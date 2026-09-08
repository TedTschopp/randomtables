const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');
const { planLookups, parseAvailability, checkPlan, buildPlan, renderMarkdown, writeReport } = require('../tools/check-wayback.cjs');

function fixture() {
  const reference = (page, subtable) => ({ kind: 'cross_page', target_page: page, target_subtable: subtable,
    target_qualified_name: `${page}.${subtable}`, token: `${page}.${subtable}`, raw: `[${page}.${subtable}]` });
  const references = [reference('Lost.Page & Names', 'main'), reference('Lost.Page & Names', 'Other'),
    reference('Present', 'word'), reference('Inactive', 'main')];
  const snapshots = new Map([['caller', { entries: references.map((record, index) => ({
    weight: index === 3 ? 0 : 1, text: record.raw, references: [record]
  })) }]]);
  const manifest = { tables: [{ id: 'caller', name: 'Caller.main', sourceFile: 'tables/caller/table.json', sourceHash: 'a'.repeat(64) }] };
  const report = { referenceTargets: references.map((record, index) => ({ name: record.target_qualified_name,
    classification: index === 2 ? 'unique-case-ready' : 'absent-from-import',
    matches: index === 2 ? [{ id: 'present', name: 'Present.Word', status: 'ready' }] : [],
    directTableIds: ['caller'], affectedTables: 12 - index })) };
  return { report, manifest, snapshots };
}

test('archive plans use exact active source targets, deduplicate pages, and keep local candidates separate', () => {
  const { report, manifest, snapshots } = fixture();
  const before = JSON.stringify({ report, manifest, snapshots: [...snapshots] });
  const plan = planLookups(report, manifest, snapshots);
  assert.equal(plan.pages.length, 1);
  assert.equal(plan.pages[0].title, 'Lost.Page & Names');
  assert.deepEqual(plan.pages[0].targets, ['Lost.Page & Names.Other', 'Lost.Page & Names.main']);
  assert.equal(new Set(plan.pages[0].urls).size, plan.pages[0].urls.length);
  assert.ok(plan.pages[0].urls.length >= 4);
  for (const candidate of plan.pages[0].urls) {
    const url = new URL(candidate);
    assert.ok(['random-generator.com', 'www.random-generator.com'].includes(url.hostname));
    assert.equal(url.searchParams.get('title'), 'Lost.Page_&_Names');
    assert.equal(url.hash, '');
  }
  assert.equal(plan.targets.find(target => target.name === 'Present.word').status, 'local-review');
  assert.equal(plan.targets.find(target => target.name === 'Inactive.main').status, 'needs-review');
  assert.equal(plan.targets.find(target => target.name.endsWith('.main') && target.page === plan.pages[0].title).subtable, 'main');
  assert.equal(JSON.stringify({ report, manifest, snapshots: [...snapshots] }), before);
  assert.deepEqual(planLookups({ ...report, referenceTargets: [...report.referenceTargets].reverse() }, manifest, snapshots), plan);
});

test('archive plans do not guess page boundaries when qualified source identities conflict', () => {
  const { report, manifest, snapshots } = fixture();
  const entry = snapshots.get('caller').entries[0];
  entry.references.push({ ...entry.references[0], target_page: 'Lost', target_subtable: 'Page & Names.main' });
  const plan = planLookups(report, manifest, snapshots);
  assert.equal(plan.targets.find(target => target.name === 'Lost.Page & Names.main').status, 'needs-review');
  assert.deepEqual(plan.pages[0].targets, ['Lost.Page & Names.Other']);
});

test('explicit unresolved cross-page references identify missing pages without accepting external markup', () => {
  const { report, manifest, snapshots } = fixture();
  snapshots.get('caller').entries[0].references[0].kind = 'unresolved_cross_page';
  snapshots.get('caller').entries[1].references[0].kind = 'external_link';
  const plan = planLookups(report, manifest, snapshots);
  assert.equal(plan.targets.find(target => target.name === 'Lost.Page & Names.main').status, 'pending');
  assert.equal(plan.targets.find(target => target.name === 'Lost.Page & Names.Other').status, 'needs-review');
  assert.deepEqual(plan.pages[0].targets, ['Lost.Page & Names.main']);
});

function snapshot(originalUrl) {
  return { archived_snapshots: { closest: { available: true, status: '200', timestamp: '20150102123456',
    url: `http://web.archive.org/web/20150102123456/${originalUrl}` } } };
}

function plannedFixture() {
  const { report, manifest, snapshots } = fixture();
  return planLookups(report, manifest, snapshots);
}

const clock = () => new Date('2026-09-07T12:00:00Z');

