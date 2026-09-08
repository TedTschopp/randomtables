const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { buildArtifacts, compileImport, corpusFingerprint, loadCorpus, loadRecoveryCorpus, originalAttribution, planHistoricalImport, planImport, reviewedCorrections, reviewedSourceCorrections, tableId, writeArtifacts } = require('../tools/import-abulafia.cjs');

function record(pageId, pageTitle, name, contributor, originalContributor, targets = []) {
  return {
    sourceFile: `tables/${pageId}/subtables/${name}/table.json`,
    originalContributor: { name: originalContributor },
    originalSourceFile: `tables/${pageId}/subtables/${name}/history/first/table.json`,
    table: {
      page: { page_id: pageId, title: pageTitle },
      subtable: { name, qualified_name: `${pageTitle}.${name}` },
      source: { contributor: { name: contributor } },
      entries: [{
        weight: 1,
        text: targets.map(target => `[${target}]`).join(' ') || 'Result',
        references: targets.map(target => ({
          raw: `[${target}]`, token: target, kind: 'cross_page', target_qualified_name: target
        }))
      }],
      dependencies: { unresolved: [] },
      warnings: []
    }
  };
}

test('all-current selection includes disconnected contributors without changing seed selection or readiness guards', () => {
  const selected = record(71, 'Selected', 'main', 'Editor', 'Creator', ['Shared.main']);
  const shared = record(72, 'Shared', 'main', 'Other editor', 'Other creator');
  const disconnected = record(73, 'Disconnected', 'main', 'New editor', 'New creator');
  const companion = record(74, 'Companion', 'main', 'New creator', 'Earlier creator');
  const unattributed = record(75, 'Unattributed', 'main', null, null);
  disconnected.table.entries = [];
  const records = [selected, shared, disconnected, companion, unattributed];
  const before = JSON.stringify(records);
  const legacy = planImport(records, ['Selected.main']);
  assert.deepEqual(legacy.records.map(item => item.table.subtable.qualified_name), ['Selected.main', 'Shared.main']);
  const complete = planImport(records, ['Selected.main'], { allCurrent: true });
  assert.equal(complete.records.length, records.length);
  assert.equal(complete.selection, 'all-current');
  assert.ok(complete.contributors.some(contributor => contributor.name === 'Earlier creator'));
  const baseline = compileImport(legacy);
  const bundle = compileImport(complete);
  for (const table of baseline.tables) assert.deepEqual(bundle.tables.find(candidate => candidate.id === table.id), table);
  assert.equal(bundle.tables.find(table => table.name === 'Disconnected.main').status, 'blocked');
  const artifacts = buildArtifacts(complete, bundle, { repository: 'fixture', commit: 'fixed' }, ['Selected.main']);
  assert.equal(JSON.parse(artifacts.get('tables/abulafia/manifest.json')).selection, 'all-current');
  assert.throws(() => planImport([...records, selected], ['Selected.main'], { allCurrent: true }), /duplicate/i);
  assert.throws(() => planImport(records, ['Missing.main'], { allCurrent: true }), /seed/i);
  assert.throws(() => planImport(records, ['Selected.main'], { allCurrent: 'yes' }), /allCurrent/i);
  assert.equal(JSON.stringify(records), before);
});

function caseCorrection(source, target, row = 1) {
  const digest = value => crypto.createHash('sha256').update(value).digest('hex');
  source.sourceHash ||= digest(JSON.stringify(source.table));
  target.sourceHash ||= digest(JSON.stringify(target.table));
  const entry = source.table.entries[row - 1];
  const reference = entry.references[0];
  return {
    tableId: tableId(source.table), sourceFile: source.sourceFile, sourceHash: source.sourceHash,
    row, entryHash: digest(entry.text), weight: entry.weight, raw: reference.raw,
    from: reference.target_qualified_name, to: target.table.subtable.qualified_name,
    targetId: tableId(target.table), targetSourceHash: target.sourceHash,
    referenceCount: entry.references.filter(item => item.raw === reference.raw).length
  };
}

function sourceRecoveryFixtures() {
  const digest = value => crypto.createHash('sha256').update(value).digest('hex');
  const lair = record(99, 'Recovered', 'lair35', 'Editor', 'Creator');
  lair.table.subtable.line_number = 100;
  lair.table.entries = [];
  lair.table.raw_source = ';lair35\n7;(in lair)\n13;(not in lair)';
  lair.table.warnings = [
    'Line 101: preserved nonstandard row before first entry: 7;(in lair)',
    'Line 102: preserved nonstandard row before first entry: 13;(not in lair)'
  ];
  const interjection = record(99, 'Recovered', 'interjection', 'Editor', 'Creator', ['Recovered.choices']);
  interjection.table.subtable.line_number = 200;
  interjection.table.entries[0].text = '[Recovered.choices],';
  interjection.table.entries[0].raw_text = '1,[Recovered.choices], ';
  interjection.table.raw_source = ';interjection\n0 NOTE: trailing spc!\n1,[Recovered.choices], ';
  interjection.table.warnings = ['Line 201: preserved nonstandard row before first entry: 0 NOTE: trailing spc!'];
  const choices = record(99, 'Recovered', 'choices', 'Editor', 'Creator');
  choices.table.entries[0].text = 'I said';
  function correction(source, kind, details) {
    source.sourceHash = digest(JSON.stringify(source.table));
    return { tableId: tableId(source.table), sourceFile: source.sourceFile, sourceHash: source.sourceHash,
      rawSourceHash: digest(source.table.raw_source), kind, ...details };
  }
  const lairCorrection = correction(lair, 'recover-empty-semicolon-table', { rows: [
    { line: 2, raw: '7;(in lair)', weight: 7, text: '(in lair)', warning: lair.table.warnings[0] },
    { line: 3, raw: '13;(not in lair)', weight: 13, text: '(not in lair)', warning: lair.table.warnings[1] }
  ] });
  const spacingCorrection = correction(interjection, 'restore-trailing-space', {
    row: 1, line: 3, raw: '1,[Recovered.choices], ', weight: 1, entryHash: digest(interjection.table.entries[0].text),
    noteLine: 2, note: '0 NOTE: trailing spc!', warning: interjection.table.warnings[0]
  });
  return { lair, interjection, choices, lairCorrection, spacingCorrection };
}

test('source recovery restores only approved literal rows with exact original weights and archive evidence', () => {
  const { lair, interjection, choices, lairCorrection } = sourceRecoveryFixtures();
  const plan = planImport([lair, interjection, choices], ['Recovered.lair35']);
  const before = JSON.stringify(plan);
  const baseline = compileImport(plan);
  const bundle = compileImport(plan, { sourceCorrections: [lairCorrection] });
  const table = bundle.tables.find(table => table.name === 'Recovered.lair35');
  assert.equal(table.status, 'ready', JSON.stringify(table.issues));
  assert.deepEqual(table.values, { '1-7': '(in lair)', '8-20': '(not in lair)' });
  assert.equal(table.totalWeight, 20);
  assert.deepEqual(table.entries.map(entry => [entry.rawText, entry.rawSourceLine]), [['7;(in lair)', 2], ['13;(not in lair)', 3]]);
  assert.deepEqual(table.sourceCorrections, [lairCorrection]);
  assert.equal(bundle.tables.find(table => table.name === 'Recovered.interjection').status, 'blocked');
  const provenance = { repository: 'fixture', commit: 'fixed' };
  const artifacts = buildArtifacts(plan, bundle, provenance);
  assert.equal(artifacts.get('tables/abulafia/source/99.json'), buildArtifacts(plan, baseline, provenance).get('tables/abulafia/source/99.json'));
  const runtime = vm.createContext({});
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), runtime);
  runtime.WikiImport.register(bundle);
  const outcomes = {};
  for (let side = 0; side < 20; side += 1) {
    vm.runInContext(`Math.random = () => ${(side + 0.5) / 20};`, runtime);
    const result = runtime.WikiImport.roll(table.id);
    assert.equal(result.warnings.length, 0);
    outcomes[result.text] = (outcomes[result.text] || 0) + 1;
  }
  assert.deepEqual(outcomes, { '(in lair)': 7, '(not in lair)': 13 });
  assert.equal(JSON.stringify(plan), before);
});

test('source recovery restores a documented trailing space without changing existing parsed row evidence', () => {
  const { interjection, choices, spacingCorrection } = sourceRecoveryFixtures();
  const parent = record(99, 'Recovered', 'Parent', 'Editor', 'Creator', ['Recovered.interjection']);
  parent.table.entries[0].text = '[Recovered.interjection]next';
  const plan = planImport([interjection, choices, parent], ['Recovered.interjection']);
  const before = JSON.stringify(plan);
  const baseline = compileImport(plan);
  const bundle = compileImport(plan, { sourceCorrections: [spacingCorrection] });
  const table = bundle.tables.find(table => table.name === 'Recovered.interjection');
  assert.equal(table.status, 'ready', JSON.stringify(table.issues));
  assert.equal(table.entries[0].rawText, '[Recovered.choices],');
  assert.equal(table.entries[0].text, `{${tableId(choices.table)}}, `);
  assert.equal(table.entries[0].weight, 1);
  assert.deepEqual(table.sourceCorrections, [spacingCorrection]);
  const runtime = vm.createContext({});
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), runtime);
  runtime.WikiImport.register(bundle);
  assert.equal(runtime.WikiImport.roll(tableId(parent.table)).text, 'I said, next');
  const provenance = { repository: 'fixture', commit: 'fixed' };
  assert.equal(buildArtifacts(plan, bundle, provenance).get('tables/abulafia/source/99.json'), buildArtifacts(plan, baseline, provenance).get('tables/abulafia/source/99.json'));
  assert.deepEqual(bundle.tables.find(table => table.id === tableId(choices.table)), baseline.tables.find(table => table.id === tableId(choices.table)));
  assert.equal(JSON.stringify(plan), before);
});

test('source recovery rejects stale bindings, changed probabilities, incomplete rows, and unrecorded whitespace', () => {
  const { lair, interjection, choices, lairCorrection, spacingCorrection } = sourceRecoveryFixtures();
  const plan = planImport([lair, interjection, choices], ['Recovered.lair35']);
  const invalidLair = [
    { tableId: 'outside' }, { sourceFile: 'other.json' }, { sourceHash: '0'.repeat(64) }, { rawSourceHash: '0'.repeat(64) },
    { kind: 'accept-all-warnings' }, { extra: true }, { rows: [] }, { rows: lairCorrection.rows.slice(0, 1) },
    ...[{ weight: 0 }, { weight: 8 }, { weight: 7.5 }, { text: 'replacement' }, { text: '[Other.main]' },
      { line: 3 }, { raw: '7,(in lair)' }, { warning: 'Other warning' }, { extra: true }].map(change => ({
      rows: [{ ...lairCorrection.rows[0], ...change }, lairCorrection.rows[1]]
    }))
  ];
  for (const change of invalidLair) assert.throws(() => compileImport(plan, { sourceCorrections: [{ ...lairCorrection, ...change }] }), /source correction/i);
  for (const change of [
    { entryHash: '0'.repeat(64) }, { weight: 0 }, { weight: 2 }, { row: 2 }, { line: 2 },
    { raw: '1,[Recovered.choices],  ' }, { noteLine: 3 }, { note: '0 NOTE: other' }, { warning: 'Other warning' }
  ]) assert.throws(() => compileImport(plan, { sourceCorrections: [{ ...spacingCorrection, ...change }] }), /source correction/i);
  for (const corrections of [null, {}, [lairCorrection, lairCorrection], [null]]) {
    assert.throws(() => compileImport(plan, { sourceCorrections: corrections }), /source correction/i);
  }
  lair.table.entries.push({ weight: 1, text: 'Already extracted', references: [] });
  assert.throws(() => compileImport(plan, { sourceCorrections: [lairCorrection] }), /complete empty-table recovery/);
  interjection.table.entries[0].raw_text = '1,[Recovered.choices],';
  assert.throws(() => compileImport(plan, { sourceCorrections: [spacingCorrection] }), /source correction/i);
});

