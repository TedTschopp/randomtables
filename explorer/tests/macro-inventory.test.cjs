const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { scanExpressions, summarizeTables, unparsedExpressions, loadLocalTables, inventoryTableSets, requirementsFor, runtimeSupport, renderMarkdown } = require('../tools/inventory-macros.cjs');

test('macro inventory finds outer and nested calls without counting ordinary references or parameters', () => {
  const result = scanExpressions('{legacy_table} {{lcfirst:{{ia|[adjective]}}}} {{#if:{{{value|}}}|{{po|Fred}}|none}}');
  assert.deepEqual(result.macros.map(macro => macro.name), ['lcfirst', 'ia', '#if', 'po']);
  assert.deepEqual(result.macros.map(macro => macro.depth), [0, 1, 0, 1]);
  assert.ok(result.macros.every(macro => macro.closed));
  assert.equal(result.parameters.length, 1);
  assert.equal(result.parameters[0].raw, '{{{value|}}}');
  assert.deepEqual(result.problems, []);
});

test('macro inventory retains spelling and distinguishes malformed and protected source', () => {
  const result = scanExpressions('{{Template:Po|Fred}} <nowiki>{{po|Example}}</nowiki> <!-- {{ucfirst:note}} --> {{ucfirst:word}');
  assert.deepEqual(result.macros.map(macro => macro.name), ['po', 'po', 'ucfirst', 'ucfirst']);
  assert.equal(result.macros[0].spelling, 'Template:Po');
  assert.deepEqual(result.macros.map(macro => macro.protected), [false, true, true, false]);
  assert.equal(result.macros[3].closed, false);
  assert.ok(result.problems.some(problem => problem.kind === 'unclosed-template'));
});

test('macro inventory does not mistake dynamic template names or links for known operations', () => {
  const result = scanExpressions('{{[template name]|value}} {{#expr:2+3}} [[ordinary link]]');
  assert.deepEqual(result.macros.map(macro => macro.name), ['<dynamic>', '#expr']);
  assert.equal(result.macros[0].spelling, '[template name]');
  assert.equal(result.macros[1].kind, 'parser-function');
});

test('macro totals distinguish ready, blocked, not imported, and inactive rows without double counting tables', () => {
  const tables = [
    { id: 'ready', name: 'Ready', state: 'ready-static', entries: [
      { weight: 2, text: '{{po|Fred}} {{po|James}}' }, { weight: 0, text: '{{fc|note}}' }
    ] },
    { id: 'blocked', name: 'Blocked', state: 'blocked', entries: [
      { weight: 1, text: '{{po|{{unknown|value}}}}' }
    ] },
    { id: 'outside', name: 'Not imported', state: 'not-imported', entries: [
      { weight: 1, text: '{{po|Name}}' }, { weight: -1, text: '{{bad|weight}}' },
      { weight: 1, text: '<nowiki>{{po|documentation}}</nowiki>' }
    ] }
  ];
  const before = JSON.stringify(tables);
  const report = summarizeTables(tables);
  const possessive = report.macros.find(macro => macro.name === 'po');
  assert.equal(possessive.occurrences, 5);
  assert.equal(possessive.executableOccurrences, 4);
  assert.equal(possessive.executableTables, 3);
  assert.deepEqual(possessive.byState, { 'ready-static': 1, blocked: 1, 'not-imported': 1 });
  assert.equal(possessive.protectedOccurrences, 1);
  assert.equal(report.macros.find(macro => macro.name === 'fc').zeroWeightOccurrences, 1);
  assert.equal(report.macros.find(macro => macro.name === 'bad').invalidWeightOccurrences, 1);
  assert.equal(report.summary.tables, 3);
  assert.equal(JSON.stringify(tables), before);
});

test('unparsed source macros are reported separately without repeating parsed row occurrences', () => {
  const table = {
    entries: [{ weight: 1, text: '{{po|Fred}} {{po|Fred}}' }],
    raw_source: ';main\n1,{{po|Fred}} {{po|Fred}}\ninvalid row {{ia|hidden}}\n{{po|Fred}}'
  };
  const remaining = unparsedExpressions(table);
  assert.deepEqual(remaining.map(macro => macro.name), ['ia', 'po']);
  assert.ok(remaining.every(macro => macro.line >= 3));
});

