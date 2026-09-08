const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');
const { writeArtifacts } = require('./import-abulafia.cjs');

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function compareDefinitions(plan, sources) {
  assert.ok(Array.isArray(plan.targets), 'Expected planned target identities');
  const identities = new Set();
  const sourceIds = new Set();
  const definitions = [];
  for (const source of sources) {
    assert.ok(typeof source.id === 'string' && source.id && !sourceIds.has(source.id), 'Invalid or duplicate source identity');
    assert.ok(['baseline', 'wiki-export', 'converted-tables'].includes(source.kind), 'Unexpected source kind');
    assert.equal(typeof source.complete, 'boolean', 'Expected explicit source completeness');
    assert.ok(Array.isArray(source.definitions), 'Expected source definitions');
    sourceIds.add(source.id);
    for (const definition of source.definitions) {
      assert.ok(typeof definition.page === 'string' && definition.page && typeof definition.subtable === 'string' && definition.subtable,
        'Invalid definition identity');
      assert.ok(typeof definition.rawSource === 'string' && Array.isArray(definition.entries) && Array.isArray(definition.warnings),
        'Missing definition source evidence');
      const candidate = structuredClone(definition);
      definitions.push({ ...candidate, sourceId: source.id, sourceKind: source.kind,
        rawSha256: hash(candidate.rawSource),
        rowsSha256: hash(JSON.stringify(candidate.entries.map(entry => [entry.weight, entry.raw_text ?? entry.text]))),
        positiveRows: candidate.entries.filter(entry => Number.isSafeInteger(entry.weight) && entry.weight > 0).length,
        reviewRequired: true });
    }
  }
  const targets = plan.targets.map(target => {
    assert.ok(typeof target.name === 'string' && target.name && !identities.has(target.name), 'Invalid or duplicate target identity');
    identities.add(target.name);
    if (!target.page || !target.subtable) {
      assert.ok(['local-review', 'needs-review'].includes(target.status), 'Unresolved target identity requires review');
      return { ...structuredClone(target), tableConfirmed: false, candidates: [] };
    }
    assert.equal(`${target.page}.${target.subtable}`, target.name, 'Target identity does not match its page and subtable');
    const candidates = definitions.filter(definition => definition.page.toLowerCase() === target.page.toLowerCase() &&
      definition.subtable.toLowerCase() === target.subtable.toLowerCase()).map(definition => ({ ...definition,
      match: definition.page === target.page && definition.subtable === target.subtable ? 'exact' : 'case-only' }));
    const exact = candidates.filter(candidate => candidate.match === 'exact');
    const baseline = exact.filter(candidate => candidate.sourceKind === 'baseline' && candidate.positiveRows);
    const backups = exact.filter(candidate => candidate.sourceKind !== 'baseline' && candidate.positiveRows);
    const status = baseline.length ? 'baseline-definition' : backups.length ? 'backup-definition' :
      candidates.some(candidate => candidate.match === 'case-only' && candidate.positiveRows) ? 'case-only-definition' :
      exact.length ? 'empty-definition' : sources.some(source => !source.complete) ? 'incomplete' : 'not-found';
    return { ...structuredClone(target), status, tableConfirmed: false, candidates,
      baselineDefinitions: baseline.length, backupDefinitions: backups.length };
  });
  const count = status => targets.filter(target => target.status === status).length;
  return { schemaVersion: 1, kind: 'backup-definition-comparison',
    summary: { totalTargets: targets.length, comparedTargets: targets.filter(target => target.page && target.subtable).length,
      baselineDefinitionTargets: count('baseline-definition'), backupDefinitionTargets: count('backup-definition'),
      caseOnlyDefinitionTargets: count('case-only-definition'), emptyDefinitionTargets: count('empty-definition'),
      notFoundTargets: count('not-found'), incompleteTargets: count('incomplete'),
      localReviewTargets: count('local-review'), identityReviewTargets: count('needs-review'), confirmedRecoveries: 0 },
    sources: sources.map(({ definitions: records, ...source }) => ({ ...structuredClone(source), definitionCount: records.length })),
    targets };
}

