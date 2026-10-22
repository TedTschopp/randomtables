const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parseArgs } = require('node:util');
const { parse } = require('parse5');
const { writeArtifacts } = require('./import-abulafia.cjs');

const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const hash = content => crypto.createHash('sha256').update(content).digest('hex');
const missingId = name => `wiki_abulafia_missing_${Buffer.from(name, 'utf8').toString('hex')}`;
const referenceCodes = new Set(['missing_reference', 'source_unresolved', 'unsupported_reference',
  'reference_mismatch', 'ambiguous_reference', 'unrecorded_dependency']);

function sourceInfo(table) {
  return { id: table.id, name: table.wiki?.name || table.id, status: table.blocked ? 'blocked' : 'ready',
    scope: table.wiki ? table.wiki.historical ? 'historical' : 'current' : 'legacy',
    sourceFile: table.wiki?.sourceFile || table.source, sourceHash: table.wiki?.sourceHash,
    archiveFile: table.wiki?.archiveFile };
}

function collectReferences(model, quarantine) {
  const sources = new Map(model.tables.map(table => [table.id, table]));
  assert.equal(sources.size, model.tables.length, 'Duplicate source table identity');
  const folded = new Map();
  for (const table of model.tables.filter(table => table.wiki)) {
    const name = table.wiki.name;
    const key = name.toLowerCase();
    if (!folded.has(key)) folded.set(key, []);
    folded.get(key).push({ id: table.id, name, status: table.wiki.status });
  }
  const targets = new Map();
  function targetFor(id, name) {
    if (!targets.has(id)) targets.set(id, { id, name, graphTarget: false, namedDiagnostic: false, referrers: new Map() });
    assert.equal(targets.get(id).name, name, 'Conflicting target identity');
    return targets.get(id);
  }
  function referringSource(target, id) {
    const table = sources.get(id);
    assert.ok(table, `Unknown referring table: ${id}`);
    if (!target.referrers.has(id)) target.referrers.set(id, { ...sourceInfo(table), rows: [] });
    return target.referrers.get(id);
  }
  for (const node of model.nodes.filter(node => node.missing)) {
    const encoded = /^wiki_abulafia_missing_([a-f0-9]*)$/.exec(node.id);
    const name = encoded ? Buffer.from(encoded[1], 'hex').toString('utf8') : node.id;
    targetFor(node.id, name).graphTarget = true;
  }
  for (const record of quarantine.referenceTargets) {
    const target = targetFor(missingId(record.name), record.name);
    assert.equal(target.namedDiagnostic, false, 'Duplicate named diagnostic target');
    target.namedDiagnostic = true;
    target.affectedTables = record.affectedTables;
    for (const id of record.directTableIds) referringSource(target, id);
  }
  for (const table of model.tables) for (const [index, entry] of table.entries.entries()) {
    const counts = new Map();
    for (const id of entry.references) {
      assert.ok(sources.has(id) || targets.has(id), `Unindexed missing reference: ${id}`);
      if (targets.has(id)) counts.set(id, (counts.get(id) || 0) + 1);
    }
    for (const [id, references] of counts) referringSource(targets.get(id), table.id).rows.push({
      row: index + 1, weight: entry.weight, references, rawText: table.wiki?.entries[index]?.rawText ?? entry.text
    });
  }
  const records = [...targets.values()].map(target => {
    const matches = [...(folded.get(target.name.toLowerCase()) || [])].sort((left, right) => compare(left.id, right.id));
    const classification = matches.some(match => match.name === target.name) ? 'exact-imported' : matches.length > 1 ? 'ambiguous-case' :
      !matches.length ? 'absent-from-import' : matches[0].status === 'ready' ? 'unique-case-ready' : 'unique-case-blocked';
    return { ...target, classification, matches,
      referrers: [...target.referrers.values()].sort((left, right) => compare(left.name, right.name) || compare(left.id, right.id)) };
  }).sort((left, right) => compare(left.name, right.name) || compare(left.id, right.id));
  const diagnostics = model.tables.flatMap(table => {
    const issues = (table.wiki?.issues || []).filter(issue => referenceCodes.has(issue.code)).map(issue => ({ ...issue }));
    return issues.length ? [{ ...sourceInfo(table), issues }] : [];
  }).sort((left, right) => compare(left.name, right.name) || compare(left.id, right.id));
  const classificationCounts = {};
  for (const target of records) classificationCounts[target.classification] = (classificationCounts[target.classification] || 0) + 1;
  return { schemaVersion: 1, summary: { readyTables: quarantine.summary.readyTables, blockedTables: quarantine.summary.blockedTables,
    targets: records.length, graphTargets: records.filter(target => target.graphTarget).length,
    namedDiagnosticTargets: records.filter(target => target.namedDiagnostic).length,
    graphOnlyTargets: records.filter(target => target.graphTarget && !target.namedDiagnostic).length,
    diagnosticOnlyTargets: records.filter(target => target.namedDiagnostic && !target.graphTarget).length,
    referringTables: new Set(records.flatMap(target => target.referrers.map(source => source.id))).size,
    targetRowUses: records.reduce((total, target) => total + target.referrers.reduce((sum, source) => sum + source.rows.length, 0), 0),
    tablesWithReferenceDiagnostics: diagnostics.length, classificationCounts }, targets: records, diagnostics };
}