test('source recovery keeps unrelated extraction warnings, missing references, and cyclic tables blocked', () => {
  for (const defect of ['warning', 'missing', 'cycle']) {
    const { interjection, choices, spacingCorrection } = sourceRecoveryFixtures();
    let records = [interjection, choices];
    if (defect === 'warning') interjection.table.warnings.push('Separate unresolved extraction warning');
    if (defect === 'missing') records = [interjection];
    if (defect === 'cycle') records[1] = record(99, 'Recovered', 'choices', 'Editor', 'Creator', ['Recovered.interjection']);
    const plan = planImport(records, ['Recovered.interjection']);
    const bundle = compileImport(plan, { sourceCorrections: [spacingCorrection], runtimeExpressions: true });
    const compiled = bundle.tables.find(table => table.id === spacingCorrection.tableId);
    assert.equal(compiled.status, 'blocked', defect);
    const expected = { warning: 'source_warning', missing: 'missing_reference', cycle: 'cycle' }[defect];
    assert.ok(bundle.tables.some(table => table.issues.some(issue => issue.code === expected)), defect);
  }
});

test('source correction approval binds the source revision, report hashes, and exact selected scope', () => {
  const { lairCorrection, spacingCorrection } = sourceRecoveryFixtures();
  const provenance = { repository: 'fixture', commit: 'a'.repeat(40) };
  const basis = { candidateComponents: 2, reportSha256: 'b'.repeat(64), manifestSha256: 'c'.repeat(64), conditionalEstimate: 31 };
  const configuration = { schemaVersion: 1, ...provenance, basis, corrections: [lairCorrection, spacingCorrection] };
  const before = JSON.stringify(configuration);
  assert.deepEqual(reviewedSourceCorrections(configuration, provenance), configuration.corrections);
  assert.equal(JSON.stringify(configuration), before);
  for (const change of [
    { schemaVersion: 2 }, { repository: 'other' }, { commit: 'd'.repeat(40) }, { corrections: [] },
    { corrections: [null, spacingCorrection] }, { corrections: [lairCorrection, lairCorrection] },
    { basis: { ...basis, candidateComponents: 1 } }, { basis: { ...basis, reportSha256: 'stale' } },
    { basis: { ...basis, manifestSha256: 'stale' } }, { basis: { ...basis, conditionalEstimate: -1 } }
  ]) assert.throws(() => reviewedSourceCorrections({ ...configuration, ...change }, provenance), /source correction batch/i);
});

test('reviewed follow-up batches retain independent scope and source revision guards', () => {
  const source = record(93, 'Batches', 'main', 'Editor', 'Creator', ['Batches.choices']);
  const target = record(93, 'Batches', 'Choices', 'Editor', 'Creator');
  const parent = record(93, 'Batches', 'Parent', 'Editor', 'Creator', ['Batches.Main']);
  const first = caseCorrection(source, target);
  const second = caseCorrection(parent, source);
  const provenance = { repository: 'fixture', commit: 'a'.repeat(40) };
  const basis = { report: 'Docs/quarantine-report.json', reportSha256: 'b'.repeat(64), manifestSha256: 'c'.repeat(64),
    candidateComponents: 1, missingTargetNames: 1, conditionalEstimate: 1 };
  const configuration = { schemaVersion: 1, ...provenance, basis, corrections: [first] };
  assert.deepEqual(reviewedCorrections(configuration, provenance), [first]);
  configuration.followUpBatches = [{ basis: { ...basis, manifestSha256: 'd'.repeat(64) }, corrections: [second] }];
  const before = JSON.stringify(configuration);
  assert.deepEqual(reviewedCorrections(configuration, provenance), [first, second]);
  const plan = planImport([source, target, parent], ['Batches.main']);
  const baseline = compileImport(plan, { referenceCorrections: [first] });
  const bundle = compileImport(plan, { referenceCorrections: reviewedCorrections(configuration, provenance) });
  assert.ok(bundle.tables.every(table => table.status === 'ready'));
  for (const table of baseline.tables.filter(table => table.status === 'ready')) {
    assert.deepEqual(bundle.tables.find(candidate => candidate.id === table.id), table);
  }
  assert.equal(JSON.stringify(configuration), before);
  const invalid = [
    { ...configuration, schemaVersion: 2 }, { ...configuration, commit: 'e'.repeat(40) },
    { ...configuration, repository: 'other' }, { ...configuration, followUpBatches: {} },
    { ...configuration, basis: { ...basis, candidateComponents: 2 } },
    { ...configuration, followUpBatches: [{ basis: { ...basis, missingTargetNames: 2 }, corrections: [second] }] },
    { ...configuration, followUpBatches: [{ basis: { ...basis, reportSha256: 'stale' }, corrections: [second] }] },
    { ...configuration, followUpBatches: [{ basis, corrections: [] }] },
    { ...configuration, followUpBatches: [{ basis, corrections: [null] }] },
    { ...configuration, followUpBatches: [{ basis, corrections: [first] }] },
    { ...configuration, followUpBatches: [{ basis, corrections: [second], followUpBatches: [] }] }
  ];
  for (const candidate of invalid) assert.throws(() => reviewedCorrections(candidate, provenance), /correction batch/i);
});

test('explicit case corrections change only approved selectable references and preserve source evidence', () => {
  const source = record(94, 'Case', 'main', 'Editor', 'Creator', ['Case.choices']);
  source.table.entries[0].weight = 2;
  source.table.entries.push({ ...structuredClone(source.table.entries[0]), weight: 0 });
  const target = record(94, 'Case', 'Choices', 'Editor', 'Creator');
  target.table.entries = [{ weight: 2, text: 'One', references: [] }, { weight: 3, text: 'Two', references: [] }];
  const unapproved = record(94, 'Case', 'Unapproved', 'Editor', 'Creator', ['Case.choices']);
  const correction = caseCorrection(source, target);
  const plan = planImport([source, target, unapproved], ['Case.main']);
  const before = JSON.stringify(plan);
  const baseline = compileImport(plan);
  const bundle = compileImport(plan, { referenceCorrections: [correction] });
  const compiled = bundle.tables.find(table => table.name === 'Case.main');
  assert.equal(compiled.status, 'ready', JSON.stringify(compiled.issues));
  assert.deepEqual(compiled.values, { '1-2': `{${tableId(target.table)}}` });
  assert.equal(compiled.totalWeight, 2);
  assert.equal(compiled.entries[0].rawText, '[Case.choices]');
  assert.equal(compiled.entries[1].text, '[Case.choices]');
  assert.deepEqual(compiled.dependencies, [tableId(target.table)]);
  assert.deepEqual(compiled.referenceCorrections, [correction]);
  assert.equal(bundle.tables.find(table => table.name === 'Case.Unapproved').status, 'blocked');
  assert.deepEqual(bundle.tables.find(table => table.name === 'Case.Choices'), baseline.tables.find(table => table.name === 'Case.Choices'));
  assert.deepEqual(bundle.aliases, {});
  assert.equal(JSON.stringify(plan), before);
});

test('case correction guards reject stale, nonselectable, ambiguous, or unrelated source bindings', () => {
  const source = record(95, 'Guarded', 'main', 'Editor', 'Creator', ['Guarded.choices']);
  const target = record(95, 'Guarded', 'Choices', 'Editor', 'Creator');
  const correction = caseCorrection(source, target);
  const plan = planImport([source, target], ['Guarded.main']);
  for (const change of [
    { sourceHash: '0'.repeat(64) }, { targetSourceHash: '0'.repeat(64) }, { entryHash: '0'.repeat(64) },
    { sourceFile: 'other.json' }, { row: 2 }, { weight: 0 }, { weight: 2 }, { referenceCount: 2 },
    { raw: '[unrecorded]' }, { from: 'Unrelated.choices' }, { from: 'Guarded.Choices' },
    { targetId: 'outside' }, { tableId: 'outside' }, { extra: true }
  ]) assert.throws(() => compileImport(plan, { referenceCorrections: [{ ...correction, ...change }] }), /correction/i, JSON.stringify(change));
  assert.throws(() => compileImport(plan, { referenceCorrections: [correction, correction] }), /Duplicate reference correction/);
  for (const name of ['CHOICES', 'choices']) {
    const collision = record(95, 'Guarded', name, 'Editor', 'Creator');
    const ambiguous = planImport([source, target, collision], ['Guarded.main']);
    assert.throws(() => compileImport(ambiguous, { referenceCorrections: [correction] }), /case-only target/);
  }
  assert.throws(() => compileImport({ ...plan, records: [source] }, { referenceCorrections: [correction] }), /selected import/);
  const unrelated = record(95, 'Guarded', 'Other', 'Editor', 'Creator', ['Guarded.choices']);
  unrelated.table.entries[0].text = '[different]';
  unrelated.table.entries[0].references[0].raw = '[different]';
  unrelated.table.entries[0].references[0].token = 'different';
  const invalid = caseCorrection(unrelated, target);
  assert.throws(() => compileImport(planImport([unrelated, target], ['Guarded.Other']), { referenceCorrections: [invalid] }), /case-only source token/);
});

