const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { planAcquisition, acquireSources, buildCompleteness, renderCompleteness, writeCompleteness } = require('../tools/backup-inventory.cjs');

const digest = content => crypto.createHash('sha256').update(content).digest('hex');

function comparisonFixture() {
  return {
    scope: { complete: true },
    provenance: { expectedSourceIds: ['baseline', 'older'], baselineVerification: {
      id: 'baseline', matchesLocalBaseline: true, url: 'https://archive.org/download/fixture/baseline.7z',
      archiveSha256: digest('baseline'), archiveBytes: 8, member: 'baseline.xml', xmlSha256: digest('baseline XML'), xmlBytes: 12
    } },
    sources: [
      { id: 'baseline', kind: 'baseline', complete: true, archiveUrl: 'https://archive.org/download/fixture/baseline.7z', files: [{ name: 'baseline.xml' }] },
      { id: 'older', kind: 'wiki-export', complete: true, archiveUrl: 'https://archive.org/download/fixture/older.7z', files: [
        { name: 'older.7z', sha256: digest('older'), bytes: 5, member: 'older.xml', xmlSha256: digest('older XML'), xmlBytes: 9 }
      ] }
    ]
  };
}

test('acquisition retains complete source archives and separates exact source identities', () => {
  const comparison = comparisonFixture();
  const before = JSON.stringify(comparison);
  const plan = planAcquisition(comparison);
  assert.equal(plan.length, 2);
  assert.equal(plan[0].file, 'downloads/baseline/baseline.7z');
  assert.equal(plan[1].file, 'downloads/older/older.7z');
  assert.equal(plan[0].xml.sha256, digest('baseline XML'));
  assert.equal(JSON.stringify(comparison), before);
  assert.throws(() => planAcquisition({ ...comparison, sources: comparison.sources.slice(1) }), /scope|source/i);
  assert.throws(() => planAcquisition({ ...comparison, scope: { complete: false } }), /complete/i);
  const conflicting = structuredClone(comparison);
  conflicting.sources[1].id = 'BASELINE';
  conflicting.provenance.expectedSourceIds[1] = 'BASELINE';
  assert.throws(() => planAcquisition(conflicting), /collision|identity/i);
  const unsafe = structuredClone(comparison);
  unsafe.sources[1].files[0].name = '../older.7z';
  assert.throws(() => planAcquisition(unsafe), /name|path/i);
});

