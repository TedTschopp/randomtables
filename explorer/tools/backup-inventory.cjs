const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseArgs } = require('node:util');
const { loadCorpus, writeArtifacts } = require('./import-abulafia.cjs');

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function contained(root, relative) {
  assert.ok(typeof relative === 'string' && relative && !path.isAbsolute(relative), 'Expected a contained relative path');
  const filename = path.resolve(root, relative);
  const within = path.relative(root, filename);
  assert.ok(within && within !== '..' && !within.startsWith('..' + path.sep) && !path.isAbsolute(within), 'Path must stay inside the repository');
  for (let current = filename; current !== root; current = path.dirname(current)) {
    const information = fs.lstatSync(current, { throwIfNoEntry: false });
    assert.ok(!information?.isSymbolicLink(), 'Symbolic paths are not permitted');
  }
  return filename;
}

function planAcquisition(comparison) {
  assert.equal(comparison.scope.complete, true, 'Comparison source scope is incomplete');
  assert.deepEqual(comparison.sources.map(source => source.id).sort(), [...comparison.provenance.expectedSourceIds].sort(), 'Comparison source scope differs from its plan');
  const identities = new Set();
  return comparison.sources.map(source => {
    assert.equal(source.complete, true, 'Source scan is incomplete');
    assert.match(source.id, /^[A-Za-z0-9_-]+$/, 'Invalid source identity');
    const filesystemIdentity = source.id.normalize('NFD').toLowerCase();
    assert.ok(!identities.has(filesystemIdentity), 'Source identity would cause a filesystem collision');
    identities.add(filesystemIdentity);
    assert.ok(['baseline', 'wiki-export', 'converted-tables'].includes(source.kind), 'Unknown source kind');
    let archive;
    if (source.kind === 'baseline') {
      const verification = comparison.provenance.baselineVerification;
      assert.equal(verification.id, source.id, 'Baseline identity mismatch');
      assert.equal(verification.matchesLocalBaseline, true, 'Baseline verification is incomplete');
      archive = { name: decodeURIComponent(new URL(verification.url).pathname.split('/').at(-1)),
        url: verification.url, sha256: verification.archiveSha256, sha1: verification.archiveSha1, bytes: verification.archiveBytes,
        member: verification.member, xmlSha256: verification.xmlSha256, xmlBytes: verification.xmlBytes };
    } else if (source.kind === 'wiki-export') {
      assert.equal(source.files.length, 1, 'Expected one XML source archive');
      archive = { ...source.files[0], url: source.archiveUrl };
    } else {
      archive = { ...source.download, name: source.download.file };
    }
    assert.ok(typeof archive.name === 'string' && archive.name && path.basename(archive.name) === archive.name && !['.', '..'].includes(archive.name), 'Unsafe archive file name');
    assert.match(archive.sha256, /^[a-f0-9]{64}$/, 'Expected an archive SHA-256');
    assert.ok(Number.isSafeInteger(archive.bytes) && archive.bytes > 0 && archive.bytes <= 90 * 1024 * 1024, 'Archive byte size is outside the supported limit');
    const url = new URL(archive.url);
    assert.ok(url.protocol === 'https:' && !url.username && !url.password, 'Expected a public HTTPS archive URL');
    return { id: source.id, kind: source.kind, file: `downloads/${source.id}/${archive.name}`, name: archive.name,
      url: url.href, sha256: archive.sha256, ...(archive.sha1 ? { sha1: archive.sha1 } : {}), bytes: archive.bytes,
      ...(archive.member ? { xml: { member: archive.member, sha256: archive.xmlSha256, bytes: archive.xmlBytes } } : {}),
      ...(source.repository ? { repository: source.repository, revision: source.revision, tableFiles: source.files.length } : {}),
      selection: 'whole-source-archive' };
  });
}

function acquireSources(repo, cacheRoot, outputRoot, plan) {
  const root = fs.realpathSync(repo);
  const prefix = path.relative(path.resolve(repo), path.resolve(repo, outputRoot));
  contained(root, prefix);
  const cache = path.relative(path.resolve(repo), path.resolve(repo, cacheRoot));
  contained(root, cache);
  assert.ok(Array.isArray(plan) && plan.length, 'Expected a nonempty acquisition plan');
  const artifacts = new Map();
  for (const source of plan) {
    const input = contained(root, path.join(cache, source.name));
    assert.equal(fs.statSync(input).size, source.bytes, `Archive byte size changed: ${source.id}`);
    const content = fs.readFileSync(input);
    assert.equal(hash(content), source.sha256, `Archive hash changed: ${source.id}`);
    if (source.sha1) assert.equal(crypto.createHash('sha1').update(content).digest('hex'), source.sha1, `Published archive hash differs: ${source.id}`);
    const relative = path.join(prefix, source.file);
    contained(root, relative);
    assert.ok(!artifacts.has(relative), 'Duplicate acquisition output path');
    artifacts.set(relative, content);
  }
  const acquisition = { schemaVersion: 1, kind: 'backup-source-acquisition',
    summary: { files: plan.length, verified: plan.length, bytes: plan.reduce((sum, source) => sum + source.bytes, 0) },
    sources: structuredClone(plan) };
  artifacts.set(path.join(prefix, 'acquisition.json'), JSON.stringify(acquisition, null, 2) + '\n');
  const written = writeArtifacts(root, artifacts);
  return { ...acquisition, written };
}