test('local collection preserves shadowed and unloaded definitions without scanning its own reports', context => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'macro-inventory-'));
  context.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  for (const directory of ['tables', 'Docs', 'JS', 'explorer']) fs.mkdirSync(path.join(repo, directory));
  for (const file of ['JS/generator.js', 'explorer/model.js']) {
    fs.copyFileSync(path.join(__dirname, '..', '..', file), path.join(repo, file));
  }
  fs.writeFileSync(path.join(repo, 'index.html'), '<script src="tables/first.js"></script><script src="tables/second.js"></script>');
  fs.writeFileSync(path.join(repo, 'tables/first.js'), 'gen_data.fixture = { "1-2": "{{ia|one}}", "3": "{{uc:two}}" };');
  fs.writeFileSync(path.join(repo, 'tables/second.js'), 'gen_data.fixture = ["{{po|Fred}}"];');
  fs.writeFileSync(path.join(repo, 'tables/unloaded.js'), 'gen_data.fixture = ["{{plural|book}}"];');
  fs.writeFileSync(path.join(repo, 'tables/archive.json'), JSON.stringify({ old: ['{{lc:WORD}}'] }));
  fs.writeFileSync(path.join(repo, 'tables/abulafia.js'), 'throw new Error("Generated imports must not execute");');
  fs.writeFileSync(path.join(repo, 'Docs/words.txt'), 'plain words\n');
  fs.writeFileSync(path.join(repo, 'Docs/macro-inventory.json'), JSON.stringify({ macros: ['{{not_a_table}}'] }));
  const result = loadLocalTables(repo);
  assert.deepEqual(result.tables.map(table => table.state), ['legacy-shadowed', 'legacy-active', 'legacy-unloaded', 'legacy-json']);
  assert.deepEqual(result.tables[0].entries.map(entry => entry.weight), [1, 2]);
  assert.equal(result.tables[1].entries[0].text, '{{po|Fred}}');
  assert.equal(result.scriptFiles, 3);
  assert.equal(result.jsonFiles, 1);
  assert.equal(result.wordlists.length, 1);
  assert.ok(!result.files.includes('Docs/macro-inventory.json'));
});

test('inventory separates current membership from imported history without omitting catalog blockers', () => {
  const { tableId } = require('../tools/import-abulafia.cjs');
  function record(name, historical = false) {
    return { sourceFile: `tables/${name}/table.json`, sourceHash: name,
      ...(historical ? { historical: { basis: 'latest-retained-definition' } } : {}),
      table: { page: { page_id: 1, title: 'Page' }, subtable: { name, qualified_name: `Page.${name}` },
        entries: [{ weight: 1, text: `{{po|${name}}}` }] } };
  }
  const current = record('current');
  const outside = record('outside');
  const historical = record('old', true);
  const unused = record('unused', true);
  const metadata = (record, status) => ({ id: tableId(record.table), name: record.table.subtable.qualified_name,
    sourceFile: record.sourceFile, sourceHash: record.sourceHash, status,
    ...(record.historical ? { historical: record.historical } : {}) });
  const manifest = { summary: { tables: 2 }, tables: [metadata(current, 'ready'), metadata(historical, 'blocked')] };
  const records = [current, historical, outside, unused];
  const before = JSON.stringify({ manifest, records });
  const sets = inventoryTableSets(records, manifest);
  assert.deepEqual(sets.current.map(table => table.name), ['Page.current', 'Page.outside']);
  assert.deepEqual(sets.historical.map(table => table.name), ['Page.old']);
  assert.equal(sets.catalog.length, 3);
  assert.deepEqual(summarizeTables(sets.catalog).summary.byState, { 'ready-static': 1, 'not-imported': 1, blocked: 1 });
  assert.equal(sets.historical[0].historical, true);
  assert.throws(() => inventoryTableSets(records.filter(record => record !== historical), manifest), /scope|missing/i);
  const stale = structuredClone(manifest);
  stale.tables[1].sourceHash = 'stale';
  assert.throws(() => inventoryTableSets(records, stale), /source|hash/i);
  assert.equal(JSON.stringify({ manifest, records }), before);
});

