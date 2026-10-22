const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');
const { tableId, writeArtifacts } = require('./import-abulafia.cjs');

function compare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function pageUrls(title) {
  const urls = [];
  for (const protocol of ['http:', 'https:']) {
    for (const hostname of ['www.random-generator.com', 'random-generator.com']) {
      const url = new URL(`${protocol}//${hostname}/index.php`);
      url.searchParams.set('title', title.replace(/ /g, '_'));
      urls.push(url.href);
      url.searchParams.set('action', 'raw');
      urls.push(url.href);
    }
  }
  return urls;
}

function planLookups(report, manifest, snapshots) {
  const tables = new Map(manifest.tables.map(table => [table.id, table]));
  const names = new Set();
  const targets = report.referenceTargets.map(target => {
    if (typeof target.name !== 'string' || !target.name || names.has(target.name) || !Array.isArray(target.directTableIds) ||
        !Array.isArray(target.matches) || !Number.isSafeInteger(target.affectedTables) || target.affectedTables < 0) {
      throw new Error('Invalid missing-reference metadata');
    }
    names.add(target.name);
    const record = { name: target.name, classification: target.classification, affectedTables: target.affectedTables,
      directTableIds: [...target.directTableIds].sort(compare), matches: structuredClone(target.matches) };
    if (target.classification !== 'absent-from-import' || target.matches.length) {
      return { ...record, status: 'local-review', reason: 'An imported candidate already exists; no archive lookup is inferred.' };
    }
    const candidates = new Map();
    const evidence = [];
    for (const id of record.directTableIds) {
      const metadata = tables.get(id);
      const snapshot = snapshots.get(id);
      if (!metadata || !Array.isArray(snapshot?.entries)) throw new Error(`Missing source evidence: ${id}`);
      for (const [index, entry] of snapshot.entries.entries()) {
        if (!Number.isSafeInteger(entry.weight) || entry.weight <= 0 || typeof entry.text !== 'string') continue;
        for (const reference of entry.references || []) {
          if (reference.target_qualified_name !== target.name || !['local', 'cross_page', 'unresolved_cross_page'].includes(reference.kind) ||
              typeof reference.target_page !== 'string' || !reference.target_page || /[\x00-\x1f]/.test(reference.target_page) ||
              typeof reference.target_subtable !== 'string' || !reference.target_subtable ||
              `${reference.target_page}.${reference.target_subtable}` !== target.name ||
              reference.raw !== `[${reference.token}]` || !entry.text.includes(reference.raw)) continue;
          candidates.set(JSON.stringify([reference.target_page, reference.target_subtable]), {
            page: reference.target_page, subtable: reference.target_subtable
          });
          evidence.push({ tableId: id, sourceFile: metadata.sourceFile, sourceHash: metadata.sourceHash,
            row: index + 1, weight: entry.weight, raw: reference.raw });
        }
      }
    }
    if (candidates.size !== 1) return { ...record, status: 'needs-review', evidence,
      reason: candidates.size ? 'Conflicting page/subtable identities in the source.' : 'No exact active source reference identifies the page and subtable.' };
    return { ...record, status: 'pending', ...candidates.values().next().value, evidence };
  }).sort((left, right) => compare(left.name, right.name));
  const pages = new Map();
  for (const target of targets.filter(record => record.status === 'pending')) {
    if (!pages.has(target.page)) pages.set(target.page, { title: target.page, targets: [], affectedTables: 0, urls: pageUrls(target.page) });
    const page = pages.get(target.page);
    page.targets.push(target.name);
    page.affectedTables = Math.max(page.affectedTables, target.affectedTables);
  }
  return { schemaVersion: 1, targets, pages: [...pages.values()]
    .sort((left, right) => right.affectedTables - left.affectedTables || compare(left.title, right.title)) };
}

function resourceIdentity(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || !['random-generator.com', 'www.random-generator.com'].includes(url.hostname) ||
      url.port || url.username || url.password || url.hash || url.pathname !== '/index.php' ||
      url.searchParams.getAll('title').length !== 1 || !url.searchParams.get('title') ||
      [...url.searchParams.keys()].some(key => !['title', 'action'].includes(key)) ||
      url.searchParams.getAll('action').length > 1 || !['raw', null].includes(url.searchParams.get('action'))) {
    throw new Error('Unexpected wiki page URL');
  }
  return JSON.stringify([url.searchParams.get('title').replace(/ /g, '_'), url.searchParams.get('action')]);
}

