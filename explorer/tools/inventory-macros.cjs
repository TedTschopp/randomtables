function scanExpressions(input) {
  const text = String(input);
  const protectedRanges = [];
  const protection = /<!--(?:[\s\S]*?-->|[\s\S]*$)|<nowiki\b[^>]*>/gi;
  for (const match of text.matchAll(protection)) {
    if (match[0].startsWith('<!--')) protectedRanges.push([match.index, match.index + match[0].length]);
    else if (!/\/\s*>$/.test(match[0])) {
      const closing = /<\/nowiki\s*>/gi;
      closing.lastIndex = match.index + match[0].length;
      const end = closing.exec(text);
      protectedRanges.push([match.index, end ? end.index + end[0].length : text.length]);
    }
  }
  const macros = [];
  const parameters = [];
  const problems = [];
  const stack = [];
  function finish(frame, end, closed) {
    const raw = text.slice(frame.start, end);
    const protectedSource = protectedRanges.some(([start, finish]) => frame.start >= start && frame.start < finish);
    if (frame.kind === 'parameter') {
      parameters.push({ start: frame.start, end, raw, closed, protected: protectedSource });
    } else {
      const headerEnd = frame.headerEnd ?? (closed ? end - 2 : end);
      const spelling = text.slice(frame.start + 2, headerEnd).trim();
      const normalized = spelling.replace(/^Template\s*:/i, '').replace(/_/g, ' ').trim().toLowerCase();
      const dynamic = !normalized || /[{}\[\]]/.test(normalized);
      macros.push({
        name: dynamic ? '<dynamic>' : normalized, spelling, separator: frame.separator || null,
        kind: dynamic ? 'dynamic' : normalized.startsWith('#') ? 'parser-function' : 'template',
        start: frame.start, end, raw, depth: frame.depth, parentStart: frame.parentStart,
        closed, protected: protectedSource
      });
    }
    if (!closed) problems.push({ kind: `unclosed-${frame.kind}`, start: frame.start, raw, protected: protectedSource });
  }
  let cursor = 0;
  while (cursor < text.length) {
    if (text.startsWith('{{', cursor)) {
      let length = 2;
      while (text[cursor + length] === '{') length += 1;
      const kind = length === 3 ? 'parameter' : 'template';
      const templates = stack.filter(frame => frame.kind === 'template');
      stack.push({ kind, start: cursor, depth: templates.length, parentStart: templates.at(-1)?.start ?? null });
      cursor += kind === 'parameter' ? 3 : 2;
      continue;
    }
    const frame = stack.at(-1);
    const closing = frame?.kind === 'parameter' ? '}}}' : '}}';
    if (frame && text.startsWith(closing, cursor)) {
      stack.pop();
      cursor += closing.length;
      finish(frame, cursor, true);
      continue;
    }
    if (!frame && text.startsWith('}}', cursor)) {
      problems.push({ kind: 'unmatched-close', start: cursor, raw: '}}',
        protected: protectedRanges.some(([start, end]) => cursor >= start && cursor < end) });
      cursor += 2;
      continue;
    }
    if (frame?.kind === 'template' && frame.headerEnd === undefined && ['|', ':'].includes(text[cursor])) {
      const header = text.slice(frame.start + 2, cursor).trim();
      if (text[cursor] !== ':' || !/^Template$/i.test(header)) {
        frame.headerEnd = cursor;
        frame.separator = text[cursor];
      }
    }
    cursor += 1;
  }
  for (const frame of stack) finish(frame, text.length, false);
  macros.sort((first, second) => first.start - second.start);
  parameters.sort((first, second) => first.start - second.start);
  problems.sort((first, second) => first.start - second.start);
  return { macros, parameters, problems };
}

