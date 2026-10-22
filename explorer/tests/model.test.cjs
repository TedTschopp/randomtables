const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const modelPath = path.join(__dirname, '..', 'model.js');
const generatorPath = path.join(__dirname, '..', '..', 'JS', 'generator.js');

function createRuntime() {
  const runtime = vm.createContext({ console });
  vm.runInContext(fs.readFileSync(generatorPath, 'utf8'), runtime);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', 'JS', 'wiki-import.js'), 'utf8'), runtime);
  vm.runInContext(fs.readFileSync(modelPath, 'utf8'), runtime);
  return runtime;
}

test('indexes lists and weighted tables without changing the registry', () => {
  const runtime = createRuntime();
  const tables = {
    welcome: { '01-02': 'Welcome to {town}. {town}', '03-00': '{missing}' },
    town: ['Harbor', '{welcome}'],
    isolated: ['Quiet']
  };
  const before = JSON.stringify(tables);
  const model = runtime.TableAtlas.buildModel(tables, { welcome: 'tables/city.js' });

  assert.equal(model.nodes.length, 4);
  assert.equal(model.tables.length, 3);
  assert.equal(model.edges.length, 3);
  assert.equal(model.byId.get('welcome').source, 'tables/city.js');
  assert.equal(model.byId.get('welcome').kind, 'Weighted');
  assert.equal(model.byId.get('town').kind, 'List');
  assert.equal(model.byId.get('missing').missing, true);
  assert.equal(model.byId.get('town').incoming[0], 'welcome');
  assert.equal(model.byId.get('welcome').outgoing.length, 2);
  assert.equal(model.edges.find(edge => edge.target === 'town').count, 2);
  assert.equal(model.byId.get('welcome').entries[1].weight, 98);
  assert.equal(JSON.stringify(tables), before);
});

test('neighborhood traversal follows both directions and terminates on cycles', () => {
  const runtime = createRuntime();
  const model = runtime.TableAtlas.buildModel({
    parent: ['{focus}'],
    focus: ['{child}'],
    child: ['{focus} {leaf}'],
    leaf: ['End'],
    isolated: ['Separate']
  });
  const oneHop = runtime.TableAtlas.neighborhood(model, 'focus', 1);
  const twoHops = runtime.TableAtlas.neighborhood(model, 'focus', 2);

  assert.deepEqual(Array.from(oneHop.nodes, node => node.id).sort(), ['child', 'focus', 'parent']);
  assert.equal(oneHop.edges.length, 3);
  assert.equal(twoHops.nodes.length, 4);
  assert.equal(runtime.TableAtlas.neighborhood(model, 'unknown', 2).nodes.length, 0);
});

test('reference parsing matches the legacy token syntax and keeps empty entries', () => {
  const runtime = createRuntime();
  const model = runtime.TableAtlas.buildModel({
    source: ['', '{valid_name} {valid_name} {not-a-token} {two words}'],
    valid_name: ['Done']
  });

  assert.equal(model.byId.get('source').entries.length, 2);
  assert.equal(model.edges.length, 1);
  assert.equal(model.edges[0].count, 2);
  assert.equal(model.byId.get('source').entries[0].text, '');
});

test('traced rolls reuse the legacy engine and restore its functions', () => {
  const runtime = createRuntime();
  vm.runInContext("gen_data = { start: ['Hello {name}!'], name: ['Ada'] };", runtime);
  const originalGenerate = runtime.generate_text;
  const originalSelect = runtime.select_from;
  const before = JSON.stringify(runtime.gen_data);
  const result = runtime.TableAtlas.roll('start', runtime);

  assert.equal(result.text, 'Hello Ada!');
  assert.deepEqual(Array.from(result.steps, step => step.id), ['start', 'name']);
  assert.equal(result.steps[0].value, 'Hello {name}!');
  assert.equal(result.steps[1].depth, 1);
  assert.equal(result.warnings.length, 0);
  assert.equal(runtime.generate_text, originalGenerate);
  assert.equal(runtime.select_from, originalSelect);
  assert.equal(JSON.stringify(runtime.gen_data), before);
});

test('traced rolls preserve weighted range semantics including 00', () => {
  const runtime = createRuntime();
  vm.runInContext("gen_data = { weighted: { '01-99': 'Common', '00': 'Rare' } }; Math.random = () => 0.999;", runtime);

  assert.equal(runtime.TableAtlas.roll('weighted', runtime).text, 'Rare');
});

test('missing references and runaway recursion are visible and bounded', () => {
  const runtime = createRuntime();
  vm.runInContext("gen_data = { missing_test: ['See {absent}'], recursive: ['{recursive}'] };", runtime);
  const missing = runtime.TableAtlas.roll('missing_test', runtime);
  const recursive = runtime.TableAtlas.roll('recursive', runtime);

  assert.match(missing.text, /Missing: absent/);
  assert.equal(missing.warnings[0].type, 'missing');
  assert.ok(recursive.steps.length <= 64);
  assert.equal(recursive.warnings[0].type, 'limit');
  assert.equal(runtime.generate_text('missing_test'), 'See ');
});

