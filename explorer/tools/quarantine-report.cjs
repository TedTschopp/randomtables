const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');
const { tableId, writeArtifacts } = require('./import-abulafia.cjs');

function compare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function analyzeManifest(manifest) {
  if (!Array.isArray(manifest.tables)) throw new Error('Manifest tables must be an array');
  const tables = [...manifest.tables].sort((left, right) => compare(left.id, right.id));
  const byId = new Map();
  for (const table of tables) {
    if (typeof table.id !== 'string' || !table.id || byId.has(table.id)) throw new Error('Table IDs must be unique nonempty strings');
    if (typeof table.name !== 'string' || !table.name || !['ready', 'blocked'].includes(table.status) ||
        !Array.isArray(table.dependencies) || table.dependencies.some(id => typeof id !== 'string') ||
        !Array.isArray(table.issues) || table.issues.some(issue => typeof issue.code !== 'string' || typeof issue.detail !== 'string')) {
      throw new Error(`Invalid table metadata: ${table.id}`);
    }
    byId.set(table.id, table);
  }
  const blocked = tables.filter(table => table.status === 'blocked');
  if (manifest.summary && (manifest.summary.tables !== tables.length || manifest.summary.blocked !== blocked.length ||
      manifest.summary.ready !== tables.length - blocked.length)) throw new Error('Manifest summary does not match its tables');
  for (const table of tables.filter(record => record.status === 'ready')) {
    if (table.issues.length) throw new Error(`Ready table has issues: ${table.id}`);
    if (table.dependencies.some(id => byId.get(id)?.status !== 'ready')) throw new Error(`Ready table depends on an unavailable table: ${table.id}`);
  }
  const localIssues = new Map(blocked.map(table => {
    const issues = table.issues.filter(issue => issue.code !== 'blocked_dependency');
    const recordedMissing = new Set(issues.filter(issue => issue.code === 'missing_reference')
      .map(issue => `wiki_abulafia_missing_${Buffer.from(issue.detail, 'utf8').toString('hex')}`));
    const inferred = [...new Set(table.dependencies.filter(id => !byId.has(id) && !recordedMissing.has(id)))]
      .map(id => ({ code: 'unrecorded_dependency', detail: id }));
    return [table.id, [...issues, ...inferred]];
  }));
  const blockedIds = new Set(blocked.map(table => table.id));
  const edges = new Map(blocked.map(table => [table.id, [...new Set(table.dependencies.filter(id => blockedIds.has(id)))].sort(compare)]));
  const parents = new Map(blocked.map(table => [table.id, []]));
  for (const [id, dependencies] of edges) for (const dependency of dependencies) parents.get(dependency).push(id);
  const visited = new Set();
  const finished = [];
  for (const table of blocked) {
    const pending = [[table.id, false]];
    while (pending.length) {
      const [id, leaving] = pending.pop();
      if (leaving) {
        finished.push(id);
      } else if (!visited.has(id)) {
        visited.add(id);
        pending.push([id, true]);
        for (const dependency of [...edges.get(id)].reverse()) if (!visited.has(dependency)) pending.push([dependency, false]);
      }
    }
  }
  const components = [];
  visited.clear();
  for (const id of finished.reverse()) {
    if (visited.has(id)) continue;
    const members = [];
    const pending = [id];
    while (pending.length) {
      const current = pending.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      members.push(current);
      pending.push(...parents.get(current));
    }
    components.push({ tableIds: members.sort(compare), dependencies: new Set(), parents: new Set(), rootIds: new Set() });
  }
  components.sort((left, right) => compare(left.tableIds[0], right.tableIds[0]));
  const componentById = new Map(components.flatMap(component => component.tableIds.map(id => [id, component])));
  for (const component of components) {
    for (const id of component.tableIds) {
      for (const dependency of edges.get(id)) {
        const target = componentById.get(dependency);
        if (target !== component) {
          component.dependencies.add(target);
          target.parents.add(component);
        }
      }
    }
  }
  const roots = [];
  for (const component of components) {
    const issues = component.tableIds.flatMap(id => localIssues.get(id)
      .map(issue => ({ tableId: id, code: issue.code, detail: issue.detail })))
      .sort((left, right) => compare(left.tableId, right.tableId) || compare(left.code, right.code) || compare(left.detail, right.detail));
    const cyclic = component.tableIds.length > 1 || edges.get(component.tableIds[0]).includes(component.tableIds[0]);
    const unexplained = !issues.length && !cyclic && !component.dependencies.size;
    if (!issues.length && !cyclic && !unexplained) continue;
    const root = {
      id: `root:${component.tableIds[0]}`, tableIds: component.tableIds,
      names: component.tableIds.map(id => byId.get(id).name), cyclic, unexplained, issues,
      affectedTables: 0, downstreamTables: 0, conditionalRecovery: 0
    };
    component.rootIds.add(root.id);
    roots.push(root);
  }
  const pending = components.filter(component => !component.dependencies.size);
  const remaining = new Map(components.map(component => [component, component.dependencies.size]));
  for (let index = 0; index < pending.length; index += 1) {
    const component = pending[index];
    for (const parent of component.parents) {
      for (const root of component.rootIds) parent.rootIds.add(root);
      remaining.set(parent, remaining.get(parent) - 1);
      if (!remaining.get(parent)) pending.push(parent);
    }
  }
  if (pending.length !== components.length) throw new Error('Component graph must be acyclic');
  const rootsById = new Map(roots.map(root => [root.id, root]));
  const records = blocked.map(table => {
    const rootIds = [...componentById.get(table.id).rootIds].sort(compare);
    if (!rootIds.length) throw new Error(`Blocked table has no repair candidate: ${table.id}`);
    for (const id of rootIds) {
      const root = rootsById.get(id);
      root.affectedTables += 1;
      if (!root.tableIds.includes(table.id)) root.downstreamTables += 1;
      if (rootIds.length === 1) root.conditionalRecovery += 1;
    }
    return { id: table.id, name: table.name, rootIds };
  });
  roots.sort((left, right) => right.conditionalRecovery - left.conditionalRecovery || right.affectedTables - left.affectedTables || compare(left.id, right.id));
  return {
    summary: {
      importedTables: tables.length, readyTables: tables.length - blocked.length, blockedTables: blocked.length,
      dependencyOnlyTables: blocked.filter(table => table.issues.length > 0 && table.issues.every(issue => issue.code === 'blocked_dependency')).length,
      multipleRootTables: records.filter(table => table.rootIds.length > 1).length,
      rootComponents: roots.length, cyclicComponents: roots.filter(root => root.cyclic).length,
      unexplainedTables: roots.filter(root => root.unexplained).reduce((total, root) => total + root.tableIds.length, 0)
    },
    roots,
    tables: records
  };
}

