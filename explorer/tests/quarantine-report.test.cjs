const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { analyzeManifest, describeRepairs, buildReport, renderMarkdown, writeReport } = require('../tools/quarantine-report.cjs');

function table(id, dependencies = [], issues = [], status = 'blocked') {
  return { id, name: `${id}.main`, page: id, status, dependencies, issues };
}

test('quarantine ranking separates shared reach from recovery and preserves its inputs', () => {
  const manifest = { tables: [
    table('missing', [], [{ code: 'missing_reference', detail: 'Lost.main' }, { code: 'source_unresolved', detail: 'Unresolved source' }]),
    table('empty', [], [{ code: 'empty_table', detail: 'No entries' }, { code: 'invalid_weight', detail: 'No selectable weight' }]),
    table('left', ['missing'], [{ code: 'blocked_dependency', detail: 'missing.main' }]),
    table('right', ['missing'], [{ code: 'blocked_dependency', detail: 'missing.main' }]),
    table('top', ['left', 'right'], [{ code: 'blocked_dependency', detail: 'left.main' }]),
    table('mixed', ['top', 'empty'], [{ code: 'blocked_dependency', detail: 'top.main' }]),
    table('ready', [], [], 'ready')
  ] };
  const before = JSON.stringify(manifest);
  const report = analyzeManifest(manifest);
  const missing = report.roots.find(root => root.tableIds.includes('missing'));
  const empty = report.roots.find(root => root.tableIds.includes('empty'));
  assert.equal(report.summary.importedTables, 7);
  assert.equal(report.summary.blockedTables, 6);
  assert.equal(report.summary.readyTables, 1);
  assert.equal(report.summary.dependencyOnlyTables, 4);
  assert.equal(report.summary.multipleRootTables, 1);
  assert.equal(missing.affectedTables, 5);
  assert.equal(missing.downstreamTables, 4);
  assert.equal(missing.conditionalRecovery, 4);
  assert.equal(empty.affectedTables, 2);
  assert.equal(empty.conditionalRecovery, 1);
  assert.equal(report.roots[0].id, missing.id);
  assert.equal(report.tables.find(record => record.id === 'mixed').rootIds.length, 2);
  assert.equal(JSON.stringify(manifest), before);
  assert.deepEqual(analyzeManifest({ tables: [...manifest.tables].reverse() }), report);
});

test('quarantine ranking treats a cycle as one joint repair and keeps independent defects', () => {
  const manifest = { tables: [
    table('cycle-a', ['cycle-b'], [{ code: 'cycle', detail: 'Cyclic expansion' }]),
    table('cycle-b', ['cycle-a'], [{ code: 'blocked_dependency', detail: 'cycle-a.main' }]),
    table('caller', ['cycle-a'], [{ code: 'blocked_dependency', detail: 'cycle-a.main' }]),
    table('own-defect', ['cycle-b'], [{ code: 'unsupported_syntax', detail: 'Unconverted expression' }]),
    table('unexplained')
  ] };
  const report = analyzeManifest(manifest);
  const cycle = report.roots.find(root => root.cyclic);
  assert.deepEqual(cycle.tableIds, ['cycle-a', 'cycle-b']);
  assert.equal(cycle.affectedTables, 4);
  assert.equal(cycle.conditionalRecovery, 3);
  assert.equal(report.roots.find(root => root.tableIds.includes('own-defect')).conditionalRecovery, 0);
  assert.equal(report.roots.find(root => root.tableIds.includes('unexplained')).unexplained, true);
  assert.equal(report.summary.unexplainedTables, 1);
  assert.equal(report.summary.cyclicComponents, 1);
});

test('quarantine analysis rejects inconsistent readiness and accounts for unrecorded missing edges', () => {
  assert.throws(() => analyzeManifest({ tables: [table('duplicate'), table('duplicate')] }), /unique/);
  assert.throws(() => analyzeManifest({ tables: [table('bad', [], [{ code: 'cycle', detail: 'Cycle' }], 'ready')] }), /Ready table has issues/);
  assert.throws(() => analyzeManifest({ tables: [table('ready', ['blocked'], [], 'ready'), table('blocked')] }), /Ready table depends/);
  assert.throws(() => analyzeManifest({ tables: [table('ready', ['absent'], [], 'ready')] }), /Ready table depends/);
  assert.throws(() => analyzeManifest({ tables: [table('blocked')], summary: { tables: 1, ready: 1, blocked: 0 } }), /summary/);
  const report = analyzeManifest({ tables: [table('dangling', ['absent'])] });
  assert.equal(report.roots[0].issues[0].code, 'unrecorded_dependency');
  assert.equal(report.roots[0].unexplained, false);
});