function wikiIdentity(table) {
  assert.match(String(table.pageId), /^\d+$/, 'Expected an exact XML page ID');
  assert.ok(typeof table.page === 'string' && table.page && typeof table.subtable === 'string' && table.subtable.isWellFormed(), 'Invalid table identity');
  return JSON.stringify([String(table.pageId), table.page, table.subtable]);
}

function buildCompleteness({ comparison, acquisition, censuses, currentTables, manifest, legacy, provenance }) {
  assert.equal(comparison.scope.complete, true, 'Comparison source scope is incomplete');
  const expected = [...comparison.provenance.expectedSourceIds].sort();
  assert.deepEqual(acquisition.sources.map(source => source.id).sort(), expected, 'Acquisition source scope differs from the comparison');
  assert.equal(acquisition.summary.verified, expected.length, 'Acquisition verification is incomplete');
  assert.equal(acquisition.summary.files, expected.length, 'Acquisition file scope is incomplete');
  assert.equal(acquisition.sources.filter(source => source.kind === 'baseline').length, 1, 'Expected one baseline source');
  const wiki = new Map();
  const baseline = new Set();
  const activeBaseline = new Set();
  const sourceSummaries = [];
  const convertedTables = [];
  const names = new Map();
  const seenSources = new Set();
  const nameEvidence = (page, subtable) => {
    const key = JSON.stringify([page, subtable]);
    if (!names.has(key)) names.set(key, { baseline: new Set(), xml: new Set(), converted: new Set(), declared: new Set(),
      formatReview: new Set(), pageIds: new Set() });
    return names.get(key);
  };
  const wikiRecord = table => {
    const key = wikiIdentity(table);
    if (!wiki.has(key)) wiki.set(key, { pageId: String(table.pageId), page: table.page, subtable: table.subtable,
      name: `${table.page}.${table.subtable}`, unnamed: table.subtable === '', sourceIds: new Set(), latestSourceIds: new Set(), variantHashes: new Set(),
      hasPositiveRows: false, inBaseline: false, inCurrentInventory: false, importStatus: 'not-in-current-inventory' });
    return [key, wiki.get(key)];
  };
  for (const census of censuses) {
    assert.ok(expected.includes(census.id) && !seenSources.has(census.id), 'Unexpected or duplicate census source');
    assert.equal(census.complete, true, 'Source census is incomplete');
    assert.equal(census.kind, acquisition.sources.find(source => source.id === census.id).kind, 'Census source kind differs');
    seenSources.add(census.id);
    const identities = new Set();
    for (const table of census.tables) {
      const key = census.kind === 'converted-tables' ? JSON.stringify([table.sourceFile, table.page, table.subtable]) : wikiIdentity(table);
      assert.ok(!identities.has(key), 'Duplicate census table identity');
      identities.add(key);
      const positive = table.variants.some(variant => variant.positiveRows > 0);
      const formatReview = table.variants.some(variant => variant.positiveRows === null);
      const hashes = [...new Set(table.variants.map(variant => {
        assert.match(variant.sha256, /^[a-f0-9]{64}$/, 'Invalid definition hash');
        return variant.sha256;
      }))].sort();
      const evidence = nameEvidence(table.page, table.subtable);
      evidence.declared.add(census.id);
      if (formatReview) evidence.formatReview.add(census.id);
      if (census.kind === 'converted-tables') {
        if (positive) evidence.converted.add(census.id);
        convertedTables.push({ sourceId: census.id, sourceFile: table.sourceFile, sourceSha256: table.sourceSha256,
          page: table.page, subtable: table.subtable, name: `${table.page}.${table.subtable}`, identityBasis: 'filename-derived',
          hasPositiveRows: positive, requiresFormatReview: formatReview, definitionVariants: hashes.length,
          variantsSha256: hash(JSON.stringify(hashes)) });
      } else {
        const [identity, record] = wikiRecord(table);
        record.sourceIds.add(census.id);
        if (table.presentInLatest === true) record.latestSourceIds.add(census.id);
        for (const value of hashes) record.variantHashes.add(value);
        record.hasPositiveRows ||= positive;
        evidence.pageIds.add(String(table.pageId));
        if (positive) evidence.xml.add(census.id);
        if (census.kind === 'baseline') {
          baseline.add(identity);
          record.inBaseline = true;
          if (positive) evidence.baseline.add(census.id);
          if (table.presentInLatest === true) activeBaseline.add(identity);
        }
      }
    }
    sourceSummaries.push({ id: census.id, kind: census.kind, summary: structuredClone(census.summary),
      censusFile: census.censusFile, censusSha256: census.censusSha256, resultSha256: census.resultSha256, jobSha256: census.jobSha256 });
  }
  assert.deepEqual([...seenSources].sort(), expected, 'Census source scope is incomplete');
  const currentIdentities = new Set();
  for (const table of currentTables) {
    const [identity, record] = wikiRecord(table);
    assert.ok(!currentIdentities.has(identity), 'Duplicate current table identity');
    currentIdentities.add(identity);
    record.inCurrentInventory = true;
    record.importStatus = 'not-imported';
  }
  const imported = new Set();
  let ready = 0, readyRuntime = 0, blocked = 0;
  for (const table of manifest.tables) {
    const identity = /^wiki_abulafia_(\d+)_([a-f0-9]*)$/.exec(table.id);
    assert.ok(identity, 'Invalid imported table ID');
    const subtable = Buffer.from(identity[2], 'hex').toString('utf8');
    assert.equal(Buffer.from(subtable).toString('hex'), identity[2], 'Invalid imported UTF-8 table identity');
    assert.equal(table.name, `${table.page}.${subtable}`, 'Imported name differs from its exact identity');
    const key = wikiIdentity({ pageId: identity[1], page: table.page, subtable });
    assert.ok(currentIdentities.has(key) && !imported.has(key), 'Imported table is missing or duplicated in current inventory');
    assert.ok(['ready', 'blocked'].includes(table.status), 'Unknown imported readiness state');
    imported.add(key);
    const state = table.status === 'ready' ? table.execution === 'wiki' ? 'ready-runtime' : 'ready-static' : 'blocked';
    wiki.get(key).importStatus = state;
    if (table.status === 'ready') { ready++; if (table.execution === 'wiki') readyRuntime++; } else blocked++;
  }
  assert.equal(imported.size, manifest.summary.tables, 'Imported table count differs from manifest');
  assert.equal(ready, manifest.summary.ready, 'Ready table count differs from manifest');
  assert.equal(blocked, manifest.summary.blocked, 'Blocked table count differs from manifest');
  const wikiTables = [...wiki.values()].map(({ sourceIds, latestSourceIds, variantHashes, ...record }) => ({ ...record,
    sourceIds: [...sourceIds].sort(), latestSourceIds: [...latestSourceIds].sort(), definitionVariants: variantHashes.size,
    variantsSha256: hash(JSON.stringify([...variantHashes].sort())) })).sort((left, right) =>
      left.name < right.name ? -1 : left.name > right.name ? 1 : left.pageId < right.pageId ? -1 : left.pageId > right.pageId ? 1 : 0);
  const archived = wikiTables.filter(table => table.sourceIds.length);
  const additional = archived.filter(table => !table.inBaseline);
  const targets = comparison.targets.map(target => {
    if (!target.page || !target.subtable) return { name: target.name, classification: target.status, imported: false };
    const evidence = names.get(JSON.stringify([target.page, target.subtable]));
    const classification = evidence?.baseline.size ? 'baseline-history-definition' : evidence?.xml.size ? 'additional-xml-definition' :
      evidence?.converted.size ? 'converted-only-definition' : evidence?.formatReview.size ? 'format-review-definition' :
      evidence?.declared.size ? 'no-positive-rows' : 'not-found';
    return { name: target.name, page: target.page, subtable: target.subtable, classification, imported: false,
      sourceIds: evidence ? [...evidence.declared].sort() : [], matchingPageIds: evidence ? [...evidence.pageIds].sort() : [],
      identityReviewRequired: (evidence?.pageIds.size || 0) > 1 };
  });
  const targetCounts = Object.fromEntries([...new Set(targets.map(target => target.classification))].sort().map(classification =>
    [classification, targets.filter(target => target.classification === classification).length]));
  const percent = (numerator, denominator) => denominator ? Math.round(numerator / denominator * 10000) / 100 : null;
  return { schemaVersion: 1, kind: 'table-inventory-completeness', provenance: structuredClone(provenance), confirmedRecoveries: 0,
    acquisition: { ...structuredClone(acquisition.summary), expectedSources: expected.length, completedCensuses: seenSources.size,
      coveragePercent: percent(acquisition.summary.verified, expected.length),
      xmlSnapshots: acquisition.sources.filter(source => source.kind !== 'converted-tables').length,
      convertedCollections: acquisition.sources.filter(source => source.kind === 'converted-tables').length,
      convertedFiles: acquisition.sources.reduce((sum, source) => sum + (source.tableFiles || 0), 0) },
    wiki: { knownIdentities: wikiTables.length, archivedIdentities: archived.length, positiveArchivedIdentities: archived.filter(table => table.hasPositiveRows).length,
      baselineIdentities: baseline.size, additionalArchiveIdentities: additional.length,
      additionalPositiveArchiveIdentities: additional.filter(table => table.hasPositiveRows).length,
      additionalPageNames: [...new Set(additional.map(table => table.page))].sort(),
      currentOnlyIdentities: wikiTables.filter(table => !table.sourceIds.length).length,
      ambiguousNames: [...names.values()].filter(evidence => evidence.pageIds.size > 1).length,
      unnamedArchiveIdentities: archived.filter(table => table.unnamed).length },
    current: { tables: currentIdentities.size, imported: imported.size, notImported: currentIdentities.size - imported.size,
      ready, readyStatic: ready - readyRuntime, readyRuntime, blocked, entries: manifest.summary.entries,
      importCoveragePercent: percent(imported.size, currentIdentities.size), readyOfImportedPercent: percent(ready, imported.size),
      readyOfCurrentPercent: percent(ready, currentIdentities.size),
      activeBaselineTables: activeBaseline.size, notInActiveBaseline: wikiTables.filter(table => table.inCurrentInventory &&
        !activeBaseline.has(wikiIdentity(table))).map(({ pageId, page, subtable, importStatus }) => ({ pageId, page, subtable, importStatus })) },
    converted: { tableRecords: convertedTables.length, positiveWeightRecords: convertedTables.filter(table => table.hasPositiveRows).length,
      formatReviewRecords: convertedTables.filter(table => table.requiresFormatReview).length,
      identityBasis: 'Source ID plus exact file path and subtable name; not deduplicated into wiki identities.' },
    legacy: structuredClone(legacy.summary), targetCounts, sources: sourceSummaries,
    wikiTables, convertedTables, targets };
}