test('case correction projections support dependent macros while archives and old ready values stay identical', () => {
  const source = record(96, 'Projected', 'main', 'Editor', 'Creator', ['Projected.choices']);
  source.table.dependencies.unresolved = ['Projected.choices'];
  const target = record(96, 'Projected', 'Choices', 'Editor', 'Creator');
  target.table.entries = [{ weight: 2, text: 'apple', references: [] }, { weight: 3, text: 'pear', references: [] }];
  const parent = record(96, 'Projected', 'Parent', 'Editor', 'Creator', ['Projected.main']);
  parent.table.entries[0].text = '{{ucfirst:{{Ia|[Projected.main]}}}}';
  const correction = caseCorrection(source, target);
  const plan = planImport([source, target, parent], ['Projected.main']);
  const before = JSON.stringify(plan);
  const baseline = compileImport(plan, { runtimeExpressions: true });
  const bundle = compileImport(plan, { runtimeExpressions: true, referenceCorrections: [correction] });
  const compiled = bundle.tables.find(table => table.name === 'Projected.Parent');
  assert.equal(compiled.status, 'ready', JSON.stringify(compiled.issues));
  assert.equal(compiled.execution, 'wiki');
  const provenance = { repository: 'fixture', commit: 'fixed' };
  const oldArtifacts = buildArtifacts(plan, baseline, provenance);
  const artifacts = buildArtifacts(plan, bundle, provenance);
  assert.equal(artifacts.get('tables/abulafia/source/96.json'), oldArtifacts.get('tables/abulafia/source/96.json'));
  const metadata = JSON.parse(artifacts.get('tables/abulafia/manifest.json')).tables.find(table => table.name === 'Projected.main');
  assert.deepEqual(metadata.referenceCorrections, [correction]);
  const context = vm.createContext({ WikiExpressions: require('../../JS/wiki-expressions.js') });
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), context);
  context.WikiImport.register(bundle);
  for (const [random, expected] of [[0, 'An apple'], [0.999999, 'A pear']]) {
    vm.runInContext(`Math.random = () => ${random};`, context);
    const result = context.WikiImport.roll(compiled.id);
    assert.equal(result.text, expected);
    assert.deepEqual(Array.from(result.warnings), []);
  }
  assert.deepEqual(bundle.tables.find(table => table.name === 'Projected.Choices'), baseline.tables.find(table => table.name === 'Projected.Choices'));
  assert.equal(JSON.stringify(plan), before);
});

test('case corrections neither clear uncorrected rows nor bypass cyclic dependency guards', () => {
  const source = record(97, 'Partial', 'main', 'Editor', 'Creator', ['Partial.choices']);
  source.table.entries.push(structuredClone(source.table.entries[0]));
  source.table.dependencies.unresolved = ['Partial.choices'];
  const target = record(97, 'Partial', 'Choices', 'Editor', 'Creator');
  const correction = caseCorrection(source, target);
  const plan = planImport([source, target], ['Partial.main']);
  const partial = compileImport(plan, { referenceCorrections: [correction] }).tables.find(table => table.name === 'Partial.main');
  assert.equal(partial.status, 'blocked');
  assert.ok(partial.issues.some(issue => issue.code === 'missing_reference'));
  assert.ok(partial.issues.some(issue => issue.code === 'source_unresolved'));
  const cycleSource = record(98, 'Cycle', 'main', 'Editor', 'Creator', ['Cycle.choices']);
  const cycleTarget = record(98, 'Cycle', 'Choices', 'Editor', 'Creator', ['Cycle.main']);
  const cycleCorrection = caseCorrection(cycleSource, cycleTarget);
  const cyclic = compileImport(planImport([cycleSource, cycleTarget], ['Cycle.main']), { referenceCorrections: [cycleCorrection], runtimeExpressions: true });
  assert.ok(cyclic.tables.every(table => table.status === 'blocked'));
  assert.ok(cyclic.tables.some(table => table.issues.some(issue => issue.code === 'cycle')));
});

test('extended wiki expressions compile nested and repeated macros without changing source weights or classic values', () => {
  const source = record(91, 'Extended', 'main', 'Editor', 'Creator', ['Extended.Choices']);
  source.table.entries[0].text = '{{ucfirst:{{Ia|[Extended.Choices]}}}} / {{#expr:2 + 3 * 4}}';
  source.table.entries[0].weight = 2;
  source.table.entries.push({ weight: 0, text: '{{not implemented}}', references: [] });
  const choices = record(91, 'Extended', 'Choices', 'Editor', 'Creator');
  choices.table.entries = [{ weight: 2, text: 'apple', references: [] }, { weight: 1, text: 'pear', references: [] }];
  const plan = planImport([source, choices], ['Extended.main']);
  const before = JSON.stringify(plan);
  const bundle = compileImport(plan, { runtimeExpressions: true });
  const compiled = bundle.tables.find(table => table.name === 'Extended.main');
  assert.equal(compiled.status, 'ready', JSON.stringify(compiled.issues));
  assert.equal(compiled.execution, 'wiki');
  assert.equal(compiled.totalWeight, 2);
  assert.equal(compiled.program[1], null);
  assert.equal(compiled.program[0][0].args[0][0].op, 'article');
  assert.deepEqual(bundle.tables.find(table => table.name === 'Extended.Choices').values, { '1-2': 'apple', 3: 'pear' });
  assert.equal(JSON.stringify(plan), before);
  const context = vm.createContext({ WikiExpressions: require('../../JS/wiki-expressions.js') });
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), context);
  const generate = context.generate_text;
  context.WikiImport.register(bundle);
  vm.runInContext('Math.random = () => 0;', context);
  const result = context.WikiImport.roll(compiled.id);
  assert.equal(result.text, 'An apple / 14');
  assert.equal(result.warnings.length, 0);
  assert.equal(result.steps.length, 2);
  assert.equal(context.generate_text, generate);
});

test('extended wiki compilation rejects invalid arithmetic, unsafe dynamic arguments, and output expansion', () => {
  for (const text of ['{{#expr:1/0}}', '{{ucfirst:\u00e9clair}}', '{{uc:<b>word</b>}}', '{{uc:one|two}}',
    '{{#replace:' + 'a'.repeat(12000) + '|a|long}}']) {
    const source = record(92, 'Invalid', 'main', 'Editor', 'Creator');
    source.table.entries[0].text = text;
    const compiled = compileImport(planImport([source], ['Invalid.main']), { runtimeExpressions: true }).tables[0];
    assert.equal(compiled.status, 'blocked', text.slice(0, 60));
    assert.equal(compiled.program, undefined);
  }
  for (const text of ['{{#expr:[Invalid.Choices] + 1}}', '{{ucfirst:[Invalid.Choices]}}']) {
    const source = record(92, 'Invalid', 'main', 'Editor', 'Creator', ['Invalid.Choices']);
    source.table.entries[0].text = text;
    const choices = record(92, 'Invalid', 'Choices', 'Editor', 'Creator');
    choices.table.entries = ['2', '\u00e9clair'].map(value => ({ weight: 1, text: value, references: [] }));
    const compiled = compileImport(planImport([source, choices], ['Invalid.main']), { runtimeExpressions: true }).tables.find(table => table.name === 'Invalid.main');
    assert.equal(compiled.status, 'blocked', text);
  }
});

test('extended wiki search offsets are validated against every possible input string', () => {
  for (const [texts, offsets, status] of [
    [['abc'], ['0', '-1'], 'blocked'],
    [['abc'], ['0', '4'], 'blocked'],
    [['a', 'abc'], ['2'], 'blocked'],
    [['abc'], ['0', '3'], 'ready'],
    [['a', 'abc'], ['0', '1'], 'ready']
  ]) {
    const source = record(93, 'Offsets', 'main', 'Editor', 'Creator', ['Offsets.Text', 'Offsets.Offset']);
    source.table.entries[0].text = '{{#pos:[Offsets.Text]|a|[Offsets.Offset]}}';
    const words = record(93, 'Offsets', 'Text', 'Editor', 'Creator');
    words.table.entries = texts.map(text => ({ weight: 1, text, references: [] }));
    const positions = record(93, 'Offsets', 'Offset', 'Editor', 'Creator');
    positions.table.entries = offsets.map(text => ({ weight: 1, text, references: [] }));
    const bundle = compileImport(planImport([source, words, positions], ['Offsets.main']), { runtimeExpressions: true });
    assert.equal(bundle.tables.find(table => table.name === 'Offsets.main').status, status, JSON.stringify({ texts, offsets }));
  }
});

test('wiki imports recursively include current and original contributors plus dependency authors', () => {
  const records = [
    record(1, 'Seed', 'main', 'Editor', 'Creator', ['Dependency.main']),
    record(2, 'Edited', 'main', 'Editor', 'Another creator'),
    record(3, 'Created', 'main', 'Another editor', 'Creator'),
    record(4, 'Original collection', 'main', 'Another creator', 'Another creator'),
    record(5, 'Dependency', 'main', 'Dependency editor', 'Dependency creator'),
    record(6, 'Dependency collection', 'main', 'Dependency creator', 'Dependency creator'),
    record(7, 'Unrelated', 'main', 'Unrelated editor', 'Unrelated creator')
  ];
  const before = JSON.stringify(records);
  const plan = planImport(records, ['Seed.main']);

  assert.deepEqual(plan.records.map(item => item.table.subtable.qualified_name).sort(), [
    'Created.main', 'Dependency collection.main', 'Dependency.main', 'Edited.main',
    'Original collection.main', 'Seed.main'
  ]);
  assert.equal(JSON.stringify(records), before);
});

test('wiki identifiers distinguish case, punctuation, Unicode, and page ownership', () => {
  const tables = [
    record(1, 'Page', 'name', 'Editor', 'Creator').table,
    record(1, 'Page', 'Name', 'Editor', 'Creator').table,
    record(1, 'Page', 'a-b', 'Editor', 'Creator').table,
    record(1, 'Page', 'a_b', 'Editor', 'Creator').table,
    record(1, 'Page', '\u00d7', 'Editor', 'Creator').table,
    record(2, 'Other page', 'name', 'Editor', 'Creator').table
  ];
  const identifiers = tables.map(tableId);

  assert.equal(new Set(identifiers).size, tables.length);
  assert.ok(identifiers.every(identifier => /^wiki_abulafia_\w+$/.test(identifier)));
  assert.equal(tableId(tables[0]), tableId(tables[0]));
});

test('unknown attribution does not group unrelated tables into a synthetic author', () => {
  const seed = record(1, 'Seed', 'main', null, null);
  const unrelated = record(2, 'Unrelated', 'main', null, null);

  assert.deepEqual(planImport([seed, unrelated], ['Seed.main']).records, [seed]);
});

test('legacy contributor ID zero does not merge distinct named authors', () => {
  const seed = record(1, 'Seed', 'main', 'First author', 'First author');
  const unrelated = record(2, 'Unrelated', 'main', 'Second author', 'Second author');
  seed.table.source.contributor.id = 0;
  unrelated.table.source.contributor.id = 0;

  assert.deepEqual(planImport([seed, unrelated], ['Seed.main']).records, [seed]);
});

test('original attribution uses the earliest retained nonempty content snapshot', () => {
  const current = record(1, 'Page', 'main', 'Current editor', null);
  current.table.source.timestamp = '2020-01-01T00:00:00Z';
  const first = record(1, 'Page', 'main', 'Original author', null);
  first.table.source.timestamp = '2006-01-01T00:00:00Z';
  first.sourceFile = 'history/2006/table.json';
  const empty = record(1, 'Page', 'main', 'Empty revision editor', null);
  empty.table.source.timestamp = '2005-01-01T00:00:00Z';
  empty.table.entries = [];

  const attribution = originalAttribution(current, [empty, current, first]);
  assert.equal(attribution.contributor.name, 'Original author');
  assert.equal(attribution.sourceFile, first.sourceFile);
  assert.equal(attribution.basis, 'earliest-retained-content');
});