function summarizeTables(tables) {
  const macros = new Map();
  const macroTables = new Set();
  const executableMacroTables = new Set();
  const states = new Map();
  const diagnostics = [];
  let entries = 0;
  let parameterOccurrences = 0;
  for (const table of tables) {
    states.set(table.state, (states.get(table.state) || 0) + 1);
    for (const [index, entry] of table.entries.entries()) {
      entries += 1;
      const scan = scanExpressions(entry.text);
      parameterOccurrences += scan.parameters.length;
      for (const problem of scan.problems) diagnostics.push({ table: table.name, tableId: table.id, state: table.state,
        file: table.file, entry: index + 1, weight: entry.weight, ...problem, raw: problem.raw.slice(0, 240) });
      for (const macro of scan.macros) {
        if (!macros.has(macro.name)) macros.set(macro.name, {
          name: macro.name, kind: macro.kind, occurrences: 0, executableOccurrences: 0,
          zeroWeightOccurrences: 0, invalidWeightOccurrences: 0, protectedOccurrences: 0,
          malformedOccurrences: 0, nestedOccurrences: 0, tables: new Set(), executableTables: new Set(),
          executableRows: new Set(), byState: new Map(), spellings: new Set(), separators: new Set(), locations: []
        });
        const group = macros.get(macro.name);
        const validWeight = Number.isSafeInteger(entry.weight) && entry.weight >= 0;
        const executable = validWeight && entry.weight > 0 && macro.closed && !macro.protected;
        group.occurrences += 1;
        group.tables.add(table.id);
        macroTables.add(table.id);
        group.spellings.add(macro.spelling);
        group.separators.add(macro.separator);
        if (macro.protected) group.protectedOccurrences += 1;
        if (!macro.closed) group.malformedOccurrences += 1;
        if (macro.depth > 0) group.nestedOccurrences += 1;
        if (entry.weight === 0) group.zeroWeightOccurrences += 1;
        if (!validWeight) group.invalidWeightOccurrences += 1;
        if (executable) {
          group.executableOccurrences += 1;
          group.executableTables.add(table.id);
          executableMacroTables.add(table.id);
          group.executableRows.add(`${table.id}:${index}`);
          if (!group.byState.has(table.state)) group.byState.set(table.state, new Set());
          group.byState.get(table.state).add(table.id);
        }
        group.locations.push({
          table: table.name, tableId: table.id, state: table.state, file: table.file,
          archiveFile: table.archiveFile,
          entry: index + 1, weight: entry.weight, executable,
          spelling: macro.spelling, separator: macro.separator, depth: macro.depth,
          start: macro.start, end: macro.end, closed: macro.closed, protected: macro.protected,
          example: macro.raw.slice(0, 240), truncated: macro.raw.length > 240
        });
      }
    }
  }
  return {
    summary: { tables: tables.length, entries, macroTables: macroTables.size,
      executableMacroTables: executableMacroTables.size, parameterOccurrences,
      byState: Object.fromEntries(states), syntaxProblems: diagnostics.length },
    macros: [...macros.values()].map(group => ({
      ...group, tables: group.tables.size, executableTables: group.executableTables.size,
      executableRows: group.executableRows.size,
      byState: Object.fromEntries([...group.byState].map(([state, identifiers]) => [state, identifiers.size])),
      spellings: [...group.spellings].sort(), separators: [...group.separators].sort()
    })).sort((first, second) => second.executableTables - first.executableTables || first.name.localeCompare(second.name)),
    diagnostics
  };
}

function unparsedExpressions(table) {
  const parsed = new Map();
  for (const entry of table.entries) {
    for (const macro of scanExpressions(entry.text).macros) parsed.set(macro.raw, (parsed.get(macro.raw) || 0) + 1);
  }
  const source = String(table.raw_source || '');
  return scanExpressions(source).macros.filter(macro => {
    const count = parsed.get(macro.raw) || 0;
    if (!count) return true;
    parsed.set(macro.raw, count - 1);
    return false;
  }).map(macro => ({ ...macro, line: source.slice(0, macro.start).split('\n').length }));
}

