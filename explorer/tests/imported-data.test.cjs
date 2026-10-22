const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { reviewedCorrections, reviewedSourceCorrections, reviewedRecursionPolicies } = require('../tools/import-abulafia.cjs');

const repo = path.join(__dirname, '..', '..');
const read = relative => fs.readFileSync(path.join(repo, relative), 'utf8');

test('the catalog includes the complete pinned current corpus with quarantine preserved', () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  assert.equal(manifest.selection, 'all-current-with-history');
  assert.equal(manifest.summary.tables, 32255);
  assert.equal(manifest.summary.currentTables, 26156);
  assert.equal(manifest.summary.historicalTables, 6099);
  assert.equal(manifest.summary.pages, 1638);
  assert.equal(manifest.summary.sourceArchives, 2170);
  assert.equal(manifest.summary.contributors, 275);
  assert.equal(manifest.summary.ready, 25716);
  assert.equal(manifest.summary.blocked, 6539);
  assert.equal(manifest.summary.entries, 590941);
  const current = manifest.tables.filter(table => !table.historical);
  const historical = manifest.tables.filter(table => table.historical);
  assert.equal(current.length, 26156);
  assert.equal(current.filter(table => table.status === 'ready').length, 21223);
  assert.equal(current.filter(table => table.status === 'blocked').length, 4933);
  assert.equal(historical.filter(table => table.status === 'ready').length, 4493);
  assert.equal(historical.filter(table => table.status === 'blocked').length, 1606);
});