const familyDefinitions = {
  references: { label: 'Missing, ambiguous, or unsupported references', effort: 'small to large',
    proposal: 'Review exact reference tokens and source history; record explicit table-scoped corrections without adding global aliases or changing identifiers.' },
  recursion: { label: 'Recursive generation', effort: 'large',
    proposal: 'Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.' },
  source: { label: 'Empty tables, weights, or extraction warnings', effort: 'medium',
    proposal: 'Review archived raw source and extractor warnings; recover verified rows through documented corrections, preserving weights and leaving genuinely empty sources blocked.' },
  expressions: { label: 'Expressions or malformed source syntax', effort: 'medium to large',
    proposal: 'Distinguish malformed delimiters, unsupported reference operators, and argument restrictions from unsupported macro names before implementing a conversion rule.' },
  limits: { label: 'Expansion or validation limits', effort: 'medium to large',
    proposal: 'Identify the exceeded bound and test a semantics-preserving validation optimization; retain all browser depth, operation, call, and output guards.' },
  safety: { label: 'Unsafe source markup', effort: 'medium',
    proposal: 'Review the source construct for an inert text projection; never enable arbitrary HTML, scripts, styles, or URLs.' },
  review: { label: 'Unexplained or unclassified source defects', effort: 'unknown',
    proposal: 'Reproduce the importer diagnostic against the pinned source before estimating a repair.' }
};

function issueFamily(issue) {
  if (['missing_reference', 'source_unresolved', 'unsupported_reference', 'reference_mismatch', 'ambiguous_reference', 'unrecorded_dependency'].includes(issue.code)) return 'references';
  if (issue.code === 'cycle' || /^Cyclic /.test(issue.detail)) return 'recursion';
  if (issue.code === 'expansion_limit' || /exceeds|budget|4096|65536/.test(issue.detail)) return 'limits';
  if (['empty_table', 'invalid_weight', 'source_warning'].includes(issue.code)) return 'source';
  if (issue.code === 'unsafe_html') return 'safety';
  if (/^unsupported_/.test(issue.code)) return 'expressions';
  return 'review';
}