function parseAvailability(payload, originalUrl) {
  const archived = payload?.archived_snapshots;
  if (!archived || typeof archived !== 'object' || Array.isArray(archived)) throw new Error('Malformed archive availability response');
  if (!Object.keys(archived).length) return { status: 'not-found' };
  const closest = archived.closest;
  if (!closest || closest.available !== true || String(closest.status) !== '200' ||
      typeof closest.timestamp !== 'string' || !/^\d{14}$/.test(closest.timestamp) || typeof closest.url !== 'string') {
    throw new Error('Archive response does not identify an accessible HTTP 200 snapshot');
  }
  const snapshot = new URL(closest.url);
  const capture = snapshot.href.match(/^https?:\/\/web\.archive\.org\/web\/(\d{14})\/(https?:\/\/.+)$/);
  if (!capture || snapshot.username || snapshot.password || snapshot.port || capture[1] !== closest.timestamp) {
    throw new Error('Unexpected archive snapshot URL');
  }
  if (resourceIdentity(capture[2]) !== resourceIdentity(originalUrl)) throw new Error('Archive snapshot belongs to a different page or resource');
  snapshot.protocol = 'https:';
  return { status: 'found', snapshot: { url: snapshot.href, timestamp: closest.timestamp, originalUrl: capture[2] } };
}

function availabilityUrl(originalUrl, timestamp) {
  resourceIdentity(originalUrl);
  const endpoint = new URL('https://archive.org/wayback/available');
  endpoint.searchParams.set('url', originalUrl);
  if (timestamp) endpoint.searchParams.set('timestamp', timestamp);
  return endpoint.href;
}