test('availability parsing requires an accessible capture of the requested page, not just any archived URL', () => {
  const url = plannedFixture().pages[0].urls[0];
  const found = parseAvailability(snapshot(url), url);
  assert.equal(found.status, 'found');
  assert.match(found.snapshot.url, /^https:\/\/web\.archive\.org\/web\/20150102123456\//);
  assert.equal(found.snapshot.timestamp, '20150102123456');
  assert.deepEqual(parseAvailability({ archived_snapshots: {} }, url), { status: 'not-found' });
  for (const payload of [null, {}, { archived_snapshots: [] }, { archived_snapshots: { closest: {} } }]) {
    assert.throws(() => parseAvailability(payload, url), /response|snapshot/i);
  }
  const wrongPage = snapshot('http://www.random-generator.com/index.php?title=Other');
  assert.throws(() => parseAvailability(wrongPage, url), /page|resource/i);
  const unsafe = snapshot(url);
  unsafe.archived_snapshots.closest.url = 'https://example.com/untrusted';
  assert.throws(() => parseAvailability(unsafe, url), /snapshot|archive/i);
  const unavailable = snapshot(url);
  unavailable.archived_snapshots.closest.status = '404';
  assert.throws(() => parseAvailability(unavailable, url), /accessible|snapshot/i);
});

test('archive checking is explicit, bounded, and preserves incomplete results across a resumable run', async () => {
  const plan = plannedFixture();
  const calls = [];
  const pauses = [];
  const options = { now: clock, pause: async milliseconds => pauses.push(milliseconds), maxRequests: 1,
    fetchImpl: async (endpoint, options) => {
      const request = new URL(endpoint);
      assert.equal(request.origin + request.pathname, 'https://archive.org/wayback/available');
      assert.equal(options.redirect, 'error');
      assert.equal(options.credentials, 'omit');
      assert.ok(options.signal instanceof AbortSignal);
      calls.push(request.searchParams.get('url'));
      return Response.json({ archived_snapshots: {} });
    } };
  const preview = await checkPlan(plan, { ...options, maxRequests: 0 });
  assert.equal(calls.length, 0);
  assert.equal(preview.pages[0].status, 'not-checked');
  const first = await checkPlan(plan, options);
  assert.equal(calls.length, 1);
  assert.equal(first.requestsMade, 1);
  assert.equal(first.pages[0].status, 'incomplete');
  assert.equal(first.pages[0].tableConfirmed, false);
  const resumed = await checkPlan(plan, { ...options, previous: first,
    fetchImpl: async endpoint => {
      const originalUrl = new URL(endpoint).searchParams.get('url');
      calls.push(originalUrl);
      return Response.json(snapshot(originalUrl));
    } });
  assert.equal(calls.length, 2);
  assert.equal(new Set(calls).size, 2);
  assert.equal(resumed.pages[0].status, 'archived-page');
  assert.equal(resumed.pages[0].tableConfirmed, false);
  assert.equal(resumed.summary.targetsWithPageSnapshots, 2);
  assert.equal(resumed.queries.length, 2);
  const unchanged = await checkPlan(plan, { ...options, previous: resumed });
  assert.equal(unchanged.requestsMade, 0);
  assert.equal(calls.length, 2);
  const changed = structuredClone(plan);
  changed.targets[0].affectedTables += 1;
  await assert.rejects(checkPlan(changed, { ...options, previous: first }), /resume|plan/i);
  await assert.rejects(checkPlan(plan, { ...options, previous: first, timestamp: '20100101' }), /resume|timestamp/i);
  const duplicate = structuredClone(first);
  duplicate.queries.push(duplicate.queries[0]);
  await assert.rejects(checkPlan(plan, { ...options, previous: duplicate }), /duplicate|resume/i);
});

test('archive requests are sequential and spaced; rate limits leave unchecked URLs pending', async () => {
  const pauses = [];
  let calls = 0;
  const report = await checkPlan(plannedFixture(), { maxRequests: 3, now: clock,
    pause: async milliseconds => pauses.push(milliseconds), fetchImpl: async () => {
      calls += 1;
      return calls === 1 ? Response.json({ archived_snapshots: {} }) : new Response('', { status: 429, headers: { 'Retry-After': '120' } });
    } });
  assert.equal(calls, 2);
  assert.deepEqual(pauses, [1000]);
  assert.equal(report.stopReason, 'rate-limited');
  assert.equal(report.queries[1].status, 'error');
  assert.equal(report.queries[1].retryAfter, '120');
  assert.equal(report.pages[0].status, 'incomplete');
  assert.equal(report.summary.pagesWithoutSnapshots, 0);
});

test('network, timeout, malformed, and oversized API responses are errors rather than missing snapshots', async () => {
  const errors = [
    async () => { throw new TypeError('Network unavailable'); },
    async () => { throw new DOMException('Request timed out', 'TimeoutError'); },
    async () => new Response('<html>Service unavailable</html>'),
    async () => new Response('x'.repeat(65537)),
    async () => new Response('', { status: 503 })
  ];
  for (const fetchImpl of errors) {
    const report = await checkPlan(plannedFixture(), { maxRequests: 1, now: clock, fetchImpl });
    assert.equal(report.queries[0].status, 'error');
    assert.equal(report.pages[0].status, 'incomplete');
    assert.equal(report.summary.pagesWithoutSnapshots, 0);
  }
});

test('a negative result requires every planned URL and never changes local table readiness', async () => {
  const plan = plannedFixture();
  const before = JSON.stringify(plan);
  const report = await checkPlan(plan, { maxRequests: 100, timestamp: '20100101', now: clock, pause: async () => {},
    fetchImpl: async endpoint => {
      assert.equal(new URL(endpoint).searchParams.get('timestamp'), '20100101');
      return Response.json({ archived_snapshots: {} });
    } });
  assert.equal(report.pages[0].status, 'no-snapshot');
  assert.equal(report.summary.pagesWithoutSnapshots, 1);
  assert.equal(report.requestsMade, plan.pages[0].urls.length);
  assert.equal(report.targets.find(target => target.name === 'Present.word').status, 'local-review');
  assert.equal(JSON.stringify(plan), before);
});

test('distinct source identities that share a normalized wiki URL keep one resumable query', async () => {
  const plan = plannedFixture();
  const alias = structuredClone(plan.pages[0]);
  alias.title = alias.title.replace(/ /g, '_');
  alias.targets = ['SeparateIdentity.main'];
  plan.pages.push(alias);
  plan.targets.push({ name: 'SeparateIdentity.main', status: 'pending', page: alias.title, subtable: 'main' });
  const report = await checkPlan(plan, { maxRequests: 100, now: clock, pause: async () => {},
    fetchImpl: async () => Response.json({ archived_snapshots: {} }) });
  assert.equal(report.requestsMade, plan.pages[0].urls.length);
  assert.equal(report.queries.length, plan.pages[0].urls.length);
  const resumed = await checkPlan(plan, { previous: report, now: clock });
  assert.equal(resumed.requestsMade, 0);
  assert.equal(resumed.targets.length, plan.targets.length);
});

function repositoryFixture(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'wayback-report-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const digest = content => crypto.createHash('sha256').update(content).digest('hex');
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  };
  const { report, manifest, snapshots } = fixture();
  const id = 'wiki_abulafia_1_6d61696e';
  const source = { ...snapshots.get('caller'), page: { page_id: 1, title: 'Caller' },
    subtable: { name: 'main', qualified_name: 'Caller.main' }, source: { revision_id: 7 } };
  const metadata = { ...manifest.tables[0], id, page: 'Caller', sourceRevision: 7, archiveFile: 'tables/abulafia/source/1.json' };
  for (const target of report.referenceTargets) target.directTableIds = [id];
  const provenance = { repository: 'https://github.com/example/wiki', commit: 'b'.repeat(40) };
  const archive = JSON.stringify({ ...provenance, tables: [{ current: { sourceFile: metadata.sourceFile,
    sourceHash: metadata.sourceHash, table: source } }] });
  const manifestContent = JSON.stringify({ ...provenance, tables: [metadata], summary: { tables: 1 },
    generatedFiles: { [metadata.archiveFile]: { sha256: digest(archive), bytes: Buffer.byteLength(archive) } } });
  const reportData = { ...report, schemaVersion: 1, provenance: { ...provenance, manifest: 'tables/abulafia/manifest.json',
    manifestSha256: digest(manifestContent) }, scope: { notImportedTables: 0 } };
  write('tables/abulafia/manifest.json', manifestContent);
  write(metadata.archiveFile, archive);
  write('Docs/quarantine-report.json', JSON.stringify(reportData));
  write('explorer/tools/check-wayback.cjs', fs.readFileSync(path.join(__dirname, '../tools/check-wayback.cjs')));
  return { root, archiveFile: metadata.archiveFile, archive, reportData, write };
}