function loadLocalTables(repo) {
  const fs = require('node:fs');
  const path = require('node:path');
  const vm = require('node:vm');
  const { parse } = require('parse5');
  const sources = [];
  function scripts(node) {
    if (node.tagName === 'script') {
      const source = node.attrs.find(attribute => attribute.name === 'src')?.value;
      if (source?.startsWith('tables/') && source !== 'tables/abulafia.js') sources.push(source);
    }
    for (const child of node.childNodes || []) scripts(child);
  }
  scripts(parse(fs.readFileSync(path.join(repo, 'index.html'), 'utf8')));
  const files = [];
  function walk(relative, pattern) {
    for (const entry of fs.readdirSync(path.join(repo, relative), { withFileTypes: true })) {
      const file = `${relative}/${entry.name}`;
      if (file === 'tables/abulafia' || file === 'tables/abulafia.js') continue;
      if (entry.isDirectory()) walk(file, pattern);
      else if (pattern.test(entry.name)) files.push(file);
    }
  }
  walk('tables', /\.(js|json|txt)$/);
  walk('Docs', /\.txt$/);
  files.sort();
  const runtime = vm.createContext({}, { codeGeneration: { strings: false, wasm: false } });
  for (const file of ['JS/generator.js', 'explorer/model.js']) {
    vm.runInContext(fs.readFileSync(path.join(repo, file), 'utf8'), runtime, { filename: file, timeout: 1000 });
  }
  const tables = [];
  const active = new Map();
  let currentFile;
  function entriesFor(values) {
    const model = runtime.TableAtlas.buildModel({ fixture: values });
    return Array.from(model.tables[0].entries, entry => ({ key: entry.key, weight: entry.weight, text: entry.text }));
  }
  function collect(identifier, values, state) {
    const table = { id: `local:${currentFile}:${identifier}:${tables.length}`, name: identifier,
      file: currentFile, state, entries: entriesFor(values) };
    tables.push(table);
    return table;
  }
  runtime.gen_data = new Proxy(Object.create(null), {
    set(target, identifier, values) {
      const table = collect(String(identifier), values, sources.includes(currentFile) ? 'legacy-shadowed' : 'legacy-unloaded');
      if (sources.includes(currentFile)) active.set(String(identifier), table);
      return Reflect.set(target, identifier, values);
    }
  });
  for (const file of [...sources, ...files.filter(file => file.endsWith('.js') && !sources.includes(file))]) {
    currentFile = file;
    vm.runInContext(fs.readFileSync(path.join(repo, file), 'utf8'), runtime, { filename: file, timeout: 1000 });
  }
  for (const table of active.values()) table.state = 'legacy-active';
  for (const file of files.filter(file => file.endsWith('.json'))) {
    currentFile = file;
    const data = JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
    for (const [identifier, values] of Object.entries(data)) {
      const prototype = values && typeof values === 'object' && 'type' in values && 'table' in values;
      const table = collect(identifier, prototype ? values.table : values, prototype ? 'legacy-json-prototype' : 'legacy-json');
      if (prototype) table.prototypeType = values.type;
    }
  }
  const wordlists = [];
  for (const file of files.filter(file => file.endsWith('.txt'))) {
    const text = fs.readFileSync(path.join(repo, file), 'utf8');
    const expressions = scanExpressions(text);
    wordlists.push({ file, lines: text.split(/\r?\n/).length, macros: expressions.macros, problems: expressions.problems });
  }
  return { tables, files, scriptFiles: files.filter(file => file.endsWith('.js')).length,
    jsonFiles: files.filter(file => file.endsWith('.json')).length, loadedScripts: sources.length, wordlists };
}

function otherSyntax(tables) {
  const groups = new Map();
  function count(kind, table, entry, index, sample) {
    if (!groups.has(kind)) groups.set(kind, { kind, occurrences: 0, tables: new Set(), byState: new Map(), examples: [] });
    const group = groups.get(kind);
    group.occurrences += 1;
    group.tables.add(table.id);
    if (!group.byState.has(table.state)) group.byState.set(table.state, new Set());
    group.byState.get(table.state).add(table.id);
    if (group.examples.length < 8) group.examples.push({ table: table.name, file: table.file, entry: index + 1, weight: entry.weight, text: sample });
  }
  for (const table of tables) for (const [index, entry] of table.entries.entries()) {
    if (!(Number.isSafeInteger(entry.weight) && entry.weight > 0)) continue;
    const text = String(entry.text);
    const macros = scanExpressions(text).macros;
    for (const match of text.matchAll(/\{([^{}\r\n]+)\}/g)) {
      if (macros.some(macro => match.index >= macro.start && match.index < macro.end)) continue;
      count(/^\w+$/.test(match[1]) ? 'single-brace table reference' : 'non-simple single-brace expression', table, entry, index, match[0]);
    }
    for (const [kind, pattern] of [
      ['percent-delimited candidate', /%[^%\n]{1,160}%/g],
      ['double-bracket wiki link', /\[\[[^\n]*?\]\]/g],
      ['generator extension tag', /<\/?(?:sg[a-z]+|random|choose|pick)\b[^>]*>/gi]
    ]) {
      for (const match of text.matchAll(pattern)) count(kind, table, entry, index, match[0]);
    }
  }
  return [...groups.values()].map(group => ({ ...group, tables: group.tables.size,
    byState: Object.fromEntries([...group.byState].map(([state, identifiers]) => [state, identifiers.size])) }));
}