async function readJson(response) {
  const limit = 65536;
  if (Number(response.headers.get('content-length')) > limit) {
    await response.body?.cancel();
    throw new Error('Archive API response exceeds 64 KiB');
  }
  if (!response.body) throw new Error('Archive API response is empty');
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new Error('Archive API response exceeds 64 KiB');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function checkAvailability(originalUrl, { timestamp, fetchImpl, timeoutMs, now }) {
  const apiUrl = availabilityUrl(originalUrl, timestamp);
  try {
    const response = await fetchImpl(apiUrl, { method: 'GET', redirect: 'error', credentials: 'omit',
      headers: { Accept: 'application/json', 'User-Agent': 'RandomTables-Archive-Checker/1.0 (+https://github.com/TedTschopp/randomtables)' },
      signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) {
      await response.body?.cancel();
      return { url: originalUrl, apiUrl, checkedAt: now().toISOString(), status: 'error', httpStatus: response.status,
        message: `Archive API returned HTTP ${response.status}`, retryAfter: response.headers.get('retry-after') };
    }
    return { url: originalUrl, apiUrl, checkedAt: now().toISOString(), ...parseAvailability(await readJson(response), originalUrl) };
  } catch (error) {
    return { url: originalUrl, apiUrl, checkedAt: now().toISOString(), status: 'error',
      message: `${error.name}: ${error.message}`.slice(0, 300) };
  }
}

async function checkPlan(plan, { maxRequests = 0, timestamp = '', previous, fetchImpl = globalThis.fetch,
  intervalMs = 1000, timeoutMs = 10000, now = () => new Date(),
  pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)), onProgress = () => {} } = {}) {
  if (!Number.isSafeInteger(maxRequests) || maxRequests < 0 || maxRequests > 10000 ||
      !Number.isSafeInteger(intervalMs) || intervalMs < 1000 || intervalMs > 60000 ||
      !Number.isSafeInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 30000 ||
      typeof timestamp !== 'string' || (timestamp && !/^\d{1,14}$/.test(timestamp))) {
    throw new Error('Invalid request budget, interval, timeout, or timestamp');
  }
  const planSha256 = crypto.createHash('sha256').update(JSON.stringify(plan)).digest('hex');
  const ordered = [];
  const plannedUrls = new Set();
  for (const page of plan.pages) {
    if (JSON.stringify(page.urls) !== JSON.stringify(pageUrls(page.title))) throw new Error('Unexpected planned page URLs');
  }
  for (let variant = 0; variant < 8; variant += 1) {
    for (const page of plan.pages) {
      const url = page.urls[variant];
      if (plannedUrls.has(url)) continue;
      plannedUrls.add(url);
      ordered.push({ page, url });
    }
  }
  const results = new Map();
  if (previous) {
    if (previous.schemaVersion !== 1 || previous.kind !== 'wayback-availability' || previous.planSha256 !== planSha256 ||
        previous.queryTimestamp !== timestamp || !Array.isArray(previous.queries)) throw new Error('Resume report does not match this plan and timestamp');
    for (const query of previous.queries) {
      if (!plannedUrls.has(query.url) || results.has(query.url) || !['found', 'not-found', 'error'].includes(query.status) ||
          query.apiUrl !== availabilityUrl(query.url, timestamp) || !Number.isFinite(Date.parse(query.checkedAt))) {
        throw new Error('Invalid or duplicate query in resume report');
      }
      if (query.status === 'found') parseAvailability({ archived_snapshots: { closest: { available: true, status: '200',
        timestamp: query.snapshot?.timestamp, url: query.snapshot?.url } } }, query.url);
      results.set(query.url, structuredClone(query));
    }
  }
  let requestsMade = 0;
  let stopReason = 'complete';
  for (const { page, url } of ordered) {
    if (page.urls.some(candidate => results.get(candidate)?.status === 'found') || ['found', 'not-found'].includes(results.get(url)?.status)) continue;
    if (requestsMade >= maxRequests) {
      stopReason = maxRequests ? 'request-budget' : 'not-checked';
      break;
    }
    if (requestsMade) await pause(intervalMs);
    const result = await checkAvailability(url, { timestamp, fetchImpl, timeoutMs, now });
    results.set(url, result);
    requestsMade += 1;
    onProgress({ requestsMade, maxRequests, page: page.title, result });
    if ([403, 429, 503].includes(result.httpStatus)) {
      stopReason = result.httpStatus === 429 ? 'rate-limited' : 'service-unavailable';
      break;
    }
  }
  const pages = plan.pages.map(page => {
    const queries = page.urls.map(url => results.get(url)).filter(Boolean);
    const snapshots = queries.filter(query => query.status === 'found').map(query => query.snapshot);
    const status = snapshots.length ? 'archived-page' : queries.length === page.urls.length && queries.every(query => query.status === 'not-found') ?
      'no-snapshot' : queries.length ? 'incomplete' : 'not-checked';
    return { ...page, status, tableConfirmed: false, checkedUrls: queries.length, snapshots };
  });
  const pagesByTitle = new Map(pages.map(page => [page.title, page]));
  const targets = plan.targets.map(target => target.status !== 'pending' ? { ...target } :
    { ...target, status: pagesByTitle.get(target.page).status, tableConfirmed: false });
  const queries = ordered.map(query => results.get(query.url)).filter(Boolean);
  const errors = queries.filter(query => query.status === 'error').length;
  if (stopReason === 'complete' && errors) stopReason = 'errors';
  return { ...plan, kind: 'wayback-availability', planSha256, queryTimestamp: timestamp, generatedAt: now().toISOString(),
    limits: { maxRequests, intervalMs, timeoutMs }, requestsMade, stopReason,
    summary: { missingReferenceTargets: targets.length, plannedPages: pages.length,
      plannedTargets: targets.filter(target => target.page).length,
      localReviewTargets: targets.filter(target => target.status === 'local-review').length,
      needsReviewTargets: targets.filter(target => target.status === 'needs-review').length,
      pagesWithSnapshots: pages.filter(page => page.status === 'archived-page').length,
      targetsWithPageSnapshots: targets.filter(target => target.status === 'archived-page').length,
      pagesWithoutSnapshots: pages.filter(page => page.status === 'no-snapshot').length,
      incompletePages: pages.filter(page => ['incomplete', 'not-checked'].includes(page.status)).length,
      checkedQueries: queries.length, queryErrors: errors },
    targets, pages, queries };
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function readContained(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) throw new Error('Input paths must be repository-relative');
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) throw new Error(`Input is outside the repository: ${relative}`);
  for (let current = target; current !== root; current = path.dirname(current)) {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Refusing a symbolic link: ${relative}`);
  }
  const stats = fs.statSync(target);
  if (!stats.isFile() || stats.size > 90 * 1024 * 1024) throw new Error(`Input must be a regular file no larger than 90 MiB: ${relative}`);
  return fs.readFileSync(target);
}

function buildPlan(repo) {
  const root = fs.realpathSync(repo);
  const inputHashes = {};
  function read(file) {
    const content = readContained(root, file);
    inputHashes[file] = hash(content);
    return content;
  }
  const manifestFile = 'tables/abulafia/manifest.json';
  const reportFile = 'Docs/quarantine-report.json';
  const manifestBytes = read(manifestFile);
  const manifest = JSON.parse(manifestBytes);
  const reportBytes = read(reportFile);
  const report = JSON.parse(reportBytes);
  assert.equal(report.schemaVersion, 1, 'Unsupported quarantine report schema');
  assert.equal(report.provenance.manifest, manifestFile, 'Unexpected manifest path');
  assert.equal(report.provenance.manifestSha256, hash(manifestBytes), 'Quarantine report manifest hash is stale');
  assert.equal(report.provenance.repository, manifest.repository, 'Source repository mismatch');
  assert.equal(report.provenance.commit, manifest.commit, 'Pinned source revision mismatch');
  assert.match(manifest.repository, /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/, 'Expected a pinned source repository');
  assert.match(manifest.commit, /^[a-f0-9]{40}$/, 'Expected a pinned source commit');
  read('explorer/tools/check-wayback.cjs');
  const tables = new Map(manifest.tables.map(table => [table.id, table]));
  assert.equal(tables.size, manifest.tables.length, 'Duplicate manifest table identities');
  const ids = [...new Set(report.referenceTargets.filter(target => target.classification === 'absent-from-import' && !target.matches.length)
    .flatMap(target => target.directTableIds))].sort(compare);
  const archives = new Map();
  const snapshots = new Map();
  for (const id of ids) {
    const metadata = tables.get(id);
    assert.ok(metadata, `Unknown referring table: ${id}`);
    assert.match(metadata.archiveFile, /^tables\/abulafia\/source\/(?:historical\/)?\d+\.json$/, 'Unexpected source archive path');
    assert.equal(metadata.archiveFile.includes('/historical/'), Boolean(metadata.historical), 'Historical archive scope mismatch');
    if (!archives.has(metadata.archiveFile)) {
      const content = read(metadata.archiveFile);
      const expected = manifest.generatedFiles[metadata.archiveFile];
      assert.ok(expected, `Missing source provenance: ${metadata.archiveFile}`);
      assert.equal(hash(content), expected.sha256, `Source archive hash mismatch: ${metadata.archiveFile}`);
      assert.equal(content.length, expected.bytes, `Source archive bytes mismatch: ${metadata.archiveFile}`);
      const archive = JSON.parse(content);
      assert.equal(archive.repository, manifest.repository, 'Archive source repository mismatch');
      assert.equal(archive.commit, manifest.commit, 'Archive source revision mismatch');
      archives.set(metadata.archiveFile, archive);
    }
    const records = archives.get(metadata.archiveFile).tables.filter(record => record.current.sourceFile === metadata.sourceFile);
    assert.equal(records.length, 1, `Expected one archived table: ${metadata.name}`);
    const current = records[0].current;
    assert.equal(current.sourceHash, metadata.sourceHash, 'Archived table source hash mismatch');
    assert.equal(tableId(current.table), id, 'Archived table identity mismatch');
    assert.equal(current.table.subtable.qualified_name, metadata.name, 'Archived table name mismatch');
    assert.equal(current.table.source.revision_id, metadata.sourceRevision, 'Archived table revision mismatch');
    snapshots.set(id, current.table);
  }
  return { ...planLookups(report, manifest, snapshots),
    provenance: { repository: manifest.repository, commit: manifest.commit, manifest: manifestFile, manifestSha256: hash(manifestBytes),
      quarantineReport: reportFile, quarantineReportSha256: hash(reportBytes),
      inputHashes: Object.fromEntries(Object.entries(inputHashes).sort(([left], [right]) => compare(left, right))) },
    scope: { importedTables: manifest.summary.tables, notImportedTables: report.scope.notImportedTables,
      archivedPagesInspected: archives.size, basis: 'Active missing-reference diagnostics in the imported wiki quarantine report.' } };
}

function renderMarkdown(report) {
  const label = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/[\r\n]/g, ' ').replace(/\|/g, ' / ').replace(/[\\`*_\[\]()]/g, '\\$&').replace(/(https?):\/\//gi, '$1:&#47;&#47;');
  const number = value => value.toLocaleString('en-US');
  const pages = new Map(report.pages.map(page => [page.title, page]));
  const lines = [
    '# Missing Table Archive Check', '', `Checked: ${report.generatedAt}. Source commit: \`${report.provenance?.commit || 'fixture'}\`.`, '',
    'This report checks the Internet Archive Wayback Availability API. It does not download or execute archived page content; no tables are imported or changed.', '',
    '**An archived page does not confirm that a missing subtable exists in that capture.** Review the exact subtable, source text, weights, history, and contributor attribution before proposing recovery.', '',
    'A `no-snapshot` result means the API returned no accessible capture for every planned URL variant. It is not proof that the source was never archived. Errors, timeouts, and unattempted URLs are not negative results.', '',
    `Requested date: ${report.queryTimestamp ? `\`${report.queryTimestamp}\` (nearest capture)` : 'latest available capture'}. Stop reason: \`${report.stopReason}\`.`, '',
    '## Coverage', '', '| Item | Count |', '| --- | ---: |',
    `| Missing-reference targets | ${number(report.summary.missingReferenceTargets)} |`,
    `| Targets with an existing local candidate | ${number(report.summary.localReviewTargets)} |`,
    `| Targets requiring source-identity review | ${number(report.summary.needsReviewTargets)} |`,
    `| Planned pages | ${number(report.summary.plannedPages)} |`,
    `| Pages with an accessible snapshot | ${number(report.summary.pagesWithSnapshots)} |`,
    `| Missing targets on those pages, not verified | ${number(report.summary.targetsWithPageSnapshots)} |`,
    `| Pages with no snapshot across planned URLs | ${number(report.summary.pagesWithoutSnapshots)} |`,
    `| Incomplete or unattempted pages | ${number(report.summary.incompletePages)} |`,
    `| API requests in this run | ${number(report.requestsMade)} |`,
    `| Retained query errors | ${number(report.summary.queryErrors)} |`, '',
    'The scope is the imported wiki quarantine report, not every graph placeholder or every table in the upstream wiki. Absence from the import does not establish that a table is absent from the full source dump.', '',
    '## Missing Targets', '',
    'Names and capitalization remain exact. Existing local candidates are kept for separate review. Page requests are deduplicated; table identities are not merged.', '',
    '| Missing Target | State | Archived Page | Capture |', '| --- | --- | --- | --- |'
  ];
  for (const target of report.targets) {
    const snapshot = pages.get(target.page)?.snapshots[0];
    const link = snapshot ? `[snapshot](${snapshot.url})` : '-';
    lines.push(`| ${label(target.name)} | ${target.status} | ${link} | ${snapshot?.timestamp || '-'} |`);
  }
  lines.push('', '## Query Evidence', '',
    'The [JSON report](wayback-report.json) retains all source bindings, input hashes, page URL variants, API requests, timestamps, errors, and candidate capture links. A successful availability response is page-level evidence only.', '',
    'The checker tries HTTP and HTTPS, with and without `www`, for the MediaWiki page and `action=raw` URLs. It stops querying a page after the first valid capture. Other URL layouts or older captures may still require manual research.', '',
    'Each run is request-limited and sequential. HTTP 403, 429, or 503 stops the run and leaves the remainder pending. Resume into a new output directory; previously completed queries are reused, errors are retried, and different output files are never overwritten.', '',
    'Only public wiki page URLs are sent to `archive.org`; row contents and contributor records are not sent. The application remains browser-only and does not load this checker.', '',
    'API documentation: [Wayback Machine APIs](https://archive.org/help/wayback_api.php).', '');
  const errors = report.queries.filter(query => query.status === 'error');
  if (errors.length) {
    lines.push('## Incomplete Checks', '', '| Query | Error | Retry-After |', '| --- | --- | --- |');
    for (const query of errors) lines.push(`| [availability request](${query.apiUrl}) | ${label(query.message)} | ${label(query.retryAfter || '-')} |`);
    lines.push('');
  }
  return lines.join('\n');
}