test('wiki conversion preserves weights and rewrites references to namespaced IDs', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Choices']);
  const choices = record(1, 'Page', 'Choices', 'Editor', 'Creator');
  choices.table.entries = [
    { weight: 2, text: 'One', references: [] },
    { weight: 3, text: 'Two', references: [] }
  ];
  const plan = planImport([root, choices], ['Page.main']);
  const before = JSON.stringify(plan);
  const bundle = compileImport(plan, { aliases: { recovered: 'Page.main' } });
  const compiledRoot = bundle.tables.find(table => table.name === 'Page.main');
  const compiledChoices = bundle.tables.find(table => table.name === 'Page.Choices');

  assert.deepEqual(compiledRoot.values, [`{${tableId(choices.table)}}`]);
  assert.deepEqual(compiledChoices.values, { '1-2': 'One', '3-5': 'Two' });
  assert.equal(compiledRoot.status, 'ready');
  assert.equal(bundle.aliases.recovered, tableId(root.table));
  assert.equal(JSON.stringify(plan), before);
});

test('ucfirst materializes plain leaf choices with exact probabilities and unchanged sources', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Choices']);
  root.table.entries[0].weight = 2;
  root.table.entries[0].text = 'A {{ucfirst:[Page.Choices]}}.';
  root.table.entries.push({ weight: 1, text: 'Unchanged', references: [] });
  const choices = record(1, 'Page', 'Choices', 'Editor', 'Creator');
  choices.table.entries = [
    { weight: 2, text: 'reddish hue', references: [] },
    { weight: 0, text: '{{unsupported note}}', references: [] },
    { weight: 3, text: 'bLUe', references: [] }
  ];
  const plan = planImport([root, choices], ['Page.main']);
  const before = JSON.stringify(plan);
  const bundle = compileImport(plan);
  const compiled = bundle.tables.find(table => table.name === 'Page.main');

  assert.equal(compiled.status, 'ready');
  assert.deepEqual(compiled.values, { '1-4': 'A Reddish hue.', '5-10': 'A BLUe.', '11-15': 'Unchanged' });
  assert.equal(compiled.entries.length, 2);
  assert.equal(compiled.totalWeight, 3);
  assert.equal(compiled.entries[0].rawText, root.table.entries[0].text);
  assert.ok(compiled.entries[0].references.includes(tableId(choices.table)));
  assert.deepEqual(compiled.dependencies, [tableId(choices.table)]);
  assert.equal(bundle.tables.length, 2, 'Materialization must not introduce table identifiers');
  assert.deepEqual(bundle.tables.find(table => table.name === 'Page.Choices').values, { '1-2': 'reddish hue', '3-5': 'bLUe' });
  assert.equal(JSON.stringify(plan), before);
});

test('ucfirst literals change only the first ASCII character and preserve the remainder', () => {
  const source = record(1, 'Page', 'main', 'Editor', 'Creator');
  source.table.entries = ['text tRAnSFORM', 'already UPPER', '!word', '7words', '', 'e\u0301clair']
    .map(text => ({ weight: 1, text: `{{ucfirst:${text}}}`, references: [] }));
  const compiled = compileImport(planImport([source], ['Page.main'])).tables[0];

  assert.equal(compiled.status, 'ready');
  assert.deepEqual(Object.values(compiled.values), ['Text tRAnSFORM', 'Already UPPER', '!word', '7words', '', 'E\u0301clair']);
});

test('ucfirst does not enable unknown, nested, malformed, or locale-sensitive expressions', () => {
  for (const text of [
    '{{ucfirst:{{lc:word}}}}', '{{lcfirst:WORD}}', '{{ucfirst|word}}', '{{ucfirst:word}',
    '{{ucfirst:word}}}', '{{ucfirst:one}}{{ucfirst:two}}', '{{ucfirst:\u00e9clair}}',
    '{{ucfirst:\u00dfeta}}', '{{ucfirst: leading}}', '{{ucfirst:trailing }}',
    '{{ucfirst:<b>word</b>}}', '{{ucfirst:&eacute;clair}}'
  ]) {
    const source = record(1, 'Page', 'main', 'Editor', 'Creator');
    source.table.entries[0].text = text;
    const compiled = compileImport(planImport([source], ['Page.main'])).tables[0];
    assert.equal(compiled.status, 'blocked', text);
    assert.equal(compiled.entries[0].rawText, text);
  }
});

test('ucfirst does not bypass missing, blocked, malformed, or recursive reference validation', () => {
  for (const condition of ['missing', 'warning', 'unresolved', 'invalid-weight', 'empty', 'recursive', 'indirect', 'malformed-reference', 'mismatched-reference']) {
    const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Choices']);
    root.table.entries[0].text = '{{ucfirst:[Page.Choices]}}';
    const choices = record(1, 'Page', 'Choices', 'Editor', 'Creator');
    choices.table.entries[0].text = 'word';
    const leaf = record(1, 'Page', 'Leaf', 'Editor', 'Creator');
    if (condition === 'warning') choices.table.warnings.push('Parse warning');
    if (condition === 'unresolved') choices.table.dependencies.unresolved.push('Missing.main');
    if (condition === 'invalid-weight') choices.table.entries.push({ weight: -1, text: 'invalid', references: [] });
    if (condition === 'empty') choices.table.entries = [];
    if (condition === 'recursive' || condition === 'indirect') {
      choices.table.entries = record(1, 'Page', 'Choices', 'Editor', 'Creator', [condition === 'recursive' ? 'Page.main' : 'Page.Leaf']).table.entries;
    }
    if (condition === 'malformed-reference') root.table.entries[0].references[0].kind = 'expression';
    if (condition === 'mismatched-reference') root.table.entries[0].references[0].token = 'Wrong';
    const records = condition === 'missing' ? [root] : [root, choices, leaf];
    const bundle = compileImport(planImport(records, ['Page.main']));
    const compiled = bundle.tables.find(table => table.name === 'Page.main');
    assert.equal(compiled.status, 'blocked', condition);
    assert.match(compiled.values[0], /unavailable/i, condition);
    assert.throws(() => compileImport(planImport(records, ['Page.main']), { aliases: { unsafe: 'Page.main' } }), /unvalidated/i, condition);
  }
});

test('ucfirst preserves independent references outside the macro in unchanged legacy rolls', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Choices']);
  root.table.entries[0].text = '[Page.Choices] {{ucfirst:[Page.Choices]}}';
  const choices = record(1, 'Page', 'Choices', 'Editor', 'Creator');
  choices.table.entries = ['red', 'blue'].map(text => ({ weight: 1, text, references: [] }));
  const bundle = compileImport(planImport([root, choices], ['Page.main']));
  const runtime = vm.createContext({ console });
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), runtime);
  }
  const generate = runtime.generate_text;
  vm.runInContext(`WikiImport.register(${JSON.stringify(bundle)});`, runtime);
  const results = [];
  for (const first of [0.25, 0.75]) {
    for (const second of [0.25, 0.75]) {
      vm.runInContext(`Math.random = (() => { const values = [${first}, ${second}]; return () => values.shift(); })();`, runtime);
      results.push(runtime.generate_text(tableId(root.table)));
    }
  }
  assert.deepEqual(results, ['red Red', 'blue Red', 'red Blue', 'blue Blue']);
  assert.equal(runtime.generate_text, generate);
  assert.deepEqual(Array.from(runtime.gen_data[tableId(choices.table)]), ['red', 'blue']);
});

test('ucfirst bounds materialized choices, exact integer weights, and output length', () => {
  for (const condition of ['choices', 'weights', 'length']) {
    const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Choices']);
    root.table.entries[0].text = '{{ucfirst:[Page.Choices]}}';
    const choices = record(1, 'Page', 'Choices', 'Editor', 'Creator');
    if (condition === 'choices') choices.table.entries = Array.from({ length: 4097 }, () => ({ weight: 1, text: 'word', references: [] }));
    if (condition === 'weights') {
      root.table.entries[0].weight = 2;
      choices.table.entries[0].weight = Number.MAX_SAFE_INTEGER;
    }
    if (condition === 'length') choices.table.entries[0].text = 'word'.repeat(8193);
    const compiled = compileImport(planImport([root, choices], ['Page.main'])).tables.find(table => table.name === 'Page.main');
    assert.equal(compiled.status, 'blocked', condition);
    assert.ok(compiled.issues.some(issue => ['unsupported_ucfirst', 'expansion_limit'].includes(issue.code)), condition);
  }
});

test('ucfirst combines different leaf totals without rounding row probabilities', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Halves']);
  root.table.entries[0].text = '{{ucfirst:[Page.Halves]}}';
  const thirdsEntry = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Thirds']).table.entries[0];
  thirdsEntry.text = '{{ucfirst:[Page.Thirds]}}';
  root.table.entries.push(thirdsEntry);
  const halves = record(1, 'Page', 'Halves', 'Editor', 'Creator');
  halves.table.entries = ['one', 'two'].map(text => ({ weight: 1, text, references: [] }));
  const thirds = record(1, 'Page', 'Thirds', 'Editor', 'Creator');
  thirds.table.entries = ['three', 'four', 'five'].map(text => ({ weight: 1, text, references: [] }));
  const compiled = compileImport(planImport([root, halves, thirds], ['Page.main'])).tables.find(table => table.name === 'Page.main');
  assert.equal(compiled.status, 'ready');
  assert.deepEqual(compiled.values, { '1-3': 'One', '4-6': 'Two', '7-8': 'Three', '9-10': 'Four', '11-12': 'Five' });
});

test('po follows the archived possessive template including terminal S, apostrophes, and empty input', () => {
  const source = record(1, 'Page', 'main', 'Editor', 'Creator');
  source.table.entries = ['Fred', 'Linus', 'JAMES', "D'Angelo", "Fred'", 'boss\u2019s', 'Andr\u00e9', '']
    .map(text => ({ weight: 1, text: `{{po|${text}}}`, references: [] }));
  const before = JSON.stringify(source);
  const compiled = compileImport(planImport([source], ['Page.main'])).tables[0];

  assert.equal(compiled.status, 'ready');
  assert.deepEqual(Object.values(compiled.values), ['Fred\u2019s', 'Linus\u2019', 'JAMES\u2019', "D'Angelo\u2019s", "Fred'\u2019s", 'boss\u2019s\u2019', 'Andr\u00e9\u2019s', '\u2019s']);
  assert.equal(JSON.stringify(source), before);
});