function renderMarkdown(report, outputFile = 'Docs/missing-unresolved-references.md') {
  const cell = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/[\\`*_[\]{}|]/g, '\\$&');
  const link = file => path.posix.relative(path.posix.dirname(outputFile), file).split('/').map(encodeURIComponent).join('/');
  const labels = { 'absent-from-import': 'No imported definition', 'unique-case-ready': 'One case-only match, ready',
    'unique-case-blocked': 'One case-only match, blocked', 'ambiguous-case': 'Multiple case-only matches',
    'exact-imported': 'Exact name exists; stored reference remains unresolved' };
  const sourceLink = source => `[${cell(source.name)}](${link(source.archiveFile || source.sourceFile || 'explorer/index.html')})`;
  const lines = ['# Missing and Unresolved References', '',
    'Complete alphabetical inventory of unresolved Atlas targets, named missing-reference diagnostics, and reference-related diagnostics that may not form graph links. No table, alias, policy, source row, or readiness state is changed.', '',
    `The current wiki catalog has **${report.summary.readyTables.toLocaleString('en-US')} ready** and **${report.summary.blockedTables.toLocaleString('en-US')} quarantined** tables.`, '',
    '| Scope | Count |', '| --- | ---: |',
    `| Distinct named targets in this file | ${report.summary.targets} |`,
    `| Unresolved targets in the Atlas source graph | ${report.summary.graphTargets} |`,
    `| Named missing-reference targets in the quarantine report | ${report.summary.namedDiagnosticTargets} |`,
    `| Additional graph-only targets | ${report.summary.graphOnlyTargets} |`,
    `| Diagnostic-only targets absent from the graph | ${report.summary.diagnosticOnlyTargets} |`,
    `| Directly referring tables | ${report.summary.referringTables} |`,
    `| Source-row uses of these targets | ${report.summary.targetRowUses} |`,
    `| Tables with reference-related diagnostics | ${report.summary.tablesWithReferenceDiagnostics} |`, '',
    '## Reading the List', '',
    '- Names and case are preserved. Candidate matches are suggestions, not approved corrections or aliases.',
    '- Row numbers are one-based source-entry positions. Weights are stored source weights, not probabilities. Weight 0 rows are retained but cannot be selected.',
    '- A named diagnostic is recorded by import validation. A graph-only target is retained source-reference evidence without that diagnostic; it may occur only in nonselectable rows.',
    '- A ready source can retain unresolved references in nonselectable rows. A present but quarantined dependency is not a missing name; see the full quarantine report for those dependency chains.',
    '- Source links open the preserved local archive. Every matching row, original text, repeated-reference count, source ID, source hash, and candidate ID is retained in the JSON companion.', '',
    '## All Named Targets', '', '| Requested Target | Problem | Candidate Matches | Referring Sources and Rows |', '| --- | --- | --- | --- |'];
  for (const target of report.targets) {
    const candidates = target.matches.map(match => `[${cell(match.name)}](${link('explorer/index.html')}?table=${encodeURIComponent(match.id)}) (${match.status})`).join('; ') || 'None';
    const sources = target.referrers.map(source => {
      const rows = source.rows.length ? source.rows.map(row => `row ${row.row} (weight ${cell(row.weight)}${row.references > 1 ? `, ${row.references} references` : ''})`).join(', ') : 'diagnostic only; no parsed row link';
      return `${sourceLink(source)} (${source.scope}, ${source.status}): ${rows}`;
    }).join('; ');
    lines.push(`| ${cell(target.name)} | ${labels[target.classification]}; ${target.namedDiagnostic ? 'named diagnostic' : 'graph only'} | ${candidates} | ${sources} |`);
  }
  lines.push('', '## Reference Diagnostics by Source', '',
    'These are all recorded reference-related diagnostics, including unsupported tokens and unresolved source metadata. They overlap the named list; they are not additional missing-target counts. Unparsed or malformed expressions can hide further references, so no target is guessed from a generic syntax error.', '',
    '| Source Table | Scope | Recorded Diagnostics |', '| --- | --- | --- |');
  for (const source of report.diagnostics) lines.push(`| ${sourceLink(source)} | ${source.scope} | ${source.issues.map(issue => `${cell(issue.code)}: ${cell(issue.detail)}`).join('; ')} |`);
  lines.push('', '## Evidence', '',
    `[Full row-level JSON](${link(outputFile.replace(/\.md$/, '.json'))}) and [quarantine report](${link('Docs/quarantine-report.md')}).`, '');
  if (report.provenance) lines.push(`Manifest SHA-256: \`${report.provenance.manifestSha256}\`.`, '',
    `Quarantine report SHA-256: \`${report.provenance.quarantineReportSha256}\`.`, '',
    `Source revision: \`${report.provenance.commit}\`. All inputs are local, pinned files.`, '');
  lines.push('Regenerate from the repository root with `node explorer/tools/reference-problems.cjs --output Docs`. Different existing reports are refused; use a new output directory for a changed snapshot.', '');
  return lines.join('\n');
}