function markdownLabel(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;')
    .replace(/[\r\n]/g, ' ').replace(/[\\`*_\[\]()]/g, '\\$&').replace(/(https?):\/\//gi, '$1:&#47;&#47;');
}

function renderCompleteness(report) {
  const number = value => Number(value).toLocaleString('en-US');
  const current = report.current;
  const lines = ['# Table Inventory Completeness', '', `Report date: ${markdownLabel(report.provenance.date)}.`, '',
    `**All ${number(report.acquisition.expectedSources)} identified source archives are preserved and checksum-verified.** ` +
      `The census found ${number(report.wiki.archivedIdentities)} distinct wiki table identities across their retained histories, ` +
      `including ${number(report.wiki.additionalArchiveIdentities)} absent from the baseline XML history.`, '',
    '**No tables were imported, renamed, enabled, or repaired.** Download completion, definition inventory, and executable readiness are separate measures. ' +
      'A positive-weight row does not establish that references, macros, provenance, or probability semantics are suitable for import.', '',
    '## Download Completeness', '', '| Measure | Result |', '| --- | ---: |',
    `| Identified full-source archives verified | ${number(report.acquisition.verified)} / ${number(report.acquisition.expectedSources)} (${report.acquisition.coveragePercent}%) |`,
    `| Preserved archive bytes | ${number(report.acquisition.bytes)} |`,
    `| Completed source censuses | ${number(report.acquisition.completedCensuses)} |`,
    `| Wiki history snapshots | ${number(report.acquisition.xmlSnapshots)} |`,
    `| Converted collections | ${number(report.acquisition.convertedCollections)} |`,
    `| Converted table files inspected | ${number(report.acquisition.convertedFiles)} |`, '',
    'Whole original source archives are retained, not just matching rows or selected authors. The snapshots therefore retain the other tables by the same contributors that the exports contain. ' +
    'Any later import must still apply contributor-wide selection, attribution, dependency, and collision safeguards. No names were folded, aliased, or merged for import.', '',
    'The original downloads were already acquired during the earlier comparison. This pass verified and preserved them in dedicated local backup storage; ' +
    'it did not need to repeat those network transfers. Bulk archives and reproducible census caches are local-only; acquisition manifests and consolidated reports can be versioned.', '',
    '## Wiki Inventory', '', '| Measure | Table Identities |', '| --- | ---: |',
    `| Distinct active declarations found anywhere in archived XML history | ${number(report.wiki.archivedIdentities)} |`,
    `| With at least one recognized positive-weight definition | ${number(report.wiki.positiveArchivedIdentities)} |`,
    `| Already represented in baseline XML history | ${number(report.wiki.baselineIdentities)} |`,
    `| Additional identities from alternate snapshots | ${number(report.wiki.additionalArchiveIdentities)} |`,
    `| Additional identities with recognized positive-weight rows | ${number(report.wiki.additionalPositiveArchiveIdentities)} |`,
    `| Current extracted identities absent from the active-history census | ${number(report.wiki.currentOnlyIdentities)} |`,
    `| Known wiki identities including the current extracted inventory | ${number(report.wiki.knownIdentities)} |`,
    `| Page/subtable names associated with multiple XML page IDs | ${number(report.wiki.ambiguousNames)} |`, '',
    'Wiki identity is the exact page ID, page title, and subtable name. Repeated revisions and copied snapshots do not create additional identities. ' +
    'A historical page rename or reused title remains explicit; it is not an automatic alias. Definition variants are deduplicated by hash within each identity. ' +
    `${number(report.wiki.unnamedArchiveIdentities)} archived identities have an empty subtable name; these are preserved and flagged without inventing replacement names.`, '',
    'The [additional wiki table list](new-wiki-tables.md) names every identity absent from baseline history. ' +
    'The [complete machine-readable inventory](inventory-report.json) includes all known wiki identities, source-qualified converted records, source hashes, and target classifications.', '',
    '## Current Import', '', '| Measure | Tables |', '| --- | ---: |',
    `| Current upstream extracted table inventory | ${number(current.tables)} |`,
    `| Imported into the app | ${number(current.imported)} |`,
    `| Current tables not imported | ${number(current.notImported)} |`,
    `| Runnable imported tables | ${number(current.ready)} |`,
    `| Runnable static tables | ${number(current.readyStatic)} |`,
    `| Runnable wiki-runtime tables | ${number(current.readyRuntime)} |`,
    `| Imported tables still blocked | ${number(current.blocked)} |`, '',
    `Imported coverage of the current extracted inventory: **${current.importCoveragePercent}%**. ` +
      `Runnable coverage among imported tables: **${current.readyOfImportedPercent}%**. ` +
      `Runnable coverage of the current extracted inventory: **${current.readyOfCurrentPercent}%**. ` +
      'These percentages describe the current corpus, not all historical definitions or the original live wiki.', '',
    '### Extraction Reconciliation', '',
    `The active latest-revision census has ${number(current.activeBaselineTables)} table identities. ` +
      `${number(current.notInActiveBaseline.length)} current extracted identities are not active in that census. ` +
      'The census masks comments and nowiki content and determines latest state across repeated page fragments. ' +
      'This is an extraction-scope difference, not evidence that the corresponding source files were not downloaded. Existing imported behavior is unchanged.', '',
    '| Page | Page ID | Subtable | Current Import State |', '| --- | --- | --- | --- |'];
  for (const table of current.notInActiveBaseline) lines.push(`| ${markdownLabel(table.page)} | ${table.pageId} | ${markdownLabel(table.subtable)} | ${table.importStatus} |`);
  lines.push('', '## Converted Collections', '',
    `The converted files contain **${number(report.converted.tableRecords)} source-qualified table records**. ` +
      `${number(report.converted.positiveWeightRecords)} have recognized positive-weight rows; ` +
      `${number(report.converted.formatReviewRecords)} contain colon-style declarations whose weights and expressions were not interpreted.`, '',
    'Converted records are counted by source ID, exact file path, and subtable name. Related MyUniverse versions are not independent corroboration, ' +
    'and these record counts must not be added to the wiki total as unique recovered tables. Filenames suggest identity but do not prove original wiki provenance. ' +
    'Wrappers, rewritten references, disabled rows, mixed formats, and attribution still require review.', '',
    '## Existing Local Tables', '',
    `The existing local-source inventory records **${number(report.legacy.tables)} table records**, including active, shadowed, unloaded, and alternate JSON definitions. ` +
      'These are not all active app tables and are not deduplicated against wiki or backup records.', '',
    '| Local State | Records |', '| --- | ---: |');
  for (const [state, count] of Object.entries(report.legacy.byState || {})) lines.push(`| ${markdownLabel(state)} | ${number(count)} |`);
  lines.push('', '## Unresolved Target Coverage', '',
    'These counts use exact page and subtable identities from the existing unresolved-reference report. Finding a definition does not change its live unresolved status.', '',
    '| Definition Evidence | Target Names |', '| --- | ---: |');
  const labels = { 'baseline-history-definition': 'Positive definition in baseline history', 'additional-xml-definition': 'Positive definition in additional XML',
    'converted-only-definition': 'Positive candidate only in converted copies', 'format-review-definition': 'Declaration found; format semantics require review',
    'no-positive-rows': 'Definition found without recognized positive rows', 'not-found': 'No matching definition in inspected sources',
    'local-review': 'Existing local case candidate; separate review', 'needs-review': 'Malformed source identity; separate review' };
  for (const [classification, count] of Object.entries(report.targetCounts)) lines.push(`| ${labels[classification] || markdownLabel(classification)} | ${number(count)} |`);
  lines.push('', '## Source Census', '', '| Source | Historical Identities or Copy Records | Latest Identities | Definition Variants |', '| --- | ---: | ---: | ---: |');
  for (const source of report.sources) lines.push(`| ${markdownLabel(source.id)} | ${number(source.summary.tableIdentities || 0)} | ` +
    `${number(source.summary.latestTableIdentities || 0)} | ${number(source.summary.definitionVariants || 0)} |`);
  lines.push('', 'Per-source counts overlap. XML revision record counts include repeated fragments and replicated history; they are not unique-revision totals.', '',
    '## Remaining Limits', '',
    '- Complete download coverage refers only to the identified and explicitly inventoried sources. It does not prove a complete backup of the original wiki.',
    '- The XML census identifies parser-recognized table declarations in sgtable blocks across all retained revisions, including explicitly flagged empty names. Comments, nowiki content, aliases, and other generator formats are not automatically treated as active tables.',
    '- Converted colon declarations are listed, but their probability and expression rules remain unverified. They are not empty tables or ready-to-run imports.',
    '- Other differently packaged wikidump archives, missing or suppressed wiki revisions, Wayback HTML captures, images, and unlocated sources remain outside this census.',
    '- Historical definitions may have been removed intentionally. Review their source revisions, dependencies, original weights, and contributor attribution before proposing an import.',
    '- The application remains browser-only and offline. No server, runtime dependency, import selection change, or execution-policy change was introduced.', '',
    '## Next Review', '',
    'Review XML-backed historical definitions before converted-only adaptations. For each proposed batch, verify the selected revision, preserve exact identifiers and probabilities, ' +
    'expand to the complete contributor-owned collection, and recompute all dependency and runtime checks. Downloaded and inventoried does not mean approved or runnable.', '');
  return lines.join('\n');
}

function renderAdditionalTables(report) {
  const lines = ['# Additional Wiki Table Identities', '',
    'These exact identities occur in the preserved alternate XML snapshots but not in the baseline XML history. ' +
    'Positive rows are recognized source rows, not confirmation that the table is executable or suitable for import.', '',
    '[Completeness report](inventory-report.md)', '',
    '| Page | Page ID | Subtable | Positive Rows Found | Source Snapshots |', '| --- | --- | --- | --- | ---: |'];
  for (const table of report.wikiTables.filter(table => table.sourceIds.length && !table.inBaseline)) {
    lines.push(`| ${markdownLabel(table.page)} | ${table.pageId} | ${markdownLabel(table.subtable)} | ${table.hasPositiveRows ? 'Yes' : 'No'} | ${table.sourceIds.length} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function fileHash(root, relative) {
  const filename = contained(root, relative);
  const information = fs.statSync(filename);
  assert.ok(information.isFile() && information.size <= 1024 * 1024 * 1024, 'Expected a regular input file no larger than 1 GiB');
  const descriptor = fs.openSync(filename, 'r');
  try {
    const digest = crypto.createHash('sha256');
    const buffer = Buffer.alloc(1024 * 1024);
    let count;
    while ((count = fs.readSync(descriptor, buffer, 0, buffer.length, null))) digest.update(buffer.subarray(0, count));
    const after = fs.fstatSync(descriptor);
    assert.ok(after.size === information.size && after.mtimeMs === information.mtimeMs, 'Input changed while hashing');
    return digest.digest('hex');
  } finally {
    fs.closeSync(descriptor);
  }
}

function loadCompleteness(repo, { archiveRoot, sourceRoot, comparisonFile, date }) {
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date).toISOString().slice(0, 10) === date, 'Expected an ISO report date');
  const root = fs.realpathSync(repo);
  const prefix = path.relative(path.resolve(repo), path.resolve(repo, archiveRoot));
  const archive = fs.realpathSync(contained(root, prefix));
  const upstream = fs.realpathSync(sourceRoot);
  const inputHashes = {};
  const read = relative => {
    const filename = contained(root, relative);
    assert.ok(fs.statSync(filename).size <= 90 * 1024 * 1024, 'Inventory input exceeds 90 MiB');
    const content = fs.readFileSync(filename);
    inputHashes[relative] = hash(content);
    return JSON.parse(content);
  };
  const acquisitionFile = path.join(prefix, 'acquisition.json');
  const acquisition = read(acquisitionFile);
  const comparisonPath = path.relative(path.resolve(repo), path.resolve(repo, comparisonFile));
  const comparison = read(comparisonPath);
  assert.deepEqual(acquisition.sources, planAcquisition(comparison), 'Preserved acquisition differs from the verified comparison');
  const manifest = read('tables/abulafia/manifest.json');
  const inventory = read('Docs/macro-inventory.json');
  assert.equal(inventory.provenance.manifestSha256, inputHashes['tables/abulafia/manifest.json'], 'Current macro inventory is stale');
  assert.equal(inventory.provenance.commit, manifest.commit, 'Current source revisions differ');
  const commit = execFileSync('git', ['-C', upstream, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  assert.equal(commit, manifest.commit, 'Use the pinned source checkout');
  assert.equal(execFileSync('git', ['-C', upstream, 'status', '--porcelain'], { encoding: 'utf8' }).trim(), '', 'Source checkout has uncommitted changes');
  const { buildPlan } = require('./check-wayback.cjs');
  const targetPlan = buildPlan(root);
  assert.equal(comparison.provenance.planSha256, hash(JSON.stringify(targetPlan)), 'Comparison no longer matches current missing-reference evidence');
  assert.deepEqual(comparison.targets.map(target => [target.name, target.page, target.subtable]),
    targetPlan.targets.map(target => [target.name, target.page, target.subtable]), 'Comparison target identities differ from current evidence');
  const toolFiles = ['explorer/tools/backup-inventory.cjs', 'explorer/tools/census-backups.py', 'explorer/tools/scan-backups.py',
    'explorer/tools/import-abulafia.cjs', 'explorer/tools/check-wayback.cjs'];
  for (const file of toolFiles) inputHashes[file] = fileHash(root, file);
  const censusSha256 = inputHashes['explorer/tools/census-backups.py'];
  const readerSha256 = inputHashes['explorer/tools/scan-backups.py'];
  const extractorSha256 = fileHash(upstream, 'tools/extract_tables.py');
  assert.equal(extractorSha256, comparison.provenance.extractor.sha256, 'Source extractor differs from the audited version');
  for (const source of acquisition.sources) {
    const file = path.join(prefix, source.file);
    assert.equal(fileHash(root, file), source.sha256, `Preserved archive hash changed: ${source.id}`);
    assert.equal(fs.statSync(contained(root, file)).size, source.bytes, `Preserved archive size changed: ${source.id}`);
    inputHashes[file] = source.sha256;
  }
  const sourceRecordHashes = {};
  const currentTables = loadCorpus(upstream).map(record => {
    sourceRecordHashes[record.sourceFile] = record.sourceHash;
    return { pageId: String(record.table.page.page_id), page: record.table.page.title, subtable: record.table.subtable.name,
      sourceFile: record.sourceFile, sourceHash: record.sourceHash };
  });
  assert.equal(currentTables.length, inventory.scope.currentWikiTables, 'Current source inventory count differs');
  for (const table of manifest.tables) assert.equal(sourceRecordHashes[table.sourceFile], table.sourceHash, `Imported source evidence changed: ${table.name}`);
  const provenance = { date, sourceRepository: manifest.repository, sourceCommit: commit,
    acquisitionManifest: acquisitionFile, comparisonReport: comparisonPath,
    currentInventory: 'Docs/macro-inventory.json', currentManifest: 'tables/abulafia/manifest.json',
    sourceIndex: { file: 'tables/index.json', sha256: fileHash(upstream, 'tables/index.json') },
    extractor: { file: 'tools/extract_tables.py', sha256: extractorSha256, commit },
    sourceRecordHashes, inputHashes };
  function* censuses() {
    for (const source of acquisition.sources) {
      const censusFile = path.join(prefix, 'census', censusSha256.slice(0, 12), `${source.id}.json`);
      const jobFile = path.join(prefix, 'census', censusSha256.slice(0, 12), `${source.id}.job.json`);
      const job = read(jobFile);
      const census = read(censusFile);
      assert.equal(census.censusSha256, censusSha256, 'Census reader hash is stale');
      assert.equal(census.jobSha256, hash(JSON.stringify(job)), 'Census job hash is stale');
      assert.equal(census.readerSha256, readerSha256, 'XML reader hash is stale');
      assert.equal(census.extractorSha256, extractorSha256, 'Census extractor hash is stale');
      assert.equal(job.readerSha256, readerSha256, 'Job XML reader differs');
      assert.equal(job.extractor.sha256, extractorSha256, 'Job source extractor differs');
      assert.equal(job.source.id, source.id, 'Job source identity differs');
      assert.equal(job.source.kind, source.kind, 'Job source kind differs');
      assert.equal(fs.realpathSync(job.source.root), archive, 'Job does not reference the preserved archive root');
      const comparisonSource = comparison.sources.find(record => record.id === source.id);
      const expectedFiles = source.kind === 'converted-tables' ? comparisonSource.files : [{ name: source.file, sha256: source.sha256,
        bytes: source.bytes, member: source.xml.member, xmlSha256: source.xml.sha256, xmlBytes: source.xml.bytes }];
      if (source.kind === 'converted-tables') {
        assert.equal(job.source.archive.name, source.file, 'Converted job archive differs');
        assert.equal(job.source.archive.sha256, source.sha256, 'Converted job archive hash differs');
      }
      assert.deepEqual(job.source.files, expectedFiles, 'Census job file scope differs from preserved sources');
      assert.equal(census.files.length, expectedFiles.length, 'Census file scope is incomplete');
      assert.equal(census.summary.filesScanned, expectedFiles.length, 'Census file count differs');
      const files = new Map(census.files.map(file => [file.name, file]));
      assert.equal(files.size, census.files.length, 'Duplicate census file identity');
      for (const expectedFile of expectedFiles) {
        const actual = files.get(expectedFile.name);
        assert.ok(actual, 'Missing census file');
        for (const [field, value] of Object.entries(expectedFile)) assert.deepEqual(actual[field], value, `Census file metadata differs: ${field}`);
      }
      assert.equal(census.summary.tableIdentities, census.tables.length, 'Census table count differs');
      for (const table of census.tables) assert.equal(table.sourceSha256, files.get(table.sourceFile)?.sha256, 'Census definition source hash differs');
      yield { ...census, censusFile, resultSha256: inputHashes[censusFile] };
    }
  }
  const report = buildCompleteness({ comparison, acquisition, censuses: censuses(), currentTables, manifest, legacy: inventory.legacy, provenance });
  report.provenance.inputHashes = Object.fromEntries(Object.entries(inputHashes).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0));
  return report;
}

function writeCompleteness(repo, outputRoot, report) {
  const root = fs.realpathSync(repo);
  const prefix = path.relative(path.resolve(repo), path.resolve(repo, outputRoot));
  contained(root, prefix);
  for (const [file, expected] of Object.entries(report.provenance.inputHashes)) {
    assert.equal(fileHash(root, file), expected, `Input hash changed before publication: ${file}`);
  }
  return writeArtifacts(root, new Map([
    [path.join(prefix, 'inventory-report.json'), JSON.stringify(report) + '\n'],
    [path.join(prefix, 'inventory-report.md'), renderCompleteness(report)],
    [path.join(prefix, 'new-wiki-tables.md'), renderAdditionalTables(report)]
  ]));
}

module.exports = { planAcquisition, acquireSources, buildCompleteness, renderCompleteness, renderAdditionalTables, loadCompleteness, writeCompleteness };

function main() {
  const { values } = parseArgs({ options: { 'archive-root': { type: 'string' }, source: { type: 'string' }, comparison: { type: 'string' },
    date: { type: 'string' }, output: { type: 'string' }, help: { type: 'boolean' } } });
  if (values.help || !Object.keys(values).length) {
    console.log('Usage: node explorer/tools/backup-inventory.cjs --archive-root DIRECTORY --source DIRECTORY --comparison FILE [--date YYYY-MM-DD] [--output DIRECTORY]\n' +
      'Verify preserved local archives and complete census results; no network access or table imports.\n' +
      'Without --output, print only completeness totals. Publication refuses changed inputs and conflicting files.');
    return;
  }
  assert.ok(values['archive-root'] && values.source && values.comparison, 'Supply --archive-root, --source, and --comparison before reading or writing inventory reports');
  const repo = path.resolve(__dirname, '..', '..');
  const report = loadCompleteness(repo, { archiveRoot: path.resolve(values['archive-root']), sourceRoot: path.resolve(values.source),
    comparisonFile: path.resolve(values.comparison), date: values.date || new Date().toISOString().slice(0, 10) });
  const written = values.output ? writeCompleteness(repo, path.resolve(values.output), report) : 0;
  const { notInActiveBaseline, ...current } = report.current;
  console.log(JSON.stringify({ acquisition: report.acquisition, wiki: report.wiki, current,
    extractionScopeDifferences: notInActiveBaseline.length, converted: report.converted, targetCounts: report.targetCounts,
    output: values.output ? path.relative(repo, path.resolve(values.output)) : null, written }, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}