test('historical recovery retains exact source bindings and independently reviewed renamed-leaf evidence', () => {
  const digest = content => crypto.createHash('sha256').update(content).digest('hex');
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const configuration = JSON.parse(read('explorer/tools/historical-recovery.json'));
  assert.equal(manifest.recovery.configurationSha256, digest(JSON.stringify(configuration)));
  assert.equal(configuration.targets.length, 129);
  assert.equal(configuration.referenceRenames.length, 12);
  const tables = new Map(manifest.tables.map(table => [table.id, table]));
  const names = new Map(manifest.tables.map(table => [table.name, table]));
  const archives = new Map();
  function original(table) {
    if (!archives.has(table.archiveFile)) archives.set(table.archiveFile, JSON.parse(read(table.archiveFile)));
    return archives.get(table.archiveFile).tables.find(snapshot => snapshot.current.sourceFile === table.sourceFile).current.table;
  }
  for (const target of configuration.targets) {
    const table = names.get(target.name);
    assert.equal(table.sourceFile, target.sourceFile);
    assert.equal(table.sourceHash, target.sourceHash);
    assert.equal(table.historical.absentSourceHash, target.absentSourceHash);
    assert.equal(table.historical.basis, 'latest-retained-definition');
    assert.match(table.archiveFile, /^tables\/abulafia\/source\/historical\//);
  }
  assert.equal(manifest.tables.filter(table => table.historical?.basis === 'verified-xml-definition').length, 43);
  assert.equal(digest(read(configuration.xml.file)), configuration.xml.sha256);
  for (const correction of configuration.referenceRenames) {
    const source = tables.get(correction.tableId);
    const target = tables.get(correction.targetId);
    const definitionBytes = read(correction.definition.sourceFile);
    const definition = JSON.parse(definitionBytes);
    assert.equal(digest(definitionBytes), correction.definition.sourceHash);
    assert.equal(source.sourceHash, correction.sourceHash);
    assert.equal(target.sourceHash, correction.targetSourceHash);
    assert.equal(definition.subtable.qualified_name, correction.from);
    assert.equal(definition.page.page_id, original(target).page.page_id);
    assert.equal(definition.raw_source, original(target).raw_source);
    assert.equal(target.status, 'ready');
    assert.ok(source.referenceRenames.some(rule => rule.raw === correction.raw && rule.row === correction.row && rule.to === correction.to));
    const entry = original(source).entries[correction.row - 1];
    assert.equal(digest(entry.text), correction.entryHash);
    assert.equal(entry.weight, correction.weight);
  }
});

test('source extraction repairs retain approved raw rows, warnings, and correction evidence', () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const tables = new Map(manifest.tables.map(table => [table.name, table]));
  const configuration = JSON.parse(read('explorer/tools/source-extraction-corrections.json'));
  const corrections = reviewedSourceCorrections(configuration, manifest);
  assert.equal(configuration.corrections.length, 2);
  assert.equal(configuration.followUpBatches.length, 1);
  assert.equal(corrections.length, 3);
  const names = ['ODnD Wilderness Encounter Cruncher.lair35', 'The Blues Engine.interjection'];
  for (const name of names) {
    const table = tables.get(name);
    assert.equal(table.status, 'ready', name);
    assert.equal(table.sourceCorrections.length, 1, name);
    const correction = table.sourceCorrections[0];
    assert.deepEqual(correction, corrections.find(record => record.tableId === table.id));
    assert.equal(correction.sourceFile, table.sourceFile);
    assert.equal(correction.sourceHash, table.sourceHash);
    const archive = JSON.parse(read(table.archiveFile));
    const original = archive.tables.find(record => record.current.sourceFile === table.sourceFile).current.table;
    assert.equal(crypto.createHash('sha256').update(original.raw_source).digest('hex'), correction.rawSourceHash);
    const lines = original.raw_source.split('\n');
    if (correction.kind === 'recover-empty-semicolon-table') {
      assert.equal(original.entries.length, 0);
      assert.equal(table.totalWeight, 20);
      assert.deepEqual(correction.rows.map(row => row.weight), [7, 13]);
      for (const row of correction.rows) {
        assert.equal(lines[row.line - 1], row.raw);
        assert.ok(original.warnings.includes(row.warning));
      }
    } else {
      assert.equal(original.entries.length, 1);
      assert.equal(original.entries[0].text, '[ij],');
      assert.equal(lines[correction.line - 1], '1,[ij], ');
      assert.equal(lines[correction.noteLine - 1], correction.note);
      assert.ok(original.warnings.includes(correction.warning));
    }
  }
  const descriptor = tables.get('Secret Society Title.TitleDescriptor');
  const correction = corrections.find(record => record.tableId === descriptor.id);
  assert.equal(correction.kind, 'repair-extra-self-reference-bracket');
  assert.deepEqual(descriptor.sourceCorrections, [correction]);
  assert.equal(descriptor.status, 'ready');
  assert.ok(descriptor.dependencies.includes(descriptor.id));
  assert.deepEqual(descriptor.recursion, { kind: 'bounded-wrapper', row: 1, maxDepth: 1 });
  assert.deepEqual(descriptor.issues, []);
  assert.ok(!descriptor.issues.some(issue => issue.code === 'unsupported_syntax'));
  const original = JSON.parse(read(descriptor.archiveFile)).tables.find(record => record.current.sourceFile === descriptor.sourceFile).current.table;
  assert.equal(original.raw_source.split('\n')[correction.line - 1], '10,Most [TitleDescriptor]]');
  assert.equal(original.entries[correction.row - 1].text, 'Most [TitleDescriptor]]');
  assert.equal(original.entries[correction.row - 1].weight, 10);
  assert.deepEqual(original.entries[correction.row - 1].references, []);
  assert.equal(crypto.createHash('sha256').update(original.raw_source).digest('hex'), correction.rawSourceHash);
  assert.equal(crypto.createHash('sha256').update(original.entries[correction.row - 1].text).digest('hex'), correction.entryHash);
  assert.equal(manifest.tables.filter(table => table.sourceCorrections).length, 3);
});

test('eligible follow-up case references use their reviewed ready targets', () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const tables = new Map(manifest.tables.map(table => [table.name, table]));
  for (const name of ['Secret Society Title.Noun', 'Wild West Personas.colors']) {
    assert.equal(tables.get(name).status, 'ready', name);
  }
  assert.equal(tables.get('Star Wars Plot Generator.contact').status, 'blocked');
  for (const [name, targetName] of [
    ['Secret Society Title.Noun', 'Animal.Weirdsymbol'],
    ['Wild West Personas.colors', 'Simple Colors.SCAN'],
    ['Star Wars Plot Generator.contact', 'Star Wars Random NPC.DroidName']
  ]) {
    const source = tables.get(name);
    const target = tables.get(targetName);
    assert.equal(target.status, 'ready', targetName);
    assert.ok(source.dependencies.includes(target.id), name);
    assert.ok(source.referenceCorrections.some(correction => correction.to === targetName), name);
  }
});

