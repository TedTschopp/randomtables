const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { compareDefinitions, buildReport, renderMarkdown, loadAudit, writeReport } = require('../tools/compare-backups.cjs');

function target(page, subtable) {
  return { name: `${page}.${subtable}`, page, subtable, status: 'pending', affectedTables: 7 };
}

function definition(page, subtable, overrides = {}) {
  return { page, subtable, rawSource: `;${subtable}\n1,Original result`,
    entries: [{ weight: 1, text: 'Original result', raw_text: '1,Original result' }],
    warnings: [], sourceFile: 'fixture.xml', revisionId: '12', ...overrides };
}

test('backup comparison matches definitions, not references or guessed dotted page names', () => {
  const plan = { targets: [target('Lost.Page', 'Word'), target('MagicalWondrous', 'Gemstones')] };
  const sources = [
    { id: 'baseline', kind: 'baseline', complete: true, definitions: [definition('Utility', 'Jewels', {
      rawSource: ';Jewels\n4,[MagicalWondrous.Gemstones]' })] },
    { id: 'backup', kind: 'wiki-export', complete: true, definitions: [
      definition('Lost', 'Page.Word'), definition('Lost.Page', 'Word')
    ] }
  ];
  const before = JSON.stringify({ plan, sources });
  const report = compareDefinitions(plan, sources);
  assert.equal(report.targets[0].status, 'backup-definition');
  assert.equal(report.targets[0].candidates.length, 1);
  assert.equal(report.targets[0].candidates[0].page, 'Lost.Page');
  assert.equal(report.targets[1].status, 'not-found');
  assert.equal(report.summary.backupDefinitionTargets, 1);
  assert.equal(report.summary.notFoundTargets, 1);
  assert.equal(JSON.stringify({ plan, sources }), before);
});

test('baseline definitions and case-only candidates are not new recoveries', () => {
  const plan = { targets: [target('Existing', 'Word'), target('Names', 'lower'), target('Names', 'Lower')] };
  const report = compareDefinitions(plan, [
    { id: 'baseline', kind: 'baseline', complete: true, definitions: [definition('Existing', 'Word')] },
    { id: 'copy', kind: 'converted-tables', complete: true, definitions: [definition('Names', 'Lower')] }
  ]);
  assert.equal(report.targets[0].status, 'baseline-definition');
  assert.equal(report.targets[1].status, 'case-only-definition');
  assert.equal(report.targets[2].status, 'backup-definition');
  assert.deepEqual(report.targets.map(record => record.name), plan.targets.map(record => record.name));
  assert.equal(report.targets[1].candidates[0].match, 'case-only');
  for (const record of report.targets) {
    assert.equal(record.tableConfirmed, false);
    for (const candidate of record.candidates) assert.equal(candidate.reviewRequired, true);
  }
});

test('empty definitions, altered copies, and incomplete sources retain their limitations', () => {
  const plan = { targets: [target('Empty', 'Start'), target('Edited', 'Start'), target('Absent', 'Start')] };
  const report = compareDefinitions(plan, [
    { id: 'copy', kind: 'converted-tables', complete: true, definitions: [
      definition('Empty', 'Start', { entries: [{ weight: 0, text: 'A note' }] }),
      definition('Edited', 'Start', { warnings: ['Commented-out weighted row'],
        rawSource: ';Start\n1,Original result\n#4,[Missing.Table]' })
    ] },
    { id: 'failed', kind: 'wiki-export', complete: false, definitions: [] }
  ]);
  assert.equal(report.targets[0].status, 'empty-definition');
  assert.equal(report.targets[1].status, 'backup-definition');
  assert.deepEqual(report.targets[1].candidates[0].warnings, ['Commented-out weighted row']);
  assert.equal(report.targets[2].status, 'incomplete');
  assert.equal(report.summary.confirmedRecoveries, 0);
});

