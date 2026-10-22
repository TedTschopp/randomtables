const expressions = require('../../JS/wiki-expressions.js');
const templateData = require('../../JS/wiki-template-data.js');
const { prepare: prepareRecursion } = require('../../JS/wiki-recursion.js');

function createExpressionCompiler(byName, { tableId, inertText, escapeText, recursionPolicies = new Map() }) {
  const byId = new Map([...byName.values()].map(record => [tableId(record.table), record.table]));
  const valueCache = new Map();
  const costCache = new Map();
  const sourceCache = new WeakMap();
  const recursionCache = new Map();
  const recursionViews = new Map();
  const pages = new Set([...byName.values()].map(record => record.table.page.title));
  function reject(message) { throw new Error(message); }
  function count(parts) {
    return parts.reduce((total, part) => total + 1 + (part.args || []).reduce((sum, argument) => sum + count(argument || []), 0) +
      Object.values(part.named || {}).reduce((sum, argument) => sum + count(argument), 0) + (part.fallback ? count(part.fallback) : 0), 0);
  }
  const overhead = Object.fromEntries(Object.entries(templateData).map(([name, definition]) => [name, count(expressions.parse(definition.source, { parameters: true }))]));
  function partsFor(entry) {
    if (sourceCache.has(entry)) return sourceCache.get(entry);
    if (/<[^>]*\{\{/.test(entry.text)) reject('Macros inside HTML tags are unsupported');
    const parsed = expressions.parse(entry.text, { reference(token) {
      const references = entry.references.filter(reference => reference.raw === `[${token}]`);
      const names = new Set(references.map(reference => reference.target_qualified_name));
      if (names.size !== 1) reject(`Missing or ambiguous macro reference: [${token}]`);
      const target = byName.get([...names][0])?.table;
      if (!target || references.some(reference => !['local', 'cross_page'].includes(reference.kind)) ||
          ![target.subtable.name, target.subtable.qualified_name, target.page.title].includes(token)) reject(`Unsupported macro reference: [${token}]`);
      return tableId(target);
    } });
    const program = expressions.validate(parsed.map(part => typeof part === 'string' ? escapeText(inertText(part, (code, detail) => reject(detail))) : part));
    sourceCache.set(entry, program);
    return program;
  }
  function entriesFor(identifier, ancestors) {
    const table = byId.get(identifier);
    if (!table || table.warnings?.length || ancestors.has(identifier) || ancestors.size >= 32) reject('Macro dependency is missing, cyclic, too deep, or has parse warnings');
    if (table.entries.some(entry => !Number.isSafeInteger(entry.weight) || entry.weight < 0)) reject('Macro dependency has invalid source weights');
    const entries = table.entries.filter(entry => entry.weight > 0);
    if (!entries.length) reject('Macro dependency has no selectable rows');
    return entries;
  }
  function recursionView(identifier) {
    if (recursionViews.has(identifier)) return recursionViews.get(identifier);
    entriesFor(identifier, new Set());
    const source = byId.get(identifier);
    const policy = recursionPolicies.get(identifier);
    let cursor = 0;
    const rows = source.entries.flatMap((entry, index) => {
      if (entry.weight === 0) return [];
      const start = cursor + 1;
      cursor += entry.weight;
      const parts = partsFor(entry);
      return [{ start, end: cursor, row: index + 1, parts,
        value: parts.map(part => typeof part === 'string' ? part : part.ref ? `{${part.ref}}` : '').join('') }];
    });
    const view = { id: identifier, status: 'ready', rows,
      ...(policy ? { recursion: { kind: policy.kind, row: policy.row, maxDepth: policy.maxDepth } } : {}) };
    recursionViews.set(identifier, view);
    return view;
  }
  function recursionFor(identifier, ancestors) {
    if (!recursionPolicies.has(identifier)) return null;
    entriesFor(identifier, ancestors);
    if (!recursionCache.has(identifier)) recursionCache.set(identifier, prepareRecursion(recursionView(identifier), recursionView));
    return recursionCache.get(identifier);
  }
  function referencesIn(parts, result = []) {
    for (const part of parts) {
      if (part.ref) result.push(part);
      for (const argument of part.args || []) referencesIn(argument || [], result);
      for (const argument of Object.values(part.named || {})) referencesIn(argument, result);
    }
    return result;
  }
  function choices(parts, ancestors = new Set()) {
    const references = referencesIn(parts);
    const domains = references.map(reference => sourceValues(reference.ref, ancestors));
    if (domains.reduce((product, domain) => product * domain.length, 1) > 4096) reject('Macro argument validation exceeds 4096 combinations');
    const selected = new Map();
    const outputs = new Set();
    let characters = 0;
    function replace(nodes) {
      return nodes.map(part => {
        if (part.ref) return selected.get(part);
        if (typeof part === 'string') return part;
        return { op: part.op, args: part.args.map(argument => argument === null ? null : replace(argument)),
          ...(part.named ? { named: Object.fromEntries(Object.entries(part.named).map(([name, argument]) => [name, replace(argument)])) } : {}) };
      });
    }
    function visit(index) {
      if (index === references.length) {
        const value = expressions.evaluate(replace(parts), { exists: title => pages.has(title) });
        if (!outputs.has(value)) characters += value.length;
        if (characters > 1024 * 1024) reject('Macro argument validation exceeds its text budget');
        outputs.add(value);
        return;
      }
      for (const value of domains[index]) {
        selected.set(references[index], value);
        visit(index + 1);
      }
    }
    visit(0);
    return [...outputs];
  }
  function sourceValues(identifier, ancestors) {
    if (ancestors.has(identifier)) reject('Cyclic macro argument');
    if (valueCache.has(identifier)) return valueCache.get(identifier);
    const values = new Set();
    let characters = 0;
    function add(value) {
      if (!values.has(value)) characters += value.length;
      values.add(value);
      if (values.size > 4096 || characters > 1024 * 1024) reject('Macro argument domain exceeds its validation budget');
    }
    const recursion = recursionFor(identifier, ancestors);
    if (recursion) {
      const terminals = [...new Map(recursion.choices.map(choice => [choice.text, choice.key]))].map(([text, key]) => ({ text, key }));
      for (const choice of terminals) add(choice.text);
      if (recursion.kind === 'unique-pair') {
        const groups = new Map();
        for (const choice of terminals) groups.set(choice.key, (groups.get(choice.key) || 0) + 1);
        const combinations = terminals.length ** 2 - [...groups.values()].reduce((total, size) => total + size ** 2, 0);
        if (terminals.length + combinations > 4096) reject('Macro argument domain exceeds its validation budget');
        for (const first of terminals) for (const second of terminals) {
          if (first.key !== second.key) add(first.text + recursion.literal + second.text);
        }
      } else for (const choice of terminals) add(recursion.literal + choice.text);
    } else {
      const entries = entriesFor(identifier, ancestors);
      for (const entry of entries) for (const value of choices(partsFor(entry), new Set(ancestors).add(identifier))) add(value);
    }
    const result = [...values];
    valueCache.set(identifier, result);
    return result;
  }
  function sourceCost(identifier, ancestors) {
    if (ancestors.has(identifier)) reject('Cyclic macro dependency');
    if (costCache.has(identifier)) return costCache.get(identifier);
    const recursion = recursionFor(identifier, ancestors);
    if (recursion) {
      const terminalOperations = Math.max(...recursion.choices.map(choice => choice.steps.reduce((total, step) =>
        total + partsFor(byId.get(step.id).entries[step.row - 1]).length, 0)));
      const operations = partsFor(byId.get(identifier).entries[recursion.row - 1]).length + recursion.arity * terminalOperations;
      const result = { ...recursion.cost, operations };
      costCache.set(identifier, result);
      return result;
    }
    const entries = entriesFor(identifier, ancestors);
    const costs = entries.map(entry => cost(partsFor(entry), new Set(ancestors).add(identifier)));
    const result = { length: Math.max(...costs.map(value => value.length)), operations: Math.max(...costs.map(value => value.operations)),
      calls: 1 + Math.max(...costs.map(value => value.calls)), depth: 1 + Math.max(...costs.map(value => value.depth)) };
    costCache.set(identifier, result);
    return result;
  }
  function cost(parts, ancestors = new Set()) {
    const result = { length: 0, operations: 0, calls: 0, depth: 0 };
    for (const part of parts) {
      let child;
      if (typeof part === 'string') child = { length: part.length, operations: 1, calls: 0, depth: 0 };
      else if (part.ref) child = sourceCost(part.ref, ancestors);
      else {
        const args = part.args.map(argument => cost(argument || [], ancestors));
        const named = Object.values(part.named || {}).map(argument => cost(argument, ancestors));
        const children = [...args, ...named];
        const length = index => args[index]?.length || 0;
        let maximum = length(0);
        if (['#expr', '#len', '#pos', '#rpos', 'numtostring'].includes(part.op)) maximum = 64;
        else if (part.op === 'currentyear') maximum = 6;
        else if (part.op === 'comma') maximum = 2;
        else if (part.op === '!') maximum = 1;
        else if (part.op === 'article') maximum += 3;
        else if (['plural', 'po'].includes(part.op)) maximum = Math.max(maximum + 2, length(1));
        else if (['uc', 'lc'].includes(part.op)) maximum *= 3;
        else if (part.op === 'concat') maximum += length(1);
        else if (part.op === 'pronoun') maximum *= 2;
        else if (part.op === '#replace') maximum *= Math.max(1, length(2));
        else if (part.op === 'array norepeat') maximum += length(1) + 1;
        else if (['array implode', 'psychon norepeat'].includes(part.op)) maximum = maximum * Math.max(6, length(1)) + length(2);
        else if (['#if', '#ifeq', '#ifexist', '#switch', 'link', 'font color', 'dieroll'].includes(part.op)) maximum = Math.max(3, ...children.map(child => child.length));
        else if (part.op === 'hover') maximum = length(1);
        child = { length: maximum, operations: 1 + (overhead[part.op] || 0) + children.reduce((sum, value) => sum + value.operations, 0),
          calls: children.reduce((sum, value) => sum + value.calls, 0), depth: Math.max(0, ...children.map(value => value.depth)) };
      }
      result.length += child.length;
      result.operations += child.operations;
      result.calls += child.calls;
      result.depth = Math.max(result.depth, child.depth);
      if (result.length > 32768 || result.operations > 4096 || result.calls > 511 || result.depth >= 32) reject('Macro worst-case expansion exceeds browser limits');
    }
    return result;
  }
  function check(parts) {
    for (const part of parts) {
      if (typeof part === 'string') {
        if (/%[^%]+%/.test(part)) reject('Percent-delimited expressions are not implemented');
        continue;
      }
      if (part.ref) continue;
      for (const argument of part.args) check(argument || []);
      for (const argument of Object.values(part.named || {})) check(argument);
      if (part.op === '#expr') for (const value of choices(part.args[0] || [])) expressions.arithmetic(value);
      if (part.op === '#sub' || part.op === '#pos') {
        for (const index of part.op === '#sub' ? [1, 2] : [2]) {
          for (const value of choices(part.args[index] || [])) if (!Number.isSafeInteger(Number(value.trim()))) reject('Unvalidated dynamic string offset');
        }
        if (part.op === '#pos') choices([part]);
      }
      if (['ucfirst', 'lcfirst'].includes(part.op)) {
        const argument = part.args[0].filter(part => typeof part !== 'string' || part.trim());
        const first = argument[0];
        const guaranteed = typeof first === 'string' && first.trimStart().charCodeAt(0) <= 127 || first?.op === 'article';
        if (!guaranteed) for (const value of choices(part.args[0])) if (value.trim().charCodeAt(0) > 127) reject('Non-ASCII first-character casing remains unsupported');
      }
    }
  }
  return (entry, issue) => {
    if (!String(entry.text).includes('{{')) return null;
    try {
      const program = partsFor(entry);
      check(program);
      cost(program);
      if (!referencesIn(program).length) expressions.evaluate(program, { exists: title => pages.has(title) });
      return { program, syntax: program.filter(part => typeof part === 'string').join('') };
    } catch (error) {
      issue('unsupported_macro_expression', error.message);
      return null;
    }
  };
}

module.exports = { createExpressionCompiler };