test('repair descriptions distinguish case candidates, blocked targets, ambiguity, and joint recovery', () => {
  const missing = (id, target) => table(id, [], [
    { code: 'missing_reference', detail: target }, { code: 'unsupported_reference', detail: `[${target}]` }
  ]);
  const manifest = { tables: [
    { ...table('word', [], [], 'ready'), name: 'Target.Word' },
    { ...table('name', [], [], 'ready'), name: 'Other.Name' },
    { ...table('blocked', [], [{ code: 'empty_table', detail: 'No rows' }]), name: 'Blocked.Word' },
    { ...table('variant1', [], [], 'ready'), name: 'Ambiguous.Word' },
    { ...table('variant2', [], [], 'ready'), name: 'Ambiguous.WORD' },
    missing('case1', 'Target.word'), missing('case2', 'Other.name'),
    missing('needs-more', 'Blocked.word'), missing('ambiguous', 'Ambiguous.word'), missing('lost', 'MissingPage.main'),
    table('both', ['case1', 'case2'], [{ code: 'blocked_dependency', detail: 'case1.main' }])
  ] };
  const snapshots = new Map(manifest.tables.map(record => {
    const target = record.issues.find(issue => issue.code === 'missing_reference')?.detail;
    return [record.id, { subtable: { name: 'main', qualified_name: record.name }, warnings: [], entries: target ? [
      { weight: 0, text: '[Inactive.main]', references: [{ raw: '[Inactive.main]', token: 'Inactive.main', kind: 'cross_page', target_qualified_name: 'Inactive.main' }] },
      { weight: 1, text: `[${target}]`, references: [{ raw: `[${target}]`, token: target, kind: 'cross_page', target_qualified_name: target }] }
    ] : [] }];
  }));
  const report = describeRepairs(analyzeManifest(manifest), manifest, snapshots);
  const targets = new Map(report.referenceTargets.map(target => [target.name, target]));
  assert.equal(targets.get('Target.word').classification, 'unique-case-ready');
  assert.equal(targets.get('Blocked.word').classification, 'unique-case-blocked');
  assert.equal(targets.get('Ambiguous.word').classification, 'ambiguous-case');
  assert.equal(targets.get('MissingPage.main').classification, 'absent-from-import');
  assert.ok(!targets.has('Inactive.main'));
  assert.deepEqual(report.caseCorrectionBatch.rootIds, ['root:case1', 'root:case2']);
  assert.equal(report.caseCorrectionBatch.conditionalRecovery, 3);
  assert.equal(report.caseCorrectionBatch.targets.length, 2);
  const candidate = report.roots.find(root => root.tableIds.includes('case1'));
  assert.equal(candidate.confidence.level, 'high');
  assert.equal(candidate.examples[0].row, 2);
  assert.equal(candidate.examples[0].weight, 1);
  assert.ok(report.roots.find(root => root.tableIds.includes('needs-more')).proposals.some(proposal => /blocked/.test(proposal)));
  assert.ok(report.roots.find(root => root.tableIds.includes('lost')).proposals.some(proposal => /history/.test(proposal)));
});

test('repair evidence identifies hidden self references without claiming a delimiter fix unlocks them', () => {
  const manifest = { tables: [table('recursive-text', [], [{ code: 'unsupported_syntax', detail: 'Unconverted square-bracket expression' }])] };
  const snapshots = new Map([['recursive-text', { subtable: { name: 'main', qualified_name: 'recursive-text.main' }, warnings: [],
    entries: [{ weight: 10, text: 'Most [main]]', references: [] }, { weight: 1, text: 'Able', references: [] }] }]]);
  const report = describeRepairs(analyzeManifest(manifest), manifest, snapshots);
  assert.equal(report.roots[0].hiddenSelfReferences[0].row, 1);
  assert.equal(report.roots[0].hiddenSelfReferences[0].token, 'main');
  assert.equal(report.roots[0].confidence.level, 'low');
  assert.ok(report.roots[0].proposals.some(proposal => /new cycle/.test(proposal)));
  assert.equal(report.caseCorrectionBatch.conditionalRecovery, 0);
});

function reportFixture(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'quarantine-report-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const hash = content => crypto.createHash('sha256').update(content).digest('hex');
  function write(file, content) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  }
  const source = { page: { page_id: 1, title: 'Fixture' }, subtable: { name: 'main', qualified_name: 'Fixture.main' },
    source: { revision_id: 7 }, warnings: [], raw_source: ';main\n1,[Target.word]', entries: [{ weight: 1, text: '[Target.word]',
      references: [{ raw: '[Target.word]', token: 'Target.word', kind: 'cross_page', target_qualified_name: 'Target.word' }] }] };
  const sourceFile = 'tables/fixture/subtables/main/table.json';
  const sourceHash = hash(JSON.stringify(source));
  const archiveFile = 'tables/abulafia/source/1.json';
  const provenance = { repository: 'https://github.com/example/wiki', commit: 'abc123' };
  const archive = JSON.stringify({ schemaVersion: 1, ...provenance, tables: [{ current: { sourceFile, sourceHash, table: source } }] });
  const manifest = { schemaVersion: 1, ...provenance, summary: { tables: 2, ready: 1, blocked: 1 }, tables: [
    { ...table('wiki_abulafia_1_6d61696e', [], [{ code: 'missing_reference', detail: 'Target.word' }, { code: 'unsupported_reference', detail: '[Target.word]' }]),
      name: 'Fixture.main', sourceFile, sourceHash, archiveFile, sourceRevision: 7 },
    { ...table('wiki_abulafia_2_576f7264', [], [], 'ready'), name: 'Target.Word' }
  ], generatedFiles: { [archiveFile]: { sha256: hash(archive), bytes: Buffer.byteLength(archive) } } };
  const manifestText = JSON.stringify(manifest);
  const inventory = { generatedOn: '2026-09-06', provenance: { ...provenance, manifest: 'tables/abulafia/manifest.json',
    manifestSha256: hash(manifestText), supportFileHashes: {} }, scope: { currentWikiTables: 3, importedTables: 2, notImportedTables: 1 },
    current: { summary: { byState: { 'ready-static': 1, 'ready-runtime': 0, blocked: 1, 'not-imported': 1 } } } };
  write(archiveFile, archive);
  write('tables/abulafia/manifest.json', manifestText);
  write('Docs/macro-inventory.json', JSON.stringify(inventory));
  write('explorer/tools/quarantine-report.cjs', fs.readFileSync(path.join(__dirname, '../tools/quarantine-report.cjs')));
  return { root, archiveFile, archive, manifest, inventory, write };
}