async function buildReport(repo) {
  const root = fs.realpathSync(repo);
  const inputHashes = {};
  const inputs = new Map();
  function read(file) {
    if (inputs.has(file)) return inputs.get(file);
    const target = path.resolve(root, file);
    assert.ok(!path.isAbsolute(file) && target.startsWith(root + path.sep), `Input outside repository: ${file}`);
    for (let current = target; current !== root; current = path.dirname(current)) assert.equal(fs.lstatSync(current).isSymbolicLink(), false, `Symlink input: ${file}`);
    const stats = fs.statSync(target);
    assert.ok(stats.isFile() && stats.size <= 90 * 1024 * 1024, `Invalid input file: ${file}`);
    const bytes = fs.readFileSync(target);
    inputHashes[file] = hash(bytes);
    inputs.set(file, bytes);
    return bytes;
  }
  const manifestFile = 'tables/abulafia/manifest.json';
  const quarantineFile = 'Docs/quarantine-report.json';
  const manifest = JSON.parse(read(manifestFile));
  const quarantine = JSON.parse(read(quarantineFile));
  assert.equal(quarantine.provenance.manifestSha256, inputHashes[manifestFile], 'Stale quarantine manifest hash');
  assert.equal(quarantine.provenance.repository, manifest.repository, 'Source repository mismatch');
  assert.equal(quarantine.provenance.commit, manifest.commit, 'Source revision mismatch');
  for (const [file, expected] of Object.entries(quarantine.provenance.inputHashes)) assert.equal(hash(read(file)), expected, `Stale report input: ${file}`);
  const scripts = [];
  function visit(node) {
    if (node.tagName === 'script') {
      const source = node.attrs.find(attribute => attribute.name === 'src')?.value;
      if (source?.startsWith('tables/') && source !== 'tables/abulafia.js') scripts.push(source);
    }
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parse(read('index.html').toString('utf8')));
  const runtime = vm.createContext({ console, atob, Blob, Response, DecompressionStream }, { codeGeneration: { strings: false, wasm: false } });
  for (const file of ['JS/generator.js', 'explorer/vendor/jsep.iife.min.js', 'JS/wiki-template-data.js', 'JS/wiki-expressions.js',
    'JS/wiki-recursion.js', 'JS/wiki-import.js', 'explorer/model.js', ...scripts, 'tables/abulafia.js', 'explorer/abulafia-catalog.js']) {
    const content = read(file);
    if (manifest.generatedFiles[file]) assert.equal(hash(content), manifest.generatedFiles[file].sha256, `Catalog hash mismatch: ${file}`);
    vm.runInContext(content.toString('utf8'), runtime, { filename: file, timeout: 1000 });
  }
  await runtime.WikiImport.catalogReady;
  assert.equal(runtime.WikiImport.metadata.size, manifest.tables.length, 'Incomplete runtime catalog');
  for (const table of manifest.tables) {
    const actual = runtime.WikiImport.metadata.get(table.id);
    for (const field of ['name', 'status', 'sourceFile', 'sourceHash', 'archiveFile']) assert.equal(actual[field], table[field], `Catalog metadata mismatch: ${table.id}`);
  }
  const report = collectReferences(runtime.TableAtlas.buildModel(runtime.gen_data), quarantine);
  read('explorer/tools/reference-problems.cjs');
  return { ...report, provenance: { repository: manifest.repository, commit: manifest.commit,
    manifestSha256: inputHashes[manifestFile], quarantineReportSha256: inputHashes[quarantineFile],
    inputHashes: Object.fromEntries(Object.entries(inputHashes).sort(([left], [right]) => compare(left, right))) } };
}

async function main() {
  const { values } = parseArgs({ options: { output: { type: 'string' } } });
  const repo = path.resolve(__dirname, '../..');
  const report = await buildReport(repo);
  let written = 0;
  if (values.output) {
    const directory = path.relative(repo, path.resolve(repo, values.output)).split(path.sep).join('/');
    const filename = path.posix.join(directory, 'missing-unresolved-references.md');
    written = writeArtifacts(repo, new Map([[filename, renderMarkdown(report, filename)],
      [filename.replace(/\.md$/, '.json'), JSON.stringify(report, null, 2) + '\n']]));
  }
  console.log(JSON.stringify({ ...report.summary, written }, null, 2));
}

module.exports = { collectReferences, renderMarkdown, buildReport };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
