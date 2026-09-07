const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { gzipSync } = require('node:zlib');

function runtime() {
  const context = vm.createContext({ console, atob, Blob, Response, DecompressionStream });
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), context);
  }
  return context;
}

function payload() {
  return {
    schemaVersion: 1,
    tables: [
      { id: 'wiki_abulafia_1_61', name: 'Page.a', status: 'ready', values: ['Result'], entries: [], issues: [] },
      { id: 'wiki_abulafia_1_62', name: 'Page.b', status: 'blocked', values: ['{{untrusted}}'], entries: [], issues: [{ code: 'unsupported_syntax', detail: 'Unsupported expression' }] }
    ],
    labels: { wiki_abulafia_1_61: 'Page.a', wiki_abulafia_1_62: 'Page.b' },
    aliases: { recovered: 'wiki_abulafia_1_61' }
  };
}

function expressionPayload() {
  return {
    schemaVersion: 1,
    tables: [
      {
        id: 'wiki_abulafia_2_61', name: 'Names.possessive', status: 'ready', execution: 'wiki',
        values: ['[Wiki table requires Table Atlas: Names.possessive]'], totalWeight: 1,
        entries: [{ weight: 1, text: '{{po|{wiki_abulafia_2_62}}}', rawText: '{{po|[names]}}', references: ['wiki_abulafia_2_62'] }],
        program: [[{ op: 'po', parts: [{ ref: 'wiki_abulafia_2_62' }] }]], issues: []
      },
      {
        id: 'wiki_abulafia_2_62', name: 'Names.names', status: 'ready',
        values: { '1-2': '{wiki_abulafia_2_63}', 3: 'CHRIS' }, entries: [], issues: []
      },
      {
        id: 'wiki_abulafia_2_63', name: 'Names.leaf', status: 'ready',
        values: { '1-2': 'Fred', 3: 'James' }, entries: [], issues: []
      }
    ],
    labels: {}, aliases: {}
  };
}

test('extended wiki programs support structured nested calls and remain immutable and atomically validated', () => {
  const context = runtime();
  context.WikiExpressions = require('../../JS/wiki-expressions.js');
  const bundle = expressionPayload();
  bundle.tables[0].program = [[{ op: 'ucfirst', args: [[{ op: 'article', args: [[{ ref: 'wiki_abulafia_2_63' }]] }]] }]];
  bundle.tables[2].values = ['old book'];
  context.WikiImport.register(bundle);
  bundle.tables[0].program[0][0].args[0][0].op = 'eval';
  vm.runInContext('Math.random = () => 0;', context);
  const result = context.WikiImport.roll(bundle.tables[0].id);
  assert.equal(result.text, 'An old book');
  assert.equal(result.warnings.length, 0);
  assert.equal(result.steps.length, 2);
  for (const invalid of [{ op: 'constructor', args: [] }, { op: 'uc', args: [['<script>bad</script>']] }, { op: 'uc', args: [['word']], extra: true }]) {
    const rejected = expressionPayload();
    rejected.tables[0].program = [[invalid]];
    const isolated = runtime();
    isolated.WikiExpressions = require('../../JS/wiki-expressions.js');
    assert.throws(() => isolated.WikiImport.register(rejected), /wiki|unsupported|invalid/i);
    assert.equal(isolated.WikiImport.metadata.size, 0);
    assert.equal(Object.keys(isolated.gen_data).length, 0);
  }
});

test('wiki expression rolls follow compact weighted references and transform the completed result', () => {
  const context = runtime();
  const generate = context.generate_text;
  const select = context.select_from;
  vm.runInContext("gen_data.original = ['Original'];", context);
  vm.runInContext(`WikiImport.register(${JSON.stringify(expressionPayload())});`, context);
  const before = JSON.stringify(context.gen_data);
  const counts = {};
  for (let nameSide = 0; nameSide < 3; nameSide += 1) {
    for (let leafSide = 0; leafSide < 3; leafSide += 1) {
      vm.runInContext(`Math.random = (() => { const samples = [0.5, ${(nameSide + 0.5) / 3}, ${(leafSide + 0.5) / 3}]; return () => samples.shift(); })();`, context);
      const result = context.WikiImport.roll('wiki_abulafia_2_61');
      assert.equal(result.warnings.length, 0);
      counts[result.text] = (counts[result.text] || 0) + 1;
      assert.equal(result.steps[0].id, 'wiki_abulafia_2_61');
      assert.equal(result.steps[0].depth, 0);
      assert.equal(result.steps[1].id, 'wiki_abulafia_2_62');
      assert.equal(result.steps[1].depth, 1);
      if (nameSide < 2) assert.equal(result.steps[2].id, 'wiki_abulafia_2_63');
    }
  }
  assert.deepEqual(counts, { 'Fred\u2019s': 4, 'James\u2019': 2, 'CHRIS\u2019': 3 });
  assert.equal(context.generate_text, generate);
  assert.equal(context.select_from, select);
  assert.equal(JSON.stringify(context.gen_data), before);
  vm.runInContext('Math.random = () => 0;', context);
  assert.equal(context.generate_text('original'), 'Original');
  assert.match(context.generate_text('wiki_abulafia_2_61'), /requires Table Atlas/);
});