test('report generation is deterministic, scoped, evidence-linked, and refuses different existing reports', context => {
  const fixture = reportFixture(context);
  const report = buildReport(fixture.root);
  assert.deepEqual(buildReport(fixture.root), report);
  assert.equal(report.scope.notImportedTables, 1);
  assert.equal(report.summary.blockedTables, 1);
  assert.equal(report.caseCorrectionBatch.conditionalRecovery, 1);
  const markdown = renderMarkdown(report);
  assert.ok(markdown.includes('Source revision: `abc123`.'), 'Report code spans must not add padding');
  assert.match(markdown, /Conditional recovery/);
  assert.match(markdown, /not a promise/);
  assert.match(markdown, /not imported/);
  assert.match(markdown, /## Ranked Repair Components/);
  assert.match(markdown, /## Source Evidence/);
  assert.match(markdown, /blob\/abc123\/tables\/fixture\/subtables\/main\/table.json/);
  assert.match(markdown, /new dependencies/i);
  assert.equal(writeReport(fixture.root, path.join(fixture.root, 'Docs'), report), 2);
  assert.equal(writeReport(fixture.root, path.join(fixture.root, 'Docs'), report), 0);
  assert.deepEqual(buildReport(fixture.root), report);
  fixture.write('Docs/quarantine-report.md', 'User-authored report\n');
  assert.throws(() => writeReport(fixture.root, path.join(fixture.root, 'Docs'), report), /Refusing to overwrite/);
  assert.equal(fs.readFileSync(path.join(fixture.root, 'Docs/quarantine-report.md'), 'utf8'), 'User-authored report\n');
  assert.equal(fs.readFileSync(path.join(fixture.root, fixture.archiveFile), 'utf8'), fixture.archive);
});

test('report marks the case pass complete when no eligible candidates remain', context => {
  const fixture = reportFixture(context);
  const report = buildReport(fixture.root);
  report.caseCorrectionBatch = { rootIds: [], targets: [], conditionalTableIds: [], conditionalRecovery: 0, affectedTables: 0 };
  const markdown = renderMarkdown(report);
  assert.match(markdown, /No eligible case-only corrections remain under the current safety rules/);
  assert.match(markdown, /ranked source-data blockers/);
  assert.doesNotMatch(markdown, /Review the \*\*case-only reference corrections\*\* first/);
  assert.doesNotMatch(markdown, /Their combined conditional recovery/);
  assert.doesNotMatch(markdown, /\| Component \| Missing Target \|/);
  assert.match(markdown, /new imports or relaxed execution limits/);
});

test('report rejects stale inventory, changed evidence, and source symlinks before writing', context => {
  const fixture = reportFixture(context);
  const report = buildReport(fixture.root);
  fixture.write(fixture.archiveFile, fixture.archive + '\n');
  assert.throws(() => buildReport(fixture.root), /Archive hash/);
  assert.throws(() => writeReport(fixture.root, path.join(fixture.root, 'Docs'), report), /Input changed/);
  assert.equal(fs.existsSync(path.join(fixture.root, 'Docs/quarantine-report.json')), false);
  fixture.write(fixture.archiveFile, fixture.archive);
  fixture.write('Docs/macro-inventory.json', JSON.stringify({ ...fixture.inventory, provenance: { ...fixture.inventory.provenance, manifestSha256: 'stale' } }));
  assert.throws(() => buildReport(fixture.root), /Inventory manifest hash/);
  fixture.write('Docs/macro-inventory.json', JSON.stringify(fixture.inventory));
  fixture.write('archive-copy.json', fixture.archive);
  fs.unlinkSync(path.join(fixture.root, fixture.archiveFile));
  fs.symlinkSync(path.join(fixture.root, 'archive-copy.json'), path.join(fixture.root, fixture.archiveFile));
  assert.throws(() => buildReport(fixture.root), /symbolic link/);
});