function buildReport(plan, sources, provenance) {
  assert.ok(Array.isArray(provenance.expectedSourceIds) && provenance.expectedSourceIds.length, 'Expected the complete planned source scope');
  assert.equal(new Set(provenance.expectedSourceIds).size, provenance.expectedSourceIds.length, 'Duplicate planned source identity');
  assert.deepEqual(sources.map(source => source.id).sort(), [...provenance.expectedSourceIds].sort(), 'Scanned source scope differs from the plan');
  assert.ok(sources.every(source => source.complete), 'Every planned source must be completely scanned');
  assert.equal(sources.filter(source => source.kind === 'baseline').length, 1, 'Expected one current XML baseline');
  const comparison = compareDefinitions(plan, sources);
  const targets = comparison.targets.map(({ candidates, ...target }) => {
    const positive = candidates.filter(candidate => candidate.match === 'exact' && candidate.positiveRows);
    const classification = target.status === 'backup-definition' ?
      positive.some(candidate => candidate.sourceKind === 'wiki-export') ? 'new-xml-definition' : 'converted-only-definition' : target.status;
    const variants = new Map();
    for (const candidate of candidates) {
      const key = JSON.stringify([candidate.page, candidate.subtable, candidate.rawSha256, candidate.rowsSha256]);
      if (!variants.has(key)) variants.set(key, { id: hash(key), page: candidate.page, subtable: candidate.subtable,
        match: candidate.match, rawSha256: candidate.rawSha256, rowsSha256: candidate.rowsSha256,
        positiveRows: candidate.positiveRows, parsedRows: candidate.entries.length, occurrences: [] });
      const { rawSource, entries, revisions = [], rawSha256, rowsSha256, page, subtable, match, positiveRows,
        reviewRequired, ...location } = candidate;
      const ordered = [...revisions].sort((left, right) => {
        if (left.timestamp !== right.timestamp) return left.timestamp < right.timestamp ? -1 : 1;
        if (/^\d+$/.test(left.id) && /^\d+$/.test(right.id)) return BigInt(left.id) < BigInt(right.id) ? -1 : BigInt(left.id) > BigInt(right.id) ? 1 : 0;
        return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
      });
      variants.get(key).occurrences.push({ ...location, revisionCount: ordered.length,
        revisionsSha256: hash(JSON.stringify(ordered)), firstRevision: ordered[0] || null, lastRevision: ordered.at(-1) || null,
        contributorCount: new Set(ordered.map(revision => JSON.stringify(revision.contributor || {})).filter(value => value !== '{}')).size });
    }
    return { ...target, classification, reviewRequired: true, variants: [...variants.values()] };
  });
  const count = classification => targets.filter(target => target.classification === classification).length;
  return { schemaVersion: 1, kind: 'backup-definition-evidence', provenance: structuredClone(provenance),
    scope: { ...structuredClone(plan.scope || {}), complete: true, plannedSources: provenance.expectedSourceIds.length,
      scannedSources: sources.length, archiveSnapshots: sources.filter(source => source.kind !== 'converted-tables').length,
      convertedCollections: sources.filter(source => source.kind === 'converted-tables').length,
      convertedFiles: sources.filter(source => source.kind === 'converted-tables').reduce((sum, source) => sum + (source.files?.length || 0), 0),
      xmlRevisionRecords: sources.reduce((sum, source) => sum + (source.summary?.revisionsScanned || 0), 0) },
    summary: { ...comparison.summary, newArchiveDefinitionTargets: count('new-xml-definition'),
      convertedOnlyDefinitionTargets: count('converted-only-definition'),
      baselineHistoricalTargets: comparison.targets.filter(target => target.status === 'baseline-definition' &&
        target.candidates.filter(candidate => candidate.match === 'exact' && candidate.positiveRows && candidate.sourceKind === 'baseline')
          .every(candidate => candidate.presentInLatest === false)).length },
    sources: comparison.sources.map(({ root, download, ...source }) => ({ ...source,
      ...(download ? { download: { ...download, file: path.basename(download.file) } } : {}), exactPositiveTargetCount: comparison.targets.filter(target =>
      target.candidates.some(candidate => candidate.sourceId === source.id && candidate.match === 'exact' && candidate.positiveRows)).length })),
    targets };
}