test('requirements group verified aliases without adding table counts or hiding unknown names', () => {
  const current = summarizeTables([
    { id: 'shared', name: 'Shared', state: 'blocked', entries: [{ weight: 1, text: '{{ia|one}} {{Article|two}}' }] },
    { id: 'outside', name: 'Outside', state: 'not-imported', entries: [{ weight: 1, text: '{{article|three}} {{future|value}}' }] }
  ]);
  const requirements = requirementsFor(current.macros);
  const article = requirements.find(group => group.id === 'articles');
  assert.deepEqual(article.names, ['ia', 'article']);
  assert.equal(article.tables, 2);
  assert.equal(article.occurrences, 3);
  assert.deepEqual(article.byState, { blocked: 1, 'not-imported': 1 });
  assert.ok(requirements.some(group => group.id === 'unclassified' && group.names.includes('future')));
});

test('inventory support follows the shared evaluator and distinguishes presentation projections', () => {
  const expressions = require('../../JS/wiki-expressions.js');
  const support = runtimeSupport();
  assert.deepEqual(support.canonicalOperations, [...expressions.supportedOperations]);
  assert.deepEqual(support.operationAliases, expressions.aliases);
  assert.deepEqual(support.supportedOperations, [...new Set([...expressions.supportedOperations, ...Object.keys(expressions.aliases)])].sort());
  assert.ok(support.plainTextOperations.includes('dieroll'));
  assert.ok(support.plainTextOperations.includes('fc'));
  assert.ok(support.plainTextOperations.every(name => support.supportedOperations.includes(name)));
  assert.ok(!support.supportedOperations.includes('sgdisplaygreatertemplate'));
});

test('readable inventory includes source examples, requirements, exceptions, and precise unsupported counts', () => {
  const current = summarizeTables([
    { id: 'sample', name: 'Sample.main', file: 'tables/sample/subtables/main/table.json', state: 'blocked',
      entries: [{ weight: 1, text: '{{ia|one}} {{Article|two}} {{ucfirst:three}} {{link|Page|Label}} {{future|value}}' }] }
  ]);
  const report = {
    generatedOn: '2026-09-06', provenance: { repository: 'https://github.com/example/wiki', commit: 'abc123' },
    scope: { currentWikiTables: 1, importedTables: 1, notImportedTables: 0, localScriptFiles: 0,
      loadedLocalScripts: 0, localJsonFiles: 0 }, current, legacy: summarizeTables([]),
    ...runtimeSupport(), requirements: requirementsFor(current.macros), wordlists: [],
    unparsedSource: [{ name: 'subst', table: 'Sample.main', file: 'tables/sample/subtables/main/table.json', line: 1,
      closed: true, protected: false, example: '{{subst:Generator start}}' }],
    expressionPatterns: [], otherSyntax: [], validationIssues: {}
  };
  const markdown = renderMarkdown(report);
  assert.match(markdown, /\*\*4 names\*\* have implemented support/);
  assert.match(markdown, /\*\*1 name\*\* remains unsupported/);
  assert.match(markdown, /Plain text/);
  assert.match(markdown, /multiple and nested/);
  assert.doesNotMatch(markdown, /Only `po`|one recognized transform per row|no nested transforms|unfinished end-to-end|First extend/);
  assert.match(markdown, /## Capability Requirements/);
  assert.match(markdown, /## Source Examples/);
  assert.match(markdown, /## Template Dependencies/);
  assert.match(markdown, /blob\/abc123\/tables\/sample\/subtables\/main\/table.json/);
  assert.match(markdown, /subst/);
  assert.match(markdown, /Indefinite articles/);
});