test('wiki programs are validated atomically and cannot enter compatibility aliases or core bundles', () => {
  for (const condition of ['unknown', 'nested', 'reference', 'literal', 'weight', 'total', 'zero', 'shape', 'nodes', 'alias', 'core']) {
    const bundle = expressionPayload();
    const table = bundle.tables[0];
    if (condition === 'unknown') table.program[0][0].op = 'eval';
    if (condition === 'nested') table.program[0][0].parts = [{ op: 'po', parts: ['name'] }];
    if (condition === 'reference') table.program[0][0].parts = [{ ref: 'original' }];
    if (condition === 'literal') table.program[0] = ['<script>injected = true</script>'];
    if (condition === 'weight') table.entries[0].weight = -1;
    if (condition === 'total') table.totalWeight = 2;
    if (condition === 'zero') table.entries[0].weight = 0;
    if (condition === 'shape') table.program = [];
    if (condition === 'nodes') table.program[0] = Array(4097).fill('');
    if (condition === 'alias') bundle.aliases.recovered = table.id;
    const context = runtime();
    assert.throws(() => context.WikiImport.register(bundle, { core: condition === 'core' }), /wiki|expression|compatibility|alias/i, condition);
    assert.equal(Object.keys(context.gen_data).length, 0, condition);
    assert.equal(context.WikiImport.metadata.size, 0, condition);
    assert.equal(context.WikiImport.roll(table.id).warnings[0].type, 'missing', condition);
  }
});

test('wiki runtime copies executable data and never reparses inert values as macros', () => {
  const context = runtime();
  const bundle = expressionPayload();
  context.WikiImport.register(bundle);
  bundle.tables[0].program[0][0].op = 'eval';
  bundle.tables[0].entries[0].weight = 0;
  bundle.tables[1].values['1-2'] = '{{unsupported}}';
  context.gen_data.wiki_abulafia_2_63 = ['{{unsupported}}'];
  context.WikiImport.metadata.get('wiki_abulafia_2_63').status = 'blocked';
  vm.runInContext('Math.random = () => 0;', context);
  const result = context.WikiImport.roll('wiki_abulafia_2_61');
  assert.equal(result.text, 'Fred\u2019s');
  assert.equal(result.warnings.length, 0);
});

test('wiki expression guards stop cycles, excessive depth, call counts, length, and invalid targets', () => {
  for (const condition of ['missing', 'blocked', 'cycle', 'depth', 'calls', 'length', 'syntax', 'legacy']) {
    const bundle = expressionPayload();
    const table = bundle.tables[0];
    if (condition === 'missing') bundle.tables.pop();
    if (condition === 'blocked') bundle.tables[2].status = 'blocked';
    if (condition === 'cycle') bundle.tables[2].values = [`{${table.id}}`];
    if (condition === 'depth') {
      for (let index = 3; index < 36; index += 1) {
        const next = `wiki_abulafia_3_${index.toString(16)}`;
        bundle.tables[bundle.tables.length - 1].values = [`{${next}}`];
        bundle.tables.push({ id: next, name: next, status: 'ready', values: ['Leaf'], entries: [], issues: [] });
      }
    }
    if (condition === 'calls') {
      table.program[0] = Array.from({ length: 512 }, () => ({ ref: 'wiki_abulafia_2_63' }));
      bundle.tables[2].values = [''];
    }
    if (condition === 'length') table.program[0] = ['a'.repeat(32768), 'extra'];
    if (condition === 'syntax') bundle.tables[2].values = ['{{unsupported}}'];
    if (condition === 'legacy') bundle.tables[2].values = ['{original}'];
    const context = runtime();
    vm.runInContext("gen_data.original = ['Original']; Math.random = () => 0;", context);
    context.WikiImport.register(bundle);
    const result = context.WikiImport.roll(table.id);
    assert.equal(result.text, '', condition);
    assert.equal(result.warnings.length, 1, condition);
    assert.equal(result.warnings[0].type, ['depth', 'calls', 'length'].includes(condition) ? 'limit' : condition === 'legacy' ? 'missing' : condition);
    assert.ok(result.steps.length <= 512, condition);
    assert.equal(context.generate_text('original'), 'Original', condition);
  }
});