function renderMarkdown(report) {
  const label = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;').replace(/[\r\n]/g, ' ').replace(/[\\`*_\[\]()]/g, '\\$&').replace(/(https?):\/\//gi, '$1:&#47;&#47;');
  const sourceLink = source => {
    const address = source.repository && source.revision ? `${source.repository}/tree/${source.revision}` : source.archiveUrl;
    if (!address) return label(source.id);
    const url = new URL(address);
    assert.equal(url.protocol, 'https:', 'Expected an HTTPS source citation');
    const escaped = url.href.replace(/[()\[\]<>\\]/g, character => '%' + character.charCodeAt(0).toString(16).toUpperCase());
    return `[${label(source.id)}](${escaped})`;
  };
  const number = value => value.toLocaleString('en-US');
  const descriptions = { 'baseline-definition': 'Already in current XML history', 'new-xml-definition': 'Additional XML definition',
    'converted-only-definition': 'Converted-copy candidate only', 'empty-definition': 'No positive-weight rows',
    'not-found': 'Not found in inspected sources', 'case-only-definition': 'Case-only candidate; identity review',
    'local-review': 'Existing local case candidate; excluded', 'needs-review': 'Malformed identity; excluded', incomplete: 'Incomplete' };
  const summary = report.summary;
  const lines = [
    '# Backup Definition Comparison', '', `Audit date: ${label(report.provenance.auditDate || 'not recorded')}.`, '',
    `**${number(summary.newArchiveDefinitionTargets)} missing target names have positive-weight definitions in additional wiki XML snapshots.** ` +
      `Another ${number(summary.convertedOnlyDefinitionTargets)} have candidates only in converted collections. ` +
      `${number(summary.baselineDefinitionTargets)} already have definitions in the current XML history.`, '',
    '**No tables were imported, renamed, enabled, or repaired.** A matching definition is a recovery candidate, not a verified executable restoration. ' +
      'Exact page and subtable identities, weights, dependencies, contributor attribution, and historical intent still require review.', '',
    '## Results', '', '| Target Classification | Count |', '| --- | ---: |',
    `| Already in the current XML history | ${number(summary.baselineDefinitionTargets)} |`,
    `| Additional original wiki XML evidence | ${number(summary.newArchiveDefinitionTargets)} |`,
    `| Converted-copy-only candidates | ${number(summary.convertedOnlyDefinitionTargets)} |`,
    `| Definitions without positive-weight rows | ${number(summary.emptyDefinitionTargets)} |`,
    `| No matching definition in inspected sources | ${number(summary.notFoundTargets)} |`,
    `| Case-only definitions requiring identity review | ${number(summary.caseOnlyDefinitionTargets)} |`,
    `| Existing local case candidates, excluded from comparison | ${number(summary.localReviewTargets)} |`,
    `| Malformed identities, excluded from comparison | ${number(summary.identityReviewTargets)} |`,
    `| Total unresolved target names | ${number(summary.totalTargets)} |`, '',
    `${number(summary.comparedTargets)} exact target identities were compared. ` +
      `${number(summary.baselineHistoricalTargets)} of the baseline matches occur only in older retained revisions, not the latest revision of that page identity. ` +
      'These counts are target names, not pages, files, unique revisions, or the number of tables that would become runnable.', '',
    '## Inspected Sources', '',
    `The planned scope is complete: ${number(report.scope.archiveSnapshots)} explicitly named history XML snapshots and ` +
      `${number(report.scope.convertedCollections)} converted collections containing ${number(report.scope.convertedFiles)} table files. ` +
      `${number(report.scope.xmlRevisionRecords)} XML revision records were inspected across the snapshots. ` +
      'This revision count includes repeated fragments and copied history; it is not a count of unique revisions.', '',
    '| Source | Kind | Files | XML Revision Records | Exact Positive Target Matches |', '| --- | --- | ---: | ---: | ---: |'
  ];
  for (const source of report.sources) lines.push(`| ${sourceLink(source)} | ${source.kind} | ${number(source.files?.length || 0)} | ` +
    `${number(source.summary?.revisionsScanned || 0)} | ${number(source.exactPositiveTargetCount)} |`);
  lines.push('', 'Source counts overlap. The MyUniverse versions are related copies, not independent corroboration. ' +
    'A complete scan means all files in this explicit plan were parsed successfully; it does not establish that their original wiki exports were complete.', '',
    'The [JSON evidence](backup-report.json) records source URLs, pinned repository revisions, source-file hashes, decoded XML hashes, ' +
    'definition variants, page IDs, locations, first and last retained matching revisions, and hashes of the full retained revision evidence. ' +
    'Raw table rows are not republished here. The verified local scan cache retains the complete definition and revision evidence.', '',
    '## Additional XML Definitions', '',
    'These target names are absent as positive-weight definitions from the current XML history but occur in at least one inspected alternate snapshot. ' +
    'A retained definition may have been deliberately removed or may depend on other unavailable tables.', '',
    '| Target | XML Sources With Positive Rows | Distinct XML Definition Variants |', '| --- | ---: | ---: |');
  for (const target of report.targets.filter(target => target.classification === 'new-xml-definition')) {
    const variants = target.variants.filter(variant => variant.match === 'exact' && variant.positiveRows &&
      variant.occurrences.some(occurrence => occurrence.sourceKind === 'wiki-export'));
    const sourceIds = new Set(variants.flatMap(variant => variant.occurrences.filter(occurrence => occurrence.sourceKind === 'wiki-export').map(occurrence => occurrence.sourceId)));
    lines.push(`| ${label(target.name)} | ${number(sourceIds.size)} | ${number(variants.length)} |`);
  }
  lines.push('', '## Converted-Only Candidates', '',
    'Filename stems suggest page identity but do not establish original wiki provenance. ' +
    'Wrappers, rewritten references, commented-out rows, and mixed-source content need separate fidelity and attribution review.', '',
    '| Target | Distinct Positive Definition Variants |', '| --- | ---: |');
  for (const target of report.targets.filter(target => target.classification === 'converted-only-definition')) {
    lines.push(`| ${label(target.name)} | ${number(target.variants.filter(variant => variant.match === 'exact' && variant.positiveRows).length)} |`);
  }
  lines.push('', '## Recovery Constraints', '',
    '- Start review with original XML definitions. Select a defensible historical revision and check why the definition is absent from the current page.',
    '- Trace every positive-weight dependency and relevant template before estimating runnable recovery. Affected-table counts are not recovery counts.',
    '- Preserve exact case, punctuation, Unicode, weights, significant whitespace, source hashes, revision evidence, and contributor attribution. Do not create name aliases.',
    '- Any later wiki import must include all other tables from the same contributors under the existing contributor-wide selection and collision safeguards.',
    '- Do not promote converted-only wrappers as original wiki definitions without a separate, explicit decision.',
    '- Keep the three no-positive-row definitions unresolved; an empty header does not provide a usable distribution.', '',
    '## Limits', '',
    'The scanner checks active semicolon-named subtables inside wiki `sgtable` blocks and matching headers in the selected converted files. ' +
    'It ignores wiki comments and `nowiki` text for definition detection. Renamed pages, case changes, aliases, other generator formats, ' +
    'and tables in unplanned packages are not automatically equated.', '',
    'Only the explicitly inventoried `*-history.xml.7z` snapshots were compared. Other `wikidump.7z` packages and Wayback HTML captures were not exhaustively inspected. ' +
    'No matching definition means none was found in the inspected scope, not that the source is permanently lost.', '',
    'The XML files are MediaWiki exports, not original SQL database backups. All comparison tools are optional local maintenance tools; ' +
    'the application remains static, browser-only, and offline.', '',
    '## Complete Target List', '', '| Target | Classification |', '| --- | --- |');
  for (const target of report.targets) lines.push(`| ${label(target.name)} | ${descriptions[target.classification] || label(target.classification)} |`);
  lines.push('');
  return lines.join('\n');
}

