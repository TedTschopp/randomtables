const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const repo = path.join(__dirname, '..', '..');

function loadRegistry() {
  const runtime = vm.createContext({ console });
  const html = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
  const sources = Array.from(html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g), match => match[1])
    .filter(source => source.startsWith('tables/'));
  for (const source of ['JS/generator.js', 'JS/wiki-import.js', 'explorer/model.js', ...sources]) {
    vm.runInContext(fs.readFileSync(path.join(repo, source), 'utf8'), runtime, { filename: source });
  }
  return runtime;
}

test('all classic registry references point to defined tables', () => {
  const runtime = loadRegistry();
  const model = runtime.TableAtlas.buildModel(runtime.gen_data);
  const missing = model.nodes.filter(table => table.missing);

  assert.deepEqual(Array.from(missing, table => table.id).sort(), []);
});

test('Gaelic and Scottish Lowland names retain distinct male and female lists', () => {
  const { gen_data: tables } = loadRegistry();

  assert.ok(tables.Gaelic_male_common?.includes('\u00c1ed'));
  assert.ok(tables.Gaelic_female_common.includes('B\u00e9binn'));
  assert.equal(tables.Gaelic_male_name['1-80'], '{Gaelic_male_common}');
  assert.equal(tables.Gaelic_female_name['1-80'], '{Gaelic_female_common}');
  assert.equal(tables.Scottish_Lowland_male_name['1-80'], '{Scottish_Lowland_male_common}');
  assert.equal(tables.Scottish_Lowland_female_name?.['1-80'], '{Scottish_Lowland_female_common}');
});