const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const expressions = require('../../JS/wiki-expressions.js');

test('wiki expressions parse multiple and nested operations with verified aliases and references', () => {
  const parts = expressions.parse('{{ucfirst:{{Ia|[thing]}}}} / {{lc:MiXeD}}', {
    reference: token => {
      assert.equal(token, 'thing');
      return 'wiki_abulafia_1_61';
    }
  });
  assert.deepEqual(parts, [
    { op: 'ucfirst', args: [[{ op: 'article', args: [[{ ref: 'wiki_abulafia_1_61' }]] }]] },
    ' / ', { op: 'lc', args: [['MiXeD']] }
  ]);
});

test('wiki expressions reject unknown operations, malformed delimiters, and excessive nesting', () => {
  for (const text of ['{{constructor|value}}', '{{uc:missing}', '{{uc:[missing}}', '{{{1|unbound}}}']) {
    assert.throws(() => expressions.parse(text), /unsupported|unclosed|parameter|reference/i, text);
  }
  assert.throws(() => expressions.parse('{{uc:'.repeat(40) + 'word' + '}}'.repeat(40)), /limit|depth/i);
});

function render(source, options = {}) {
  return expressions.evaluate(expressions.parse(source, options), options);
}

test('string and case functions follow documented MediaWiki edge behavior', () => {
  for (const [source, expected] of [
    ['{{ucfirst: text tRAnSFORM }}', 'Text tRAnSFORM'], ['{{lcfirst: AbC }}', 'abC'],
    ['{{uc:\u00e9cole}}', '\u00c9COLE'], ['{{lc:MiXeD}}', 'mixed'], ['{{lc:x=y}}', 'x=y'],
    ['{{#len:\u017dmr\u017elina}}', '8'], ['{{#len:&nbsp;}}', '6'],
    ['{{#sub:Icecream|3|0}}', 'cream'], ['{{#sub:Icecream|3|-3}}', 'cr'],
    ['{{#sub:Icecream|-3|2}}', 'ea'], ['{{#sub:Icecream|3|-6}}', ''],
    ['{{#pos:abc|z}}', ''], ['{{#rpos:abc|z}}', '-1'], ['{{#pos:abcabc|a|1}}', '3'],
    ['{{#replace:a b||}}', 'ab'], ['{{#replace:aaa|a|$&}}', '$&$&$&'],
    ['{{#replace:a_b|_|&#32;}}', 'a&#32;b'], ['{{Comma}}{{!}}{{p}}', ', ||']
  ]) assert.equal(render(source), expected, source);
});

test('archived grammar templates preserve source rules and overrides rather than generic English guesses', () => {
  for (const [source, expected] of [
    ['{{ia|Apple}}', 'an Apple'], ['{{Article|unicorn}}', 'a unicorn'], ['{{article|hour}}', 'a hour'],
    ['{{ucfirst:{{ia|old book}}}}', 'An old book'], ['{{Article|}}', 'a'],
    ['{{Plural|city}}', 'citys'], ['{{Plural|cactus}}', 'cacti'], ['{{Plural|box}}', 'boxes'],
    ['{{Plural|a coin}}', 'a coin'], ['{{Plural|mouse|mice}}', 'mice'], ['{{Plural|bus|override}}', 'bi'],
    ['{{Po|Fred|his}}', 'his'], ['{{po|James|his}}', 'James\u2019'], ['{{po|}}', '\u2019s'],
    ['{{Concat|ta|al}}', 'tal'], ['{{Concat|ta|kal}}', 'takal'],
    ['{{Pronoun|!HESHE has !HISHER book. !HESHE sees !HIMHER.|f}}', 'she has her book. She sees her.'],
    ['{{Numtostring|1}}', 'one'], ['{{Numtostring|20}}', 'twenty'], ['{{Numtostring|21}}', '']
  ]) assert.equal(render(source), expected, source);
});

test('array helpers preserve the archived pipe-string behavior and delimiter defaults', () => {
  for (const [source, expected] of [
    ['{{Array_norepeat|red{{!}}blue|red}}', 'red|blue'],
    ['{{Array_norepeat|red{{!}}blue|green}}', 'red|blue|green'],
    ['{{Array_norepeat|reddish|red}}', 'reddish'],
    ['{{Array_implode|red{{!}}blue}}', 'red,&#32;blue'],
    ['{{Psychon_norepeat|red{{!}}blue}}', 'red,&#32;blue']
  ]) assert.equal(render(source), expected, source);
});