test('reviewed case corrections retain exact source bindings and ready target identities in the catalog', () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const batch = JSON.parse(read('explorer/tools/case-reference-corrections.json'));
  const tables = new Map(manifest.tables.map(table => [table.id, table]));
  const archives = new Map();
  const corrections = reviewedCorrections(batch, manifest);
  assert.equal(batch.commit, manifest.commit);
  assert.equal(batch.corrections.length, 363);
  assert.equal(new Set(batch.corrections.map(correction => correction.tableId)).size, 196);
  assert.equal(batch.followUpBatches.length, 1);
  assert.equal(corrections.length, 366);
  assert.equal(new Set(corrections.map(correction => correction.tableId)).size, 199);
  const recoveryBatch = JSON.parse(read('explorer/tools/recovery-case-corrections.json'));
  const recoveryCorrections = reviewedCorrections(recoveryBatch, manifest, { selection: manifest.selection });
  assert.equal(recoveryBatch.basis.candidateComponents, 39);
  assert.equal(recoveryBatch.basis.missingTargetNames, 34);
  assert.equal(recoveryBatch.corrections.length, 71);
  assert.equal(recoveryBatch.followUpBatches.length, 1);
  assert.equal(recoveryBatch.followUpBatches[0].basis.candidateComponents, 2);
  assert.equal(recoveryBatch.followUpBatches[0].basis.missingTargetNames, 4);
  assert.equal(recoveryBatch.followUpBatches[0].corrections.length, 19);
  assert.equal(recoveryCorrections.length, 90);
  const recoveredSources = [...new Set(recoveryCorrections.map(correction => correction.tableId))].map(id => tables.get(id));
  assert.equal(recoveredSources.filter(table => table.historical).length, 39);
  assert.equal(recoveredSources.filter(table => !table.historical).length, 2);
  assert.equal(recoveredSources.filter(table => table.status === 'ready').length, 30);
  assert.equal(recoveredSources.filter(table => table.status === 'blocked').length, 11);
  assert.equal(manifest.tables.filter(table => table.referenceCorrections).length, 648);
  for (const correction of [...corrections, ...recoveryCorrections]) {
    const source = tables.get(correction.tableId);
    const target = tables.get(correction.targetId);
    assert.equal(source.sourceFile, correction.sourceFile);
    assert.equal(source.sourceHash, correction.sourceHash);
    assert.equal(target.name, correction.to);
    assert.equal(target.sourceHash, correction.targetSourceHash);
    assert.equal(target.status, 'ready');
    assert.ok(source.dependencies.includes(target.id));
    assert.ok(source.referenceCorrections.some(record => JSON.stringify(record) === JSON.stringify(correction)));
    if (!archives.has(source.archiveFile)) archives.set(source.archiveFile, JSON.parse(read(source.archiveFile)));
    const original = archives.get(source.archiveFile).tables.find(record => record.current.sourceFile === source.sourceFile).current.table;
    const entry = original.entries[correction.row - 1];
    assert.equal(crypto.createHash('sha256').update(entry.text).digest('hex'), correction.entryHash);
    assert.equal(entry.weight, correction.weight);
    assert.ok(entry.text.includes(correction.raw));
    const references = entry.references.filter(reference => reference.raw === correction.raw);
    assert.equal(references.length, correction.referenceCount);
    assert.ok(references.every(reference => reference.target_qualified_name === correction.from));
  }
});