function requirementsFor(macros) {
  const { groups } = require('./macro-requirements.json');
  const known = new Set(groups.flatMap(group => group.names));
  const unknown = macros.filter(macro => macro.executableTables && !known.has(macro.name)).map(macro => macro.name);
  const definitions = unknown.length ? [...groups, {
    id: 'unclassified', label: 'Unclassified names', priority: 'Review', names: unknown,
    requirement: 'Verify these newly observed names against their source definitions.',
    caution: 'No behavior has been inferred from the names.'
  }] : groups;
  return definitions.map(group => {
    const locations = macros.filter(macro => group.names.includes(macro.name))
      .flatMap(macro => macro.locations).filter(location => location.executable);
    const byState = new Map();
    for (const location of locations) {
      if (!byState.has(location.state)) byState.set(location.state, new Set());
      byState.get(location.state).add(location.tableId);
    }
    return { ...group, tables: new Set(locations.map(location => location.tableId)).size, occurrences: locations.length,
      byState: Object.fromEntries([...byState].map(([state, identifiers]) => [state, identifiers.size])) };
  }).filter(group => group.tables > 0);
}

function runtimeSupport() {
  const { supportedOperations, aliases } = require('../../JS/wiki-expressions.js');
  const names = [...new Set([...supportedOperations, ...Object.keys(aliases)])].sort();
  const presentation = new Set(['link', 'hover', 'linkme', 'font color', 'dieroll']);
  return {
    canonicalOperations: [...supportedOperations], operationAliases: { ...aliases }, supportedOperations: names,
    plainTextOperations: names.filter(name => presentation.has(aliases[name] || name))
  };
}

