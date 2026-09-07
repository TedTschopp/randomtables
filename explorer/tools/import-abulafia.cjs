const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');
const vm = require('node:vm');
const { gzipSync } = require('node:zlib');
const { parseFragment } = require('parse5');
const { createExpressionCompiler } = require('./compile-wiki-expressions.cjs');

function contributorKey(contributor) {
  if (!contributor) return null;
  if (Number.isInteger(contributor.id) && contributor.id > 0) return `user:${contributor.id}`;
  if (contributor.name) return `name:${contributor.name}`;
  if (contributor.ip) return `ip:${contributor.ip}`;
  return null;
}

function tableId(table) {
  const pageId = String(table.page.page_id);
  const name = table.subtable.name;
  if (!/^\d+$/.test(pageId) || typeof name !== 'string' || !name.isWellFormed()) {
    throw new Error('Wiki table identity is invalid');
  }
  return `wiki_abulafia_${pageId}_${Buffer.from(name, 'utf8').toString('hex')}`;
}

function planImport(records, seeds) {
  const byName = new Map();
  const byContributor = new Map();
  const namedAccounts = new Map();
  const accounts = new Map();
  for (const record of records) {
    for (const contributor of [record.table.source.contributor, record.originalContributor]) {
      if (!contributor?.name || !Number.isInteger(contributor.id) || contributor.id <= 0) continue;
      if (!namedAccounts.has(contributor.name)) namedAccounts.set(contributor.name, new Set());
      namedAccounts.get(contributor.name).add(contributor.id);
      accounts.set(`user:${contributor.id}`, contributor);
    }
  }
  function identity(contributor) {
    const candidates = namedAccounts.get(contributor?.name);
    if (!(contributor?.id > 0) && candidates?.size === 1) return `user:${[...candidates][0]}`;
    return contributorKey(contributor);
  }
  for (const record of records) {
    const name = record.table.subtable.qualified_name;
    if (byName.has(name)) throw new Error(`Duplicate wiki table: ${name}`);
    byName.set(name, record);
    for (const contributor of [record.table.source.contributor, record.originalContributor]) {
      const key = identity(contributor);
      if (!key) continue;
      if (!byContributor.has(key)) byContributor.set(key, new Set());
      byContributor.get(key).add(name);
    }
  }

  for (const seed of seeds) {
    if (!byName.has(seed)) throw new Error(`Wiki seed does not exist: ${seed}`);
  }
  const pending = [...seeds];
  const selected = new Set();
  const contributors = new Map();
  const missingTargets = new Set();
  while (pending.length) {
    const name = pending.pop();
    if (selected.has(name)) continue;
    const record = byName.get(name);
    if (!record) {
      missingTargets.add(name);
      continue;
    }
    selected.add(name);
    for (const contributor of [record.table.source.contributor, record.originalContributor]) {
      const key = identity(contributor);
      if (!key || contributors.has(key)) continue;
      contributors.set(key, accounts.get(key) || contributor);
      pending.push(...byContributor.get(key));
    }
    for (const entry of record.table.entries) {
      for (const reference of entry.references) {
        if (reference.target_qualified_name) pending.push(reference.target_qualified_name);
      }
    }
  }

  return {
    records: [...selected].sort().map(name => byName.get(name)),
    contributors: [...contributors.entries()].sort(([first], [second]) => first < second ? -1 : first > second ? 1 : 0)
      .map(([key, contributor]) => ({ key, ...contributor })),
    missingTargets: [...missingTargets].sort()
  };
}

function originalAttribution(current, history) {
  const populated = [...history, current].filter(record => record.table.entries.length)
    .sort((first, second) => String(first.table.source.timestamp).localeCompare(String(second.table.source.timestamp)));
  const earliest = populated[0] || current;
  return {
    contributor: earliest.table.source.contributor,
    sourceFile: earliest.sourceFile,
    revision: earliest.table.source,
    basis: earliest.sourceFile !== current.sourceFile ? 'earliest-retained-content' : 'current-revision-only'
  };
}

function loadCorpus(sourceRoot) {
  const root = fs.realpathSync(sourceRoot);
  function readSource(relative) {
    const file = fs.realpathSync(path.join(root, relative));
    const contained = path.relative(root, file);
    if (contained.startsWith(`..${path.sep}`) || path.isAbsolute(contained)) throw new Error(`Source path escapes the corpus: ${relative}`);
    const content = fs.readFileSync(file, 'utf8');
    return {
      sourceFile: relative.split(path.sep).join('/'),
      sourceHash: crypto.createHash('sha256').update(content).digest('hex'),
      table: JSON.parse(content)
    };
  }
  const inventory = readSource('tables/index.json').table;
  const records = [];
  for (const folder of new Set(inventory.pages.map(page => page.folder_name))) {
    if (typeof folder !== 'string' || path.basename(folder) !== folder || ['.', '..'].includes(folder)) {
      throw new Error(`Invalid corpus page folder: ${folder}`);
    }
    const page = readSource(`tables/${folder}/page.json`).table;
    const currentNames = new Set(page.subtables.map(table => table.qualified_name));
    const found = new Set();
    const directory = path.join(root, 'tables', folder, 'subtables');
    for (const child of fs.existsSync(directory) ? fs.readdirSync(directory, { withFileTypes: true }) : []) {
      if (!child.isDirectory()) continue;
      const relative = `tables/${folder}/subtables/${child.name}`;
      if (!fs.existsSync(path.join(root, relative, 'table.json'))) continue;
      const current = readSource(`${relative}/table.json`);
      if (!currentNames.has(current.table.subtable.qualified_name)) continue;
      found.add(current.table.subtable.qualified_name);
      const historyRoot = path.join(root, relative, 'history');
      const history = [];
      for (const revision of fs.existsSync(historyRoot) ? fs.readdirSync(historyRoot).sort() : []) {
        const historicalFile = `${relative}/history/${revision}/table.json`;
        if (!fs.existsSync(path.join(root, historicalFile))) continue;
        const snapshot = readSource(historicalFile);
        if (snapshot.table.entries.length) {
          history.push(snapshot);
          break;
        }
      }
      const original = originalAttribution(current, history);
      records.push({
        ...current, originalContributor: original.contributor, originalSourceFile: original.sourceFile,
        originalRevision: original.revision, attributionBasis: original.basis,
        originalSnapshot: history.find(snapshot => snapshot.sourceFile === original.sourceFile) || null
      });
    }
    for (const name of currentNames) if (!found.has(name)) throw new Error(`Current table file is missing: ${name}`);
  }
  return records;
}