test('po expands weighted reference chains without changing source values or probabilities', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Names']);
  root.table.entries[0].text = 'A {{po|[Page.Names]}} item';
  root.table.entries[0].weight = 2;
  root.table.entries.push({ weight: 1, text: 'Unchanged', references: [] });
  const names = record(1, 'Page', 'Names', 'Editor', 'Creator', ['Page.Endings']);
  names.table.entries.push({ weight: 1, text: 'CHRIS', references: [] });
  const endings = record(1, 'Page', 'Endings', 'Editor', 'Creator');
  endings.table.entries = [
    { weight: 2, text: 'Fred', references: [] },
    { weight: 1, text: 'James', references: [] }
  ];
  const plan = planImport([root, names, endings], ['Page.main']);
  const before = JSON.stringify(plan);
  const bundle = compileImport(plan);
  const compiled = bundle.tables.find(table => table.name === 'Page.main');

  assert.equal(compiled.status, 'ready');
  assert.deepEqual(compiled.values, { '1-4': 'A Fred\u2019s item', '5-6': 'A James\u2019 item', '7-12': 'A CHRIS\u2019 item', '13-18': 'Unchanged' });
  assert.equal(compiled.totalWeight, 3);
  assert.equal(compiled.entries.length, 2);
  assert.equal(compiled.entries[0].rawText, root.table.entries[0].text);
  assert.deepEqual(compiled.dependencies, [tableId(names.table)]);
  assert.equal(bundle.tables.length, 3, 'Possessive compilation must not introduce helper identifiers');
  assert.deepEqual(bundle.tables.find(table => table.name === 'Page.Names').values, [`{${tableId(endings.table)}}`, 'CHRIS']);
  assert.deepEqual(bundle.tables.find(table => table.name === 'Page.Endings').values, { '1-2': 'Fred', 3: 'James' });
  assert.equal(JSON.stringify(plan), before);
});

test('po keeps optional overrides, nested macros, ambiguous whitespace, and markup quarantined', () => {
  for (const text of [
    '{{po|Fred|Override}}', '{{po|{{ucfirst:fred}}}}', '{{po:Fred}}', '{{po}}',
    '{{po|Fred}}}', '{{po|Fred}}{{po|James}}', '{{po| Fred}}', '{{po|Fred }}',
    '{{po|<b>Fred</b>}}', '{{po|Fred&amp;James}}', '{{Possessive|Fred}}'
  ]) {
    const source = record(1, 'Page', 'main', 'Editor', 'Creator');
    source.table.entries[0].text = text;
    const compiled = compileImport(planImport([source], ['Page.main'])).tables[0];
    assert.equal(compiled.status, 'blocked', text);
    assert.equal(compiled.entries[0].rawText, text);
  }
});

test('po combines independent references and applies the suffix after empty choices are expanded', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.First', 'Page.Last', 'Page.Badge']);
  root.table.entries[0].text = '[Page.Badge] {{po|[Page.First][Page.Last]}}';
  const first = record(1, 'Page', 'First', 'Editor', 'Creator');
  first.table.entries = [{ weight: 2, text: 'Mary', references: [] }, { weight: 1, text: 'Chris', references: [] }];
  const last = record(1, 'Page', 'Last', 'Editor', 'Creator');
  last.table.entries = [{ weight: 1, text: '', references: [] }, { weight: 2, text: 's', references: [] }];
  const badge = record(1, 'Page', 'Badge', 'Editor', 'Creator');
  badge.table.entries = ['Gold', 'Silver'].map(text => ({ weight: 1, text, references: [] }));
  const bundle = compileImport(planImport([root, first, last, badge], ['Page.main']));
  const compiled = bundle.tables.find(table => table.name === 'Page.main');
  const token = `{${tableId(badge.table)}}`;
  assert.equal(compiled.status, 'ready');
  assert.deepEqual(compiled.values, { '1-2': `${token} Mary\u2019s`, '3-6': `${token} Marys\u2019`, 7: `${token} Chris\u2019`, '8-9': `${token} Chriss\u2019` });
  const runtime = vm.createContext({ console });
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), runtime);
  }
  const generate = runtime.generate_text;
  vm.runInContext(`WikiImport.register(${JSON.stringify(bundle)});`, runtime);
  const counts = {};
  for (let side = 0; side < 9; side += 1) {
    for (const badgeSample of [0.25, 0.75]) {
      vm.runInContext(`Math.random = (() => { const values = [${(side + 0.5) / 9}, ${badgeSample}]; return () => values.shift(); })();`, runtime);
      const output = runtime.generate_text(compiled.id);
      counts[output] = (counts[output] || 0) + 1;
    }
  }
  assert.deepEqual(counts, { 'Gold Mary\u2019s': 2, 'Silver Mary\u2019s': 2, 'Gold Marys\u2019': 4, 'Silver Marys\u2019': 4,
    'Gold Chris\u2019': 1, 'Silver Chris\u2019': 1, 'Gold Chriss\u2019': 2, 'Silver Chriss\u2019': 2 });
  assert.equal(runtime.generate_text, generate);
});

test('po rolls repeated occurrences independently and skips preserved zero-weight expressions', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Names']);
  root.table.entries[0].text = '{{po|[Page.Names][Page.Names]}}';
  const names = record(1, 'Page', 'Names', 'Editor', 'Creator');
  names.table.entries = ['a', 's'].map(text => ({ weight: 1, text, references: [] }));
  const inactive = record(1, 'Page', 'Names', 'Editor', 'Creator', ['Page.Missing']).table.entries[0];
  names.table.entries.push({ ...inactive, weight: 0, text: '{{unsupported}} [Page.Missing]' });
  names.table.dependencies.unresolved = ['Page.Missing'];
  root.table.entries.push({ weight: 0, text: '{{po|{{unsupported}}}}', references: [] });
  const plan = planImport([root, names], ['Page.main']);
  const before = JSON.stringify(plan);
  const bundle = compileImport(plan);
  const compiled = bundle.tables.find(table => table.name === 'Page.main');
  assert.equal(compiled.status, 'ready');
  assert.deepEqual(compiled.values, ['aa\u2019s', 'as\u2019', 'sa\u2019s', 'ss\u2019']);
  assert.equal(compiled.entries[1].text, root.table.entries[1].text);
  assert.equal(JSON.stringify(plan), before);
});

test('po does not bypass dependency validation or execute unsupported source expressions', () => {
  for (const condition of ['missing', 'warning', 'unresolved', 'invalid-weight', 'empty', 'cycle', 'nested', 'html', 'replacement', 'malformed-reference', 'ambiguous-reference']) {
    const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Names']);
    root.table.entries[0].text = '{{po|[Page.Names]}}';
    const names = record(1, 'Page', 'Names', 'Editor', 'Creator');
    names.table.entries[0].text = 'Fred';
    if (condition === 'warning') names.table.warnings.push('Parse warning');
    if (condition === 'unresolved') names.table.dependencies.unresolved.push('Unattributed.main');
    if (condition === 'invalid-weight') names.table.entries.push({ weight: -1, text: 'Invalid', references: [] });
    if (condition === 'empty') names.table.entries = [];
    if (condition === 'cycle') names.table.entries = record(1, 'Page', 'Names', 'Editor', 'Creator', ['Page.main']).table.entries;
    if (condition === 'nested') names.table.entries[0].text = '{{ucfirst:fred}}';
    if (condition === 'html') names.table.entries[0].text = '<img src="missing" onerror="globalThis.injected = true">';
    if (condition === 'replacement') names.table.entries[0].text = '$&';
    if (condition === 'malformed-reference') root.table.entries[0].references[0].kind = 'expression';
    if (condition === 'ambiguous-reference') root.table.entries[0].references.push({ ...root.table.entries[0].references[0], target_qualified_name: 'Page.Other' });
    const records = condition === 'missing' ? [root] : [root, names];
    const plan = planImport(records, ['Page.main']);
    const compiled = compileImport(plan).tables.find(table => table.name === 'Page.main');
    assert.equal(compiled.status, 'blocked', condition);
    assert.match(compiled.values[0], /unavailable/i, condition);
    assert.throws(() => compileImport(plan, { aliases: { unsafe: 'Page.main' } }), /unvalidated/i, condition);
  }
});

test('po bounds branch sums, Cartesian products, reference depth, calls, weights, and output length', () => {
  for (const condition of ['choices', 'product', 'depth', 'calls', 'weights', 'length']) {
    const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Names']);
    root.table.entries[0].text = '{{po|[Page.Names]}}';
    const names = record(1, 'Page', 'Names', 'Editor', 'Creator');
    names.table.entries[0].text = 'Fred';
    const records = [root, names];
    if (condition === 'choices') names.table.entries = Array.from({ length: 4097 }, () => ({ weight: 1, text: 'name', references: [] }));
    if (condition === 'product') {
      names.table.entries = Array.from({ length: 65 }, () => ({ weight: 1, text: 'name', references: [] }));
      root.table.entries[0].text = '{{po|[Page.Names][Page.Names]}}';
    }
    if (condition === 'depth') {
      for (let index = 0; index < 33; index += 1) {
        const name = index === 0 ? 'Names' : `Depth${index}`;
        const target = index === 32 ? [] : [`Page.Depth${index + 1}`];
        const source = record(1, 'Page', name, 'Editor', 'Creator', target);
        if (index === 0) names.table.entries = source.table.entries;
        else records.push(source);
      }
    }
    if (condition === 'calls') {
      names.table.entries[0].text = '';
      root.table.entries[0].text = `{{po|${'[Page.Names]'.repeat(513)}}}`;
    }
    if (condition === 'weights') {
      const leaf = record(1, 'Page', 'Leaf', 'Editor', 'Creator');
      leaf.table.entries = [{ weight: Number.MAX_SAFE_INTEGER - 1, text: 'Fred', references: [] }, { weight: 1, text: 'James', references: [] }];
      names.table.entries = record(1, 'Page', 'Names', 'Editor', 'Creator', ['Page.Leaf']).table.entries;
      names.table.entries.push({ weight: 1, text: 'Chris', references: [] });
      records.push(leaf);
    }
    if (condition === 'length') names.table.entries[0].text = 'a'.repeat(32768);
    const compiled = compileImport(planImport(records, ['Page.main'])).tables.find(table => table.name === 'Page.main');
    assert.equal(compiled.status, 'blocked', condition);
    assert.ok(compiled.issues.some(issue => ['unsupported_po', 'expansion_limit'].includes(issue.code)), condition);
  }
});