test('ambiguous input identities are rejected and local-review targets remain excluded', () => {
  const record = target('Exact', 'Name');
  assert.throws(() => compareDefinitions({ targets: [record, record] }, []), /duplicate/i);
  assert.throws(() => compareDefinitions({ targets: [{ ...record, name: 'Other.Name' }] }, []), /identity/i);
  const excluded = { name: 'Local.lower', status: 'local-review', matches: [{ name: 'Local.Lower' }] };
  const report = compareDefinitions({ targets: [excluded] }, []);
  assert.equal(report.targets[0].status, 'local-review');
  assert.equal(report.summary.comparedTargets, 0);
});

test('published evidence requires the complete source scope and retains distinct identities without copying source rows', () => {
  const revision = { id: '12', timestamp: '2012-01-01T00:00:00Z', textSha256: 'a'.repeat(64), contributor: { id: '7', username: 'Writer' } };
  const plan = { targets: [target('Historical', 'Word'), target('Original', 'Word'), target('Adapted', 'Start'), target('Absent', '<script>|[text]')] };
  const sources = [
    { id: 'baseline', kind: 'baseline', complete: true, definitions: [definition('Historical', 'Word', { revisions: [revision], presentInLatest: false })] },
    { id: 'old', kind: 'wiki-export', complete: true, definitions: ['1', '2'].map(pageId => definition('Original', 'Word', {
      pageId, revisions: [revision, { ...revision, id: '13', timestamp: '2013-01-01T00:00:00Z' }], presentInLatest: true
    })) },
    { id: 'copy', kind: 'converted-tables', complete: true, definitions: [definition('Adapted', 'Start', { warnings: ['Rewritten references'] })] }
  ];
  const provenance = { expectedSourceIds: ['baseline', 'old', 'copy'], auditDate: '2026-09-07' };
  const before = JSON.stringify({ plan, sources });
  const report = buildReport(plan, sources, provenance);
  assert.equal(report.scope.complete, true);
  assert.equal(report.summary.newArchiveDefinitionTargets, 1);
  assert.equal(report.summary.convertedOnlyDefinitionTargets, 1);
  assert.equal(report.summary.baselineHistoricalTargets, 1);
  assert.equal(report.summary.confirmedRecoveries, 0);
  const found = report.targets[1];
  assert.equal(found.classification, 'new-xml-definition');
  assert.equal(found.variants.length, 1);
  assert.deepEqual(found.variants[0].occurrences.map(record => record.pageId), ['1', '2']);
  for (const occurrence of found.variants[0].occurrences) {
    assert.equal(occurrence.revisionCount, 2);
    assert.deepEqual(occurrence.firstRevision, revision);
    assert.equal(occurrence.lastRevision.id, '13');
    assert.match(occurrence.revisionsSha256, /^[a-f0-9]{64}$/);
  }
  assert.equal(report.targets[2].classification, 'converted-only-definition');
  assert.deepEqual(report.targets[2].variants[0].occurrences[0].warnings, ['Rewritten references']);
  assert.equal(JSON.stringify(report).includes('Original result'), false);
  assert.equal(JSON.stringify({ plan, sources }), before);
  assert.equal(JSON.stringify(buildReport(plan, sources, provenance)), JSON.stringify(report));
  assert.throws(() => buildReport(plan, sources.slice(1), provenance), /scope|source/i);
  assert.throws(() => buildReport(plan, sources.map(source => ({ ...source, complete: false })), provenance), /complete/i);
  const markdown = renderMarkdown(report);
  assert.match(markdown, /No tables were imported/i);
  assert.match(markdown, /&lt;script&gt;/);
  assert.doesNotMatch(markdown, /<script>/);
});

const extractor = path.resolve(__dirname, '../../../random-generator-com-wiki-dump/tools/extract_tables.py');
const scanner = path.resolve(__dirname, '../tools/scan-backups.py');
const digest = content => crypto.createHash('sha256').update(content).digest('hex');

