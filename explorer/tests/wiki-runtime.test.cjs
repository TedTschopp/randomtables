const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { gzipSync } = require('node:zlib');

function runtime() {
  const context = vm.createContext({ console, atob, Blob, Response, DecompressionStream });
  for (const file of ['JS/generator.js', 'JS/wiki-recursion.js', 'JS/wiki-import.js']) {
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

function recursionPayload(kind = 'unique-pair') {
  const identifier = 'wiki_abulafia_4_61';
  const leaf = 'wiki_abulafia_4_62';
  const recursive = kind === 'unique-pair' ? [{ ref: identifier }, ' and ', { ref: identifier }] : ['Most ', { ref: identifier }];
  return { schemaVersion: 1, aliases: {}, labels: {}, tables: [{
    id: identifier, name: 'Choices.main', status: 'ready', execution: 'wiki', totalWeight: 4,
    values: ['Requires Table Atlas'], issues: [],
    recursion: { kind, row: 1, maxDepth: 1 },
    entries: [
      { weight: 1, text: kind === 'unique-pair' ? `{${identifier}} and {${identifier}}` : `Most {${identifier}}`, references: [identifier] },
      { weight: 2, text: `{${leaf}}`, references: [leaf] },
      { weight: 1, text: 'Beets', references: [] }
    ],
    program: [recursive, [{ ref: leaf }], ['Beets']]
  }, { id: leaf, name: 'Choices.leaf', status: 'ready', values: ['Carrots', '  CARROTS  '], entries: [], issues: [] }] };
}

test('approved unique pairs sample distinct resolved values and never recurse into three items', () => {
  const context = runtime();
  const bundle = recursionPayload();
  context.WikiImport.register(bundle);
  const before = JSON.stringify(context.gen_data);
  for (const sample of [0, 0.5, 1 - Number.EPSILON]) {
    context.samples = [0, sample, sample];
    vm.runInContext('Math.random = () => samples.length ? samples.shift() : 0;', context);
    const result = context.WikiImport.roll(bundle.tables[0].id);
    assert.deepEqual(Array.from(result.warnings), []);
    const items = result.text.split(' and ').map(value => value.trim().toLowerCase());
    assert.equal(items.length, 2);
    assert.deepEqual(new Set(items), new Set(['carrots', 'beets']));
    assert.ok(result.steps.some(step => step.policy === 'unique-pair'));
    assert.ok(result.steps.every(step => step.depth < 32));
  }
  assert.equal(JSON.stringify(context.gen_data), before);
});

test('approved descriptive wrappers terminate after one wrapper without altering ordinary repeat draws', () => {
  const context = runtime();
  const bundle = recursionPayload('bounded-wrapper');
  context.WikiImport.register(bundle);
  bundle.tables[0].recursion.maxDepth = 99;
  vm.runInContext('Math.random = () => 0;', context);
  for (let repeat = 0; repeat < 2; repeat += 1) {
    const result = context.WikiImport.roll(bundle.tables[0].id);
    assert.deepEqual(Array.from(result.warnings), []);
    assert.equal(result.text, 'Most Carrots');
    assert.equal(result.steps.filter(step => step.policy === 'bounded-wrapper').length, 1);
  }
});

test('unique recursion preserves conditional path weights and scopes exclusions to one combination', () => {
  const bundle = recursionPayload();
  const table = bundle.tables[0];
  const leaf = bundle.tables[1];
  leaf.values = { 1: 'Carrots', '2-3': 'Beans' };
  const context = runtime();
  context.WikiImport.register(bundle);
  const firstCounts = {};
  const secondCounts = {};
  for (let side = 0; side < 9; side += 1) {
    context.samples = [0, (side + 0.5) / 9, 0];
    vm.runInContext('Math.random = () => samples.shift();', context);
    const result = context.WikiImport.roll(table.id);
    assert.equal(result.warnings.length, 0);
    const first = result.text.split(' and ')[0];
    firstCounts[first] = (firstCounts[first] || 0) + 1;
  }
  assert.deepEqual(firstCounts, { Carrots: 2, Beans: 4, Beets: 3 });
  for (let side = 0; side < 7; side += 1) {
    context.samples = [0, 0, (side + 0.5) / 7];
    vm.runInContext('Math.random = () => samples.shift();', context);
    const result = context.WikiImport.roll(table.id);
    assert.equal(result.warnings.length, 0);
    const second = result.text.split(' and ')[1];
    secondCounts[second] = (secondCounts[second] || 0) + 1;
  }
  assert.deepEqual(secondCounts, { Beans: 4, Beets: 3 });
  const outer = expressionPayload().tables[0];
  outer.program = [[{ ref: table.id }, ' / ', { ref: table.id }]];
  context.WikiImport.register({ schemaVersion: 1, tables: [outer], aliases: {}, labels: {} });
  vm.runInContext('Math.random = () => 0;', context);
  assert.equal(context.WikiImport.roll(outer.id).text, 'Carrots and Beans / Carrots and Beans');
  for (const sample of [NaN, -0.1, 1, Infinity]) {
    context.samples = [0, sample];
    vm.runInContext('Math.random = () => samples.shift();', context);
    const result = context.WikiImport.roll(table.id);
    assert.equal(result.text, '');
    assert.equal(result.warnings[0].type, 'error');
  }
});

test('invalid or unterminating recursion policies fail registration atomically', () => {
  for (const condition of ['depth', 'kind', 'row', 'extra', 'shape', 'one-value', 'mutual', 'missing', 'blocked', 'static', 'gap', 'overlap', 'budget']) {
    const context = runtime();
    const bundle = recursionPayload();
    const table = bundle.tables[0];
    if (condition === 'depth') table.recursion.maxDepth = 2;
    if (condition === 'kind') table.recursion.kind = 'unbounded';
    if (condition === 'row') table.recursion.row = 2;
    if (condition === 'extra') table.recursion.allowAll = true;
    if (condition === 'shape') table.program[0].push(' and ', { ref: table.id });
    if (condition === 'one-value') table.program[2] = ['CARROTS'];
    if (condition === 'mutual') bundle.tables[1].values = [`{${table.id}}`];
    if (condition === 'missing') bundle.tables.pop();
    if (condition === 'blocked') bundle.tables[1].status = 'blocked';
    if (condition === 'static') { delete table.execution; delete table.program; }
    if (condition === 'gap') bundle.tables[1].values = { 2: 'Carrots' };
    if (condition === 'overlap') bundle.tables[1].values = { '1-2': 'Carrots', 2: 'Beans' };
    if (condition === 'budget') bundle.tables[1].values = Array(4097).fill('Carrots');
    assert.throws(() => context.WikiImport.register(bundle), /recursion|recursive|terminal|distinct/i, condition);
    assert.equal(context.WikiImport.metadata.size, 0, condition);
    assert.equal(Object.keys(context.gen_data).length, 0, condition);
  }
});

test('bounded recursion consumes the remaining shared depth, call, and output budgets', () => {
  for (const kind of ['unique-pair', 'bounded-wrapper']) for (const limit of ['depth', 'calls', 'output']) {
    const context = runtime();
    const bundle = recursionPayload(kind);
    const target = bundle.tables[0];
    const outer = expressionPayload().tables[0];
    outer.entries = [{ weight: 1, text: 'Budget probe' }];
    let rootId = outer.id;
    if (limit === 'depth') {
      const chain = Array.from({ length: 31 }, (unused, index) => ({ ...outer, id: `wiki_abulafia_${500 + index}_61`,
        program: [[{ ref: index === 30 ? target.id : `wiki_abulafia_${501 + index}_61` }]] }));
      rootId = chain[0].id;
      bundle.tables.push(...chain);
    } else {
      outer.program = [limit === 'calls' ? Array.from({ length: 257 }, () => ({ ref: target.id })) :
        ['x'.repeat(32760), { ref: target.id }]];
      bundle.tables.push(outer);
    }
    context.WikiImport.register(bundle);
    vm.runInContext('Math.random = () => 0;', context);
    const result = context.WikiImport.roll(rootId);
    assert.equal(result.text, '', `${kind}: ${limit}`);
    assert.equal(result.warnings[0]?.type, 'limit', `${kind}: ${limit}`);
    assert.ok(result.steps.length <= 512);
    assert.ok(result.steps.every(step => step.depth < 32));
  }
});

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