test('compact wiki compilation keeps large combinations as references and preserves compatibility artifacts', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Combined']);
  root.table.entries[0].text = '{{po|[Page.Combined]}}';
  const combined = record(1, 'Page', 'Combined', 'Editor', 'Creator', ['Page.Names']);
  combined.table.entries[0].text = '[Page.Names][Page.Names][Page.Names]';
  const names = record(1, 'Page', 'Names', 'Editor', 'Creator');
  names.table.entries = Array.from({ length: 500 }, (_, index) => ({ weight: index + 1, text: `Name${index}`, references: [] }));
  const parent = record(1, 'Page', 'Parent', 'Editor', 'Creator', ['Page.main']);
  parent.table.entries[0].text = 'The [Page.main] item';
  const plan = planImport([root, combined, names, parent], ['Page.Parent']);
  const before = JSON.stringify(plan);
  const aliases = { recovered: 'Page.Names' };
  const legacy = compileImport(plan, { aliases });
  const bundle = compileImport(plan, { aliases, runtimeExpressions: true });
  const compiled = bundle.tables.find(table => table.name === 'Page.main');
  const compiledParent = bundle.tables.find(table => table.name === 'Page.Parent');

  assert.equal(legacy.tables.find(table => table.name === 'Page.main').status, 'blocked');
  assert.equal(compiled.status, 'ready');
  assert.equal(compiled.execution, 'wiki');
  assert.deepEqual(compiled.program, [[{ op: 'po', parts: [{ ref: tableId(combined.table) }] }]]);
  assert.equal(compiledParent.execution, 'wiki');
  assert.deepEqual(compiledParent.program, [['The ', { ref: tableId(root.table) }, ' item']]);
  assert.match(compiled.values[0], /requires Table Atlas/);
  assert.equal(compiled.entries[0].rawText, root.table.entries[0].text);
  assert.equal(bundle.tables.length, plan.records.length);
  assert.ok(JSON.stringify(compiled.program).length < 200);
  for (const name of ['Page.Names', 'Page.Combined']) {
    assert.deepEqual(bundle.tables.find(table => table.name === name).values, legacy.tables.find(table => table.name === name).values);
  }
  assert.throws(() => compileImport(plan, { runtimeExpressions: true, aliases: { incompatible: 'Page.main' } }), /unvalidated/i);
  const provenance = { repository: 'https://example.invalid/wiki', commit: 'test' };
  const originalArtifacts = buildArtifacts(plan, legacy, provenance);
  const artifacts = buildArtifacts(plan, bundle, provenance);
  assert.equal(artifacts.get('tables/abulafia.js'), originalArtifacts.get('tables/abulafia.js'));
  assert.equal(artifacts.get('tables/abulafia/source/1.json'), originalArtifacts.get('tables/abulafia/source/1.json'));
  assert.equal(JSON.stringify(plan), before);
  const runtime = vm.createContext({ console });
  for (const file of ['JS/generator.js', 'JS/wiki-import.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8'), runtime);
  }
  runtime.WikiImport.register(bundle);
  vm.runInContext('Math.random = () => 0;', runtime);
  const result = runtime.WikiImport.roll(compiledParent.id);
  assert.equal(result.text, 'The Name0Name0Name0\u2019s item');
  assert.equal(result.steps.length, 6);
  assert.equal(result.warnings.length, 0);
});

test('compact ucfirst validates every possible first character without materializing a reference chain', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Combined']);
  root.table.entries[0].text = '{{ucfirst:[Page.Combined]}}';
  const combined = record(1, 'Page', 'Combined', 'Editor', 'Creator', ['Page.Names']);
  const names = record(1, 'Page', 'Names', 'Editor', 'Creator');
  names.table.entries = ['name', 'other'].map(text => ({ weight: 1, text, references: [] }));
  const plan = planImport([root, combined, names], ['Page.main']);
  const compiled = compileImport(plan, { runtimeExpressions: true }).tables.find(table => table.name === 'Page.main');
  assert.equal(compiled.status, 'ready');
  assert.equal(compiled.execution, 'wiki');
  assert.deepEqual(compiled.program, [[{ op: 'ucfirst', parts: [{ ref: tableId(combined.table) }] }]]);
  for (const text of ['\u00e9clair', ' leading', 'trailing ', '{{unsupported}}']) {
    names.table.entries[1].text = text;
    const result = compileImport(plan, { runtimeExpressions: true }).tables.find(table => table.name === 'Page.main');
    if (text.trim() !== text) {
      assert.equal(result.status, 'ready', text);
      const output = require('../../JS/wiki-expressions.js').evaluate(result.program[0], { resolve: () => text });
      assert.equal(output, text.trim().charAt(0).toUpperCase() + text.trim().slice(1));
    } else assert.equal(result.status, 'blocked', text);
  }
});

test('wiki expressions retain source and resource quarantine while allowing validated nested dependencies', () => {
  for (const condition of ['missing', 'warning', 'unresolved', 'invalid-weight', 'cycle', 'nested', 'html', 'malformed', 'depth', 'calls', 'length']) {
    const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Names']);
    root.table.entries[0].text = '{{po|[Page.Names]}}';
    const names = record(1, 'Page', 'Names', 'Editor', 'Creator');
    names.table.entries = Array.from({ length: 4097 }, () => ({ weight: 1, text: 'Fred', references: [] }));
    const records = [root, names];
    if (condition === 'missing') records.pop();
    if (condition === 'warning') names.table.warnings.push('Parse warning');
    if (condition === 'unresolved') names.table.dependencies.unresolved = ['Unattributed.main'];
    if (condition === 'invalid-weight') names.table.entries[0].weight = -1;
    if (condition === 'cycle') names.table.entries = record(1, 'Page', 'Names', 'Editor', 'Creator', ['Page.main']).table.entries;
    if (condition === 'nested') names.table.entries[0].text = '{{ucfirst:fred}}';
    if (condition === 'html') names.table.entries[0].text = '<b>Fred</b>';
    if (condition === 'malformed') root.table.entries[0].references[0].token = 'Wrong';
    if (condition === 'depth') {
      for (let index = 0; index < 33; index += 1) {
        const source = record(1, 'Page', index === 0 ? 'Names' : `Depth${index}`, 'Editor', 'Creator', index === 32 ? [] : [`Page.Depth${index + 1}`]);
        if (index === 0) names.table.entries = source.table.entries;
        else records.push(source);
      }
    }
    if (condition === 'calls') {
      names.table.entries = [{ weight: 1, text: '', references: [] }];
      root.table.entries[0].text = `{{po|${'[Page.Names]'.repeat(512)}}}`;
    }
    if (condition === 'length') names.table.entries[0].text = 'a'.repeat(32768);
    const bundle = compileImport(planImport(records, ['Page.main']), { runtimeExpressions: true });
    const compiled = bundle.tables.find(table => table.name === 'Page.main');
    if (condition === 'nested' || condition === 'html') {
      assert.equal(compiled.status, 'ready', condition);
      assert.equal(compiled.execution, 'wiki', condition);
      assert.equal(compiled.program[0][0].op, 'po', condition);
      continue;
    }
    assert.equal(compiled.status, 'blocked', condition);
    assert.equal(compiled.program, undefined, condition);
    assert.equal(compiled.execution, undefined, condition);
  }
});

test('table-wide materialization limits fall back to compact programs without multiplying source weights', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.Names']);
  root.table.entries[0].text = 'First {{po|[Page.Names]}}';
  root.table.entries[0].weight = 2;
  root.table.entries.push({ ...root.table.entries[0], weight: 3, text: 'Second {{po|[Page.Names]}}' });
  root.table.entries.push({ weight: 0, text: '{{unsupported}}', references: [] });
  const names = record(1, 'Page', 'Names', 'Editor', 'Creator');
  names.table.entries = Array.from({ length: 2050 }, (_, index) => ({ weight: 1, text: `Name${index}`, references: [] }));
  const plan = planImport([root, names], ['Page.main']);
  assert.equal(compileImport(plan).tables.find(table => table.name === 'Page.main').status, 'blocked');
  const compiled = compileImport(plan, { runtimeExpressions: true }).tables.find(table => table.name === 'Page.main');
  assert.equal(compiled.status, 'ready');
  assert.equal(compiled.execution, 'wiki');
  assert.equal(compiled.totalWeight, 5);
  assert.deepEqual(compiled.entries.map(entry => entry.weight), [2, 3, 0]);
  assert.deepEqual(compiled.program, [
    ['First ', { op: 'po', parts: [{ ref: tableId(names.table) }] }],
    ['Second ', { op: 'po', parts: [{ ref: tableId(names.table) }] }], null
  ]);
});

test('zero-weight rows remain inspectable without blocking executable entries or dependencies', () => {
  const root = record(1, 'Page', 'main', 'Editor', 'Creator');
  const inactiveReferences = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.main', 'Broken.main', 'Absent.main']).table.entries[0];
  root.table.entries = [
    { weight: 2, text: 'First', references: [] },
    { weight: 0, text: '{{fc||#FFC|note}}', references: [] },
    { ...inactiveReferences, weight: 0 },
    { weight: 0, text: '<img src="missing" onerror="globalThis.injected = true">', references: [] },
    { weight: 0, text: 'Long note '.repeat(4000), references: [] },
    { weight: 3, text: 'Second', references: [] }
  ];
  const broken = record(2, 'Broken', 'main', 'Editor', 'Creator');
  broken.table.entries[0].text = '{{unsupported}}';
  const parent = record(3, 'Parent', 'main', 'Editor', 'Creator', ['Page.main']);
  const plan = planImport([root, broken, parent], ['Parent.main']);
  const before = JSON.stringify(plan);
  const bundle = compileImport(plan);
  const compiled = bundle.tables.find(table => table.name === 'Page.main');

  assert.equal(compiled.status, 'ready');
  assert.deepEqual(compiled.issues, []);
  assert.deepEqual(compiled.dependencies, []);
  assert.deepEqual(compiled.values, { '1-2': 'First', '3-5': 'Second' });
  assert.equal(compiled.totalWeight, 5);
  assert.equal(compiled.entries.length, root.table.entries.length);
  for (const [index, entry] of compiled.entries.entries()) {
    assert.equal(entry.rawText, root.table.entries[index].text);
    if (entry.weight === 0) assert.equal(entry.text, entry.rawText);
  }
  assert.ok(compiled.entries[2].references.includes(tableId(root.table)));
  assert.ok(compiled.entries[2].references.includes(tableId(broken.table)));
  assert.ok(compiled.entries[2].references.some(identifier => identifier.startsWith('wiki_abulafia_missing_')));
  assert.equal(bundle.tables.find(table => table.name === 'Parent.main').status, 'ready');
  assert.equal(bundle.tables.find(table => table.name === 'Broken.main').status, 'blocked');
  const artifacts = buildArtifacts(plan, bundle, { repository: 'https://example.invalid/wiki', commit: 'test' });
  const archive = JSON.parse(artifacts.get('tables/abulafia/source/1.json'));
  assert.deepEqual(archive.tables[0].current.table, root.table);
  assert.equal(JSON.stringify(plan), before);
});

