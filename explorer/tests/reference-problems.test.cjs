const assert = require('node:assert/strict');
const test = require('node:test');
const { collectReferences, renderMarkdown } = require('../tools/reference-problems.cjs');

const missingId = name => `wiki_abulafia_missing_${Buffer.from(name).toString('hex')}`;

function fixture() {
  const absent = missingId('Absent.main');
  const inactive = missingId('Known.main');
  const first = { id: 'wiki_abulafia_1_61', label: 'Caller.main', blocked: true,
    wiki: { name: 'Caller.main', status: 'blocked', sourceFile: 'tables/caller/table.json', sourceHash: 'a'.repeat(64),
      archiveFile: 'tables/abulafia/source/1.json', entries: [{ rawText: '[Absent.main] / [Absent.main]' }],
      issues: [{ code: 'missing_reference', detail: 'Absent.main' }, { code: 'unsupported_reference', detail: 'Cannot parse [Odd|<target>]' },
        { code: 'cycle', detail: 'An unrelated cycle' }] },
    entries: [{ text: 'compiled', weight: 3, references: [absent, absent] }] };
  const second = { id: 'wiki_abulafia_2_61', label: 'History.main', blocked: false,
    wiki: { name: 'History.main', status: 'ready', historical: { basis: 'latest-retained-definition' },
      archiveFile: 'tables/abulafia/source/historical/2.json', entries: [{ rawText: '[Absent.main]' }, { rawText: '[Known.main]' }], issues: [] },
    entries: [{ text: 'inactive', weight: 0, references: [absent] }, { text: 'inactive case', weight: 0, references: [inactive] }] };
  const known = { id: 'wiki_abulafia_3_61', label: 'Known.Main', blocked: false,
    wiki: { name: 'Known.Main', status: 'ready', entries: [], issues: [] }, entries: [] };
  const tables = [first, second, known];
  return { model: { tables, nodes: [...tables, { id: absent, missing: true }, { id: inactive, missing: true }] },
    quarantine: { summary: { readyTables: 2, blockedTables: 1 }, referenceTargets: [
      { name: 'Absent.main', directTableIds: [first.id], affectedTables: 7 },
      { name: 'Diagnostic.main', directTableIds: [first.id], affectedTables: 1 }
    ] } };
}

test('reference inventory unions all graph targets and named diagnostics without dropping inactive rows', () => {
  const input = fixture();
  const before = JSON.stringify(input);
  const report = collectReferences(input.model, input.quarantine);
  assert.deepEqual(report.targets.map(target => target.name), ['Absent.main', 'Diagnostic.main', 'Known.main']);
  assert.equal(report.summary.graphTargets, 2);
  assert.equal(report.summary.namedDiagnosticTargets, 2);
  assert.equal(report.summary.targets, 3);
  assert.equal(report.summary.graphOnlyTargets, 1);
  assert.equal(report.summary.diagnosticOnlyTargets, 1);
  const absent = report.targets[0];
  assert.equal(absent.referrers.length, 2);
  assert.deepEqual(absent.referrers[0].rows, [{ row: 1, weight: 3, references: 2, rawText: '[Absent.main] / [Absent.main]' }]);
  assert.equal(absent.referrers[1].scope, 'historical');
  assert.equal(absent.referrers[1].rows[0].weight, 0);
  assert.equal(report.targets[1].referrers[0].rows.length, 0);
  assert.equal(JSON.stringify(input), before);
});

test('case matches remain suggestions and reference diagnostics retain exact source evidence', () => {
  const input = fixture();
  const report = collectReferences(input.model, input.quarantine);
  const target = report.targets.find(record => record.name === 'Known.main');
  assert.equal(target.classification, 'unique-case-ready');
  assert.deepEqual(target.matches, [{ id: 'wiki_abulafia_3_61', name: 'Known.Main', status: 'ready' }]);
  assert.equal(target.namedDiagnostic, false);
  assert.equal(target.referrers[0].status, 'ready');
  assert.equal(report.diagnostics.length, 1);
  assert.deepEqual(report.diagnostics[0].issues.map(issue => issue.code), ['missing_reference', 'unsupported_reference']);
  assert.equal(report.diagnostics[0].sourceHash, 'a'.repeat(64));
  assert.equal(input.model.tables[0].wiki.status, 'blocked');
  const markdown = renderMarkdown(report);
  assert.match(markdown, /Absent\.main/);
  assert.match(markdown, /Known\.Main/);
  assert.match(markdown, /Diagnostic\.main/);
  assert.match(markdown, /tables\/abulafia\/source\/historical\/2\.json/);
  assert.match(markdown, /weight 0/);
  assert.doesNotMatch(markdown, /<target>/);
  assert.match(markdown, /&lt;target&gt;/);
});

test('ambiguous matches and malformed report identities cannot silently collapse into a correction', () => {
  const input = fixture();
  input.model.tables.push({ id: 'wiki_abulafia_4_61', label: 'KNOWN.MAIN', blocked: true,
    wiki: { name: 'KNOWN.MAIN', status: 'blocked', entries: [], issues: [] }, entries: [] });
  const report = collectReferences(input.model, input.quarantine);
  assert.equal(report.targets.find(target => target.name === 'Known.main').classification, 'ambiguous-case');
  input.quarantine.referenceTargets[0].directTableIds.push('unknown-source');
  assert.throws(() => collectReferences(input.model, input.quarantine), /Unknown referring table/);
});