test('wiki expression rolls preserve zero weights, empty arguments, and first-character-only casing', () => {
  for (const [operation, argument, expected] of [['po', '', '\u2019s'], ['ucfirst', '', ''], ['ucfirst', 'text tRAnSFORM', 'Text tRAnSFORM']]) {
    const bundle = expressionPayload();
    const table = bundle.tables[0];
    table.entries.unshift({ weight: 0, text: '{{unsupported}}', references: [] });
    table.program = [null, [{ op: operation, parts: [argument] }]];
    const context = runtime();
    context.WikiImport.register(bundle);
    vm.runInContext('Math.random = () => 0;', context);
    const result = context.WikiImport.roll(table.id);
    assert.equal(result.text, expected);
    assert.equal(result.warnings.length, 0);
    assert.equal(result.steps.length, 1);
  }
  for (const argument of ['\u00e9clair', ' leading', 'trailing ', 'name&amp;name']) {
    const bundle = expressionPayload();
    bundle.tables[0].program = [[{ op: 'ucfirst', parts: [argument] }]];
    const context = runtime();
    context.WikiImport.register(bundle);
    const result = context.WikiImport.roll(bundle.tables[0].id);
    assert.equal(result.text, '');
    assert.equal(result.warnings[0].type, 'syntax');
  }
});

test('wiki registration preserves existing tables and works with the unchanged generator', () => {
  const context = runtime();
  vm.runInContext("gen_data.original = ['Original'];", context);
  const originalGenerate = context.generate_text;
  vm.runInContext(`WikiImport.register(${JSON.stringify(payload())}, { core: true });`, context);

  assert.equal(context.generate_text('original'), 'Original');
  assert.equal(context.generate_text('recovered'), 'Result');
  assert.equal(context.generate_text, originalGenerate);
  assert.equal(context.WikiImport.metadata.get('wiki_abulafia_1_61').legacyAvailable, true);
  assert.match(context.generate_text('wiki_abulafia_1_62'), /unavailable/i);
  assert.doesNotMatch(context.generate_text('wiki_abulafia_1_62'), /[{}]/);
});

test('a collision aborts the whole registration batch before any writes', () => {
  const context = runtime();
  vm.runInContext("gen_data.wiki_abulafia_1_62 = ['User value'];", context);
  const before = JSON.stringify(context.gen_data);

  assert.throws(() => vm.runInContext(`WikiImport.register(${JSON.stringify(payload())});`, context), /collision/i);
  assert.equal(JSON.stringify(context.gen_data), before);
  assert.equal(context.WikiImport.metadata.size, 0);
});

test('duplicate IDs inside a payload and aliases to blocked tables are rejected', () => {
  const duplicate = payload();
  duplicate.tables.push(duplicate.tables[0]);
  const context = runtime();
  assert.throws(() => vm.runInContext(`WikiImport.register(${JSON.stringify(duplicate)});`, context), /collision/i);
  assert.equal(Object.keys(context.gen_data).length, 0);

  const blocked = payload();
  blocked.aliases.recovered = 'wiki_abulafia_1_62';
  assert.throws(() => vm.runInContext(`WikiImport.register(${JSON.stringify(blocked)});`, context), /unvalidated/i);
  assert.equal(Object.keys(context.gen_data).length, 0);
});

test('the compressed catalog loads entirely in-browser without fetch or evaluation', async () => {
  const context = runtime();
  const encoded = gzipSync(JSON.stringify(payload())).toString('base64');

  await context.WikiImport.loadCompressed(encoded);
  assert.equal(context.generate_text('recovered'), 'Result');
  assert.equal(context.WikiImport.metadata.size, 2);
  assert.equal(context.WikiImport.metadata.get('wiki_abulafia_1_61').legacyAvailable, false);
});