test('zero-weight handling does not accept invalid weights or tables with no selectable entries', () => {
  for (const weight of [-1, 0.5, '0', null, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    const source = record(1, 'Page', 'main', 'Editor', 'Creator');
    source.table.entries.push({ weight, text: 'Invalid', references: [] });
    const compiled = compileImport(planImport([source], ['Page.main'])).tables[0];
    assert.equal(compiled.status, 'blocked', String(weight));
    assert.ok(compiled.issues.some(issue => issue.code === 'invalid_weight'), String(weight));
  }
  const source = record(1, 'Page', 'main', 'Editor', 'Creator');
  source.table.entries[0].weight = 0;
  const compiled = compileImport(planImport([source], ['Page.main'])).tables[0];
  assert.equal(compiled.status, 'blocked');
  assert.ok(compiled.issues.some(issue => issue.code === 'invalid_weight'));
});

test('zero-weight source diagnostics are ignored only for exclusively inactive references', () => {
  const source = record(1, 'Page', 'main', 'Editor', 'Creator');
  const missing = record(1, 'Page', 'main', 'Editor', 'Creator', ['Absent.main']).table.entries[0];
  source.table.entries.push({ ...missing, weight: 0 });
  source.table.dependencies.unresolved = ['Absent.main'];
  const plan = planImport([source], ['Page.main']);
  assert.equal(compileImport(plan).tables[0].status, 'ready');

  source.table.dependencies.unresolved.push('Unattributed.main');
  assert.ok(compileImport(plan).tables[0].issues.some(issue => issue.code === 'source_unresolved'));
  source.table.dependencies.unresolved.pop();
  source.table.entries.push(missing);
  assert.ok(compileImport(plan).tables[0].issues.some(issue => issue.code === 'source_unresolved'));
  source.table.entries.pop();
  source.table.warnings.push('Unattributed parse warning');
  assert.ok(compileImport(plan).tables[0].issues.some(issue => issue.code === 'source_warning'));
});

test('making an unsupported zero-weight row selectable restores quarantine', () => {
  const source = record(1, 'Page', 'main', 'Editor', 'Creator');
  source.table.entries.push({ weight: 0, text: '{{unsupported}}', references: [] });
  const plan = planImport([source], ['Page.main']);
  assert.equal(compileImport(plan).tables[0].status, 'ready');
  source.table.entries[1].weight = 1;
  const compiled = compileImport(plan).tables[0];
  assert.equal(compiled.status, 'blocked');
  assert.ok(compiled.issues.some(issue => issue.code === 'unsupported_syntax'));
});

test('missing references, unsupported syntax, and their dependents are quarantined', () => {
  const broken = record(1, 'Broken', 'main', 'Editor', 'Creator', ['Absent.main']);
  const parent = record(2, 'Parent', 'main', 'Editor', 'Creator', ['Broken.main']);
  const macro = record(3, 'Macro', 'main', 'Editor', 'Creator');
  macro.table.entries[0].text = '{{unsupported:instruction}}';
  const bundle = compileImport(planImport([broken, parent, macro], ['Parent.main']));

  assert.ok(bundle.tables.every(table => table.status === 'blocked'));
  assert.ok(bundle.tables.find(table => table.name === 'Broken.main').issues.some(issue => issue.code === 'missing_reference'));
  assert.ok(bundle.tables.find(table => table.name === 'Parent.main').issues.some(issue => issue.code === 'blocked_dependency'));
  assert.equal(bundle.tables.find(table => table.name === 'Macro.main').entries[0].rawText, '{{unsupported:instruction}}');
  assert.ok(bundle.tables.every(table => !/\{\w+\}/.test(table.values[0])));
});

test('cyclic wiki expansion is disabled without affecting an independent table', () => {
  const first = record(1, 'First', 'main', 'Editor', 'Creator', ['Second.main']);
  const second = record(2, 'Second', 'main', 'Editor', 'Creator', ['First.main']);
  const safe = record(3, 'Safe', 'main', 'Editor', 'Creator');
  const bundle = compileImport(planImport([first, second, safe], ['Safe.main']));

  assert.equal(bundle.tables.find(table => table.name === 'Safe.main').status, 'ready');
  assert.equal(bundle.tables.find(table => table.name === 'First.main').status, 'blocked');
  assert.equal(bundle.tables.find(table => table.name === 'Second.main').status, 'blocked');
});

test('wiki markup is converted to inert text and active content is quarantined', () => {
  const safe = record(1, 'Safe', 'main', 'Editor', 'Creator');
  safe.table.entries[0].text = '<b>Salt &amp; pepper</b><br>Next line';
  const unsafe = record(2, 'Unsafe', 'main', 'Editor', 'Creator');
  unsafe.table.entries[0].text = '<img src="missing" onerror="globalThis.injected = true">';
  const bundle = compileImport(planImport([safe, unsafe], ['Safe.main']));

  assert.deepEqual(bundle.tables.find(table => table.name === 'Safe.main').values, ['Salt &amp; pepper\nNext line']);
  assert.equal(bundle.tables.find(table => table.name === 'Unsafe.main').status, 'blocked');
});

test('collisions and aliases to unvalidated tables abort compilation', () => {
  const seed = record(1, 'Seed', 'main', 'Editor', 'Creator');
  const plan = planImport([seed], ['Seed.main']);
  assert.throws(() => compileImport(plan, { existingIds: [tableId(seed.table)] }), /collision/i);
  assert.throws(() => compileImport(plan, { existingIds: ['occupied'], aliases: { occupied: 'Seed.main' } }), /collision/i);
  seed.table.entries[0].text = '{{unsupported}}';
  assert.throws(() => compileImport(plan, { aliases: { recovered: 'Seed.main' } }), /unvalidated/i);
});

test('corpus loading follows current page manifests and traces original content', context => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'abulafia-fixture-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  function writeJson(relative, value) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value));
  }
  const current = record(1, 'Page', 'main', 'Editor', null).table;
  current.source.timestamp = '2020-01-01T00:00:00Z';
  const original = record(1, 'Page', 'main', 'Original', null).table;
  original.source.timestamp = '2006-01-01T00:00:00Z';
  writeJson('tables/index.json', { pages: [{ folder_name: 'page' }, { folder_name: 'page' }] });
  writeJson('tables/page/page.json', { subtables: [current.subtable] });
  writeJson('tables/page/subtables/main/table.json', current);
  writeJson('tables/page/subtables/main/history/2006-01-01T00-00-00Z/table.json', original);
  writeJson('tables/page/subtables/obsolete/table.json', record(1, 'Page', 'obsolete', 'Editor', null).table);

  const records = loadCorpus(root);
  assert.equal(records.length, 1);
  assert.equal(records[0].originalContributor.name, 'Original');
  assert.equal(records[0].table.source.contributor.name, 'Editor');
  assert.match(records[0].originalSourceFile, /history\/2006-01-01T00-00-00Z\/table\.json$/);
  assert.match(records[0].sourceHash, /^[a-f0-9]{64}$/);
  assert.deepEqual(records[0].table, current);
});

test('historical corpus loading preserves latest definitions, deletion evidence, and current membership', context => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'abulafia-history-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  function writeJson(relative, value) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value));
  }
  function snapshot(name, year, revision, contributor, state = 'present') {
    const table = record(1, 'Page', name, contributor, null).table;
    table.source.timestamp = `${year}-01-01T00:00:00Z`;
    table.source.revision_id = revision;
    table.state = state;
    table.raw_source = `;${name}\n1,${contributor}`;
    table.entries[0].text = contributor;
    if (state === 'deleted') {
      table.entries = [];
      table.raw_source = '';
    }
    return table;
  }
  const current = snapshot('main', 2020, 20, 'Current');
  writeJson('tables/index.json', { pages: [{ folder_name: 'page' }] });
  writeJson('tables/page/page.json', { subtables: [current.subtable] });
  writeJson('tables/page/subtables/main/table.json', current);
  const deleted = snapshot('old', 2010, 10, 'Deleting editor', 'deleted');
  const original = snapshot('old', 2006, 6, 'Original');
  const latest = snapshot('old', 2008, 8, 'Last author');
  latest.table_note = 'Unchanged source evidence';
  latest.entries[0].weight = 7;
  latest.raw_source = ';old\n7,Last author';
  writeJson('tables/page/subtables/old/table.json', deleted);
  writeJson('tables/page/subtables/old/history/z-first/table.json', original);
  writeJson('tables/page/subtables/old/history/a-last/table.json', latest);
  writeJson('tables/page/subtables/old/history/deleted/table.json', deleted);
  const empty = snapshot('empty', 2009, 9, 'Last author');
  empty.entries = [];
  empty.raw_source = ';empty';
  empty.warnings = ['Source definition has no rows'];
  writeJson('tables/page/subtables/empty/table.json', snapshot('empty', 2010, 10, 'Deleting editor', 'deleted'));
  writeJson('tables/page/subtables/empty/history/first/table.json', snapshot('empty', 2006, 6, 'Original'));
  writeJson('tables/page/subtables/empty/history/last/table.json', empty);
  writeJson('tables/page/subtables/unknown/table.json', snapshot('unknown', 2010, 10, 'Deleting editor', 'deleted'));

  const baseline = loadCorpus(root);
  const recovered = loadCorpus(root, { includeHistorical: true });
  assert.equal(recovered.length, 3);
  assert.deepEqual(recovered.find(item => item.table.subtable.name === 'main'), baseline[0]);
  const restored = recovered.find(item => item.table.subtable.name === 'old');
  assert.deepEqual(restored.table, latest);
  assert.equal(restored.originalContributor.name, 'Original');
  assert.match(restored.sourceFile, /history\/a-last\/table\.json$/);
  assert.equal(restored.sourceHash, crypto.createHash('sha256').update(JSON.stringify(latest)).digest('hex'));
  assert.deepEqual(restored.historical.absentFromCurrent.table, deleted);
  assert.equal(restored.historical.basis, 'latest-retained-definition');
  const plan = planImport(recovered, ['Page.old']);
  assert.deepEqual(plan.records.map(item => item.table.subtable.name), ['empty', 'old']);
  const bundle = compileImport(plan);
  assert.equal(bundle.tables.find(item => item.name === 'Page.empty').status, 'blocked');
  assert.equal(bundle.tables.find(item => item.name === 'Page.old').totalWeight, 7);
  assert.deepEqual(loadCorpus(root), baseline);
  assert.throws(() => loadCorpus(root, { includeHistorical: 'yes' }), /includeHistorical/i);
  const changedIdentity = structuredClone(latest);
  changedIdentity.page.page_id = 2;
  writeJson('tables/page/subtables/old/history/a-last/table.json', changedIdentity);
  assert.throws(() => loadCorpus(root, { includeHistorical: true }), /historical.*identity/i);
});