function buildInventory(repo, sourceRoot) {
  const assert = require('node:assert/strict');
  const crypto = require('node:crypto');
  const fs = require('node:fs');
  const path = require('node:path');
  const { execFileSync } = require('node:child_process');
  const { loadCorpus, tableId } = require('./import-abulafia.cjs');
  const manifestBytes = fs.readFileSync(path.join(repo, 'tables/abulafia/manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  const commit = execFileSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  assert.equal(commit, manifest.commit, 'The source checkout must match the imported revision');
  assert.equal(execFileSync('git', ['-C', sourceRoot, 'status', '--porcelain'], { encoding: 'utf8' }).trim(), '', 'Use a clean source checkout');
  const imported = new Map(manifest.tables.map(table => [table.id, table]));
  const records = loadCorpus(sourceRoot);
  const wikiTables = records.map(record => {
    const id = tableId(record.table);
    const metadata = imported.get(id);
    return { id, name: record.table.subtable.qualified_name, file: record.sourceFile,
      archiveFile: metadata?.archiveFile,
      state: !metadata ? 'not-imported' : metadata.status === 'blocked' ? 'blocked' : metadata.execution === 'wiki' ? 'ready-runtime' : 'ready-static',
      entries: record.table.entries };
  });
  assert.equal(wikiTables.filter(table => table.state !== 'not-imported').length, manifest.summary.tables);
  const local = loadLocalTables(repo);
  const current = summarizeTables(wikiTables);
  const legacy = summarizeTables(local.tables);
  const unparsed = [];
  for (const [index, record] of records.entries()) for (const macro of unparsedExpressions(record.table)) {
    const table = wikiTables[index];
    unparsed.push({ name: macro.name, table: table.name, file: table.file, archiveFile: table.archiveFile, state: table.state,
      line: macro.line, closed: macro.closed, protected: macro.protected, example: macro.raw.slice(0, 240), truncated: macro.raw.length > 240 });
  }
  const patterns = new Map();
  for (const table of wikiTables) for (const entry of table.entries) {
    if (!(Number.isSafeInteger(entry.weight) && entry.weight > 0)) continue;
    const calls = scanExpressions(entry.text).macros.filter(macro => macro.closed && !macro.protected);
    const roots = calls.filter(macro => macro.parentStart === null);
    function signature(call) {
      const children = calls.filter(child => child.parentStart === call.start);
      return children.length ? `${call.name}(${children.map(signature).join(', ')})` : call.name;
    }
    if (roots.length > 1 || calls.some(call => call.depth > 0)) {
      const key = roots.map(signature).join(' + ');
      if (!patterns.has(key)) patterns.set(key, { pattern: key, rows: 0, tables: new Set(), example: entry.text.slice(0, 240) });
      const group = patterns.get(key);
      group.rows += 1;
      group.tables.add(table.id);
    }
  }
  const validation = new Map();
  for (const table of manifest.tables) for (const code of new Set(table.issues.map(issue => issue.code))) {
    validation.set(code, (validation.get(code) || 0) + 1);
  }
  const runtime = fs.readFileSync(path.join(repo, 'JS/wiki-import.js'), 'utf8');
  const supportFiles = ['JS/wiki-expressions.js', 'JS/wiki-template-data.js', 'explorer/tools/compile-wiki-expressions.cjs',
    'explorer/vendor/jsep.iife.min.js', 'explorer/tools/macro-requirements.json'];
  const { sourceArchive, definitions } = require('./macro-requirements.json');
  return {
    schemaVersion: 1, generatedOn: new Date().toISOString().slice(0, 10),
    provenance: { repository: manifest.repository, commit, manifest: 'tables/abulafia/manifest.json',
      manifestSha256: crypto.createHash('sha256').update(manifestBytes).digest('hex'),
      runtimeSha256: crypto.createHash('sha256').update(runtime).digest('hex'),
      compilerSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, 'explorer/tools/import-abulafia.cjs'))).digest('hex'),
      supportFileHashes: Object.fromEntries(supportFiles.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, file))).digest('hex')])) },
    scope: { currentWikiTables: wikiTables.length, importedTables: manifest.summary.tables,
      currentWikiPages: new Set(records.map(record => record.table.page.page_id)).size,
      notImportedTables: wikiTables.filter(table => table.state === 'not-imported').length,
      localScriptFiles: local.scriptFiles, loadedLocalScripts: local.loadedScripts, localJsonFiles: local.jsonFiles,
      localFiles: local.files, retainedHistoricalRevisionsIncluded: false },
    ...runtimeSupport(), current, legacy, wordlists: local.wordlists,
    requirements: requirementsFor(current.macros), templateEvidence: { sourceArchive, definitions },
    unparsedSource: unparsed,
    expressionPatterns: [...patterns.values()].map(group => ({ ...group, tables: group.tables.size }))
      .sort((first, second) => second.tables - first.tables || first.pattern.localeCompare(second.pattern)),
    otherSyntax: otherSyntax([...wikiTables, ...local.tables]),
    validationIssues: Object.fromEntries([...validation].sort((first, second) => second[1] - first[1]))
  };
}