test('complete case approvals bind every corrected row without changing source weights or target identities', () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const configuration = JSON.parse(read('explorer/tools/all-case-reference-corrections.json'));
  const corrections = reviewedCorrections(configuration, manifest, { selection: manifest.selection });
  const tables = new Map(manifest.tables.map(table => [table.id, table]));
  const folded = new Map();
  for (const table of manifest.tables) {
    const key = table.name.toLowerCase();
    if (!folded.has(key)) folded.set(key, []);
    folded.get(key).push(table);
  }
  const archives = new Map();
  assert.equal(corrections.length, 1438);
  assert.equal(new Set(corrections.map(rule => rule.tableId)).size, 408);
  assert.equal(corrections.filter(rule => rule.from === rule.to).length, 823);
  assert.equal(corrections.filter(rule => rule.weight === 0).length, 2);
  assert.equal(corrections.filter(rule => rule.pageAlias).length, 3);
  assert.equal(manifest.summary.ready, 25716);
  assert.equal(manifest.summary.blocked, 6539);
  let exactSubtablePageCases = 0;
  let stillBlockedTargets = 0;
  for (const correction of corrections) {
    const source = tables.get(correction.tableId);
    const target = tables.get(correction.targetId);
    assert.equal(source.sourceFile, correction.sourceFile);
    assert.equal(source.sourceHash, correction.sourceHash);
    assert.equal(target.name, correction.to);
    assert.equal(target.sourceHash, correction.targetSourceHash);
    assert.equal(correction.from.toLowerCase(), correction.to.toLowerCase());
    assert.ok(source.referenceCorrections.some(rule => JSON.stringify(rule) === JSON.stringify(correction)));
    if (!archives.has(source.archiveFile)) archives.set(source.archiveFile, JSON.parse(read(source.archiveFile)));
    const original = archives.get(source.archiveFile).tables.find(snapshot => snapshot.current.sourceFile === source.sourceFile).current.table;
    const entry = original.entries[correction.row - 1];
    assert.equal(crypto.createHash('sha256').update(entry.text).digest('hex'), correction.entryHash);
    assert.equal(entry.weight, correction.weight);
    assert.ok(entry.text.includes(correction.raw));
    const references = entry.references.filter(reference => reference.raw === correction.raw);
    assert.equal(references.length, correction.referenceCount);
    assert.ok(references.every(reference => reference.target_qualified_name === correction.from));
    if (folded.get(correction.to.toLowerCase()).length > 1) {
      const subtable = Buffer.from(target.id.split('_').at(-1), 'hex').toString('utf8');
      assert.equal(correction.from, correction.to);
      assert.ok(references.every(reference => reference.target_page === target.page && reference.target_subtable === subtable &&
        reference.token.endsWith(`.${subtable}`) && reference.token.slice(0, -subtable.length - 1).toLowerCase() === target.page.toLowerCase()));
      exactSubtablePageCases += 1;
    }
    if (correction.weight > 0) {
      assert.ok(source.dependencies.includes(target.id));
      if (target.status === 'blocked') {
        assert.equal(source.status, 'blocked');
        stillBlockedTargets += 1;
      }
    }
  }
  assert.equal(exactSubtablePageCases, 2);
  assert.ok(stillBlockedTargets > 0);
});

test('bounded recursion approval preserves exact original table evidence', () => {
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const policies = reviewedRecursionPolicies(JSON.parse(read('explorer/tools/recursion-policies.json')), manifest);
  const tables = new Map(manifest.tables.map(table => [table.id, table]));
  const digest = value => crypto.createHash('sha256').update(value).digest('hex');
  assert.equal(policies.length, 2);
  assert.equal(manifest.tables.filter(table => table.recursion).length, 2);
  for (const policy of policies) {
    const table = tables.get(policy.tableId);
    assert.equal(table.status, 'ready');
    assert.equal(table.execution, 'wiki');
    assert.deepEqual(table.recursionApproval, policy);
    assert.deepEqual(table.recursion, { kind: policy.kind, row: policy.row, maxDepth: 1 });
    assert.ok(table.dependencies.includes(table.id));
    const source = JSON.parse(read(table.archiveFile)).tables.find(snapshot => snapshot.current.sourceFile === policy.sourceFile).current;
    const entry = source.table.entries[policy.row - 1];
    assert.equal(source.sourceHash, policy.sourceHash);
    assert.equal(digest(source.table.raw_source), policy.rawSourceHash);
    assert.equal(source.table.raw_source.split('\n')[policy.line - 1], policy.raw);
    assert.equal(entry.raw_text, policy.raw);
    assert.equal(entry.weight, policy.weight);
    assert.equal(digest(entry.text), policy.entryHash);
  }
});