test('arithmetic uses a bounded numeric AST with MediaWiki operators and no code execution', () => {
  for (const [formula, expected] of [
    ['2 + 3 * 4', '14'], ['2^3', '8'], ['floor(7/2)', '3'], ['ceil 1/3', '0.33333333333333'],
    ['10 div 3', '3.3333333333333'], ['2^3^2', '64'], ['3^3^3', '19683'], ['-2^2', '4'], ['floor 1.5^2', '1'],
    ['17 mod 5', '2'], ['3 * 4 mod 10 * 10', '20'], ['-1/2 round 0', '-1'], ['2 < 3 and 4 != 5', '1'], ['', '']
  ]) assert.equal(render(`{{#expr:${formula}}}`), expected, formula);
  for (const formula of ['globalThis.value=1', 'constructor(1)', '1/0', '1e999', '[1,2]', '2 +']) {
    assert.throws(() => render(`{{#expr:${formula}}}`), /expression|arithmetic|reference|finite|zero|operand/i, formula);
  }
});

test('conditionals are lazy, compare integer strings exactly, and cache each template argument once', () => {
  const options = { reference: () => 'wiki_abulafia_1_61', resolve: () => { throw new Error('Unexpected roll'); } };
  assert.equal(render('{{#if:0|yes|[unused]}}', options), 'yes');
  assert.equal(render('{{#ifeq:01|1|same|[unused]}}', options), 'same');
  assert.equal(render('{{#ifeq:12345678901234567|12345678901234568|same|different}}'), 'different');
  assert.equal(render('{{#switch:2|1=[unused]|2=second|2=[unused]|default}}', options), 'second');
  assert.equal(render('{{#switch:z|a|b=group|#default=other}}'), 'other');
  let calls = 0;
  const resolving = { reference: () => 'wiki_abulafia_1_61', resolve: () => { calls += 1; return calls === 1 ? 'apple' : 'book'; } };
  assert.equal(render('{{Article|[word]}}', resolving), 'an apple');
  assert.equal(calls, 1);
  calls = 0;
  assert.equal(render('[word] [word]', resolving), 'apple book');
  assert.equal(calls, 2);
});

test('presentation helpers produce explicit plain-text projections and current year uses a fixed UTC clock', () => {
  for (const [source, expected] of [
    ['{{link|https://example.com|Label}}', 'Label'], ['{{link|Page}}', 'Page'],
    ['{{Hover|Explanation|Label|link=yes}}', 'Label'], ['{{LinkMe|Page}}', 'Page'],
    ['{{Font Color|red|Label}}', 'Label'], ['{{fc||#FFC|Label}}', 'Label'],
    ['{{DieRoll|title=Gold|dice=1d20x4+5}}', '1d20x4+5'],
    ['{{DieRoll|dice=1d6|text=Roll gold}}', 'Roll gold']
  ]) assert.equal(render(source), expected, source);
  assert.equal(render('{{CURRENTYEAR}}', { now: new Date('2026-12-31T23:59:59Z') }), '2026');
  assert.equal(render('{{#ifexist:Page|yes|no}}', { exists: title => title === 'Page' }), 'yes');
});

test('expression validation copies programs and rejects unknown fields, parameters, and oversized output', () => {
  const parts = expressions.parse('{{uc:word}}');
  const validated = expressions.validate(parts);
  parts[0].args[0][0] = 'changed';
  assert.equal(expressions.evaluate(validated), 'WORD');
  assert.ok(Object.isFrozen(validated[0].args[0]));
  for (const invalid of [[{ op: 'eval', args: [] }], [{ ref: 'classic' }], [{ parameter: '1' }], [{ op: 'uc', args: [['word']], extra: true }]]) {
    assert.throws(() => expressions.validate(invalid), /unsupported|invalid|parameter|reference/i);
  }
  assert.throws(() => render('{{#replace:' + 'a'.repeat(20000) + '|a|long}}'), /limit/i);
});

test('vendored browser scripts evaluate macros without modules, network access, or string code generation', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const assets = ['vendor/jsep.iife.min.js', '../JS/wiki-template-data.js', '../JS/wiki-expressions.js', '../JS/wiki-import.js'];
  const positions = assets.map(asset => html.indexOf(`src="${asset}"`));
  assert.ok(positions.every(position => position >= 0), 'All macro scripts must be loaded by the explorer');
  assert.deepEqual(positions, [...positions].sort((first, second) => first - second));
  const context = vm.createContext({}, { codeGeneration: { strings: false, wasm: false } });
  for (const file of ['explorer/vendor/jsep.iife.min.js', 'JS/wiki-template-data.js', 'JS/wiki-expressions.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), context, { filename: file });
  }
  assert.equal(vm.runInContext("WikiExpressions.evaluate(WikiExpressions.parse('{{ucfirst:{{ia|old book}}}} / {{#expr:2^3}}'))", context), 'An old book / 8');
  assert.equal(context.fetch, undefined);
  assert.equal(context.require, undefined);
});