function containedFile(root, relative) {
  assert.ok(typeof relative === 'string' && relative && !path.isAbsolute(relative), 'Expected a relative input file');
  const filename = path.resolve(root, relative);
  const within = path.relative(root, filename);
  assert.ok(within && within !== '..' && !within.startsWith('..' + path.sep) && !path.isAbsolute(within), 'Input must stay inside its source root');
  for (let current = filename; current !== root; current = path.dirname(current)) {
    assert.ok(!fs.lstatSync(current).isSymbolicLink(), 'Symbolic input paths are not permitted');
  }
  const information = fs.statSync(filename);
  assert.ok(information.isFile() && information.size <= 1024 * 1024 * 1024, 'Expected a regular source file no larger than 1 GiB');
  return filename;
}

function fileHash(root, relative) {
  const filename = containedFile(root, relative);
  const descriptor = fs.openSync(filename, 'r');
  try {
    const before = fs.fstatSync(descriptor);
    const buffer = Buffer.alloc(1024 * 1024);
    const digest = crypto.createHash('sha256');
    let count;
    while ((count = fs.readSync(descriptor, buffer, 0, buffer.length, null))) digest.update(buffer.subarray(0, count));
    const after = fs.fstatSync(descriptor);
    assert.ok(before.size === after.size && before.mtimeMs === after.mtimeMs, 'Source changed while hashing');
    return digest.digest('hex');
  } finally {
    fs.closeSync(descriptor);
  }
}