function renderMarkdown(report) {
  const number = value => value.toLocaleString('en-US');
  const escape = value => String(value).replace(/\|/g, '\\|').replace(/[\r\n]/g, ' ');
  const active = report.current.macros.filter(macro => macro.executableTables > 0);
  const inactive = report.current.macros.filter(macro => macro.executableTables === 0);
  const unsupported = active.filter(macro => !report.supportedOperations.includes(macro.name));
  const sourceLink = location => {
    const target = `${report.provenance.repository}/blob/${report.provenance.commit}/${location.file.split('/').map(encodeURIComponent).join('/')}`;
    const label = location.table.replace(/\|/g, ' / ').replace(/[\[\]<>]/g, '');
    return `[${label}](${target})`;
  };
  const evidence = report.templateEvidence || require('./macro-requirements.json');
  const dependencies = [...new Set(evidence.definitions.flatMap(definition => definition.dependencies))].sort();
  const indirectOnly = dependencies.filter(name => !active.some(macro => macro.name === name));
  const lines = [
    '# Macro Inventory', '', `Snapshot: ${report.generatedOn}. Source revision: \`${report.provenance.commit}\`.`, '',
    '## Bottom Line', '',
    `The current wiki tables use **${active.length} macro names in selectable rows**. **${active.length - unsupported.length} names** have implemented support through bounded evaluation or explicit plain-text projections. **${unsupported.length} ${unsupported.length === 1 ? 'name' : 'names'}** ${unsupported.length === 1 ? 'remains' : 'remain'} unsupported. An implemented name does not guarantee that its arguments or dependencies pass validation.`, '',
    `The scan covers **${number(report.scope.currentWikiTables)} current wiki tables**: ${number(report.scope.importedTables)} imported and ${number(report.scope.notImportedTables)} not imported. It also covers every local table script, both alternate JSON collections, and the local wordlists. Source data and runtime behavior were not changed by this inventory.`, '',
    '## Coverage', '', '| Scope | Tables or Definitions | Entries |', '| --- | ---: | ---: |',
    `| Current wiki corpus | ${number(report.current.summary.tables)} | ${number(report.current.summary.entries)} |`,
    `| Local JavaScript and JSON definitions | ${number(report.legacy.summary.tables)} | ${number(report.legacy.summary.entries)} |`, '',
    `Local sources: ${report.scope.localScriptFiles} JavaScript files (${report.scope.loadedLocalScripts} loaded by the classic home page), ${report.scope.localJsonFiles} JSON files, and ${report.wordlists.length} text wordlists. Local definitions include shadowed and unloaded data and are not added to the active browser table count.`, '',
    `Wiki state counts: ${Object.entries(report.current.summary.byState).map(([state, count]) => `\`${state}\`: ${number(count)}`).join('; ')}.`, '',
    `Local state counts: ${Object.entries(report.legacy.summary.byState).map(([state, count]) => `\`${state}\`: ${number(count)}`).join('; ')}.`, '',
    '## Selectable-Row Macros', '',
    'Counts below are distinct source tables containing well-closed, unprotected macro calls in positive, valid-weight rows. They are not predicted unlock counts. One table may appear in several rows, so columns must not be summed. Names are grouped case-insensitively with underscores treated as spaces; actual spellings remain in the JSON evidence, and grouping does not imply that every spelling is supported.', '',
    '| Macro | Source Tables | Calls | Ready Static | Ready Runtime | Blocked | Not Imported | Support |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |'
  ];
  for (const macro of active) lines.push(`| \`${escape(macro.name)}\` | ${macro.executableTables} | ${number(macro.executableOccurrences)} | ${macro.byState['ready-static'] || 0} | ${macro.byState['ready-runtime'] || 0} | ${macro.byState.blocked || 0} | ${macro.byState['not-imported'] || 0} | ${(report.plainTextOperations || []).includes(macro.name) ? 'Plain text' : report.supportedOperations.includes(macro.name) ? 'Bounded' : macro.name === 'sgdisplaygreatertemplate' ? 'Source review' : 'Not implemented'} |`);
  lines.push('', '`ready-static` means the imported table uses existing compiled choices. `ready-runtime` means the new wiki-only evaluator is required. Other tables may depend on these macros without containing them directly.', '',
    'The wiki-only parser supports multiple and nested calls, positional arguments, allowlisted named arguments, and verified aliases. Repeated table references roll independently; each evaluated template argument is cached for that invocation. Existing static choices and the classic engine are unchanged. Source text is never evaluated as JavaScript.', '',
    'Bounds: 32 levels of parsed expressions and table expansion, 512 table calls, 4,096 expression operations, and 32,768 output characters per roll. Arithmetic and sensitive dynamic arguments must pass finite-domain validation, limited to 4,096 combinations and 1 MiB of distinct text. First-character casing remains ASCII-only for `ucfirst` and `lcfirst`; full-string `uc` and `lc` use Unicode casing. Invalid, ambiguous, cyclic, and over-budget expressions remain quarantined.', '',
    'Presentation templates are plain-text projections: links retain visible labels, Hover retains visible text, and font-color wrappers retain text without styling. DieRoll retains its text or dice label; it does not create an interactive button or roll dice. CURRENTYEAR uses the browser UTC year from one timestamp per roll. `#ifexist` checks registered imported table pages only, not the entire archived wiki namespace.', '',
    'The nine bundled grammar and array template bodies retain their reviewed source rules, including irregular pluralization, prefix-based array membership, and duplicate Numtostring cases. SGDisplayGreaterTemplate and source-brace repairs remain outside executable support. See the [conversion rules](../tables/abulafia/README.md#safe-names-and-conversion) and the evaluator, importer, and offline browser tests for exact supported forms.', '',
    '## Capability Requirements', '',
    'These source-derived contracts remain acceptance criteria for implemented operations. Counts below deduplicate aliases within each group; they are not predictions of table readiness. The original implementation priorities remain in the JSON evidence.', '',
    '| Capability | Names | Source Tables |', '| --- | --- | ---: |');
  for (const group of report.requirements) lines.push(`| ${group.label} | ${group.names.map(name => `\`${escape(name)}\``).join(', ')} | ${group.tables} |`);
  lines.push('');
  for (const group of report.requirements) lines.push(`- **${group.label}:** ${group.requirement} ${group.caution}`);
  lines.push('', '## Source Examples', '',
    'Examples link to the exact current table JSON at the pinned source commit. Entry numbers refer to the parsed source entry array, starting at 1. The machine-readable report retains every occurrence, exact spellings, weights, states, offsets, and available local archive paths.', '',
    '| Macro | Exact Spellings | Source Table | Entry | Expression |', '| --- | --- | --- | ---: | --- |');
  for (const macro of active) {
    const location = macro.locations.find(item => item.executable);
    lines.push(`| \`${escape(macro.name)}\` | ${macro.spellings.map(spelling => `\`${escape(spelling)}\``).join(', ')} | ${sourceLink(location)} | ${location.entry} | \`${escape(location.example)}\`${location.truncated ? ' (truncated)' : ''} |`);
  }
  lines.push('', '## Template Dependencies', '',
    'The archived template definitions reveal helper operations that are not all named directly in selectable table rows. These are implementation dependencies if the original templates are interpreted; a tested native implementation can provide the same behavior without exposing every helper as a public macro.', '',
    `Additional helper names beyond the selectable-row list: ${indirectOnly.map(name => `\`${escape(name)}\``).join(', ')}. The pipe helpers \`!\` and \`p\` produce the same literal character. Do not count template documentation examples such as Purge as runtime requirements.`, '',
    '| Archived Template | Page ID | Revision ID | Operational Dependencies or Alias |', '| --- | ---: | ---: | --- |');
  for (const definition of evidence.definitions) {
    const detail = definition.aliasOf ? `Alias of ${definition.aliasOf}` : definition.dependencies.map(name => `\`${escape(name)}\``).join(', ') || definition.extension || 'Literal output';
    lines.push(`| ${definition.title} | ${definition.pageId} | ${definition.revision} | ${detail} |`);
  }
  lines.push('', `Evidence comes from the latest retained revisions in the source checkout's \`${evidence.sourceArchive.file}\`, SHA-256 \`${evidence.sourceArchive.sha256}\`. That XML export is not tracked by the upstream Git repository, so its hash is recorded separately from the table-data commit. The reviewed metadata is maintained in [macro-requirements.json](../explorer/tools/macro-requirements.json); the scan does not reread the large XML archive on every run.`, '',
    '## Additional Source Syntax', '',
    `There are ${report.current.summary.syntaxProblems} brace-structure diagnostics in parsed wiki entries and ${report.unparsedSource.length} additional macro occurrences found in raw table source but not matched to parsed entries. Their line numbers and examples are in the JSON report. Raw-only expressions have unknown execution weight and are not added to the selectable-row counts.`, '',
    'Macro names observed only outside selectable, well-formed rows:', '', ...inactive.map(macro => `- \`${escape(macro.name)}\`: ${macro.occurrences} occurrences; ${macro.zeroWeightOccurrences} zero-weight, ${macro.malformedOccurrences} malformed.`), '',
    `Local JavaScript/JSON data contains ${report.legacy.macros.length} double-brace macro names; text wordlists contain ${report.wordlists.reduce((sum, file) => sum + file.macros.length, 0)} double-brace macro occurrences.`, '',
    'The local double-brace usages are `ucfirst` strings in `CompassDirection` and `TerrainsCap`, repeated in the alternate old-object JSON collection. They mix legacy single-brace references with double-brace macro delimiters. These are not evidence of working classic macro support; source-brace repairs and an explicit compatibility decision are separate work. Prototype JSON payloads are inspected as stored data, not declared to be supported runtime schemas.', '',
    'Raw-source exceptions are listed separately below. The `subst:Generator start` calls are wiki authoring/scaffolding syntax, not an additional per-roll operation. Other raw-only cases include parser-damaged or omitted rows; a balanced outer macro does not validate its inner references.', '',
    '| Source Table | Raw-Source Line | Macro | Outer Call Closed | Example |', '| --- | ---: | --- | --- | --- |');
  for (const location of report.unparsedSource) lines.push(`| ${sourceLink(location)} | ${location.line} | \`${escape(location.name)}\` | ${location.closed ? 'Yes' : 'No'} | \`${escape(location.example)}\`${location.truncated ? ' (truncated)' : ''} |`);
  lines.push('',
    'Separate syntax candidates, not automatically additional macros:', '',
    '| Syntax | Source Tables or Definitions | Occurrences |', '| --- | ---: | ---: |');
  for (const group of report.otherSyntax) lines.push(`| ${group.kind} | ${number(group.tables)} | ${number(group.occurrences)} |`);
  lines.push('', 'Ordinary table references and dice tables are data references, not new macros. Candidate syntax requires source review; a percent sign or wiki link is not proof that a new operation is needed. The JSON report includes examples and source states.', '',
    'The classic generator only expands simple word-like identifiers inside single braces. Existing non-simple references with spaces, punctuation, or non-ASCII characters, and inline dice-like strings such as `{d8*10}` and `{1d3+2}`, need a separate compatibility audit. None were rewritten by this scan.', '',
    '## Composition Requirements', '',
    'The bounded parser supports multiple and nested operations. These source patterns also include tables that remain blocked by invalid arguments, dependencies, or resource limits:', '',
    '| Pattern | Tables | Rows |', '| --- | ---: | ---: |');
  for (const group of report.expressionPatterns.slice(0, 15)) lines.push(`| \`${escape(group.pattern)}\` | ${group.tables} | ${group.rows} |`);
  lines.push('', '## Other Blocking Causes', '',
    'Macro support alone will not clear quarantine. Current manifest diagnostics count distinct tables per issue; a table can have multiple issues.', '',
    '| Validation Issue | Imported Tables |', '| --- | ---: |');
  for (const [code, count] of Object.entries(report.validationIssues)) lines.push(`| \`${code}\` | ${number(count)} |`);
  lines.push('', '## Reproduce', '', 'From the repository root:', '', '```sh',
    'node --test explorer/tests/macro-inventory.test.cjs',
    'node explorer/tools/inventory-macros.cjs --source ../random-generator-com-wiki-dump --output Docs', '```', '',
    'The scan follows page-manifest membership and does not treat retained obsolete files as current tables. Historical revisions are not part of the implementation backlog or the totals. Imported archives are not counted again as separate tables; raw source is compared with parsed entries for coverage gaps. Template implementations and transitive template dependencies are not added to direct table-usage counts.', '',
    'The scanner reads wiki content as JSON and text, never as executable code. Local JavaScript data definitions are evaluated only in an isolated, time-limited development VM to preserve their actual registration and range semantics. No browser runtime or server dependency is introduced. Existing output files are never overwritten unless their contents are identical.', '',
    'Full per-occurrence evidence: [macro-inventory.json](macro-inventory.json). Scanner: [inventory-macros.cjs](../explorer/tools/inventory-macros.cjs).', '');
  return lines.join('\n');
}

