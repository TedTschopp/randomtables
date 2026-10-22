(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else Object.defineProperty(root, 'WikiRecursion', { value: factory() });
})(globalThis, function () {
  'use strict';
  const maximumWeight = BigInt(Number.MAX_SAFE_INTEGER);

  function normalize(value) {
    return value.normalize('NFC').replace(/\s+/gu, ' ').trim().toLowerCase();
  }

  function prepare(table, resolve) {
    function reject(detail) { throw new Error(`Invalid recursion policy at ${table.id}: ${detail}`); }
    const policy = table.recursion;
    if (!policy || Object.keys(policy).sort().join(',') !== 'kind,maxDepth,row' ||
        !['unique-pair', 'bounded-wrapper'].includes(policy.kind) || policy.maxDepth !== 1 ||
        !Number.isSafeInteger(policy.row) || policy.row < 1) reject('unsupported policy or depth');
    const recursive = table.rows.find(row => row.row === policy.row);
    const parts = recursive?.parts;
    const self = part => part && Object.keys(part).length === 1 && part.ref === table.id;
    const pair = policy.kind === 'unique-pair';
    if (!parts || (pair ? parts.length !== 3 || !self(parts[0]) || parts[1] !== ' and ' || !self(parts[2]) :
      parts.length !== 2 || typeof parts[0] !== 'string' || !parts[0].trim() || !self(parts[1]))) reject('unsupported recursive row shape');

    function gcd(first, second) {
      while (second) [first, second] = [second, first % second];
      return first;
    }
    function fraction(numerator, denominator) {
      const divisor = gcd(numerator, denominator);
      return { numerator: numerator / divisor, denominator: denominator / divisor };
    }
    function rowParts(row) {
      if (row.parts) return row.parts;
      const result = [];
      let cursor = 0;
      for (const match of row.value.matchAll(/\{(wiki_abulafia_\d+_[a-f0-9]*)\}/g)) {
        result.push(row.value.slice(cursor, match.index), { ref: match[1] });
        cursor = match.index + match[0].length;
      }
      result.push(row.value.slice(cursor));
      return result;
    }
    const active = new Set();
    const cache = new Map();
    function expand(target, depth = 0) {
      if (!target || target.status !== 'ready') reject('missing or blocked terminal dependency');
      if (depth >= 32 || active.has(target.id)) reject('cyclic or excessive terminal dependency depth');
      if (depth && target.recursion) reject('nested recursive policies are not supported');
      if (cache.has(target.id)) return cache.get(target.id);
      active.add(target.id);
      let previousEnd = 0;
      for (const row of [...target.rows].sort((first, second) => first.start - second.start)) {
        if (!Number.isSafeInteger(row.start) || !Number.isSafeInteger(row.end) || row.start !== previousEnd + 1 ||
            row.end < row.start || typeof row.value !== 'string') reject('terminal ranges must be contiguous and nonoverlapping');
        previousEnd = row.end;
      }
      const rows = target.id === table.id ? target.rows.filter(row => row !== recursive) : target.rows;
      const total = rows.reduce((sum, row) => sum + row.end - row.start + 1, 0);
      if (!rows.length || !Number.isSafeInteger(total) || total <= 0) reject('no weighted terminating rows');
      const choices = [];
      let bytes = 0;
      for (const row of rows) {
        const weight = row.end - row.start + 1;
        if (!Number.isSafeInteger(weight) || weight <= 0) reject('invalid terminal weight');
        const tokens = rowParts(row);
        if (!Array.isArray(tokens) || tokens.filter(part => typeof part !== 'string').length > 1 ||
            tokens.some(part => typeof part === 'string' ? /[{}<>\u0000-\u001f\u007f]/.test(part) :
              !part || Object.keys(part).length !== 1 || !/^wiki_abulafia_\d+_[a-f0-9]*$/.test(part.ref))) {
          reject('terminal rows must be plain text with at most one simple reference');
        }
        const reference = tokens.find(part => typeof part !== 'string');
        const child = reference ? expand(resolve(reference.ref), depth + 1) : [{ text: '', numerator: 1n, denominator: 1n, steps: [] }];
        for (const choice of child) {
          const text = tokens.map(part => typeof part === 'string' ? part : choice.text).join('');
          if (!normalize(text) || !text.isWellFormed() || text.length > 32768 || pair && /\band\b|[,;]/iu.test(text)) {
            reject('terminal outcome is empty, unsafe, or not a single item');
          }
          const steps = [{ id: target.id, row: row.row, value: row.value, depth: 0 }, ...choice.steps.map(step => ({ ...step, depth: step.depth + 1 }))];
          bytes += text.length * 2 + JSON.stringify(steps).length * 2;
          if (choices.length >= 4096 || bytes > 1048576 || steps.length > 512) reject('terminal choice budget exceeded');
          choices.push({ text, ...fraction(BigInt(weight) * choice.numerator, BigInt(total) * choice.denominator), steps });
        }
      }
      active.delete(target.id);
      cache.set(target.id, choices);
      return choices;
    }
    const outcomes = expand(table);
    if (pair && new Set(outcomes.map(choice => normalize(choice.text))).size < 2) reject('two distinct terminal values are required');
    let denominator = 1n;
    for (const choice of outcomes) {
      denominator = denominator / gcd(denominator, choice.denominator) * choice.denominator;
      if (denominator > maximumWeight) reject('terminal probability denominator exceeds safe integer limits');
    }
    const choices = outcomes.map(choice => Object.freeze({ text: choice.text, key: normalize(choice.text),
      weight: Number(choice.numerator * (denominator / choice.denominator)),
      steps: Object.freeze(choice.steps.map(step => Object.freeze(step))) }));
    const total = choices.reduce((sum, choice) => sum + choice.weight, 0);
    if (!Number.isSafeInteger(total) || total <= 0) reject('terminal probability total exceeds safe integer limits');
    const arity = pair ? 2 : 1;
    const literal = pair ? parts[1] : parts[0];
    const cost = Object.freeze({ calls: 1 + arity * Math.max(...choices.map(choice => choice.steps.length)),
      depth: 2 + Math.max(...choices.flatMap(choice => choice.steps.map(step => step.depth))),
      length: literal.length + arity * Math.max(...choices.map(choice => choice.text.length)) });
    if (cost.calls > 512 || cost.depth > 32 || cost.length > 32768) reject('recursive expansion exceeds existing runtime limits');
    return Object.freeze({ kind: policy.kind, row: policy.row, maxDepth: 1, arity, literal, cost,
      choices: Object.freeze(choices) });
  }

  return Object.freeze({ prepare, normalize });
});