function loadAudit(repo, auditRoot, auditDate) {
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(auditDate) && new Date(auditDate).toISOString().slice(0, 10) === auditDate, 'Expected an ISO audit date');
  const root = fs.realpathSync(repo);
  const prefix = path.relative(path.resolve(repo), path.resolve(repo, auditRoot));
  const inputHashes = {};
  const read = relative => {
    const filename = containedFile(root, relative);
    assert.ok(fs.statSync(filename).size <= 90 * 1024 * 1024, 'Audit JSON exceeds 90 MiB');
    const content = fs.readFileSync(filename);
    inputHashes[relative] = hash(content);
    return JSON.parse(content);
  };
  const planFile = path.join(prefix, 'target-plan.json');
  const plan = read(planFile);
  const sourcePlan = read(path.join(prefix, 'source-plan.json'));
  assert.equal(sourcePlan.schemaVersion, 1, 'Unexpected source plan version');
  const expectedSourceIds = [...sourcePlan.archives, ...sourcePlan.repositories].map(source => source.id);
  assert.ok(expectedSourceIds.every(id => /^[A-Za-z0-9_-]+$/.test(id)), 'Invalid planned source identity');
  const scannerFile = 'explorer/tools/scan-backups.py';
  const scannerSha256 = fileHash(root, scannerFile);
  inputHashes[scannerFile] = scannerSha256;
  inputHashes['explorer/tools/compare-backups.cjs'] = fileHash(root, 'explorer/tools/compare-backups.cjs');
  const extractorFile = path.resolve(sourcePlan.extractor.file);
  assert.equal(fileHash(fs.realpathSync(path.dirname(extractorFile)), path.basename(extractorFile)), sourcePlan.extractor.sha256, 'Extractor source hash mismatch');
  const scanRoot = path.join(prefix, 'scans', scannerSha256.slice(0, 12));
  const sources = expectedSourceIds.map(id => {
    const job = read(path.join(scanRoot, `${id}.job.json`));
    const source = read(path.join(scanRoot, `${id}.json`));
    assert.equal(source.id, id, 'Scan source identity mismatch');
    assert.equal(source.complete, true, 'Source scan is incomplete');
    assert.equal(source.scannerSha256, scannerSha256, 'Stale scanner result');
    assert.equal(source.targetPlanSha256, hash(JSON.stringify(plan)), 'Stale target-plan hash');
    assert.equal(source.sourcePlanSha256, hash(JSON.stringify(job)), 'Stale source-job hash');
    assert.equal(source.extractorSha256, sourcePlan.extractor.sha256, 'Scan extractor hash mismatch');
    assert.equal(job.extractor.sha256, sourcePlan.extractor.sha256, 'Job extractor hash mismatch');
    assert.deepEqual(job.targets, plan.targets, 'Scan job uses different target identities');
    for (const [field, value] of Object.entries(job.source)) {
      if (field !== 'files') assert.deepEqual(source[field], value, `Scan source metadata differs: ${field}`);
    }
    assert.equal(source.files.length, job.source.files.length, 'Incomplete source file scope');
    assert.equal(new Set(source.files.map(file => file.name)).size, source.files.length, 'Duplicate source file identity');
    for (const [index, expected] of job.source.files.entries()) {
      for (const [field, value] of Object.entries(expected)) assert.deepEqual(source.files[index][field], value, `Scan file differs: ${expected.name}`);
    }
    const plannedArchive = sourcePlan.archives.find(record => record.id === id);
    if (id === sourcePlan.baseline.id) {
      assert.equal(source.kind, 'baseline', 'Wrong baseline source kind');
      assert.equal(source.files.length, 1, 'Expected one baseline XML');
      assert.equal(source.files[0].sha256, sourcePlan.baseline.sha256, 'Baseline XML hash mismatch');
    } else if (plannedArchive) {
      assert.equal(source.kind, 'wiki-export', 'Wrong archive source kind');
      assert.equal(source.archiveUrl, plannedArchive.url, 'Archive URL differs from plan');
      assert.equal(source.files.length, 1, 'Expected one selected XML member');
      for (const field of ['name', 'member', 'bytes', 'sha1']) assert.equal(source.files[0][field], plannedArchive[field], `Archive ${field} differs from plan`);
    } else {
      const plannedRepository = sourcePlan.repositories.find(record => record.id === id);
      assert.equal(source.kind, 'converted-tables', 'Wrong converted source kind');
      assert.equal(source.repository, plannedRepository.repository, 'Repository differs from plan');
      assert.equal(source.revision, plannedRepository.revision, 'Repository revision differs from plan');
      assert.equal(source.files.length, plannedRepository.files.length, 'Repository file scope differs from plan');
      for (const [index, expected] of plannedRepository.files.entries()) {
        for (const [field, value] of Object.entries(expected)) assert.deepEqual(source.files[index][field], value, `Repository file differs: ${expected.name}`);
      }
    }
    const sourceRoot = fs.realpathSync(source.root);
    for (const file of source.files) {
      assert.equal(fileHash(sourceRoot, file.name), file.sha256, `Source file hash changed: ${id}/${file.name}`);
      const relative = path.relative(root, path.resolve(sourceRoot, file.name));
      if (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative)) inputHashes[relative] = file.sha256;
    }
    for (const definition of source.definitions) {
      const file = source.files.find(record => record.name === definition.sourceFile);
      assert.ok(file, 'Definition points outside the scanned file scope');
      assert.equal(definition.sourceSha256, file.sha256, 'Definition source hash mismatch');
    }
    return source;
  });
  const baselineVerification = read(path.join(prefix, 'baseline-archive-verification.json'));
  const baselineArchive = sourcePlan.archives.find(source => source.id === sourcePlan.baseline.id);
  assert.ok(baselineArchive, 'Baseline archive is absent from the source plan');
  assert.equal(baselineVerification.matchesLocalBaseline, true, 'Published baseline verification is incomplete');
  assert.equal(baselineVerification.xmlSha256, sourcePlan.baseline.sha256, 'Published baseline XML hash mismatch');
  assert.equal(baselineVerification.xmlBytes, sourcePlan.baseline.bytes, 'Published baseline size mismatch');
  assert.equal(baselineVerification.url, baselineArchive.url, 'Published baseline URL mismatch');
  assert.equal(baselineVerification.archiveSha1, baselineArchive.sha1, 'Published baseline archive hash mismatch');
  Object.assign(inputHashes, plan.provenance.inputHashes);
  for (const [file, expected] of Object.entries(inputHashes)) assert.equal(fileHash(root, file), expected, `Input changed after planning: ${file}`);
  return buildReport(plan, sources, { auditDate, expectedSourceIds, planSha256: hash(JSON.stringify(plan)),
    sourceRepository: plan.provenance.repository, sourceCommit: plan.provenance.commit,
    extractor: { sha256: sourcePlan.extractor.sha256, commit: sourcePlan.extractor.commit }, baselineVerification,
    inputHashes: Object.fromEntries(Object.entries(inputHashes).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)) });
}