test('acquisition verifies every input before writing and never overwrites different content', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-acquire-'));
  try {
    fs.mkdirSync(path.join(root, 'cache'));
    fs.writeFileSync(path.join(root, 'cache/baseline.7z'), 'baseline');
    fs.writeFileSync(path.join(root, 'cache/older.7z'), 'changed');
    const plan = planAcquisition(comparisonFixture());
    assert.throws(() => acquireSources(root, 'cache', 'archive', plan), /hash|size|bytes/i);
    assert.equal(fs.existsSync(path.join(root, 'archive')), false);
    fs.writeFileSync(path.join(root, 'cache/older.7z'), 'older');
    const acquired = acquireSources(root, 'cache', 'archive', plan);
    assert.equal(acquired.summary.files, 2);
    assert.equal(acquired.summary.bytes, 13);
    assert.equal(acquired.summary.verified, 2);
    assert.equal(acquired.written, 3);
    assert.equal(acquireSources(root, 'cache', 'archive', plan).written, 0);
    assert.deepEqual(fs.readFileSync(path.join(root, 'archive/downloads/baseline/baseline.7z')), Buffer.from('baseline'));
    fs.writeFileSync(path.join(root, 'archive/downloads/older/older.7z'), 'conflict');
    assert.throws(() => acquireSources(root, 'cache', 'archive', plan), /overwrite/i);
    assert.equal(fs.readFileSync(path.join(root, 'archive/downloads/older/older.7z'), 'utf8'), 'conflict');
    assert.throws(() => acquireSources(root, 'cache', '../outside', plan), /inside|outside|contain/i);
    fs.symlinkSync(path.join(root, 'cache'), path.join(root, 'linked'));
    assert.throws(() => acquireSources(root, 'linked', 'other', plan), /symbolic/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

const extractor = path.resolve(__dirname, '../../../random-generator-com-wiki-dump/tools/extract_tables.py');
const reader = path.resolve(__dirname, '../tools/scan-backups.py');
const census = path.resolve(__dirname, '../tools/census-backups.py');

function censusFixture(files, configure = job => job) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-census-'));
  try {
    const inputs = files.map(([name, content]) => {
      const filename = path.join(root, name);
      fs.mkdirSync(path.dirname(filename), { recursive: true });
      fs.writeFileSync(filename, content);
      return { name, sha256: digest(content), bytes: Buffer.byteLength(content) };
    });
    const job = configure({ extractor: { file: extractor, sha256: digest(fs.readFileSync(extractor)) },
      readerSha256: digest(fs.readFileSync(reader)), source: { id: 'fixture', kind: 'wiki-export', root, files: inputs } });
    const result = spawnSync('python3', [census], { input: JSON.stringify(job), encoding: 'utf8',
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, maxBuffer: 4 * 1024 * 1024 });
    return { ...result, data: result.status === 0 ? JSON.parse(result.stdout) : null };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('the census separates table identities, historic definitions, empty tables, and latest fragments', { skip: !fs.existsSync(extractor) }, () => {
  const page = (pageId, revisionId, date, text) => `<page><title>Names</title><id>${pageId}</id><revision><id>${revisionId}</id>` +
    `<timestamp>${date}</timestamp><contributor><id>7</id><username>Writer</username></contributor><text><![CDATA[${text}]]></text></revision></page>`;
  const old = page('1', '1', '2012-01-01T00:00:00Z', '<sgtable>\n;Word\n2,One\n;Empty\n0,Note\n</sgtable>' +
    '<!-- <sgtable>\n;Hidden\n1,No\n</sgtable> -->');
  const xml = '<mediawiki>' + page('1', '9', '2020-01-01T00:00:00Z', '<sgtable>\n;Current\n1,Two\n</sgtable>') + old + old +
    page('2', '3', '2015-01-01T00:00:00Z', '<sgtable>\n;Word\n1,Other identity\n</sgtable>') + '</mediawiki>';
  const result = censusFixture([['history.xml', xml]]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.data.complete, true);
  assert.equal(result.data.summary.tableIdentities, 4);
  assert.equal(result.data.summary.positiveTableIdentities, 3);
  assert.equal(result.data.summary.latestTableIdentities, 2);
  assert.equal(result.data.summary.uniquePageIdentities, 2);
  const historic = result.data.tables.find(table => table.pageId === '1' && table.subtable === 'Word');
  assert.equal(historic.presentInLatest, false);
  assert.equal(historic.variants.length, 1);
  assert.equal(historic.variants[0].positiveRows, 1);
  assert.equal(historic.variants[0].totalPositiveWeight, 2);
  assert.equal(historic.firstRevision.id, '1');
  assert.equal(result.data.tables.find(table => table.pageId === '2').presentInLatest, true);
  assert.ok(historic.contributors.some(contributor => contributor.id === '7'));
  assert.equal(JSON.stringify(result.data).includes('Other identity'), false);
  assert.equal(result.data.files[0].xmlSha256, digest(xml));
});

test('converted census streams only planned data members and preserves filename collisions as distinct identities', { skip: !fs.existsSync(extractor) }, () => {
  const files = [['bundle/A/Names.tab', ';Start\n1,One\n;Empty\n0,Note'], ['bundle/B/Names.tab', ';Start\n2,Two\n#4,[Missing.Table]']];
  const result = censusFixture(files, job => {
    const archive = path.join(job.source.root, 'collection.tar.gz');
    const created = spawnSync('bsdtar', ['-czf', archive, '-C', job.source.root, 'bundle'], { encoding: 'utf8' });
    assert.equal(created.status, 0, created.stderr);
    job.source.kind = 'converted-tables';
    job.source.archive = { name: 'collection.tar.gz', sha256: digest(fs.readFileSync(archive)), prefix: 'bundle' };
    job.source.files = job.source.files.map(file => ({ ...file, name: file.name.slice('bundle/'.length) }));
    return job;
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.data.summary.filesScanned, 2);
  assert.equal(result.data.summary.tableIdentities, 3);
  const starts = result.data.tables.filter(table => table.subtable === 'Start');
  assert.equal(starts.length, 2);
  assert.deepEqual(starts.map(table => table.sourceFile), ['A/Names.tab', 'B/Names.tab']);
  assert.ok(starts.every(table => table.pageIdentity === 'filename-derived'));
  assert.ok(starts[1].variants[0].warnings.some(warning => /commented-out/i.test(warning)));
});

test('colon headers are inventoried without guessing weights or absorbing their rows into a neighboring wiki table', { skip: !fs.existsSync(extractor) }, () => {
  const result = censusFixture([['bundle/Mixed.tab', ';Start\n1,Weighted\n:Roll\n1,First\n2,Second\n;Empty\n0,Note']], job => {
    const archive = path.join(job.source.root, 'collection.tar.gz');
    const created = spawnSync('bsdtar', ['-czf', archive, '-C', job.source.root, 'bundle'], { encoding: 'utf8' });
    assert.equal(created.status, 0, created.stderr);
    job.source.kind = 'converted-tables';
    job.source.archive = { name: 'collection.tar.gz', sha256: digest(fs.readFileSync(archive)), prefix: 'bundle' };
    job.source.files = job.source.files.map(file => ({ ...file, name: file.name.slice('bundle/'.length) }));
    return job;
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.data.summary.tableIdentities, 3);
  assert.equal(result.data.summary.formatReviewTableIdentities, 1);
  const start = result.data.tables.find(table => table.subtable === 'Start');
  assert.equal(start.variants[0].positiveRows, 1);
  const roll = result.data.tables.find(table => table.subtable === 'Roll');
  assert.equal(roll.variants[0].format, 'colon-declaration');
  assert.equal(roll.variants[0].positiveRows, null);
  assert.equal(roll.variants[0].totalPositiveWeight, null);
  assert.equal(roll.variants[0].line, 3);
  assert.equal(roll.latestPositiveRows, null);
});

test('completeness separates downloads, historical identities, converted records, and runnable imports', () => {
  const table = (pageId, page, subtable, overrides = {}) => ({ pageId, page, subtable, sourceFile: 'history.xml', presentInLatest: true,
    variants: [{ sha256: digest(`${page}.${subtable}`), positiveRows: 1, parsedRows: 1, format: 'wiki-sgtable' }], ...overrides });
  const current = [table('1', 'Names', 'Word'), table('1', 'Names', 'Unused'), table('8', 'Inactive', 'Example')];
  const comparison = { scope: { complete: true }, provenance: { expectedSourceIds: ['baseline', 'older', 'copy'] }, targets: [
    { name: 'Historical.Word', page: 'Historical', subtable: 'Word' },
    { name: 'Converted.Unknown', page: 'Converted', subtable: 'Unknown' },
    { name: 'Missing.Word', page: 'Missing', subtable: 'Word' },
    { name: 'Names.lower', status: 'local-review' }
  ] };
  const acquisition = { sources: [{ id: 'baseline', kind: 'baseline' }, { id: 'older', kind: 'wiki-export' }, { id: 'copy', kind: 'converted-tables' }],
    summary: { files: 3, verified: 3, bytes: 15 } };
  const censuses = [
    { id: 'baseline', kind: 'baseline', complete: true, tables: [current[0], table('2', 'Old', 'Word', { presentInLatest: false })], summary: {} },
    { id: 'older', kind: 'wiki-export', complete: true, tables: [current[0], table('3', 'Historical', 'Word'), table('4', 'Names', 'Word')], summary: {} },
    { id: 'copy', kind: 'converted-tables', complete: true, tables: [
      table(undefined, 'Converted', 'Unknown', { sourceFile: 'A/Converted.tab', variants: [{ sha256: digest('unknown'), positiveRows: null, parsedRows: null, format: 'colon-declaration' }] }),
      table(undefined, 'Converted', 'Unknown', { sourceFile: 'B/Converted.tab', variants: [{ sha256: digest('empty'), positiveRows: 0, parsedRows: 0, format: 'semicolon' }] })
    ], summary: {} }
  ];
  const manifest = { summary: { tables: 1, ready: 1, blocked: 0 }, tables: [
    { id: 'wiki_abulafia_1_576f7264', page: 'Names', name: 'Names.Word', status: 'ready' }
  ] };
  const inputs = { comparison, acquisition, censuses, currentTables: current, manifest, legacy: { summary: { tables: 0, byState: {} } }, provenance: { date: '2026-09-07' } };
  const before = JSON.stringify(inputs);
  const report = buildCompleteness(inputs);
  assert.equal(report.acquisition.coveragePercent, 100);
  assert.equal(report.wiki.archivedIdentities, 4);
  assert.equal(report.wiki.baselineIdentities, 2);
  assert.equal(report.wiki.additionalArchiveIdentities, 2);
  assert.equal(report.wiki.currentOnlyIdentities, 2);
  assert.equal(report.wiki.knownIdentities, 6);
  assert.equal(report.wiki.ambiguousNames, 1);
  assert.equal(report.current.tables, 3);
  assert.equal(report.current.imported, 1);
  assert.equal(report.current.notImported, 2);
  assert.equal(report.current.ready, 1);
  assert.equal(report.current.notInActiveBaseline.length, 2);
  assert.equal(report.converted.tableRecords, 2);
  assert.equal(report.converted.formatReviewRecords, 1);
  assert.equal(report.targets[0].classification, 'additional-xml-definition');
  assert.equal(report.targets[1].classification, 'format-review-definition');
  assert.equal(report.targets[2].classification, 'not-found');
  assert.equal(report.targets[3].classification, 'local-review');
  assert.equal(report.confirmedRecoveries, 0);
  assert.equal(JSON.stringify(inputs), before);
  assert.throws(() => buildCompleteness({ ...inputs, censuses: censuses.slice(1) }), /source|scope/i);
  assert.throws(() => buildCompleteness({ ...inputs, censuses: censuses.map(source => ({ ...source, complete: false })) }), /complete/i);
  const duplicate = structuredClone(censuses);
  duplicate[0].tables.push(duplicate[0].tables[0]);
  assert.throws(() => buildCompleteness({ ...inputs, censuses: duplicate }), /duplicate/i);
  const markdown = renderCompleteness(report);
  assert.match(markdown, /No tables were imported/i);
  assert.match(markdown, /not.*complete.*original wiki/i);
});

test('inventory preserves empty source subtable names and their existing imported IDs without inventing aliases', () => {
  const table = { pageId: '1', page: 'Example', subtable: '', sourceFile: 'history.xml', presentInLatest: true,
    variants: [{ sha256: digest(';\n1,An unnamed result'), positiveRows: 1, parsedRows: 1, format: 'wiki-sgtable' }] };
  const report = buildCompleteness({
    comparison: { scope: { complete: true }, provenance: { expectedSourceIds: ['baseline'] }, targets: [] },
    acquisition: { sources: [{ id: 'baseline', kind: 'baseline' }], summary: { files: 1, verified: 1, bytes: 8 } },
    censuses: [{ id: 'baseline', kind: 'baseline', complete: true, tables: [table], summary: {} }],
    currentTables: [table], manifest: { summary: { tables: 1, ready: 1, blocked: 0 }, tables: [
      { id: 'wiki_abulafia_1_', name: 'Example.', page: 'Example', status: 'ready' }
    ] }, legacy: { summary: { tables: 0, byState: {} } }, provenance: { date: '2026-09-07' }
  });
  assert.equal(report.wiki.unnamedArchiveIdentities, 1);
  assert.equal(report.current.ready, 1);
  assert.equal(report.wikiTables[0].subtable, '');
  assert.equal(report.wikiTables[0].name, 'Example.');
  assert.equal(report.wikiTables[0].unnamed, true);
});

test('completeness publication is hash-bound, contained, and repeatable without overwrites', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'inventory-publish-'));
  try {
    fs.writeFileSync(path.join(root, 'basis.json'), '{}');
    const report = buildCompleteness({
      comparison: { scope: { complete: true }, provenance: { expectedSourceIds: ['baseline'] }, targets: [] },
      acquisition: { sources: [{ id: 'baseline', kind: 'baseline' }], summary: { files: 1, verified: 1, bytes: 8 } },
      censuses: [{ id: 'baseline', kind: 'baseline', complete: true, tables: [], summary: {} }], currentTables: [],
      manifest: { summary: { tables: 0, ready: 0, blocked: 0 }, tables: [] }, legacy: { summary: { tables: 0, byState: {} } },
      provenance: { date: '2026-09-07', inputHashes: { 'basis.json': digest('{}') } }
    });
    assert.equal(writeCompleteness(root, 'report', report), 3);
    assert.equal(writeCompleteness(root, 'report', report), 0);
    const before = fs.readFileSync(path.join(root, 'report/inventory-report.json'));
    const changed = structuredClone(report);
    changed.provenance.date = '2026-09-08';
    assert.throws(() => writeCompleteness(root, 'report', changed), /overwrite/i);
    assert.deepEqual(fs.readFileSync(path.join(root, 'report/inventory-report.json')), before);
    assert.throws(() => writeCompleteness(root, '../outside', report), /inside|contain/i);
    fs.symlinkSync(path.join(root, 'report'), path.join(root, 'linked'));
    assert.throws(() => writeCompleteness(root, 'linked', report), /symbolic/i);
    fs.writeFileSync(path.join(root, 'basis.json'), 'changed');
    assert.throws(() => writeCompleteness(root, 'new-report', report), /hash|changed/i);
    assert.equal(fs.existsSync(path.join(root, 'new-report')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('the inventory CLI offers a no-network usage preview and requires explicit local inputs before writes', () => {
  const script = path.resolve(__dirname, '../tools/backup-inventory.cjs');
  const help = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /Usage:/);
  assert.match(help.stdout, /no network/i);
  const incomplete = spawnSync(process.execPath, [script, '--output', 'must-not-be-created'], { encoding: 'utf8' });
  assert.notEqual(incomplete.status, 0);
  assert.match(incomplete.stderr, /source|archive|input/i);
});