function escapeText(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inertText(text, issue) {
  const allowedTags = new Set([
    'a', 'abbr', 'b', 'big', 'blockquote', 'br', 'caption', 'center', 'code', 'dd', 'del',
    'div', 'dl', 'dt', 'em', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
    'li', 'ol', 'p', 'pre', 's', 'small', 'span', 'strike', 'strong', 'sub', 'sup',
    'table', 'tbody', 'td', 'th', 'thead', 'tr', 'tt', 'u', 'ul'
  ]);
  const blocks = new Set(['blockquote', 'dd', 'div', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'p', 'tr']);
  function extract(node) {
    if (node.nodeName === '#text') return node.value;
    if (node.nodeName === '#comment') return '';
    if (node.tagName && (!allowedTags.has(node.tagName) || node.attrs?.some(attribute => /^on/i.test(attribute.name)))) {
      issue('unsafe_html', `Unsupported or active HTML element: ${node.tagName}`);
      return '';
    }
    if (node.tagName === 'br' || node.tagName === 'hr') return '\n';
    const content = (node.childNodes || []).map(extract).join('');
    return content + (blocks.has(node.tagName) ? '\n' : ['td', 'th'].includes(node.tagName) ? '\t' : '');
  }
  return extract(parseFragment(text));
}

function ucfirstChoices(entry, byName, issue) {
  const match = /^([^{}]*)\{\{ucfirst:([^{}]*)\}\}([^{}]*)$/.exec(String(entry.text));
  if (!match) return null;
  const [, prefix, argument, suffix] = match;
  const reference = entry.references.find(reference => reference.raw === argument);
  const target = byName.get(reference?.target_qualified_name)?.table;
  const choices = target ? target.entries.filter(choice => choice.weight !== 0) : [{ weight: 1, text: argument, references: [] }];
  if (!choices.length || choices.length > 4096 || choices.some(choice =>
    !Number.isSafeInteger(choice.weight) || choice.weight <= 0 || choice.references.length)) {
    issue('unsupported_ucfirst', 'ucfirst requires a bounded plain-text leaf table with valid weights');
    return null;
  }
  const total = choices.reduce((sum, choice) => sum + choice.weight, 0);
  if (!Number.isSafeInteger(total)) {
    issue('unsupported_ucfirst', 'ucfirst leaf weights exceed the exact integer limit');
    return null;
  }
  const expanded = [];
  for (const choice of choices) {
    const text = String(choice.text);
    if (!text.isWellFormed() || text.trim() !== text || text.charCodeAt(0) > 127 ||
        /[\u0000-\u001f\u007f{}\[\]<>&|]|%[^%]+%|\$(?:[$&`']|<)/.test(text)) {
      issue('unsupported_ucfirst', 'ucfirst requires plain text with an ASCII first character and no edge whitespace');
      return null;
    }
    expanded.push({ weight: choice.weight, text: prefix + text.charAt(0).toUpperCase() + text.slice(1) + suffix });
  }
  return { syntax: prefix + argument + suffix, choices: expanded };
}

function possessiveCompiler(byName) {
  const cache = new Map();
  const maximumWeight = BigInt(Number.MAX_SAFE_INTEGER);
  function reject(detail) { throw new Error(detail); }
  function gcd(first, second) {
    while (second) {
      const remainder = first % second;
      first = second;
      second = remainder;
    }
    return first;
  }
  function fraction(numerator, denominator) {
    const divisor = gcd(numerator, denominator);
    return { numerator: numerator / divisor, denominator: denominator / divisor };
  }
  function integerChoices(choices) {
    let denominator = 1n;
    for (const choice of choices) {
      denominator = denominator / gcd(denominator, choice.denominator) * choice.denominator;
      if (denominator > maximumWeight) reject('Possessive expansion exceeds the exact integer weight limit');
    }
    return choices.map(choice => ({ text: choice.text, weight: Number(choice.numerator * (denominator / choice.denominator)) }));
  }
  function plain(text) {
    if (!text.isWellFormed() || /[\u0000-\u001f\u007f{}\[\]<>&|]|%[^%]+%|\$(?:[$&`']|<)/.test(text)) {
      reject('Possessive expansion requires plain text and exact simple references');
    }
    return text;
  }
  function append(first, second) {
    if (first.length + second.length > 32768) reject('Possessive expansion exceeds 32768 characters');
    return first + second;
  }
  function expandText(text, references, ancestors) {
    const byToken = new Map();
    for (const reference of references) {
      if (byToken.has(reference.raw) && byToken.get(reference.raw).target_qualified_name !== reference.target_qualified_name) {
        reject('Possessive expansion contains an ambiguous reference');
      }
      byToken.set(reference.raw, reference);
    }
    let choices = [{ text: '', numerator: 1n, denominator: 1n }];
    let cursor = 0;
    let depth = 0;
    let calls = 0;
    for (const match of text.matchAll(/\[[^\[\]]+\]/g)) {
      const literal = plain(text.slice(cursor, match.index));
      const reference = byToken.get(match[0]);
      const target = byName.get(reference?.target_qualified_name)?.table;
      if (!target || !['local', 'cross_page'].includes(reference.kind) || reference.raw !== `[${reference.token}]` ||
          ![target.subtable.name, target.subtable.qualified_name, target.page.title].includes(reference.token)) {
        reject('Possessive expansion contains a missing or unsupported reference');
      }
      const expanded = expandTable(reference.target_qualified_name, ancestors);
      calls += expanded.calls;
      depth = Math.max(depth, expanded.depth);
      if (calls > 512) reject('Possessive expansion exceeds 512 table calls');
      if (choices.length * expanded.choices.length > 4096) reject('Possessive expansion exceeds 4096 choices');
      choices = choices.flatMap(first => expanded.choices.map(second => ({
        text: append(append(first.text, literal), second.text),
        ...fraction(first.numerator * second.numerator, first.denominator * second.denominator)
      })));
      cursor = match.index + match[0].length;
    }
    const suffix = plain(text.slice(cursor));
    return { choices: choices.map(choice => ({ ...choice, text: append(choice.text, suffix) })), depth, calls };
  }
  function expandTable(name, ancestors) {
    if (ancestors.has(name)) reject('Possessive expansion contains a cycle');
    if (ancestors.size >= 32) reject('Possessive expansion exceeds 32 levels');
    if (cache.has(name)) {
      const result = cache.get(name);
      if (ancestors.size + result.depth > 32) reject('Possessive expansion exceeds 32 levels');
      return result;
    }
    const table = byName.get(name)?.table;
    if (!table || table.warnings?.length) reject('Possessive expansion requires a table without source parse warnings');
    if (table.entries.some(entry => !Number.isSafeInteger(entry.weight) || entry.weight < 0)) {
      reject('Possessive expansion requires valid nonnegative integer weights');
    }
    const entries = table.entries.filter(entry => entry.weight > 0);
    const total = entries.reduce((sum, entry) => sum + BigInt(entry.weight), 0n);
    if (total <= 0n || total > maximumWeight) reject('Possessive expansion requires a positive safe-integer weight total');
    const next = new Set(ancestors).add(name);
    const choices = [];
    let depth = 1;
    let calls = 1;
    for (const entry of entries) {
      const expanded = expandText(String(entry.text), entry.references, next);
      if (choices.length + expanded.choices.length > 4096) reject('Possessive expansion exceeds 4096 choices');
      depth = Math.max(depth, expanded.depth + 1);
      calls = Math.max(calls, expanded.calls + 1);
      if (calls > 512) reject('Possessive expansion exceeds 512 table calls');
      choices.push(...expanded.choices.map(choice => ({ text: choice.text,
        ...fraction(BigInt(entry.weight) * choice.numerator, total * choice.denominator) })));
    }
    integerChoices(choices);
    const result = { choices, depth, calls };
    cache.set(name, result);
    return result;
  }
  return (entry, issue) => {
    const match = /^([^{}]*)\{\{po\|([^{}|]*)\}\}([^{}]*)$/.exec(String(entry.text));
    if (!match) return null;
    const [, prefix, argument, suffix] = match;
    try {
      const expanded = expandText(argument, entry.references, new Set());
      const choices = integerChoices(expanded.choices).map(choice => {
        if (choice.text.trim() !== choice.text) reject('Possessive arguments with edge whitespace are unsupported');
        const possessive = choice.text + (/[sS]$/.test(choice.text) ? '\u2019' : '\u2019s');
        return { weight: choice.weight, text: append(append(prefix, possessive), suffix) };
      });
      return { syntax: prefix + argument + suffix, choices };
    } catch (error) {
      issue('unsupported_po', error.message);
      return null;
    }
  };
}

function programParts(text) {
  const parts = [];
  let cursor = 0;
  function literal(value) {
    if (/[{}]/.test(value)) throw new Error('Unsupported braces in a runtime expression');
    if (value) parts.push(escapeText(value));
  }
  for (const match of text.matchAll(/\{(wiki_abulafia_\d+_[a-f0-9]*)\}/g)) {
    literal(text.slice(cursor, match.index));
    parts.push({ ref: match[1] });
    cursor = match.index + match[0].length;
  }
  literal(text.slice(cursor));
  return parts;
}

function compactCompiler(byName) {
  const cache = new Map();
  function reject(message) { throw new Error(message); }
  function empty() {
    return { empty: true, leadingWhitespace: false, trailingWhitespace: false, firstNonAscii: false, length: 0, calls: 0, depth: 0 };
  }
  function check(summary) {
    if (summary.length > 32768 || summary.calls > 512 || summary.depth > 32) reject('Runtime expression exceeds per-roll expansion limits');
    return summary;
  }
  function literal(text) {
    if (!text.isWellFormed() || /[\u0000-\u001f\u007f{}\[\]<>&|%$]/.test(text)) reject('Runtime arguments require plain text and exact simple references');
    return check({ ...empty(), empty: !text.length, length: text.length,
      leadingWhitespace: /^\s/.test(text), trailingWhitespace: /\s$/.test(text), firstNonAscii: text.charCodeAt(0) > 127 });
  }
  function append(first, second) {
    return check({
      empty: first.empty && second.empty,
      leadingWhitespace: first.leadingWhitespace || first.empty && second.leadingWhitespace,
      trailingWhitespace: second.trailingWhitespace || second.empty && first.trailingWhitespace,
      firstNonAscii: first.firstNonAscii || first.empty && second.firstNonAscii,
      length: first.length + second.length, calls: first.calls + second.calls, depth: Math.max(first.depth, second.depth)
    });
  }
  function summarizeText(text, references, ancestors) {
    const tokens = new Map();
    for (const reference of references) {
      if (tokens.has(reference.raw) && tokens.get(reference.raw).target_qualified_name !== reference.target_qualified_name) reject('Ambiguous runtime reference');
      tokens.set(reference.raw, reference);
    }
    let summary = empty();
    let cursor = 0;
    const parts = [];
    for (const match of text.matchAll(/\[[^\[\]]+\]/g)) {
      const prefix = text.slice(cursor, match.index);
      summary = append(summary, literal(prefix));
      if (prefix) parts.push(prefix);
      const reference = tokens.get(match[0]);
      const target = byName.get(reference?.target_qualified_name)?.table;
      if (!target || !['local', 'cross_page'].includes(reference.kind) || reference.raw !== `[${reference.token}]` ||
          ![target.subtable.name, target.subtable.qualified_name, target.page.title].includes(reference.token)) reject('Missing or unsupported runtime reference');
      summary = append(summary, summarizeTable(reference.target_qualified_name, ancestors));
      parts.push({ ref: tableId(target) });
      cursor = match.index + match[0].length;
    }
    const suffix = text.slice(cursor);
    summary = append(summary, literal(suffix));
    if (suffix) parts.push(suffix);
    return { summary, parts };
  }
  function summarizeTable(name, ancestors) {
    if (ancestors.has(name)) reject('Cyclic runtime argument');
    if (ancestors.size >= 32) reject('Runtime argument exceeds 32 levels');
    if (cache.has(name)) {
      const summary = cache.get(name);
      if (ancestors.size + summary.depth > 32) reject('Runtime argument exceeds 32 levels');
      return summary;
    }
    const source = byName.get(name)?.table;
    if (!source || source.warnings?.length) reject('Runtime arguments require source tables without parse warnings');
    if (source.entries.some(entry => !Number.isSafeInteger(entry.weight) || entry.weight < 0)) reject('Invalid runtime argument weight');
    const entries = source.entries.filter(entry => entry.weight > 0);
    const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
    if (!Number.isSafeInteger(total) || total <= 0) reject('Runtime argument requires a positive safe-integer total');
    const summary = { ...empty(), empty: false, calls: 1, depth: 1 };
    for (const entry of entries) {
      const child = summarizeText(String(entry.text), entry.references, new Set(ancestors).add(name)).summary;
      for (const flag of ['empty', 'leadingWhitespace', 'trailingWhitespace', 'firstNonAscii']) summary[flag] ||= child[flag];
      summary.length = Math.max(summary.length, child.length);
      summary.calls = Math.max(summary.calls, child.calls + 1);
      summary.depth = Math.max(summary.depth, child.depth + 1);
      check(summary);
    }
    cache.set(name, summary);
    return summary;
  }
  return (entry, issue) => {
    const match = /^([^{}]*)\{\{(po\||ucfirst:)([^{}]*)\}\}([^{}]*)$/.exec(String(entry.text));
    if (!match) return null;
    const [, prefix, operator, argument, suffix] = match;
    try {
      if (/[<>]/.test(prefix + suffix)) reject('Runtime macros require plain-text surrounding text');
      const { summary, parts } = summarizeText(argument, entry.references, new Set());
      if (summary.leadingWhitespace || summary.trailingWhitespace) reject('Runtime arguments with possible edge whitespace are unsupported');
      const op = operator === 'po|' ? 'po' : 'ucfirst';
      if (op === 'ucfirst' && summary.firstNonAscii) reject('Runtime ucfirst requires an ASCII first character or empty text');
      check({ ...summary, calls: summary.calls + 1, depth: summary.depth + 1,
        length: prefix.length + summary.length + suffix.length + (op === 'po' ? 2 : 0) });
      return { prefix, suffix, expression: { op, parts }, syntax: prefix + argument + suffix };
    } catch (error) {
      issue('unsupported_runtime_expression', error.message);
      return null;
    }
  };
}

function materializedValues(entries, alternatives, issue) {
  if (!entries.some(entry => alternatives.has(entry))) return null;
  const rows = entries.filter(entry => entry.weight > 0).map(entry => {
    const choices = alternatives.get(entry) || [{ weight: 1, text: entry.text }];
    return { weight: BigInt(entry.weight), choices, total: choices.reduce((total, choice) => total + BigInt(choice.weight), 0n) };
  });
  if (rows.reduce((total, row) => total + row.choices.length, 0) > 4096) {
    issue('expansion_limit', 'Macro materialization exceeds 4096 choices per table');
    return null;
  }
  let denominator = 1n;
  for (const row of rows) {
    let first = denominator;
    let second = row.total;
    while (second) {
      const remainder = first % second;
      first = second;
      second = remainder;
    }
    denominator = denominator / first * row.total;
    if (denominator * rows.reduce((total, row) => total + row.weight, 0n) > BigInt(Number.MAX_SAFE_INTEGER)) {
      issue('expansion_limit', 'Macro materialization exceeds the exact integer weight limit');
      return null;
    }
  }
  const choices = rows.flatMap(row => row.choices.map(choice => ({
    weight: Number(row.weight * BigInt(choice.weight) * (denominator / row.total)), text: escapeText(choice.text)
  })));
  if (choices.every(choice => choice.weight === 1)) return choices.map(choice => choice.text);
  const values = {};
  let cursor = 1;
  for (const choice of choices) {
    const end = cursor + choice.weight - 1;
    values[cursor === end ? String(cursor) : `${cursor}-${end}`] = choice.text;
    cursor = end + 1;
  }
  return values;
}

function correctedRecords(plan, corrections) {
  if (!Array.isArray(corrections) || corrections.length > 65536) throw new Error('Invalid reference correction list');
  if (!corrections.length) return plan.records;
  const fields = ['tableId', 'sourceFile', 'sourceHash', 'row', 'entryHash', 'weight', 'raw', 'from', 'to', 'targetId', 'targetSourceHash', 'referenceCount'];
  const byId = new Map(plan.records.map(record => [tableId(record.table), record]));
  const byName = new Map(plan.records.map(record => [record.table.subtable.qualified_name, record]));
  const foldedNames = new Map();
  for (const name of byName.keys()) {
    const folded = name.toLowerCase();
    foldedNames.set(folded, (foldedNames.get(folded) || 0) + 1);
  }
  const grouped = new Map();
  const digest = text => crypto.createHash('sha256').update(text).digest('hex');
  for (const correction of corrections) {
    if (!correction || Object.keys(correction).length !== fields.length || fields.some(field => !Object.hasOwn(correction, field))) {
      throw new Error('Invalid reference correction fields');
    }
    const source = byId.get(correction.tableId);
    const target = byId.get(correction.targetId);
    if (!source || !target) throw new Error('Reference correction tables must already be in the selected import');
    if (!/^[a-f0-9]{64}$/.test(correction.sourceHash) || source.sourceHash !== correction.sourceHash || source.sourceFile !== correction.sourceFile) {
      throw new Error(`Stale reference correction source: ${correction.tableId}`);
    }
    if (!/^[a-f0-9]{64}$/.test(correction.targetSourceHash) || target.sourceHash !== correction.targetSourceHash) {
      throw new Error(`Stale reference correction target: ${correction.targetId}`);
    }
    if (typeof correction.from !== 'string' || typeof correction.to !== 'string' || correction.from === correction.to ||
        correction.to !== target.table.subtable.qualified_name || correction.from.toLowerCase() !== correction.to.toLowerCase() ||
        byName.has(correction.from) || foldedNames.get(correction.to.toLowerCase()) !== 1) {
      throw new Error('Reference corrections require a missing name and one unique case-only target');
    }
    const entry = Number.isSafeInteger(correction.row) && correction.row > 0 ? source.table.entries[correction.row - 1] : null;
    if (!entry || typeof entry.text !== 'string' || digest(entry.text) !== correction.entryHash ||
        !Number.isSafeInteger(correction.weight) || correction.weight <= 0 || correction.weight !== entry.weight) {
      throw new Error(`Stale or nonselectable reference correction row: ${correction.tableId}:${correction.row}`);
    }
    if (typeof correction.raw !== 'string' || !/^\[[^\[\]\r\n]+\]$/.test(correction.raw) || !entry.text.includes(correction.raw)) {
      throw new Error('Reference correction token is absent or malformed');
    }
    const references = entry.references.filter(reference => reference.raw === correction.raw);
    if (!Number.isSafeInteger(correction.referenceCount) || correction.referenceCount <= 0 || references.length !== correction.referenceCount ||
        references.some(reference => reference.target_qualified_name !== correction.from || reference.raw !== `[${reference.token}]` ||
          !['local', 'cross_page'].includes(reference.kind))) {
      throw new Error('Reference correction does not match exact supported source references');
    }
    const spellings = [target.table.subtable.name, target.table.subtable.qualified_name, target.table.page.title];
    if (references.some(reference => typeof reference.token !== 'string' ||
        !spellings.some(name => reference.token.toLowerCase() === name.toLowerCase()))) {
      throw new Error('Reference correction requires a case-only source token');
    }
    if (!grouped.has(correction.tableId)) grouped.set(correction.tableId, new Map());
    const rows = grouped.get(correction.tableId);
    if (!rows.has(correction.row)) rows.set(correction.row, new Map());
    if (rows.get(correction.row).has(correction.raw)) throw new Error('Duplicate reference correction token in a row');
    rows.get(correction.row).set(correction.raw, { ...correction });
  }
  return plan.records.map(record => {
    const rows = grouped.get(tableId(record.table));
    if (!rows) return record;
    const applied = [...rows.values()].flatMap(tokens => [...tokens.values()]);
    const entries = record.table.entries.map((entry, index) => {
      const tokens = rows.get(index + 1);
      if (!tokens) return entry;
      return {
        ...entry,
        text: entry.text.replace(/\[[^\[\]\r\n]+\]/g, token => tokens.has(token) ? `[${tokens.get(token).to}]` : token),
        references: entry.references.map(reference => {
          const correction = tokens.get(reference.raw);
          if (!correction) return reference;
          const target = byId.get(correction.targetId).table;
          return { ...reference, raw: `[${correction.to}]`, token: correction.to,
            target_page: target.page.title, target_subtable: target.subtable.name, target_qualified_name: correction.to };
        })
      };
    });
    const correctedNames = new Set(applied.map(correction => correction.from));
    const dependencies = record.table.dependencies ? { ...record.table.dependencies,
      unresolved: (record.table.dependencies.unresolved || []).filter(name => !correctedNames.has(name) ||
        entries.some(entry => entry.weight !== 0 && entry.references.some(reference => reference.target_qualified_name === name))) } : undefined;
    return { ...record, table: { ...record.table, entries, ...(dependencies ? { dependencies } : {}) }, referenceCorrections: applied };
  });
}

function compileImport(plan, { existingIds = [], aliases = {}, runtimeExpressions = false, referenceCorrections = [] } = {}) {
  const occupied = new Set(existingIds);
  const originalByName = new Map(plan.records.map(record => [record.table.subtable.qualified_name, record]));
  const records = correctedRecords(plan, referenceCorrections);
  const byName = new Map(records.map(record => [record.table.subtable.qualified_name, record]));
  const identifiers = new Map();
  const labels = Object.create(null);
  const materialized = new Map();
  const possessiveChoices = possessiveCompiler(byName);
  const compactExpression = compactCompiler(byName);
  const extendedExpression = createExpressionCompiler(byName, { tableId, inertText, escapeText });
  const compactEntries = new WeakMap();
  const extendedEntries = new WeakMap();
  const runtimeTables = new Set();
  for (const record of plan.records) {
    const identifier = tableId(record.table);
    if (occupied.has(identifier)) throw new Error(`Wiki name collision: ${identifier}`);
    occupied.add(identifier);
    identifiers.set(record.table.subtable.qualified_name, identifier);
    labels[identifier] = record.table.subtable.qualified_name;
  }
  for (const alias of Object.keys(aliases)) {
    if (!/^\w+$/.test(alias) || alias in Object.prototype || occupied.has(alias)) {
      throw new Error(`Wiki alias collision or invalid name: ${alias}`);
    }
    occupied.add(alias);
  }

  const tables = records.map(record => {
    const source = record.table;
    const original = originalByName.get(source.subtable.qualified_name).table;
    const issues = [];
    const issueKeys = new Set();
    const alternatives = new WeakMap();
    function issue(code, detail) {
      const key = `${code}:${detail}`;
      if (issueKeys.has(key)) return;
      issueKeys.add(key);
      issues.push({ code, detail });
    }
    if (!source.entries.length) issue('empty_table', 'The source table has no entries');
    if (source.warnings?.length) issue('source_warning', 'The source extractor reported parse warnings');
    if (source.dependencies?.unresolved?.length) {
      const inactiveTargets = new Set();
      const activeTargets = new Set();
      for (const entry of source.entries) {
        const targets = entry.weight === 0 ? inactiveTargets : activeTargets;
        for (const reference of entry.references) targets.add(reference.target_qualified_name);
      }
      if (source.dependencies.unresolved.some(name => typeof name !== 'string' || !inactiveTargets.has(name) || activeTargets.has(name))) {
        issue('source_unresolved', 'The source extractor reported unresolved references');
      }
    }
    let totalWeight = 0;
    const entries = source.entries.map((entry, index) => {
      if (!Number.isSafeInteger(entry.weight) || entry.weight < 0) issue('invalid_weight', 'Weights must be nonnegative safe integers');
      const weight = Number.isSafeInteger(entry.weight) && entry.weight >= 0 ? entry.weight : 0;
      totalWeight += weight;
      const rawText = String(original.entries[index].text);
      const executableText = String(entry.text);
      const entryIssue = entry.weight === 0 ? () => {} : issue;
      const transformIssues = [];
      const transformIssue = runtimeExpressions ? (code, detail) => transformIssues.push({ code, detail }) : entryIssue;
      const transform = weight > 0 ? ucfirstChoices(entry, byName, transformIssue) || possessiveChoices(entry, transformIssue) : null;
      const compact = runtimeExpressions && weight > 0 && !transform ? compactExpression(entry, transformIssue) : null;
      const extended = runtimeExpressions && weight > 0 && !transform && !compact ? extendedExpression(entry, transformIssue) : null;
      if (!compact && !extended) for (const { code, detail } of transformIssues) entryIssue(code, detail);
      if (/[{}]|\[\[|\]\]|%[^%]+%|\$(?:[$&`']|<)/.test(transform?.syntax ?? compact?.syntax ?? extended?.syntax ?? executableText)) {
        entryIssue('unsupported_syntax', 'Wiki expressions or replacement operators require additional runtime support');
      }
      const replacements = new Map();
      const referenceIds = [];
      for (const reference of entry.references) {
        const name = reference.target_qualified_name;
        const target = byName.get(name)?.table;
        let identifier = identifiers.get(name);
        if (!identifier) {
          const missingName = name || `${source.page.title}.[${reference.token || reference.raw}]`;
          identifier = `wiki_abulafia_missing_${Buffer.from(missingName, 'utf8').toString('hex')}`;
          labels[identifier] = missingName;
          entryIssue('missing_reference', missingName);
        }
        referenceIds.push(identifier);
        if (!['local', 'cross_page'].includes(reference.kind) || !target ||
            reference.raw !== `[${reference.token}]` ||
            ![target.subtable.name, target.subtable.qualified_name, target.page.title].includes(reference.token)) {
          entryIssue('unsupported_reference', reference.raw || reference.token || 'Unknown reference');
        }
        if (!reference.raw || !executableText.includes(reference.raw)) {
          entryIssue('reference_mismatch', reference.raw || 'Reference has no source token');
          continue;
        }
        if (replacements.has(reference.raw) && replacements.get(reference.raw) !== identifier) {
          entryIssue('ambiguous_reference', reference.raw);
        }
        replacements.set(reference.raw, identifier);
      }
      let text = executableText;
      for (const [token, identifier] of replacements) text = text.split(token).join(`{${identifier}}`);
      if (/[\[\]]/.test(text)) entryIssue('unsupported_syntax', 'Unconverted square-bracket expression');
      if (entry.weight !== 0) text = inertText(text, entryIssue);
      const references = Array.from(text.matchAll(/\{(wiki_abulafia_\w+)\}/g), match => match[1]);
      for (const identifier of referenceIds) if (!references.includes(identifier)) references.push(identifier);
      const compiled = { weight, text: entry.weight === 0 ? rawText : text, rawText, references };
      if (compact) {
        compactEntries.set(compiled, compact);
        runtimeTables.add(identifiers.get(source.subtable.qualified_name));
      }
      if (extended) {
        extendedEntries.set(compiled, extended);
        runtimeTables.add(identifiers.get(source.subtable.qualified_name));
      }
      if (transform) {
        alternatives.set(compiled, transform.choices.map(choice => {
          let value = choice.text;
          for (const [token, identifier] of replacements) value = value.split(token).join(`{${identifier}}`);
          return { weight: choice.weight, text: inertText(value, entryIssue) };
        }));
      }
      return compiled;
    });
    if (!Number.isSafeInteger(totalWeight) || totalWeight <= 0) issue('invalid_weight', 'Total weight must be a positive safe integer');
    const values = materializedValues(entries, alternatives, runtimeExpressions ? () => runtimeTables.add(identifiers.get(source.subtable.qualified_name)) : issue);
    if (values) materialized.set(identifiers.get(source.subtable.qualified_name), values);
    return {
      id: identifiers.get(source.subtable.qualified_name), name: source.subtable.qualified_name,
      page: source.page.title, sourceFile: record.sourceFile, sourceHash: record.sourceHash,
      contributor: source.source.contributor, originalContributor: record.originalContributor,
      originalSourceFile: record.originalSourceFile, attributionBasis: record.attributionBasis,
      sourceRevision: source.source.revision_id, originalRevision: record.originalRevision?.revision_id,
      status: issues.length ? 'blocked' : 'ready', issues, entries, totalWeight,
      ...(record.referenceCorrections ? { referenceCorrections: record.referenceCorrections } : {}),
      dependencies: [...new Set(entries.filter(entry => entry.weight > 0).flatMap(entry => entry.references))]
    };
  });

  const byId = new Map(tables.map(table => [table.id, table]));
  const visited = new Map();
  const costs = new Map();
  function buildProgram(table) {
    const source = byName.get(table.name).table;
    function reject(code, detail) { throw new Error(detail); }
    function converted(text, original) {
      for (const reference of original.references) text = text.split(reference.raw).join(`{${identifiers.get(reference.target_qualified_name)}}`);
      return programParts(inertText(text, reject));
    }
    let nodes = 0;
    function countParts(parts) {
      if (parts.length > 4096) throw new Error('Runtime expression exceeds 4096 parts');
      for (const part of parts) {
        nodes += 1;
        if (nodes > 65536) throw new Error('Runtime program exceeds 65536 nodes');
        if (part.parts) countParts(part.parts);
        for (const argument of part.args || []) if (argument) countParts(argument);
        for (const argument of Object.values(part.named || {})) countParts(argument);
      }
    }
    return table.entries.map((entry, index) => {
      if (entry.weight === 0) return null;
      const original = source.entries[index];
      const extended = extendedEntries.get(entry);
      const compact = extended ? null : compactEntries.get(entry) || compactExpression(original, reject);
      const parts = extended ? extended.program : compact ? [...converted(compact.prefix, original), compact.expression, ...converted(compact.suffix, original)] : programParts(entry.text);
      countParts(parts);
      return parts;
    });
  }
  function assess(table, depth = 0) {
    if (visited.get(table.id) === 2) return;
    if (visited.get(table.id) === 1) {
      table.issues.push({ code: 'cycle', detail: 'Cyclic expansion requires a bounded wiki runtime' });
      table.status = 'blocked';
      return;
    }
    visited.set(table.id, 1);
    if (depth > 32) table.issues.push({ code: 'expansion_limit', detail: 'Dependency depth exceeds the browser safety limit' });
    if (depth <= 32) {
      for (const dependency of table.dependencies) {
        const target = byId.get(dependency);
        if (!target) continue;
        assess(target, depth + 1);
        if (target.status === 'blocked') table.issues.push({ code: 'blocked_dependency', detail: target.name });
        if (target.execution === 'wiki') runtimeTables.add(table.id);
      }
    }
    if (runtimeTables.has(table.id) && !table.issues.length) {
      try {
        table.program = buildProgram(table);
        table.execution = 'wiki';
      } catch (error) {
        table.issues.push({ code: 'unsupported_runtime_expression', detail: error.message });
      }
    }
    let maxCalls = 1;
    let maxLength = 0;
    let maxDepth = 1;
    for (const entry of table.entries) {
      if (entry.weight === 0) continue;
      let calls = 1;
      let length = entry.text.replace(/\{wiki_abulafia_\w+\}/g, '').length;
      let entryDepth = 1;
      for (const identifier of entry.references) {
        const cost = costs.get(identifier);
        if (!cost) continue;
        calls += cost.calls;
        length += cost.length;
        entryDepth = Math.max(entryDepth, cost.depth + 1);
      }
      maxCalls = Math.max(maxCalls, calls);
      maxLength = Math.max(maxLength, length);
      maxDepth = Math.max(maxDepth, entryDepth);
    }
    if (maxCalls > 512 || maxLength > 32768 || maxDepth > 32) {
      table.issues.push({ code: 'expansion_limit', detail: 'Worst-case expansion exceeds the browser safety limit' });
    }
    table.status = table.issues.length ? 'blocked' : 'ready';
    if (table.status === 'blocked') {
      delete table.program;
      delete table.execution;
    }
    costs.set(table.id, { calls: Math.min(maxCalls, 513), length: Math.min(maxLength, 32769), depth: Math.min(maxDepth, 33) });
    visited.set(table.id, 2);
  }
  for (const table of tables) assess(table);
  for (const table of tables) {
    if (table.status === 'blocked') {
      table.values = [escapeText(`[Wiki table unavailable: ${table.name}]`).replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')];
    } else if (table.execution === 'wiki') {
      table.values = [escapeText(`[Wiki table requires Table Atlas: ${table.name}]`).replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')];
    } else if (materialized.has(table.id)) {
      table.values = materialized.get(table.id);
    } else if (table.entries.every(entry => entry.weight === 1)) {
      table.values = table.entries.map(entry => escapeText(entry.text));
    } else {
      let cursor = 1;
      table.values = {};
      for (const entry of table.entries) {
        if (!entry.weight) continue;
        const end = cursor + entry.weight - 1;
        table.values[cursor === end ? String(cursor) : `${cursor}-${end}`] = escapeText(entry.text);
        cursor = end + 1;
      }
    }
  }
  const resolvedAliases = {};
  for (const [alias, name] of Object.entries(aliases)) {
    const target = byId.get(identifiers.get(name));
    if (!target || target.status !== 'ready' || target.execution === 'wiki') throw new Error(`Unvalidated wiki alias: ${alias} -> ${name}`);
    resolvedAliases[alias] = target.id;
  }
  return { schemaVersion: 1, contributors: plan.contributors, tables, labels, aliases: resolvedAliases };
}

function buildArtifacts(plan, bundle, provenance, seeds = []) {
  const artifacts = new Map();
  const byId = new Map(bundle.tables.map(table => [table.id, table]));
  const coreIds = new Set();
  const pending = Object.values(bundle.aliases);
  while (pending.length) {
    const identifier = pending.pop();
    if (coreIds.has(identifier)) continue;
    const table = byId.get(identifier);
    if (!table || table.status !== 'ready' || table.execution === 'wiki') throw new Error(`Unvalidated compatibility dependency: ${identifier}`);
    coreIds.add(identifier);
    pending.push(...table.dependencies);
  }
  const archives = new Map();
  const archivePaths = new Map();
  for (const record of plan.records) {
    const pageId = record.table.page.page_id;
    const archiveFile = `tables/abulafia/source/${pageId}.json`;
    archivePaths.set(tableId(record.table), archiveFile);
    if (!archives.has(archiveFile)) archives.set(archiveFile, []);
    archives.get(archiveFile).push({
      current: { sourceFile: record.sourceFile, sourceHash: record.sourceHash, table: record.table },
      original: record.originalSnapshot || null,
      attributionBasis: record.attributionBasis,
      originalContributor: record.originalContributor,
      originalSourceFile: record.originalSourceFile
    });
  }
  for (const [file, tables] of archives) {
    artifacts.set(file, JSON.stringify({ schemaVersion: 1, ...provenance, tables }) + '\n');
  }
  const summary = {
    tables: bundle.tables.length, ready: bundle.tables.filter(table => table.status === 'ready').length,
    blocked: bundle.tables.filter(table => table.status === 'blocked').length,
    coreTables: coreIds.size, contributors: plan.contributors.length, pages: archives.size,
    entries: bundle.tables.reduce((total, table) => total + table.entries.length, 0),
    historicalAttribution: plan.records.filter(record => record.originalSnapshot).length
  };
  const tables = bundle.tables.map(table => ({ ...table, archiveFile: archivePaths.get(table.id) }));
  const core = tables.filter(table => coreIds.has(table.id));
  const catalog = tables.filter(table => !coreIds.has(table.id));
  const coreLabels = Object.fromEntries(core.map(table => [table.id, table.name]));
  const catalogLabels = Object.fromEntries(Object.entries(bundle.labels).filter(([identifier]) => !coreIds.has(identifier)));
  const runtimeOnly = tables.filter(table => table.execution === 'wiki').length;
  const compatibilitySummary = { ...summary, ready: summary.ready - runtimeOnly, blocked: summary.blocked + runtimeOnly };
  artifacts.set('tables/abulafia.js', `WikiImport.register(${JSON.stringify({ schemaVersion: 1, tables: core, labels: coreLabels, aliases: bundle.aliases, summary: compatibilitySummary })}, { core: true });\n`);
  const encoded = gzipSync(JSON.stringify({ schemaVersion: 1, tables: catalog, labels: catalogLabels, aliases: {}, summary }), { level: 9 }).toString('base64');
  artifacts.set('explorer/abulafia-catalog.js', `WikiImport.catalogReady = WikiImport.loadCompressed(${JSON.stringify(encoded)});\n`);
  const generatedFiles = Object.fromEntries([...artifacts].map(([file, content]) => [file, {
    sha256: crypto.createHash('sha256').update(content).digest('hex'), bytes: Buffer.byteLength(content)
  }]));
  const manifest = {
    schemaVersion: 1, importer: 'randomtables-abulafia', ...provenance,
    attributionPolicy: 'Recorded source contributor and earliest retained content contributor, expanded recursively through authors and dependencies',
    seeds, summary, contributors: plan.contributors, aliases: bundle.aliases,
    tables: tables.map(({ entries, values, program, ...metadata }) => metadata), generatedFiles
  };
  artifacts.set('tables/abulafia/manifest.json', JSON.stringify(manifest) + '\n');
  return artifacts;
}

function writeArtifacts(outputRoot, artifacts) {
  const root = fs.realpathSync(outputRoot);
  const pending = [];
  for (const [relative, content] of artifacts) {
    const file = path.resolve(root, relative);
    const contained = path.relative(root, file);
    if (path.isAbsolute(relative) || contained === '..' || contained.startsWith(`..${path.sep}`)) {
      throw new Error(`Artifact is outside the output directory: ${relative}`);
    }
    for (let current = file; current !== root; current = path.dirname(current)) {
      if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error(`Refusing to overwrite a symbolic link: ${relative}`);
    }
    if (Buffer.byteLength(content) > 90 * 1024 * 1024) throw new Error(`Artifact exceeds the per-file size limit: ${relative}`);
    if (fs.existsSync(file)) {
      if (fs.readFileSync(file).equals(Buffer.from(content))) continue;
      throw new Error(`Refusing to overwrite existing content: ${relative}`);
    }
    pending.push({ file, content });
  }
  const created = [];
  try {
    for (const { file, content } of pending) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content, { flag: 'wx' });
      created.push(file);
    }
  } catch (error) {
    for (const file of created) fs.unlinkSync(file);
    throw error;
  }
  return created.length;
}

function main() {
  const { values } = parseArgs({ options: { source: { type: 'string' }, write: { type: 'boolean', default: false } } });
  if (!values.source) throw new Error('Supply --source with the path to a clean wiki-dump checkout');
  const sourceRoot = fs.realpathSync(values.source);
  const repository = 'https://github.com/TedTschopp/random-generator-com-wiki-dump';
  const commit = execFileSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (execFileSync('git', ['-C', sourceRoot, 'status', '--porcelain'], { encoding: 'utf8' }).trim()) {
    throw new Error('The source checkout has uncommitted changes; use a clean source snapshot');
  }
  const repo = path.resolve(__dirname, '..', '..');
  const runtime = vm.createContext({ console }, { codeGeneration: { strings: false, wasm: false } });
  const html = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
  const sources = Array.from(html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g), match => match[1])
    .filter(source => source.startsWith('tables/') && source !== 'tables/abulafia.js');
  for (const source of ['JS/generator.js', ...sources]) {
    vm.runInContext(fs.readFileSync(path.join(repo, source), 'utf8'), runtime, { filename: source, timeout: 1000 });
  }
  const seeds = ['Cheeses.Cheeseadj', 'GheronUtility.DeitySymbol', 'GheronUtility.OrganizationSymbol', 'Ship Names.main', 'Fantasy Town Names.main'];
  const aliases = {
    Cheeseadj: 'Cheeses.Cheeseadj', GheronDeitySymbol: 'GheronUtility.DeitySymbol',
    GheronOrganizationSymbol: 'GheronUtility.OrganizationSymbol', ship_name: 'Ship Names.Special',
    town_name: 'Fantasy Town Names.Englishy'
  };
  const correctionBatch = JSON.parse(fs.readFileSync(path.join(repo, 'explorer/tools/case-reference-corrections.json'), 'utf8'));
  if (correctionBatch.schemaVersion !== 1 || correctionBatch.repository !== repository || correctionBatch.commit !== commit ||
      !Array.isArray(correctionBatch.corrections) || !correctionBatch.corrections.length ||
      new Set(correctionBatch.corrections.map(correction => correction.tableId)).size !== correctionBatch.basis?.candidateComponents ||
      new Set(correctionBatch.corrections.map(correction => correction.from)).size !== correctionBatch.basis?.missingTargetNames) {
    throw new Error('Reference correction batch does not match the pinned source or reviewed scope');
  }
  const plan = planImport(loadCorpus(sourceRoot), seeds);
  const bundle = compileImport(plan, { existingIds: Object.keys(runtime.gen_data), aliases, runtimeExpressions: true,
    referenceCorrections: correctionBatch.corrections });
  const artifacts = buildArtifacts(plan, bundle, { repository, commit }, seeds);
  const manifest = JSON.parse(artifacts.get('tables/abulafia/manifest.json'));
  const written = values.write ? writeArtifacts(repo, artifacts) : 0;
  console.log(JSON.stringify({ mode: values.write ? 'write' : 'dry-run', commit, ...manifest.summary,
    aliases, referenceCorrections: correctionBatch.corrections.length, correctedTables: correctionBatch.basis.candidateComponents,
    files: artifacts.size, bytes: [...artifacts.values()].reduce((total, content) => total + Buffer.byteLength(content), 0), written }, null, 2));
}

module.exports = { buildArtifacts, compileImport, contributorKey, loadCorpus, originalAttribution, planImport, tableId, writeArtifacts };

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}