test('offline audit loading rejects stale jobs, changed data, and missing planned sources', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-audit-'));
  const save = (relative, value) => {
    const filename = path.join(root, relative);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, typeof value === 'string' ? value : JSON.stringify(value));
    return filename;
  };
  try {
    const extractorFile = save('extractor.py', 'trusted fixture');
    save('explorer/tools/scan-backups.py', 'scanner fixture');
    save('explorer/tools/compare-backups.cjs', 'reporter fixture');
    save('basis.json', '{}');
    const plan = { targets: [target('Original', 'Word')], provenance: { inputHashes: { 'basis.json': digest('{}') } } };
    save('cache/target-plan.json', JSON.stringify(plan, null, 2) + '\n');
    const sourcePlan = { schemaVersion: 1, extractor: { file: extractorFile, sha256: digest('trusted fixture') },
      baseline: { id: 'baseline', file: path.join(root, 'data/baseline.xml'), sha256: digest('baseline'), bytes: 8 },
      archives: ['baseline', 'old'].map(id => ({ id, name: `${id}.xml`, member: `${id}.xml`, bytes: id === 'old' ? 3 : 8,
        sha1: crypto.createHash('sha1').update(id).digest('hex'), url: `https://archive.org/download/fixture/${id}.xml` })), repositories: [] };
    save('cache/source-plan.json', sourcePlan);
    const scannerSha256 = digest('scanner fixture');
    const scanRoot = `cache/scans/${scannerSha256.slice(0, 12)}`;
    const scans = [];
    for (const id of ['baseline', 'old']) {
      save(`data/${id}.xml`, id);
      const source = { id, kind: id === 'baseline' ? 'baseline' : 'wiki-export', root: path.join(root, 'data'),
        archiveUrl: `https://archive.org/download/fixture/${id}.xml`, files: [{ name: `${id}.xml`, sha256: digest(id), bytes: Buffer.byteLength(id),
          ...(id === 'old' ? { member: 'old.xml', sha1: sourcePlan.archives[1].sha1 } : {}) }] };
      const job = { extractor: sourcePlan.extractor, targets: plan.targets, source };
      const scan = { ...source, files: source.files.map(file => ({ ...file, xmlSha256: digest(id), xmlBytes: Buffer.byteLength(id) })),
        complete: true, definitions: id === 'old' ? [definition('Original', 'Word', { sourceFile: 'old.xml', sourceSha256: digest(id) })] : [],
        scannerSha256, extractorSha256: sourcePlan.extractor.sha256, targetPlanSha256: digest(JSON.stringify(plan)),
        sourcePlanSha256: digest(JSON.stringify(job)) };
      save(`${scanRoot}/${id}.job.json`, job);
      save(`${scanRoot}/${id}.json`, scan);
      scans.push(scan);
    }
    save('cache/baseline-archive-verification.json', { id: 'baseline', matchesLocalBaseline: true, xmlSha256: digest('baseline'),
      xmlBytes: 8, url: sourcePlan.archives[0].url, archiveSha1: sourcePlan.archives[0].sha1 });
    const report = loadAudit(root, 'cache', '2026-09-07');
    assert.equal(report.summary.newArchiveDefinitionTargets, 1);
    assert.equal(report.scope.scannedSources, 2);
    assert.equal(JSON.stringify(report).includes(root), false);
    save(`${scanRoot}/old.json`, { ...scans[1], scannerSha256: '0'.repeat(64) });
    assert.throws(() => loadAudit(root, 'cache', '2026-09-07'), /scanner/i);
    save(`${scanRoot}/old.json`, scans[1]);
    save('data/old.xml', 'modified');
    assert.throws(() => loadAudit(root, 'cache', '2026-09-07'), /hash|source/i);
    save('data/old.xml', 'old');
    fs.unlinkSync(path.join(root, scanRoot, 'old.json'));
    assert.throws(() => loadAudit(root, 'cache', '2026-09-07'), /ENOENT|source/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('report publication is contained, hash-checked, idempotent, and refuses conflicting files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-report-'));
  try {
    fs.writeFileSync(path.join(root, 'basis.json'), '{}');
    const report = buildReport({ targets: [target('Original', 'Word')] }, [
      { id: 'baseline', kind: 'baseline', complete: true, definitions: [] }
    ], { auditDate: '2026-09-07', expectedSourceIds: ['baseline'], inputHashes: { 'basis.json': digest('{}') } });
    assert.equal(writeReport(root, 'report', report), 2);
    assert.equal(writeReport(root, 'report', report), 0);
    assert.throws(() => writeReport(root, '../outside', report), /inside|outside|contain/i);
    fs.symlinkSync(path.join(root, 'report'), path.join(root, 'linked'));
    assert.throws(() => writeReport(root, 'linked', report), /symbolic/i);
    const before = fs.readFileSync(path.join(root, 'report/backup-report.json'));
    const changed = structuredClone(report);
    changed.provenance.auditDate = '2026-09-08';
    assert.throws(() => writeReport(root, 'report', changed), /overwrite/i);
    assert.deepEqual(fs.readFileSync(path.join(root, 'report/backup-report.json')), before);
    fs.writeFileSync(path.join(root, 'basis.json'), 'changed');
    assert.throws(() => writeReport(root, 'new-report', report), /changed|hash/i);
    assert.equal(fs.existsSync(path.join(root, 'new-report')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function scanFixture(files, targets, kind = 'wiki-export', transform = job => job) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-scan-'));
  try {
    const inputs = files.map(([name, content]) => {
      fs.writeFileSync(path.join(root, name), content);
      return { name, sha256: digest(content) };
    });
    const job = transform({ extractor: { file: extractor, sha256: digest(fs.readFileSync(extractor)) }, targets,
      source: { id: 'fixture', kind, root, files: inputs } });
    const result = spawnSync('python3', [scanner], { input: JSON.stringify(job), encoding: 'utf8',
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, maxBuffer: 4 * 1024 * 1024 });
    return { ...result, data: result.status === 0 ? JSON.parse(result.stdout) : null };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('XML scanning preserves historical definitions and ignores inactive markup', { skip: !fs.existsSync(extractor) }, () => {
  const xml = `<?xml version="1.0"?>
<mediawiki xmlns="http://www.mediawiki.org/xml/export-0.10/">
<page><title>Lost.Page</title><ns>0</ns><id>3</id>
<revision><id>10</id><timestamp>2012-01-01T00:00:00Z</timestamp><contributor><username>Writer</username><id>7</id></contributor><text><![CDATA[
<sgtable>
;Word
2,One
1,Two
</sgtable>
<!-- <sgtable>\n;Hidden\n1,Not active\n</sgtable> -->
<nowiki><sgtable>\n;Literal\n1,Not active\n</sgtable></nowiki>
]]></text></revision>
<revision><id>11</id><timestamp>2020-01-01T00:00:00Z</timestamp><text>Removed in latest revision.</text></revision>
</page></mediawiki>`;
  const result = scanFixture([['history.xml', xml]], [target('Lost.Page', 'Word'), target('Lost.Page', 'Hidden'), target('Lost.Page', 'Literal')]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.data.complete, true);
  assert.equal(result.data.summary.revisionsScanned, 2);
  assert.equal(result.data.definitions.length, 1);
  const found = result.data.definitions[0];
  assert.equal(found.page, 'Lost.Page');
  assert.equal(found.subtable, 'Word');
  assert.equal(found.pageId, '3');
  assert.equal(found.revisions[0].id, '10');
  assert.equal(found.revisions[0].contributor.username, 'Writer');
  assert.equal(found.presentInLatest, false);
  assert.deepEqual(found.entries.map(entry => entry.weight), [2, 1]);
  assert.match(found.rawSource, /2,One\n1,Two/);
});

test('converted file scanning keeps filename identities and modified-row evidence', { skip: !fs.existsSync(extractor) }, () => {
  const result = scanFixture([['Names.tab', ';Word\n1,One\n#4,[Missing.Table]\n;Empty\n0,Note\n']],
    [target('Names', 'Word'), target('Names', 'Empty')], 'converted-tables');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.data.definitions.length, 2);
  const found = result.data.definitions[0];
  assert.equal(found.pageIdentity, 'filename-derived');
  assert.equal(found.sourceFile, 'Names.tab');
  assert.ok(found.warnings.some(warning => /commented-out/i.test(warning)));
  assert.match(found.rawSource, /#4,\[Missing.Table\]/);
  const report = compareDefinitions({ targets: [target('Names', 'Word'), target('Names', 'Empty')] }, [result.data]);
  assert.equal(report.targets[1].status, 'empty-definition');
});

test('source scanning rejects stale hashes, malformed XML, and entity declarations', { skip: !fs.existsSync(extractor) }, () => {
  const targets = [target('Names', 'Word')];
  const stale = scanFixture([['Names.tab', ';Word\n1,One']], targets, 'converted-tables', job => {
    job.source.files[0].sha256 = '0'.repeat(64);
    return job;
  });
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /hash/i);
  const malformed = scanFixture([['history.xml', '<mediawiki><page>']], targets);
  assert.notEqual(malformed.status, 0);
  const entities = scanFixture([['history.xml', '<!DOCTYPE mediawiki [<!ENTITY unsafe SYSTEM "file:///etc/passwd">]><mediawiki/>']], targets);
  assert.notEqual(entities.status, 0);
  assert.match(entities.stderr, /DOCTYPE|entity/i);
});

test('compressed XML sources retain both container and decoded-content hashes', { skip: !fs.existsSync(extractor) }, () => {
  const xml = '<mediawiki><page><title>Names</title><id>1</id><revision><id>2</id><timestamp>2020-01-01T00:00:00Z</timestamp>' +
    '<text><![CDATA[<sgtable>\n;Word\n1,One\n</sgtable>]]></text></revision></page></mediawiki>';
  const result = scanFixture([['history.xml', xml]], [target('Names', 'Word')], 'wiki-export', job => {
    const archive = path.join(job.source.root, 'history.tar');
    const created = spawnSync('bsdtar', ['-cf', archive, '-C', job.source.root, 'history.xml'], { encoding: 'utf8' });
    assert.equal(created.status, 0, created.stderr);
    job.source.files = [{ name: 'history.tar', member: 'history.xml', sha256: digest(fs.readFileSync(archive)) }];
    return job;
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.data.files[0].xmlSha256, digest(xml));
  assert.equal(result.data.definitions.length, 1);
  assert.equal(result.data.definitions[0].sourceMember, 'history.xml');
});

test('repeated XML pages retain distinct IDs and determine latest state across all fragments', { skip: !fs.existsSync(extractor) }, () => {
  const page = (pageId, revisionId, date, text) => `<page><title>Names</title><id>${pageId}</id><revision><id>${revisionId}</id>` +
    `<timestamp>${date}</timestamp><text><![CDATA[${text}]]></text></revision></page>`;
  const original = page('1', '10', '2012-01-01T00:00:00Z', '<sgtable>\n;Word\n1,One\n</sgtable>');
  const xml = '<mediawiki>' + page('1', '11', '2020-01-01T00:00:00Z', 'Definition removed.') + original + original +
    page('2', '12', '2020-01-02T00:00:00Z', '<sgtable>\n;Word\n1,One\n</sgtable>') + '</mediawiki>';
  const result = scanFixture([['history.xml', xml]], [target('Names', 'Word')]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.data.definitions.length, 2);
  assert.equal(result.data.summary.uniquePageTitles, 1);
  assert.equal(result.data.summary.uniquePageIdentities, 2);
  assert.equal(result.data.definitions.find(record => record.pageId === '1').presentInLatest, false);
  assert.equal(result.data.definitions.find(record => record.pageId === '1').revisions.length, 1);
  assert.equal(result.data.definitions.find(record => record.pageId === '2').presentInLatest, true);
});