test('recursion-aware macro recovery preserves the prior catalog and enables exactly the audited tables', () => {
  const digest = content => crypto.createHash('sha256').update(content).digest('hex');
  const manifest = JSON.parse(read('tables/abulafia/manifest.json'));
  const audit = JSON.parse(read('Docs/recursion-macro-2026-09-08/recovery-report.json'));
  const acceptance = JSON.parse(read('Docs/recursion-macro-2026-09-08/roll-acceptance.json'));
  const tables = new Map(manifest.tables.map(table => [table.id, table]));
  assert.equal(audit.nextManifestSha256, digest(read('tables/abulafia/manifest.json')));
  assert.equal(audit.preservedReadyBehavior, 25647);
  assert.equal(audit.preservedArchives, 2170);
  assert.equal(audit.promoted.length, 69);
  assert.equal(audit.promoted.filter(table => table.historical).length, 7);
  assert.equal(audit.current.ready - audit.previous.ready, 69);
  assert.deepEqual(audit.changed.map(change => change.file).sort(), ['explorer/abulafia-catalog.js', 'tables/abulafia/manifest.json']);
  for (const [file, expected] of Object.entries({ ...audit.protectedFileHashes, ...audit.codeHashes })) assert.equal(digest(read(file)), expected, file);
  for (const promotion of audit.promoted) {
    const table = tables.get(promotion.id);
    assert.equal(table.name, promotion.name);
    assert.equal(table.status, 'ready', table.name);
    assert.equal(table.execution, 'wiki', table.name);
    assert.deepEqual(table.issues, [], table.name);
  }
  assert.ok(audit.promoted.some(table => table.name === 'Secret Society Title.main'));
  assert.equal(acceptance.manifestSha256, audit.nextManifestSha256);
  assert.equal(acceptance.summary.tables, 69);
  assert.equal(acceptance.summary.choices, 373);
  assert.equal(acceptance.summary.rolls, 1119);
  assert.equal(acceptance.summary.warnings, 0);
  assert.equal(acceptance.summary.emptyResults, 25);
  assert.ok(acceptance.tables.find(table => table.name === 'Secret Society Title.main').policySteps > 0);
  assert.equal(acceptance.atlas.unresolvedTargets, 842);
});