test('weighted probabilities account for overlapping ranges and gaps', () => {
  const runtime = createRuntime();
  const model = runtime.TableAtlas.buildModel({
    weighted: { '1-5': 'First', '4-8': 'Second', '10': 'Last' }
  });
  const entries = model.byId.get('weighted').entries;

  assert.equal(entries.find(entry => entry.key === '1-5').probability, 0.5);
  assert.equal(entries.find(entry => entry.key === '4-8').probability, 0.3);
  assert.equal(entries.find(entry => entry.key === '10').probability, 0.1);
});

test('the explorer loads the original sources in order and indexes the real registry', () => {
  const repo = path.join(__dirname, '..', '..');
  const originalHtml = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
  const explorerHtml = fs.readFileSync(path.join(repo, 'explorer', 'index.html'), 'utf8');
  const tableScripts = html => Array.from(html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g), match => match[1])
    .map(source => source.replace(/^\.\.\//, ''))
    .filter(source => source.startsWith('tables/'));
  const sources = tableScripts(originalHtml);

  assert.deepEqual(tableScripts(explorerHtml), sources);
  const runtime = createRuntime();
  runtime.document = { currentScript: null };
  runtime.addEventListener = () => {};
  vm.runInContext(fs.readFileSync(path.join(repo, 'explorer', 'registry.js'), 'utf8'), runtime);
  for (const source of sources) {
    runtime.document.currentScript = { getAttribute: () => `../${source}` };
    vm.runInContext(fs.readFileSync(path.join(repo, source), 'utf8'), runtime, { filename: source });
  }
  const before = JSON.stringify(runtime.gen_data);
  const model = runtime.TableAtlas.buildModel(runtime.gen_data, runtime.AtlasRegistry.sources);

  assert.ok(model.tables.length > 100);
  assert.equal(model.byId.get('welcome_to_town').source, 'tables/city.js');
  assert.ok(model.byId.get('welcome_to_town').outgoing.includes('town_pride'));
  assert.ok(model.tables.every(table => table.source.startsWith('tables/')));
  assert.equal(JSON.stringify(runtime.gen_data), before);
  console.log(`Registry: ${model.tables.length} tables, ${model.entryCount} entries, ${model.edges.length} links, ${model.nodes.length - model.tables.length} missing targets.`);
});

test('wiki metadata retains readable names, provenance, source entries, and blocked roll guards', () => {
  const runtime = createRuntime();
  vm.runInContext(`WikiImport.register({
    schemaVersion: 1,
    tables: [{
      id: 'wiki_abulafia_1_61', name: 'Imported.a', page: 'Imported', status: 'blocked',
      archiveFile: 'tables/abulafia/source/1.json', sourceFile: 'tables/imported/subtables/a/table.json',
      contributor: { name: 'Editor' }, originalContributor: { name: 'Author' },
      totalWeight: 2, values: ['Unavailable'],
      issues: [{ code: 'unsupported_syntax', detail: 'Unsupported expression' }],
      entries: [{ weight: 2, text: '{{macro|{wiki_abulafia_missing_62}}}', rawText: '{{macro|[b]}}', references: ['wiki_abulafia_missing_62'] }]
    }],
    labels: { wiki_abulafia_1_61: 'Imported.a', wiki_abulafia_missing_62: 'Imported.b' }, aliases: {}
  });`, runtime);
  const model = runtime.TableAtlas.buildModel(runtime.gen_data);
  const table = model.byId.get('wiki_abulafia_1_61');

  assert.equal(table.label, 'Imported.a');
  assert.equal(table.source, 'tables/abulafia/source/1.json');
  assert.equal(table.blocked, true);
  assert.equal(table.entries[0].text, '{{macro|[b]}}');
  assert.equal(table.entries[0].probability, 1);
  assert.ok(table.searchText.includes('author'));
  assert.equal(model.byId.get('wiki_abulafia_missing_62').label, 'Imported.b');
  const result = runtime.TableAtlas.roll(table.id, runtime);
  assert.equal(result.warnings[0]?.type, 'blocked');
  assert.equal(result.steps.length, 0);
});

test('blocked source repairs display only explicitly corrected rows and retain raw evidence and cycle guards', () => {
  const runtime = createRuntime();
  vm.runInContext(`WikiImport.register({
    schemaVersion: 1,
    tables: [{
      id: 'wiki_abulafia_1_61', name: 'Imported.a', status: 'blocked', totalWeight: 11,
      archiveFile: 'tables/abulafia/source/1.json', values: ['Unavailable'],
      issues: [{ code: 'cycle', detail: 'Self reference' }],
      sourceCorrections: [{ row: 1, kind: 'repair-extra-self-reference-bracket' }],
      entries: [
        { weight: 10, text: 'Most {wiki_abulafia_1_61}', rawText: 'Most [a]]', references: ['wiki_abulafia_1_61'] },
        { weight: 1, text: '{{macro|{wiki_abulafia_missing_62}}}', rawText: '{{macro|[b]}}', references: ['wiki_abulafia_missing_62'] }
      ]
    }],
    labels: { wiki_abulafia_1_61: 'Imported.a', wiki_abulafia_missing_62: 'Imported.b' }, aliases: {}
  });`, runtime);
  const before = JSON.stringify([...runtime.WikiImport.metadata]);
  const model = runtime.TableAtlas.buildModel(runtime.gen_data);
  const table = model.byId.get('wiki_abulafia_1_61');
  assert.equal(table.entries[0].text, 'Most {wiki_abulafia_1_61}');
  assert.equal(table.entries[0].probability, 10 / 11);
  assert.equal(table.entries[1].text, '{{macro|[b]}}');
  assert.equal(table.wiki.entries[0].rawText, 'Most [a]]');
  assert.ok(model.edges.some(edge => edge.source === table.id && edge.target === table.id));
  assert.equal(table.blocked, true);
  assert.equal(runtime.TableAtlas.roll(table.id, runtime).warnings[0].type, 'blocked');
  assert.equal(JSON.stringify([...runtime.WikiImport.metadata]), before);
});

test('wiki-only programs retain source weights and route rolls to the isolated expression evaluator', () => {
  const runtime = createRuntime();
  vm.runInContext(`WikiImport.register({
    schemaVersion: 1, aliases: {}, labels: { wiki_abulafia_2_61: 'Imported.root', wiki_abulafia_2_62: 'Imported.name' },
    tables: [{
      id: 'wiki_abulafia_2_61', name: 'Imported.root', status: 'ready', execution: 'wiki',
      values: ['Requires Table Atlas'], totalWeight: 3, issues: [],
      entries: [
        { weight: 2, text: 'The {{po|{wiki_abulafia_2_62}}}', rawText: 'The {{po|[name]}}', references: ['wiki_abulafia_2_62'] },
        { weight: 1, text: 'Unchanged', rawText: 'Unchanged', references: [] }
      ],
      program: [['The ', { op: 'po', parts: [{ ref: 'wiki_abulafia_2_62' }] }], ['Unchanged']]
    }, {
      id: 'wiki_abulafia_2_62', name: 'Imported.name', status: 'ready', values: ['Fred'], totalWeight: 1, issues: [],
      entries: [{ weight: 1, text: 'Fred', rawText: 'Fred', references: [] }]
    }]
  }); Math.random = () => 0;`, runtime);
  const originalGenerate = runtime.generate_text;
  const originalSelect = runtime.select_from;
  const before = JSON.stringify(runtime.gen_data);
  const result = runtime.TableAtlas.roll('wiki_abulafia_2_61', runtime);
  assert.equal(result.text, 'The Fred\u2019s');
  assert.equal(result.warnings.length, 0);
  assert.deepEqual(Array.from(result.steps, step => step.id), ['wiki_abulafia_2_61', 'wiki_abulafia_2_62']);
  assert.equal(runtime.generate_text, originalGenerate);
  assert.equal(runtime.select_from, originalSelect);
  const model = runtime.TableAtlas.buildModel(runtime.gen_data);
  const table = model.byId.get('wiki_abulafia_2_61');
  assert.equal(table.kind, 'Weighted');
  assert.equal(table.entries.length, 2);
  assert.equal(table.entries[0].key, '1-2');
  assert.equal(table.entries[0].probability, 2 / 3);
  assert.deepEqual(Array.from(table.outgoing), ['wiki_abulafia_2_62']);
  assert.equal(JSON.stringify(runtime.gen_data), before);
});

test('large graph windows retain the selected table and report omitted nodes', () => {
  const runtime = createRuntime();
  const registry = Object.fromEntries(Array.from({ length: 800 }, (_, index) => [
    `table_${index}`, [index < 799 ? `{table_${index + 1}}` : 'End']
  ]));
  const model = runtime.TableAtlas.buildModel(registry);
  const data = { nodes: model.nodes, edges: model.edges };
  const window = runtime.TableAtlas.graphWindow(data, 'table_400', 60, 90);

  assert.ok(window.nodes.some(node => node.id === 'table_400'));
  assert.ok(window.nodes.length <= 60);
  assert.ok(window.edges.length <= 90);
  assert.equal(window.totalNodes, 800);
  assert.equal(window.totalEdges, 799);
  assert.equal(window.limited, true);
  const ids = new Set(window.nodes.map(node => node.id));
  assert.ok(window.edges.every(edge => ids.has(edge.source) && ids.has(edge.target)));
  assert.equal(data.nodes.length, 800);
});