function writeReport(repo, outputRoot, report) {
  const root = fs.realpathSync(repo);
  const prefix = path.relative(path.resolve(repo), path.resolve(repo, outputRoot));
  if (prefix === '..' || prefix.startsWith('..' + path.sep) || path.isAbsolute(prefix)) throw new Error('Report output must stay inside the repository');
  for (const [file, expected] of Object.entries(report.provenance.inputHashes)) {
    assert.equal(hash(readContained(root, file)), expected, `Input changed after planning: ${file}`);
  }
  return writeArtifacts(root, new Map([
    [path.join(prefix, 'wayback-report.json'), JSON.stringify(report, null, 2) + '\n'],
    [path.join(prefix, 'wayback-report.md'), renderMarkdown(report)]
  ]));
}

module.exports = { pageUrls, planLookups, parseAvailability, checkPlan, buildPlan, renderMarkdown, writeReport };

async function main() {
  const { values } = parseArgs({ options: {
    check: { type: 'boolean' }, help: { type: 'boolean' }, output: { type: 'string' }, resume: { type: 'string' },
    timestamp: { type: 'string' }, 'max-requests': { type: 'string' }, 'interval-ms': { type: 'string' }, 'timeout-ms': { type: 'string' }
  } });
  if (values.help) {
    console.log([
      'Usage: node explorer/tools/check-wayback.cjs [options]', '',
      'Default: validate local evidence and preview the plan; no network access or writes.',
      '--check                 Query the Wayback Availability API explicitly.',
      '--max-requests N        API request budget per run (default 10; maximum 10000).',
      '--timestamp YYYY...     Closest archived capture (1-14 digits; default latest).',
      '--resume FILE           Reuse a matching JSON report; retry failed queries.',
      '--output DIRECTORY      Write guarded JSON/Markdown reports inside the repository.',
      '--interval-ms N         Pause between requests (default/minimum 1000).',
      '--timeout-ms N          Per-request timeout (default 10000; maximum 30000).', '',
      'Snapshots are page-level candidates, not confirmed subtable copies. No imports or runtime changes.',
      'Use a new output directory when resuming. Exit codes: 0 success/partial budget, 1 invalid input, 2 API errors.'
    ].join('\n'));
    return;
  }
  if (!values.check && ['resume', 'max-requests', 'interval-ms', 'timeout-ms'].some(option => values[option] !== undefined)) {
    throw new Error('Network and resume options require --check; omit them for a no-network preview');
  }
  const repo = path.resolve(__dirname, '..', '..');
  const plan = buildPlan(repo);
  const previous = values.resume ? JSON.parse(readContained(fs.realpathSync(repo), path.relative(repo, path.resolve(values.resume)))) : undefined;
  const report = await checkPlan(plan, {
    maxRequests: values.check ? Number(values['max-requests'] ?? 10) : 0,
    intervalMs: Number(values['interval-ms'] ?? 1000), timeoutMs: Number(values['timeout-ms'] ?? 10000),
    timestamp: values.timestamp ?? previous?.queryTimestamp ?? '', previous,
    onProgress: ({ requestsMade, maxRequests, page, result }) => console.error(
      `[${requestsMade}/${maxRequests}] ${page}: ${result.status}${result.message ? ` (${result.message})` : ''}`)
  });
  const written = values.output ? writeReport(repo, path.resolve(values.output), report) : 0;
  console.log(JSON.stringify({ mode: values.check ? 'check' : 'plan', scope: report.scope, summary: report.summary,
    queryTimestamp: report.queryTimestamp, requestsMade: report.requestsMade, stopReason: report.stopReason,
    output: values.output ? path.relative(repo, path.resolve(values.output)) : null, written }, null, 2));
  if (report.summary.queryErrors) process.exitCode = 2;
}

if (require.main === module) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}