function main() {
  const fs = require('node:fs');
  const path = require('node:path');
  const { parseArgs } = require('node:util');
  const { writeArtifacts } = require('./import-abulafia.cjs');
  const { values } = parseArgs({ options: { source: { type: 'string' }, output: { type: 'string' } } });
  if (!values.source) throw new Error('Supply --source with the pinned wiki checkout');
  const repo = fs.realpathSync(path.join(__dirname, '..', '..'));
  const report = buildInventory(repo, fs.realpathSync(values.source));
  if (values.output) {
    const output = path.relative(repo, path.resolve(values.output));
    writeArtifacts(repo, new Map([
      [`${output}/macro-inventory.json`, JSON.stringify(report, null, 2) + '\n'],
      [`${output}/macro-inventory.md`, renderMarkdown(report)]
    ]));
  }
  console.log(JSON.stringify({ scope: report.scope, wiki: report.current.summary, local: report.legacy.summary,
    macroNames: report.current.macros.length, selectableMacroNames: report.current.macros.filter(macro => macro.executableTables > 0).length,
    rawOnlyOccurrences: report.unparsedSource.length, otherSyntax: report.otherSyntax.map(({ examples, ...group }) => group) }, null, 2));
}

module.exports = { scanExpressions, summarizeTables, unparsedExpressions, loadLocalTables, otherSyntax, requirementsFor, runtimeSupport, buildInventory, renderMarkdown };

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}