function writeReport(repo, outputRoot, report) {
  const root = fs.realpathSync(repo);
  const prefix = path.relative(path.resolve(repo), path.resolve(repo, outputRoot));
  assert.ok(prefix !== '..' && !prefix.startsWith('..' + path.sep) && !path.isAbsolute(prefix), 'Report output must stay inside the repository');
  for (const [file, expected] of Object.entries(report.provenance.inputHashes)) {
    assert.equal(fileHash(root, file), expected, `Input changed after planning: ${file}`);
  }
  return writeArtifacts(root, new Map([
    [path.join(prefix, 'backup-report.json'), JSON.stringify(report, null, 2) + '\n'],
    [path.join(prefix, 'backup-report.md'), renderMarkdown(report)]
  ]));
}

module.exports = { compareDefinitions, buildReport, renderMarkdown, loadAudit, writeReport };

function main() {
  const { values } = parseArgs({ options: { 'audit-root': { type: 'string' }, date: { type: 'string' }, output: { type: 'string' }, help: { type: 'boolean' } } });
  if (values.help || !values['audit-root']) {
    console.log('Usage: node explorer/tools/compare-backups.cjs --audit-root DIRECTORY --date YYYY-MM-DD [--output DIRECTORY]\n' +
      'Read verified local scan jobs and sources; no network access or imports.\n' +
      'Without --output, print only the comparison summary. Output is guarded and must stay inside the repository.');
    if (!values.help && (values.output || values.date)) throw new Error('Supply --audit-root with the completed local scan cache');
    return;
  }
  const repo = path.resolve(__dirname, '..', '..');
  const report = loadAudit(repo, path.resolve(values['audit-root']), values.date || new Date().toISOString().slice(0, 10));
  const { buildPlan } = require('./check-wayback.cjs');
  assert.equal(report.provenance.planSha256, hash(JSON.stringify(buildPlan(repo))), 'Frozen target plan no longer matches the current quarantine evidence');
  const written = values.output ? writeReport(repo, path.resolve(values.output), report) : 0;
  console.log(JSON.stringify({ scope: report.scope, summary: report.summary,
    output: values.output ? path.relative(repo, path.resolve(values.output)) : null, written }, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}