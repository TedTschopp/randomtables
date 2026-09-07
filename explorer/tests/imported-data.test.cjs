const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const repo = path.join(__dirname, '..', '..');
const read = relative => fs.readFileSync(path.join(repo, relative), 'utf8');

test('imported artifacts match their audit hashes and retain every selected source snapshot', () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const tables = new Map(manifest.tables.map(table => [table.name, table]));
  const seen = new Set();
  let historical = 0;
  assert.match(manifest.commit, /^[a-f0-9]{40}$/);
  assert.equal(new Set(manifest.tables.map(table => table.id)).size, manifest.tables.length);
  for (const [file, expected] of Object.entries(manifest.generatedFiles)) {
    const content = fs.readFileSync(path.join(repo, file));
    assert.equal(content.length, expected.bytes, file);
    assert.equal(crypto.createHash('sha256').update(content).digest('hex'), expected.sha256, file);
    if (!file.startsWith('tables/abulafia/source/')) continue;
    const archive = JSON.parse(content);
    assert.equal(archive.commit, manifest.commit);
    for (const snapshot of archive.tables) {
      const current = snapshot.current;
      const name = current.table.subtable.qualified_name;
      const metadata = tables.get(name);
      assert.ok(metadata, name);
      assert.equal(seen.has(name), false, name);
      seen.add(name);
      assert.equal(metadata.archiveFile, file);
      assert.equal(metadata.sourceHash, current.sourceHash);
      assert.deepEqual(metadata.contributor, current.table.source.contributor);
      if (snapshot.original) {
        historical += 1;
        assert.equal(metadata.originalSourceFile, snapshot.original.sourceFile);
        assert.deepEqual(metadata.originalContributor, snapshot.original.table.source.contributor);
      }
    }
  }
  assert.equal(seen.size, manifest.summary.tables);
  assert.equal(historical, manifest.summary.historicalAttribution);
});