test('archive reports use pinned evidence, explain page-only hits, and write without changing inputs', async context => {
  const fixture = repositoryFixture(context);
  const plan = buildPlan(fixture.root);
  assert.equal(plan.pages.length, 1);
  assert.deepEqual(buildPlan(fixture.root), plan);
  assert.equal(plan.provenance.commit, 'b'.repeat(40));
  assert.ok(plan.provenance.inputHashes[fixture.archiveFile]);
  const report = await checkPlan(plan, { maxRequests: 1, now: clock,
    fetchImpl: async endpoint => Response.json(snapshot(new URL(endpoint).searchParams.get('url'))) });
  const markdown = renderMarkdown(report);
  assert.match(markdown, /does not confirm.*subtable/i);
  assert.match(markdown, /not proof/i);
  assert.match(markdown, /no tables are imported/i);
  assert.match(markdown, /https:\/\/web\.archive\.org\/web\/20150102123456/);
  assert.match(markdown, /local-review/);
  const output = path.join(fixture.root, 'Docs', 'archive-run');
  assert.equal(writeReport(fixture.root, output, report), 2);
  assert.equal(writeReport(fixture.root, output, report), 0);
  assert.equal(fs.readFileSync(fixture.archiveFile.startsWith('/') ? fixture.archiveFile : path.join(fixture.root, fixture.archiveFile), 'utf8'), fixture.archive);
  assert.throws(() => writeReport(fixture.root, output, { ...report, generatedAt: 'different' }), /overwrite|different|existing/i);
  assert.throws(() => writeReport(fixture.root, path.dirname(fixture.root), report), /outside|output/i);
  const hostile = structuredClone(report);
  hostile.targets[0].name = '[http://example.com/missing]|<script>alert(1)</script>|[link](javascript:alert(1))';
  const rendered = renderMarkdown(hostile);
  assert.doesNotMatch(rendered, /<script>|\]\(javascript:|http:\/\/example\.com\/missing/);
  assert.match(rendered, /http:&#47;&#47;example\.com\/missing/);
});

test('archive planning and writing reject stale hashes, changed source evidence, and symbolic links', async context => {
  const fixture = repositoryFixture(context);
  const plan = buildPlan(fixture.root);
  const report = await checkPlan(plan, { now: clock });
  fixture.write(fixture.archiveFile, fixture.archive + '\n');
  assert.throws(() => buildPlan(fixture.root), /hash|bytes/i);
  assert.throws(() => writeReport(fixture.root, path.join(fixture.root, 'output'), report), /changed|hash/i);
  fixture.write(fixture.archiveFile, fixture.archive);
  fixture.write('Docs/quarantine-report.json', JSON.stringify({ ...fixture.reportData,
    provenance: { ...fixture.reportData.provenance, manifestSha256: '0'.repeat(64) } }));
  assert.throws(() => buildPlan(fixture.root), /stale|hash/i);
  fixture.write('Docs/quarantine-report.json', JSON.stringify(fixture.reportData));
  fs.renameSync(path.join(fixture.root, fixture.archiveFile), path.join(fixture.root, 'snapshot.json'));
  fs.symlinkSync(path.join(fixture.root, 'snapshot.json'), path.join(fixture.root, fixture.archiveFile));
  assert.throws(() => buildPlan(fixture.root), /symbolic|symlink/i);
});

test('unsafe request plans and out-of-bounds options fail before any network call', async () => {
  const plan = plannedFixture();
  let calls = 0;
  const fetchImpl = async () => { calls += 1; throw new Error('Unexpected request'); };
  for (const options of [{ maxRequests: 10001 }, { intervalMs: 0 }, { timeoutMs: 0 }, { timestamp: 'yesterday' }]) {
    await assert.rejects(checkPlan(plan, { ...options, fetchImpl }), /Invalid/);
  }
  plan.pages[0].urls[0] = 'http://localhost/private';
  await assert.rejects(checkPlan(plan, { maxRequests: 1, fetchImpl }), /planned page URLs/);
  assert.equal(calls, 0);
});

test('the CLI previews the real corpus without network access or writes and requires explicit check mode', () => {
  const script = path.join(__dirname, '../tools/check-wayback.cjs');
  const run = argumentsList => spawnSync(process.execPath, [script, ...argumentsList], { encoding: 'utf8' });
  const help = run(['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /--check/);
  assert.match(help.stdout, /no network/i);
  const preview = run([]);
  assert.equal(preview.status, 0, preview.stderr);
  const result = JSON.parse(preview.stdout);
  assert.equal(result.mode, 'plan');
  assert.equal(result.requestsMade, 0);
  assert.equal(result.written, 0);
  assert.ok(result.summary.plannedPages > 0);
  assert.equal(result.summary.pagesWithSnapshots, 0);
  assert.equal(result.summary.pagesWithoutSnapshots, 0);
  for (const argumentsList of [['--max-requests', '1'], ['--resume', 'Docs/nonexistent.json']]) {
    const invalid = run(argumentsList);
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /--check/);
  }
});