test('historical selection is source-bound, contributor-complete, and stored separately from current archives', () => {
  const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
  const current = record(1, 'Page', 'main', 'Current', 'Current');
  function historical(pageId, page, name, author) {
    const restored = record(pageId, page, name, author, author);
    const deleted = structuredClone(restored);
    deleted.table.state = 'deleted';
    deleted.table.entries = [];
    deleted.sourceHash = digest(deleted.table);
    restored.sourceFile = `tables/${pageId}/subtables/${name}/history/first/table.json`;
    restored.sourceHash = digest(restored.table);
    restored.historical = { basis: 'latest-retained-definition', absentFromCurrent: deleted };
    return restored;
  }
  const lost = historical(1, 'Page', 'lost', 'Historical author');
  const companion = historical(2, 'Companion', 'main', 'Historical author');
  const disconnected = historical(3, 'Unrelated', 'main', null);
  companion.table.entries = [];
  companion.sourceHash = digest(companion.table);
  const records = [current, lost, companion, disconnected];
  const provenance = { repository: 'fixture', commit: 'a'.repeat(40) };
  const configuration = { schemaVersion: 1, ...provenance,
    basis: { manifestSha256: 'b'.repeat(64), comparisonSha256: 'c'.repeat(64), inventorySha256: 'd'.repeat(64) },
    targets: [{ name: 'Page.lost', sourceFile: lost.sourceFile, sourceHash: lost.sourceHash,
      absentSourceHash: lost.historical.absentFromCurrent.sourceHash }] };
  const before = JSON.stringify({ records, configuration });
  const baseline = planImport([current], ['Page.main'], { allCurrent: true });
  const plan = planHistoricalImport(records, ['Page.main'], configuration, provenance);
  assert.deepEqual(plan.records.map(item => item.table.subtable.qualified_name), ['Companion.main', 'Page.lost', 'Page.main']);
  assert.equal(plan.selection, 'all-current-with-history');
  assert.equal(plan.recovery.currentTables, 1);
  assert.equal(plan.recovery.historicalTables, 2);
  assert.equal(plan.recovery.configurationSha256, digest(configuration));
  const compiled = compileImport(plan);
  assert.equal(compiled.tables.find(item => item.name === 'Companion.main').status, 'blocked');
  assert.equal(compiled.tables.find(item => item.name === 'Page.lost').historical.basis, 'latest-retained-definition');
  assert.equal(compiled.tables.find(item => item.name === 'Page.main').historical, undefined);
  const oldArtifacts = buildArtifacts(baseline, compileImport(baseline), provenance);
  const artifacts = buildArtifacts(plan, compiled, provenance);
  assert.equal(artifacts.get('tables/abulafia/source/1.json'), oldArtifacts.get('tables/abulafia/source/1.json'));
  const archive = JSON.parse(artifacts.get('tables/abulafia/source/historical/1.json'));
  assert.deepEqual(archive.tables[0].historical, lost.historical);
  const manifest = JSON.parse(artifacts.get('tables/abulafia/manifest.json'));
  assert.deepEqual(manifest.recovery, plan.recovery);
  assert.equal(manifest.summary.currentTables, 1);
  assert.equal(manifest.summary.historicalTables, 2);
  assert.equal(manifest.summary.pages, 2);
  assert.equal(manifest.summary.sourceArchives, 3);
  for (const change of [{ commit: 'e'.repeat(40) }, { targets: [] }, { targets: [configuration.targets[0], configuration.targets[0]] },
    { basis: { ...configuration.basis, manifestSha256: 'stale' } }]) {
    assert.throws(() => planHistoricalImport(records, ['Page.main'], { ...configuration, ...change }, provenance), /historical recovery/i);
  }
  for (const change of [{ name: 'Page.main' }, { sourceFile: 'other.json' }, { sourceHash: '0'.repeat(64) }, { absentSourceHash: '0'.repeat(64) }]) {
    assert.throws(() => planHistoricalImport(records, ['Page.main'], { ...configuration, targets: [{ ...configuration.targets[0], ...change }] }, provenance), /historical recovery/i);
  }
  const collision = historical(1, 'Other page', 'main', 'Historical author');
  assert.throws(() => planHistoricalImport([...records, collision], ['Page.main'], configuration, provenance), /collision/i);
  assert.equal(JSON.stringify({ records, configuration }), before);
});

test('historical additions cannot retarget reviewed current-corpus case corrections', () => {
  const source = record(1, 'Page', 'main', 'Editor', 'Creator', ['Page.OLD']);
  const target = record(1, 'Page', 'old', 'Editor', 'Creator');
  const correction = caseCorrection(source, target);
  const baseline = compileImport(planImport([source, target], ['Page.main']), { referenceCorrections: [correction] });
  const restored = record(1, 'Page', 'OLD', 'Editor', 'Creator');
  restored.historical = { basis: 'latest-retained-definition', absentFromCurrent: structuredClone(restored) };
  const plan = planImport([source, target, restored], ['Page.main']);
  assert.throws(() => compileImport(plan, { referenceCorrections: [correction] }), /unique case-only target/);
  const recovered = compileImport({ ...plan, recovery: { currentTables: 2, historicalTables: 1 } }, { referenceCorrections: [correction] });
  for (const table of baseline.tables) assert.deepEqual(recovered.tables.find(candidate => candidate.id === table.id), table);
  assert.equal(recovered.tables.find(table => table.name === 'Page.OLD').status, 'ready');
  const changed = structuredClone(target);
  changed.sourceHash = '0'.repeat(64);
  const stale = { ...plan, recovery: {}, records: [source, changed, restored] };
  assert.throws(() => compileImport(stale, { referenceCorrections: [correction] }), /stale reference correction target/i);
});

test('historical recovery leaves current zero-weight reference evidence unchanged', () => {
  const current = record(1, 'Page', 'main', 'Editor', 'Creator');
  const inactive = record(1, 'Page', 'inactive', 'Editor', 'Creator', ['Page.old']).table.entries[0];
  inactive.weight = 0;
  current.table.entries.push(inactive);
  const baseline = compileImport(planImport([current], ['Page.main']));
  const historical = record(1, 'Page', 'old', 'Editor', 'Creator');
  historical.historical = { basis: 'latest-retained-definition', absentFromCurrent: structuredClone(historical) };
  const active = record(2, 'Active', 'main', 'Editor', 'Creator', ['Page.old']);
  const plan = { ...planImport([current, historical, active], ['Page.main']), recovery: {} };
  const recovered = compileImport(plan);
  assert.deepEqual(recovered.tables.find(table => table.name === 'Page.main'), baseline.tables[0]);
  assert.equal(recovered.tables.find(table => table.name === 'Active.main').status, 'ready');
  assert.deepEqual(recovered.tables.find(table => table.name === 'Active.main').dependencies, [tableId(historical.table)]);
});

test('XML recovery loading verifies materialized source snapshots, attribution, baseline identity, and paths', context => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'abulafia-xml-recovery-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const digest = content => crypto.createHash('sha256').update(content).digest('hex');
  function save(relative, value) {
    const content = JSON.stringify(value) + '\n';
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    return { file: relative, sha256: digest(content) };
  }
  const baseline = [record(1, 'Current', 'main', 'Editor', 'Creator')];
  baseline[0].sourceHash = digest(JSON.stringify(baseline[0].table));
  const provenance = { repository: 'fixture', commit: 'a'.repeat(40) };
  const latest = record(2, 'Lost', 'main', 'Last author', null).table;
  latest.source.revision_id = 20;
  latest.source.timestamp = '2014-01-01T00:00:00Z';
  latest.raw_source = ';main\n1,Result';
  const original = structuredClone(latest);
  original.source.contributor = { name: 'First author', id: 10 };
  original.source.revision_id = 10;
  const latestFile = save('archive/abulafia-recovery/fixture/2/6d61696e/20.json', latest);
  const originalFile = save('archive/abulafia-recovery/fixture/2/6d61696e/10.json', original);
  const evidence = { sourceId: 'xml-fixture', sourceFile: 'history.xml', sourceSha256: 'b'.repeat(64),
    xmlSha256: 'c'.repeat(64), textSha256: 'd'.repeat(64), rawSha256: digest(latest.raw_source), revisionId: '20' };
  const input = { schemaVersion: 1, ...provenance, baselineSha256: corpusFingerprint(baseline),
    records: [{ sourceFile: latestFile.file, sourceHash: latestFile.sha256,
      originalSourceFile: originalFile.file, originalSourceHash: originalFile.sha256,
      historical: { basis: 'verified-xml-definition', baselineSha256: corpusFingerprint(baseline), evidence } }] };
  const indexFile = 'archive/abulafia-recovery/fixture/manifest.json';
  const configuration = save(indexFile, input);
  const recovered = loadRecoveryCorpus(root, configuration, baseline, provenance);
  assert.equal(recovered.length, 2);
  assert.deepEqual(recovered[0], baseline[0]);
  assert.deepEqual(recovered[1].table, latest);
  assert.deepEqual(recovered[1].originalSnapshot.table, original);
  assert.equal(recovered[1].originalContributor.name, 'First author');
  assert.deepEqual(recovered[1].historical.evidence, evidence);
  assert.throws(() => loadRecoveryCorpus(root, { ...configuration, sha256: '0'.repeat(64) }, baseline, provenance), /recovery.*hash/i);
  assert.throws(() => loadRecoveryCorpus(root, { ...configuration, file: '../outside.json' }, baseline, provenance), /recovery.*path/i);
  for (const change of [{ baselineSha256: '0'.repeat(64) }, { commit: 'f'.repeat(40) },
    { records: [...input.records, input.records[0]] },
    { records: [{ ...input.records[0], sourceHash: '0'.repeat(64) }] },
    { records: [{ ...input.records[0], sourceFile: '../outside.json' }] }]) {
    const changed = save(indexFile, { ...input, ...change });
    assert.throws(() => loadRecoveryCorpus(root, changed, baseline, provenance), /recovery|collision/i);
  }
  save(indexFile, input);
  fs.unlinkSync(path.join(root, latestFile.file));
  fs.symlinkSync(path.join(root, originalFile.file), path.join(root, latestFile.file));
  assert.throws(() => loadRecoveryCorpus(root, configuration, baseline, provenance), /recovery.*symbolic/i);
});

test('legacy name-only attribution joins an unambiguous registered contributor', () => {
  const seed = record(1, 'Seed', 'main', 'Same author', null);
  seed.table.source.contributor.id = 42;
  const legacy = record(2, 'Legacy', 'main', 'Same author', null);
  legacy.table.source.contributor.id = 0;

  assert.equal(planImport([seed, legacy], ['Seed.main']).records.length, 2);
});

test('import artifacts preserve source snapshots and separate the compatibility bundle', () => {
  const root = record(1, 'Seed', 'main', 'Editor', 'Creator');
  const extra = record(2, 'Extra', 'main', 'Editor', 'Creator');
  const plan = planImport([root, extra], ['Seed.main']);
  const bundle = compileImport(plan, { aliases: { recovered: 'Seed.main' } });
  const artifacts = buildArtifacts(plan, bundle, { repository: 'https://example.invalid/wiki', commit: 'test' }, ['Seed.main']);
  const manifest = JSON.parse(artifacts.get('tables/abulafia/manifest.json'));
  const source = JSON.parse(artifacts.get('tables/abulafia/source/1.json'));

  assert.deepEqual(source.tables[0].current.table, root.table);
  assert.equal(manifest.summary.tables, 2);
  assert.equal(manifest.summary.coreTables, 1);
  assert.equal(manifest.tables.length, 2);
  assert.match(artifacts.get('tables/abulafia.js'), /core: true/);
  assert.ok(!artifacts.get('tables/abulafia.js').includes(tableId(extra.table)));
  assert.match(artifacts.get('explorer/abulafia-catalog.js'), /loadCompressed/);
});

test('artifact output never overwrites an existing file or writes half a batch on collision', context => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'abulafia-output-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'existing.txt'), 'User content');
  const artifacts = new Map([['new.txt', 'New content'], ['existing.txt', 'Replacement']]);

  assert.throws(() => writeArtifacts(root, artifacts), /overwrite/i);
  assert.equal(fs.existsSync(path.join(root, 'new.txt')), false);
  assert.equal(fs.readFileSync(path.join(root, 'existing.txt'), 'utf8'), 'User content');
  assert.throws(() => writeArtifacts(root, new Map([['../outside.txt', 'Bad path']])), /outside/i);
});