test('real imports preserve the legacy registry, repair its missing targets, and quarantine unsafe data', async () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const runtime = vm.createContext({ console, atob, Blob, Response, DecompressionStream });
  const scripts = Array.from(read('index.html').matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g), match => match[1])
    .filter(source => source.startsWith('tables/') && source !== 'tables/abulafia.js');
  for (const source of ['JS/generator.js', 'explorer/vendor/jsep.iife.min.js', 'JS/wiki-template-data.js', 'JS/wiki-expressions.js', 'JS/wiki-import.js', 'explorer/model.js', ...scripts]) {
    vm.runInContext(read(source), runtime, { filename: source });
  }
  const original = new Map(Object.entries(runtime.gen_data));
  const generate = runtime.generate_text;
  vm.runInContext(read('tables/abulafia.js'), runtime, { filename: 'tables/abulafia.js' });
  assert.equal(runtime.WikiImport.metadata.size, manifest.summary.coreTables);
  const coreModel = runtime.TableAtlas.buildModel(runtime.gen_data);
  assert.deepEqual(Array.from(coreModel.nodes.filter(table => table.missing), table => table.id), []);
  for (const alias of Object.keys(manifest.aliases)) {
    for (let sample = 0; sample < 20; sample += 1) {
      const result = runtime.TableAtlas.roll(alias, runtime);
      assert.equal(result.warnings.length, 0, alias);
      assert.ok(result.text.trim(), alias);
      assert.doesNotMatch(result.text, /\{\w+\}|unavailable/i);
    }
  }
  vm.runInContext(read('explorer/abulafia-catalog.js'), runtime, { filename: 'explorer/abulafia-catalog.js' });
  await runtime.WikiImport.catalogReady;
  assert.equal(runtime.WikiImport.metadata.size, manifest.summary.tables);
  const symbolTable = Array.from(runtime.WikiImport.metadata.values()).find(table => table.name === 'Real World Deities.\uD83D\uDC78');
  assert.equal(symbolTable.status, 'ready', 'Zero-weight formatting must not quarantine selectable content');
  assert.equal(symbolTable.entries.length, 3);
  assert.equal(symbolTable.entries.filter(entry => entry.weight === 0).length, 2);
  for (const entry of symbolTable.entries.filter(entry => entry.weight === 0)) assert.equal(entry.text, entry.rawText);
  assert.ok(symbolTable.entries.some(entry => entry.weight === 0 && entry.rawText === '{{fc||#FFC|goddess}}'));
  for (let sample = 0; sample < 20; sample += 1) {
    const result = runtime.TableAtlas.roll(symbolTable.id, runtime);
    assert.equal(result.warnings.length, 0);
    assert.ok(result.text.trim());
    assert.doesNotMatch(result.text, /\{\{|Wiki table unavailable/);
  }
  const byName = new Map(Array.from(runtime.WikiImport.metadata.values(), table => [table.name, table]));
  const hues = byName.get('Color.hues');
  const capitalizedHues = byName.get('Color.huesCap');
  const compass = byName.get('Compass direction.4');
  for (const table of [capitalizedHues, compass]) assert.equal(table.status, 'ready', table.name);
  assert.equal(capitalizedHues.entries.length, 1);
  assert.equal(capitalizedHues.entries[0].rawText, '{{ucfirst:[hues]}}');
  assert.ok(capitalizedHues.dependencies.includes(hues.id));
  assert.equal(compass.entries.length, 2);
  assert.equal(compass.entries[1].rawText, '{{ucfirst:[EW]}}');
  const originalHues = JSON.stringify(runtime.gen_data[hues.id]);
  const hueCounts = {};
  const compassCounts = {};
  function rollWithSamples(identifier, samples) {
    runtime.rollIdentifier = identifier;
    runtime.rollSamples = samples;
    const result = vm.runInContext(`(() => {
      const originalRandom = Math.random;
      try {
        Math.random = () => rollSamples.shift();
        return TableAtlas.roll(rollIdentifier, globalThis);
      } finally {
        Math.random = originalRandom;
      }
    })()`, runtime);
    assert.equal(result.warnings.length, 0, identifier);
    return result.text;
  }
  for (let side = 0; side < 26; side += 1) {
    const sample = (side + 0.5) / 26;
    const text = rollWithSamples(capitalizedHues.id, [sample]);
    hueCounts[text] = (hueCounts[text] || 0) + 1;
    assert.equal(rollWithSamples(hues.id, [sample]), text.charAt(0).toLowerCase() + text.slice(1));
  }
  assert.deepEqual(hueCounts, {
    Reddish: 3, Golden: 4, White: 4, Bluish: 4, Greenish: 3,
    Yellowish: 2, Purplish: 2, Orangeish: 2, Lavender: 1, Crimson: 1
  });
  for (let side = 0; side < 8; side += 1) {
    for (const leafSample of [0.25, 0.75]) {
      const text = rollWithSamples(compass.id, [(side + 0.5) / 8, leafSample]);
      compassCounts[text] = (compassCounts[text] || 0) + 1;
    }
  }
  assert.deepEqual(compassCounts, { North: 4, South: 4, East: 4, West: 4 });
  assert.equal(JSON.stringify(runtime.gen_data[hues.id]), originalHues);
  const scottishNames = byName.get('ScottishMale.ScottishMaleFirstName');
  const originalNames = JSON.stringify(runtime.gen_data[scottishNames.id]);
  const possessors = [
    scottishNames.entries.find(entry => entry.weight > 0 && !/[sS]$/.test(entry.text)).text,
    scottishNames.entries.find(entry => entry.weight > 0 && /[sS]$/.test(entry.text)).text
  ];
  for (const name of ['Artifacts.WaterBegin', 'Pathfinder Artifact.WaterBegin']) {
    const table = byName.get(name);
    assert.equal(table.status, 'ready', name);
    assert.equal(table.entries.length, 36);
    assert.ok(table.entries.some(entry => entry.rawText === 'Admiral {{po|[ScottishMale.ScottishMaleFirstName]}}'));
    assert.ok(table.dependencies.includes(scottishNames.id));
    const values = runtime.gen_data[table.id];
    const sides = runtime.scale_table(values);
    for (const possessor of possessors) {
      const expected = `Admiral ${possessor}${/[sS]$/.test(possessor) ? '\u2019' : '\u2019s'}`;
      const choice = Object.entries(values).find(([, value]) => value === expected);
      assert.ok(choice, `${name}: ${expected}`);
      const [start] = runtime.key_range(choice[0]);
      assert.equal(rollWithSamples(table.id, [(start - 0.5) / sides]), expected);
    }
  }
  const religiousPlace = byName.get('Fantasy Town Feature.religiousplace');
  assert.equal(religiousPlace.status, 'ready');
  assert.equal(religiousPlace.entries.length, 3);
  assert.ok(religiousPlace.entries.some(entry => entry.rawText === 'St. {{po|[Catholic Saint Names.main]}} [religious]'));
  const religiousValues = runtime.gen_data[religiousPlace.id];
  const saintChoice = Object.entries(religiousValues).find(([, value]) => value.startsWith('St. ') && value.includes('\u2019'));
  assert.ok(saintChoice);
  const [saintStart] = runtime.key_range(saintChoice[0]);
  const religiousResult = rollWithSamples(religiousPlace.id, [(saintStart - 0.5) / runtime.scale_table(religiousValues), ...Array(512).fill(0.5)]);
  assert.match(religiousResult, /^St\. .+\u2019s? /);
  assert.doesNotMatch(religiousResult, /[{}]/);
  assert.equal(JSON.stringify(runtime.gen_data[scottishNames.id]), originalNames);
  for (const name of ['Fantasy Town Names.main', 'Pathfinder Artifact.BeginName']) {
    const table = byName.get(name);
    assert.equal(table.status, 'ready', name);
    assert.equal(table.execution, 'wiki', name);
    assert.equal(table.legacyAvailable, false, name);
    assert.equal(table.program.length, table.entries.length, name);
    assert.ok(JSON.stringify(table.program).length < 4096, name);
    assert.match(runtime.generate_text(table.id), /requires Table Atlas/, name);
    let start = 0;
    for (const entry of table.entries) {
      if (entry.weight === 0) continue;
      const text = rollWithSamples(table.id, [(start + entry.weight / 2) / table.totalWeight, ...Array(512).fill(0.5)]);
      assert.doesNotMatch(text, /[{}]|unavailable|requires Table Atlas/i, name);
      if (entry.rawText.includes('{{po|')) assert.match(text, /\u2019/, name);
      start += entry.weight;
    }
  }
  for (const name of ['Artifacts.BeginName', 'Quick NPC.NPCDescriptor', '1st Level Dungeon.details', '25 Magic Words Of American Television.main', 'Alignment.all']) {
    const table = byName.get(name);
    assert.equal(table.status, 'ready', name);
    assert.equal(table.execution, 'wiki', name);
    assert.equal(table.legacyAvailable, false, name);
    assert.equal(table.program.length, table.entries.length, name);
    assert.ok(table.entries.some(entry => entry.rawText.includes('{{')), name);
    let start = 0;
    for (const entry of table.entries) {
      if (!entry.weight) continue;
      for (const tail of [0, 0.5, 0.999999999]) {
        const text = rollWithSamples(table.id, [(start + entry.weight / 2) / table.totalWeight, ...Array(512).fill(tail)]);
        assert.ok(text.trim(), name);
        assert.doesNotMatch(text, /\{\{|unavailable|requires Table Atlas/i, name);
      }
      start += entry.weight;
    }
  }
  assert.equal(Object.keys(runtime.gen_data).length, original.size + manifest.summary.tables + Object.keys(manifest.aliases).length);
  assert.equal(runtime.generate_text, generate);
  for (const [identifier, value] of original) assert.equal(runtime.gen_data[identifier], value, identifier);
  let blocked = 0;
  for (const table of runtime.WikiImport.metadata.values()) {
    if (table.status === 'blocked') {
      blocked += 1;
      assert.doesNotMatch(runtime.generate_text(table.id), /[{}<>]/);
    } else {
      assert.deepEqual(Array.from(table.dependencies), [...new Set(table.entries.filter(entry => entry.weight > 0).flatMap(entry => Array.from(entry.references)))]);
      for (const dependency of table.dependencies) assert.equal(runtime.WikiImport.metadata.get(dependency)?.status, 'ready', table.name);
    }
  }
  assert.equal(blocked, manifest.summary.blocked);
});