test('published reports bind every reviewed policy and contain no remaining case-only reference candidates', () => {
  const digest = content => crypto.createHash('sha256').update(content).digest('hex');
  const manifestHash = digest(read('tables/abulafia/manifest.json'));
  const inventory = JSON.parse(read('Docs/macro-inventory.json'));
  const quarantine = JSON.parse(read('Docs/quarantine-report.json'));
  assert.equal(inventory.provenance.manifestSha256, manifestHash);
  assert.equal(quarantine.provenance.manifestSha256, manifestHash);
  assert.equal(quarantine.caseCorrectionBatch.rootIds.length, 0);
  assert.equal(quarantine.caseCorrectionBatch.targets.length, 0);
  assert.equal(quarantine.caseCorrectionBatch.conditionalRecovery, 0);
  const references = JSON.parse(read('Docs/missing-unresolved-references.json'));
  assert.equal(references.provenance.manifestSha256, manifestHash);
  assert.equal(references.provenance.quarantineReportSha256, digest(read('Docs/quarantine-report.json')));
  assert.equal(references.summary.targets, 842);
  assert.equal(references.summary.classificationCounts['unique-case-ready'] || 0, 0);
  assert.equal(references.summary.classificationCounts['unique-case-blocked'] || 0, 0);
  assert.equal(references.summary.classificationCounts['ambiguous-case'] || 0, 0);
  assert.equal(inventory.provenance.compilerSha256, digest(read('explorer/tools/import-abulafia.cjs')));
  for (const file of ['explorer/tools/case-reference-corrections.json', 'explorer/tools/recovery-case-corrections.json',
    'explorer/tools/all-case-reference-corrections.json',
    'explorer/tools/source-extraction-corrections.json', 'explorer/tools/historical-recovery.json',
    'explorer/tools/recursion-policies.json', 'JS/wiki-recursion.js']) {
    assert.equal(inventory.provenance.supportFileHashes[file], digest(read(file)), file);
    assert.equal(quarantine.provenance.inputHashes[file], digest(read(file)), file);
  }
  assert.equal(quarantine.provenance.inputHashes['Docs/macro-inventory.json'], digest(read('Docs/macro-inventory.json')));
});

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
  for (const source of ['JS/generator.js', 'explorer/vendor/jsep.iife.min.js', 'JS/wiki-template-data.js', 'JS/wiki-expressions.js', 'JS/wiki-recursion.js', 'JS/wiki-import.js', 'explorer/model.js', ...scripts]) {
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
  const descriptor = byName.get('Secret Society Title.TitleDescriptor');
  assert.equal(descriptor.entries[0].rawText, 'Most [TitleDescriptor]]');
  assert.equal(descriptor.entries[0].text, `Most {${descriptor.id}}`);
  assert.equal(descriptor.entries[0].weight, 10);
  assert.deepEqual(Array.from(runtime.gen_data[descriptor.id]), [`[Wiki table requires Table Atlas: ${descriptor.name}]`]);
  const descriptorResult = runtime.TableAtlas.roll(descriptor.id, runtime);
  assert.equal(descriptorResult.warnings.length, 0);
  assert.doesNotMatch(descriptorResult.text, /Most\s+Most/);
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
  const lair = byName.get('ODnD Wilderness Encounter Cruncher.lair35');
  assert.equal(lair.status, 'ready');
  assert.deepEqual(Array.from(lair.entries, entry => [entry.weight, entry.rawText, entry.rawSourceLine]), [[7, '7;(in lair)', 2], [13, '13;(not in lair)', 3]]);
  const lairOutcomes = {};
  for (let side = 0; side < 20; side += 1) {
    const text = rollWithSamples(lair.id, [(side + 0.5) / 20]);
    lairOutcomes[text] = (lairOutcomes[text] || 0) + 1;
  }
  assert.deepEqual(lairOutcomes, { '(in lair)': 7, '(not in lair)': 13 });
  const interjection = byName.get('The Blues Engine.interjection');
  assert.equal(interjection.entries[0].rawText, '[ij],');
  assert.ok(interjection.entries[0].text.endsWith(', '));
  assert.equal(rollWithSamples(interjection.id, [0, 0]), 'I said, ');
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
  for (const name of ['Fantasy Names.StartFemNoTitle', 'Animal.Weirdsymbol', 'SGNP 1001 nights.cities', 'Angel generator.main',
    'Secret Society Title.Noun', 'Wild West Personas.colors', 'Fantasy Landmarks.inspiration', 'Artwork.\uD83D\uDCDC' + 'River',
    'The Blues Engine.ain', 'ODnD Wilderness Encounter Cruncher.Dragon']) {
    const table = byName.get(name);
    assert.equal(table.status, 'ready', name);
    for (const correction of table.referenceCorrections || []) {
      assert.ok(table.entries[correction.row - 1].rawText.includes(correction.raw));
      assert.ok(table.entries[correction.row - 1].references.includes(correction.targetId));
    }
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
  const accessory = byName.get('Wild West Personas.accessory');
  assert.equal(accessory.status, 'ready');
  assert.equal(accessory.entries[0].rawText, '');
  assert.equal(accessory.entries[0].weight, 3);
  assert.equal(accessory.totalWeight, 11);
  assert.equal(runtime.gen_data[accessory.id]['1-3'], '');
  let noAccessory = 0;
  for (let side = 0; side < 11; side += 1) {
    const text = rollWithSamples(accessory.id, [(side + 0.5) / 11, ...Array(512).fill(0.5)]);
    if (text === '') noAccessory += 1;
  }
  assert.equal(noAccessory, 3, 'Optional empty outcomes must retain their original probability');
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