function describeRepairs(analysis, manifest, snapshots) {
  const byId = new Map(manifest.tables.map(table => [table.id, table]));
  const foldedNames = new Map();
  for (const table of manifest.tables) {
    const key = table.name.toLowerCase();
    if (!foldedNames.has(key)) foldedNames.set(key, []);
    foldedNames.get(key).push({ id: table.id, name: table.name, status: table.status });
  }
  const targets = new Map();
  for (const root of analysis.roots) for (const issue of root.issues.filter(record => record.code === 'missing_reference')) {
    if (!targets.has(issue.detail)) {
      const matches = [...(foldedNames.get(issue.detail.toLowerCase()) || [])].sort((left, right) => compare(left.id, right.id));
      const classification = matches.some(table => table.name === issue.detail) ? 'exact-imported' : matches.length > 1 ? 'ambiguous-case' :
        !matches.length ? 'absent-from-import' : matches[0].status === 'ready' ? 'unique-case-ready' : 'unique-case-blocked';
      targets.set(issue.detail, { name: issue.detail, classification, matches, directTableIds: new Set(), rootIds: new Set() });
    }
    targets.get(issue.detail).directTableIds.add(issue.tableId);
    targets.get(issue.detail).rootIds.add(root.id);
  }
  const caseRoots = new Set();
  const roots = analysis.roots.map(root => {
    const families = [...new Set([...root.issues.map(issueFamily), ...(root.cyclic ? ['recursion'] : []), ...(root.unexplained ? ['review'] : [])])].sort(compare);
    const missingTargets = [...new Set(root.issues.filter(issue => issue.code === 'missing_reference').map(issue => issue.detail))].sort(compare);
    const examples = [];
    const hiddenSelfReferences = [];
    const sourceWarnings = [];
    const verifiedTargets = new Set();
    const verifiedTokens = new Set();
    for (const id of root.tableIds) {
      const metadata = byId.get(id);
      const snapshot = snapshots.get(id);
      if (!snapshot || !Array.isArray(snapshot.entries)) throw new Error(`Missing archived snapshot: ${id}`);
      for (const warning of snapshot.warnings || []) sourceWarnings.push({ tableId: id, warning });
      const relevant = [];
      for (const [index, entry] of snapshot.entries.entries()) {
        const active = Number.isSafeInteger(entry.weight) && entry.weight > 0;
        const invalid = !Number.isSafeInteger(entry.weight) || entry.weight < 0;
        if (!active && !(invalid && families.includes('source'))) continue;
        const references = entry.references || [];
        let score = invalid ? 10 : 0;
        let remainder = entry.text;
        for (const reference of references) {
          if (reference.raw) remainder = remainder.split(reference.raw).join('');
          if (missingTargets.includes(reference.target_qualified_name)) {
            score += 10;
            if (active && reference.raw === `[${reference.token}]` && entry.text.includes(reference.raw) &&
                ['local', 'cross_page'].includes(reference.kind)) {
              verifiedTargets.add(`${id}:${reference.target_qualified_name}`);
              verifiedTokens.add(`${id}:${reference.raw}`);
            }
          }
          if (root.cyclic && root.names.includes(reference.target_qualified_name)) score += 8;
        }
        const selfNames = new Set([metadata.name, snapshot.subtable?.name].filter(Boolean));
        for (const [raw, token] of entry.text.matchAll(/\[([^\[\]\r\n]+)\]/g)) {
          if (selfNames.has(token) && !references.some(reference => reference.raw === raw)) {
            hiddenSelfReferences.push({ tableId: id, row: index + 1, token });
            score += 12;
          }
        }
        if (/[{}\[\]]|%[^%]+%/.test(remainder)) score += 4;
        if (families.includes('safety') && /<[^>]+>/.test(entry.text)) score += 6;
        relevant.push({ row: index + 1, weight: entry.weight, text: entry.text, score });
      }
      relevant.sort((left, right) => right.score - left.score || left.row - right.row);
      for (const entry of relevant.slice(0, 2)) {
        examples.push({ tableId: id, name: metadata.name, sourceFile: metadata.sourceFile, archiveFile: metadata.archiveFile,
          row: entry.row, weight: entry.weight, text: entry.text.slice(0, 480), truncated: entry.text.length > 480, kind: 'source-row' });
      }
      if (!relevant.length) examples.push({ tableId: id, name: metadata.name, sourceFile: metadata.sourceFile, archiveFile: metadata.archiveFile,
        text: (snapshot.raw_source || '').slice(0, 480), truncated: (snapshot.raw_source || '').length > 480, kind: 'raw-source' });
    }
    const caseCandidate = !root.cyclic && !hiddenSelfReferences.length && missingTargets.length > 0 &&
      missingTargets.every(name => targets.get(name).classification === 'unique-case-ready') &&
      root.issues.every(issue => issue.code === 'source_unresolved' ||
        (issue.code === 'missing_reference' && verifiedTargets.has(`${issue.tableId}:${issue.detail}`)) ||
        (issue.code === 'unsupported_reference' && verifiedTokens.has(`${issue.tableId}:${issue.detail}`)));
    const proposals = families.map(family => familyDefinitions[family].proposal);
    let confidence = { level: 'medium', basis: 'The recorded defect is identifiable; repair semantics and post-repair dependencies still require validation.' };
    let effort = families.length === 1 ? familyDefinitions[families[0]].effort : 'multiple changes';
    if (caseCandidate) {
      caseRoots.add(root.id);
      confidence = { level: 'high', basis: 'Every missing target has one case-only match already imported and ready, and its active source token is verified. This supports review, not automatic approval.' };
      effort = 'small';
      proposals.unshift('Review the listed case-only targets as explicit, source-bound reference corrections; rerun all dependency, weight, probability, and collision checks.');
    }
    if (missingTargets.some(name => targets.get(name).classification === 'absent-from-import')) {
      proposals.unshift('Inspect the current source namespace and retained history for the absent target; absence from the import does not prove the source was lost. Do not invent a substitute or import another contributor implicitly.');
      confidence = { level: 'low', basis: 'No case-only target exists in the imported catalog; the correct replacement has not been established.' };
    }
    if (missingTargets.some(name => targets.get(name).classification === 'unique-case-blocked')) {
      proposals.unshift('A case-only candidate is itself blocked. Confirm the mapping and repair that target as well; correcting spelling alone cannot make this table ready.');
      confidence = { level: 'low', basis: 'The proposed target adds unresolved blockers that are absent from the current graph estimate.' };
    }
    if (missingTargets.some(name => ['ambiguous-case', 'exact-imported'].includes(targets.get(name).classification))) {
      confidence = { level: 'low', basis: 'Target identity or recorded resolution is ambiguous and needs source review.' };
    }
    if (root.cyclic || root.unexplained) confidence = { level: 'low', basis: root.cyclic ? 'The cycle is proven, but a terminating semantics-preserving repair has not been established.' : 'No explanatory local diagnostic exists.' };
    if (hiddenSelfReferences.length) {
      proposals.unshift('The unrecorded self-reference may introduce a new cycle after delimiter repair. Do not count a bracket-only edit as recovery.');
      confidence = { level: 'low', basis: 'The recorded dependency graph omits a possible self-reference in malformed source.' };
    }
    return { ...root, families, missingTargets, confidence, effort, proposals, examples: examples.slice(0, 6), hiddenSelfReferences, sourceWarnings };
  });
  const rootById = new Map(roots.map(root => [root.id, root]));
  const referenceTargets = [...targets.values()].map(target => ({
    ...target, directTableIds: [...target.directTableIds].sort(compare), rootIds: [...target.rootIds].sort(compare),
    affectedTables: analysis.tables.filter(table => table.rootIds.some(id => target.rootIds.has(id))).length
  })).sort((left, right) => right.affectedTables - left.affectedTables || compare(left.name, right.name));
  const families = Object.entries(familyDefinitions).map(([id, definition]) => {
    const members = roots.filter(root => root.families.includes(id));
    const memberIds = new Set(members.map(root => root.id));
    return { id, label: definition.label, rootComponents: members.length,
      localTables: new Set(members.flatMap(root => root.issues.filter(issue => issueFamily(issue) === id).map(issue => issue.tableId)
        .concat(id === 'recursion' && root.cyclic ? root.tableIds : []))).size,
      affectedTables: analysis.tables.filter(table => table.rootIds.some(root => memberIds.has(root))).length,
      exclusiveRecovery: analysis.tables.filter(table => table.rootIds.every(root => rootById.get(root).families.length === 1 && memberIds.has(root))).length };
  }).filter(family => family.rootComponents).sort((left, right) => right.exclusiveRecovery - left.exclusiveRecovery || compare(left.id, right.id));
  const candidateTableIds = new Set(roots.filter(root => caseRoots.has(root.id)).flatMap(root => root.tableIds));
  const batchTargets = referenceTargets.filter(target => target.rootIds.some(id => caseRoots.has(id))).map(target => ({
    from: target.name, to: target.matches[0].name, targetId: target.matches[0].id,
    referringTableIds: target.directTableIds.filter(id => candidateTableIds.has(id))
  })).sort((left, right) => compare(left.from, right.from));
  const conditionalTableIds = analysis.tables.filter(table => table.rootIds.every(id => caseRoots.has(id))).map(table => table.id);
  const diagnostics = new Map();
  for (const table of manifest.tables) for (const code of new Set(table.issues.map(issue => issue.code))) diagnostics.set(code, (diagnostics.get(code) || 0) + 1);
  return {
    ...analysis, roots, families, referenceTargets,
    diagnostics: Object.fromEntries([...diagnostics].sort((left, right) => right[1] - left[1] || compare(left[0], right[0]))),
    caseCorrectionBatch: { rootIds: [...caseRoots].sort(compare), targets: batchTargets, conditionalTableIds,
      conditionalRecovery: conditionalTableIds.length,
      affectedTables: analysis.tables.filter(table => table.rootIds.some(id => caseRoots.has(id))).length }
  };
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function readContained(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) throw new Error('Input paths must be repository-relative');
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) throw new Error(`Input is outside the repository: ${relative}`);
  for (let current = target; current !== root; current = path.dirname(current)) {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Refusing to read a symbolic link: ${relative}`);
  }
  if (!fs.statSync(target).isFile()) throw new Error(`Input must be a regular file: ${relative}`);
  return fs.readFileSync(target);
}

function buildReport(repo) {
  const root = fs.realpathSync(repo);
  const inputHashes = {};
  function read(file) {
    const content = readContained(root, file);
    inputHashes[file] = hash(content);
    return content;
  }
  const manifestFile = 'tables/abulafia/manifest.json';
  const manifestBytes = read(manifestFile);
  const manifest = JSON.parse(manifestBytes);
  const inventoryFile = 'Docs/macro-inventory.json';
  const inventory = JSON.parse(read(inventoryFile));
  assert.equal(inventory.provenance.manifestSha256, hash(manifestBytes), 'Inventory manifest hash is stale');
  assert.equal(inventory.provenance.manifest, manifestFile, 'Inventory manifest path mismatch');
  assert.equal(inventory.provenance.commit, manifest.commit, 'Inventory source revision mismatch');
  assert.equal(inventory.provenance.repository, manifest.repository, 'Inventory source repository mismatch');
  assert.match(manifest.repository, /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/, 'Expected a pinned GitHub source repository');
  assert.match(inventory.generatedOn, /^\d{4}-\d{2}-\d{2}$/, 'Inventory snapshot date is required');
  for (const [file, expected] of Object.entries(inventory.provenance.supportFileHashes)) assert.equal(hash(read(file)), expected, `Inventory support hash mismatch: ${file}`);
  for (const [file, expected] of [['JS/wiki-import.js', inventory.provenance.runtimeSha256], ['explorer/tools/import-abulafia.cjs', inventory.provenance.compilerSha256]]) {
    if (expected) assert.equal(hash(read(file)), expected, `Inventory support hash mismatch: ${file}`);
  }
  read('explorer/tools/quarantine-report.cjs');
  const analysis = analyzeManifest(manifest);
  const notImported = inventory.scope.notImportedTables;
  assert.ok(Number.isSafeInteger(notImported) && notImported >= 0, 'Inventory not-imported count must be nonnegative');
  assert.equal(inventory.scope.importedTables, analysis.summary.importedTables, 'Inventory imported count mismatch');
  assert.equal(inventory.scope.currentWikiTables, analysis.summary.importedTables + notImported, 'Inventory current scope mismatch');
  const readyRuntime = manifest.tables.filter(table => table.status === 'ready' && table.execution === 'wiki').length;
  const expectedStates = { 'ready-static': analysis.summary.readyTables - readyRuntime, 'ready-runtime': readyRuntime,
    blocked: analysis.summary.blockedTables, 'not-imported': notImported };
  for (const [state, count] of Object.entries(expectedStates)) assert.equal(inventory.current.summary.byState[state] || 0, count, `Inventory state mismatch: ${state}`);
  const metadata = new Map(manifest.tables.map(table => [table.id, table]));
  const archives = new Map();
  const snapshots = new Map();
  for (const id of [...new Set(analysis.roots.flatMap(component => component.tableIds))].sort(compare)) {
    const table = metadata.get(id);
    assert.match(table.archiveFile, /^tables\/abulafia\/source\/\d+\.json$/, 'Unexpected archive path');
    if (!archives.has(table.archiveFile)) {
      const content = read(table.archiveFile);
      const expected = manifest.generatedFiles[table.archiveFile];
      assert.ok(expected, `Missing archive provenance: ${table.archiveFile}`);
      assert.equal(hash(content), expected.sha256, `Archive hash mismatch: ${table.archiveFile}`);
      assert.equal(content.length, expected.bytes, `Archive byte count mismatch: ${table.archiveFile}`);
      const archive = JSON.parse(content);
      assert.equal(archive.commit, manifest.commit, 'Archive source revision mismatch');
      assert.equal(archive.repository, manifest.repository, 'Archive source repository mismatch');
      archives.set(table.archiveFile, archive);
    }
    const records = archives.get(table.archiveFile).tables.filter(record => record.current.sourceFile === table.sourceFile);
    assert.equal(records.length, 1, `Expected one archived source record: ${table.name}`);
    const current = records[0].current;
    assert.equal(current.sourceHash, table.sourceHash, `Archived source hash mismatch: ${table.name}`);
    assert.equal(tableId(current.table), id, `Archived table ID mismatch: ${table.name}`);
    assert.equal(current.table.subtable.qualified_name, table.name, 'Archived table name mismatch');
    assert.equal(current.table.source.revision_id, table.sourceRevision, 'Archived table revision mismatch');
    snapshots.set(id, current.table);
  }
  return {
    schemaVersion: 1, snapshotDate: inventory.generatedOn,
    provenance: { repository: manifest.repository, commit: manifest.commit, manifest: manifestFile, manifestSha256: hash(manifestBytes),
      macroInventory: inventoryFile, inputHashes: Object.fromEntries(Object.entries(inputHashes).sort(([left], [right]) => compare(left, right))) },
    scope: { currentWikiTables: inventory.scope.currentWikiTables, importedTables: analysis.summary.importedTables,
      notImportedTables: notImported, archivedPagesInspected: archives.size, stateCounts: expectedStates },
    ...describeRepairs(analysis, manifest, snapshots)
  };
}

function renderMarkdown(report) {
  const number = value => value.toLocaleString('en-US');
  const label = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/[\r\n]/g, ' ').replace(/\|/g, ' / ').replace(/[\\`*_\[\]]/g, '\\$&');
  const code = value => {
    const text = String(value).replace(/[\r\n]/g, ' ').replace(/\|/g, '\\|').trim();
    const delimiter = '`'.repeat(Math.max(0, ...Array.from(text.matchAll(/`+/g), match => match[0].length)) + 1);
    const padding = /^`|`$/.test(text) ? ' ' : '';
    return `${delimiter}${padding}${text}${padding}${delimiter}`;
  };
  const encodePath = value => value.split('/').map(encodeURIComponent).join('/');
  const sourceLink = example => `[pinned source](${report.provenance.repository}/blob/${report.provenance.commit}/${encodePath(example.sourceFile)})`;
  const tableLink = (root, id) => {
    const index = root.tableIds.indexOf(id);
    const example = root.examples.find(record => record.tableId === id);
    return example?.archiveFile ? `[${label(root.names[index])}](../${encodePath(example.archiveFile)})` : label(root.names[index]);
  };
  const names = root => root.tableIds.slice(0, 2).map(id => tableLink(root, id)).join(' + ') + (root.tableIds.length > 2 ? ` (+${root.tableIds.length - 2} more)` : '');
  const candidateRoots = new Set(report.caseCorrectionBatch.rootIds);
  const lines = [
    '# Quarantine Recovery Report', '',
    `Snapshot: ${report.snapshotDate}. Source revision: ${code(report.provenance.commit)}.`, '',
    `The imported catalog contains **${number(report.summary.readyTables)} ready** and **${number(report.summary.blockedTables)} quarantined** tables. This report changes neither source data nor readiness.`, '',
    `The **${number(report.scope.notImportedTables)} current tables that are not imported** remain outside this repair scope. No new contributor or table is imported, and no global alias is proposed.`, '',
    '## Recommendation', '',
    `Review the **case-only reference corrections** first: ${number(candidateRoots.size)} repair components reference ${number(report.caseCorrectionBatch.targets.length)} distinct misspelled target names, each with exactly one case-only match already imported and ready.`, '',
    `Their combined conditional recovery is **${number(report.caseCorrectionBatch.conditionalRecovery)} tables**, calculated as a union rather than a sum. Their total reach is ${number(report.caseCorrectionBatch.affectedTables)} blocked tables; other defects still prevent recovery of the remainder.`, '',
    'These are review candidates, not automatic corrections. Preserve original spelling in the archive and record any approved mapping against its source table, row, and hash.', '',
    '## How Counts Work', '',
    '- A repair component is a table with local diagnostics, or a strongly connected group of tables that must be reviewed together. It can contain more than one defect.',
    '- Reach counts each blocked table once per component, including the component itself. A shared descendant is not counted twice within that component.',
    '- Conditional recovery counts tables whose complete recorded blocker set would be removed by repairing that component or the specified batch. It is a graph estimate, not a promise of readiness.',
    '- New dependencies, previously unrecorded references, probabilities, and expansion costs must be checked again. These can reduce actual recovery; removing a shared compiler rejection may also enable additional tables not captured by this estimate.',
    '- Component reach, diagnostic counts, and family totals overlap and must not be added. The single-family column includes only tables whose recorded blockers all belong exclusively to that family.',
    '- Confidence describes evidence for a proposed repair, not certainty that the original author intended it. Effort is qualitative and is not a delivery estimate.', '',
    `The graph has **${number(report.summary.rootComponents)} repair components**, including **${number(report.summary.cyclicComponents)} cyclic components**. **${number(report.summary.dependencyOnlyTables)} tables have only dependency diagnostics**; **${number(report.summary.multipleRootTables)} depend on multiple repair components**. Unexplained blocked tables: ${number(report.summary.unexplainedTables)}.`, '',
    '## Blocker Families', '',
    '| Family | Locally Implicated Tables | Components | Reach | Single-Family Conditional Recovery |',
    '| --- | ---: | ---: | ---: | ---: |'
  ];
  for (const family of report.families) lines.push(`| ${family.label} | ${number(family.localTables)} | ${number(family.rootComponents)} | ${number(family.affectedTables)} | ${number(family.exclusiveRecovery)} |`);
  lines.push('', 'Families classify recorded diagnostics, not verified independent causes. Generic syntax errors can be secondary to missing references or macro argument failures.', '',
    '## Ranked Repair Components', '', 'Ordered by conditional recovery, then reach. Source links open preserved local archives; complete memberships and blocker sets are in the [JSON report](quarantine-report.json).', '',
    '| Rank | Component | Conditional Recovery | Reach | Downstream | Confidence | Effort |',
    '| ---: | --- | ---: | ---: | ---: | --- | --- |');
  for (const [index, root] of report.roots.slice(0, 20).entries()) lines.push(`| ${index + 1} | ${names(root)} | ${number(root.conditionalRecovery)} | ${number(root.affectedTables)} | ${number(root.downstreamTables)} | ${root.confidence.level} | ${root.effort} |`);
  lines.push('', '## Case-Correction Review Batch', '',
    'Only components with verified selectable source tokens and no remaining local diagnostic outside missing-reference resolution qualify. Case folding is used to suggest candidates, never to merge or resolve IDs. Zero-weight rows do not qualify.', '',
    '| Component | Missing Target | Ready Candidate | Individual Conditional Recovery |',
    '| --- | --- | --- | ---: |');
  const targets = new Map(report.referenceTargets.map(target => [target.name, target]));
  for (const root of report.roots.filter(record => candidateRoots.has(record.id)).slice(0, 12)) {
    lines.push(`| ${names(root)} | ${root.missingTargets.map(code).join(', ')} | ${root.missingTargets.map(name => code(targets.get(name).matches[0].name)).join(', ')} | ${number(root.conditionalRecovery)} |`);
  }
  lines.push('', 'The JSON report retains the entire proposed batch, exact referring table IDs, and the deduplicated conditional recovery set. Case-only candidates that are themselves blocked, ambiguous matches, and absent targets are excluded.', '',
    '## Source Evidence', '');
  for (const [index, root] of report.roots.slice(0, 10).entries()) {
    lines.push(`### ${index + 1}. ${root.names.slice(0, 2).map(label).join(' + ')}`, '',
      `Conditional recovery: **${number(root.conditionalRecovery)}**. Reach: **${number(root.affectedTables)}**. Confidence: **${root.confidence.level}**. Effort: ${root.effort}.`, '',
      `Diagnostics: ${[...new Set(root.issues.map(issue => issue.code))].map(code).join(', ') || 'Graph-derived cycle or unexplained source'}.`, '');
    for (const example of root.examples.slice(0, 2)) {
      const position = example.kind === 'source-row' ? `entry ${example.row}, weight ${example.weight}` : 'raw source';
      lines.push(`- ${label(example.name)}, ${position}, ${sourceLink(example)}: ${code(example.text)}${example.truncated ? ' (excerpt truncated)' : ''}`);
    }
    for (const name of root.missingTargets) {
      const target = targets.get(name);
      lines.push(`- Target ${code(name)}: ${target.classification}; ${target.matches.length ? target.matches.map(match => `${code(match.name)} (${match.status})`).join(', ') : 'no case-only candidate in the import'}.`);
    }
    for (const warning of root.sourceWarnings.slice(0, 2)) lines.push(`- Extractor warning: ${code(warning.warning)}`);
    lines.push('', `Evidence basis: ${root.confidence.basis}`, '', 'Proposed repair:', '');
    for (const proposal of root.proposals) lines.push(`- ${proposal}`);
    lines.push('');
  }
  lines.push('## Recorded Diagnostics', '', 'Counts are distinct tables per diagnostic code. One source defect can produce several codes; these are not separate recoverable-table counts.', '',
    '| Diagnostic | Tables |', '| --- | ---: |');
  for (const [diagnostic, count] of Object.entries(report.diagnostics)) lines.push(`| ${code(diagnostic)} | ${number(count)} |`);
  lines.push('', '## Required Verification', '',
    '1. Bind every approved correction to source identity, original token, and source hash. Preserve archived text, weights, namespaced IDs, contributor coverage, and existing aliases.',
    '2. Add a failing focused regression before changing conversion behavior. Verify exact target resolution and row probabilities, including zero-weight rows.',
    '3. Recompile the complete selected corpus. Recompute dependencies, cycles, and worst-case costs without relaxing browser limits. Promote only tables that pass every guard.',
    '4. Verify prior ready values and programs remain unchanged. Check every selectable row of newly ready runtime tables with deterministic dependency choices.',
    '5. Run unit and artifact-integrity checks, then actual offline desktop/mobile browser acceptance for any promoted tables.', '',
    '## Reproduce', '',
    'This optional Node development tool reads the pinned manifest, the matching macro inventory, and hash-verified local source archives. The application itself still runs directly from HTML; no server is added.', '',
    '```sh', 'node explorer/tools/quarantine-report.cjs --output Docs', 'npm --prefix explorer run test:quarantine', '```', '',
    'Omit `--output` for a read-only summary. Identical reports are left untouched; different existing reports, symbolic links, stale inventory hashes, or changed source evidence are rejected. Use a new existing output directory to review a later snapshot before replacing published reports.', '',
    `Manifest: [source manifest](../tables/abulafia/manifest.json), SHA-256 ${code(report.provenance.manifestSha256)}.`, '',
    `Evidence: ${number(report.scope.archivedPagesInspected)} inspected source archives. Input hashes, source links, per-table blocker sets, case candidates, and every ranked component are retained in [quarantine-report.json](quarantine-report.json).`, '');
  return lines.join('\n');
}

function writeReport(repo, outputRoot, report) {
  const root = fs.realpathSync(repo);
  for (const [file, expected] of Object.entries(report.provenance.inputHashes)) {
    assert.equal(hash(readContained(root, file)), expected, `Input changed after analysis: ${file}`);
  }
  return writeArtifacts(outputRoot, new Map([
    ['quarantine-report.json', JSON.stringify(report, null, 2) + '\n'],
    ['quarantine-report.md', renderMarkdown(report)]
  ]));
}

function main() {
  const { values } = parseArgs({ options: { output: { type: 'string' } } });
  const repo = path.resolve(__dirname, '..', '..');
  const report = buildReport(repo);
  const written = values.output ? writeReport(repo, path.resolve(values.output), report) : 0;
  console.log(JSON.stringify({ mode: values.output ? 'write' : 'read-only', scope: report.scope, ...report.summary,
    caseCorrectionBatch: { components: report.caseCorrectionBatch.rootIds.length, targets: report.caseCorrectionBatch.targets.length,
      conditionalRecovery: report.caseCorrectionBatch.conditionalRecovery, affectedTables: report.caseCorrectionBatch.affectedTables }, written }, null, 2));
}

module.exports = { analyzeManifest, describeRepairs, buildReport, renderMarkdown, writeReport };

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}