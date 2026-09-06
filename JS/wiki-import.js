(function (root) {
  'use strict';

  if (Object.hasOwn(root, 'WikiImport')) throw new Error('Wiki import runtime already exists');
  const executables = new Map();
  const api = { metadata: new Map(), labels: Object.create(null), aliases: Object.create(null), summary: null, register, roll, loadCompressed, catalogReady: Promise.resolve() };

  function programRows(table) {
    if (!Array.isArray(table.program) || !Array.isArray(table.entries) || table.program.length !== table.entries.length) {
      throw new Error(`Invalid wiki program: ${table.id}`);
    }
    let nodes = 0;
    function copyParts(parts, inTransform = false) {
      if (!Array.isArray(parts) || parts.length > 4096) throw new Error(`Invalid wiki expression: ${table.id}`);
      return Object.freeze(Array.from(parts, part => {
        nodes += 1;
        if (nodes > 65536) throw new Error(`Wiki program exceeds the node limit: ${table.id}`);
        if (typeof part === 'string' && part.length <= 32768 && !/[{}<>]/.test(part)) return part;
        if (!part || typeof part !== 'object' || Array.isArray(part)) throw new Error(`Invalid wiki expression: ${table.id}`);
        if (Object.keys(part).length === 1 && /^wiki_abulafia_\d+_[a-f0-9]*$/.test(part.ref)) return Object.freeze({ ref: part.ref });
        if (!inTransform && Object.keys(part).length === 2 && ['po', 'ucfirst'].includes(part.op)) {
          return Object.freeze({ op: part.op, parts: copyParts(part.parts, true) });
        }
        throw new Error(`Unsupported wiki expression: ${table.id}`);
      }));
    }
    let total = 0;
    const rows = [];
    for (const [index, entry] of table.entries.entries()) {
      if (!Number.isSafeInteger(entry.weight) || entry.weight < 0) throw new Error(`Invalid wiki program weight: ${table.id}`);
      if (entry.weight === 0) {
        if (table.program[index] !== null) throw new Error(`Executable zero-weight wiki row: ${table.id}`);
        continue;
      }
      if (typeof entry.text !== 'string') throw new Error(`Invalid wiki program entry: ${table.id}`);
      const start = total + 1;
      total += entry.weight;
      rows.push(Object.freeze({ start, end: total, value: entry.text, parts: copyParts(table.program[index]) }));
    }
    if (!Number.isSafeInteger(total) || total <= 0 || total !== table.totalWeight) throw new Error(`Invalid wiki program total: ${table.id}`);
    return { rows: Object.freeze(rows), total };
  }

  function valueRows(values, identifier) {
    const rows = Object.entries(values).map(([key, value], index) => {
      const match = Array.isArray(values) ? null : /^([1-9]\d*)(?:-([1-9]\d*))?$/.exec(key);
      const start = Array.isArray(values) ? index + 1 : Number(match?.[1]);
      const end = Array.isArray(values) ? index + 1 : Number(match?.[2] || match?.[1]);
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start) {
        throw new Error(`Invalid wiki runtime range: ${identifier}`);
      }
      return Object.freeze({ start, end, value });
    });
    return { rows: Object.freeze(rows), total: rows.reduce((maximum, row) => Math.max(maximum, row.end), 0) };
  }

  function register(bundle, { core = false } = {}) {
    const registry = root.gen_data;
    if (!registry || !Object.isExtensible(registry)) throw new Error('Wiki import requires an extensible table registry');
    if (bundle.schemaVersion !== 1 || !Array.isArray(bundle.tables)) throw new Error('Unsupported wiki import payload');
    const staged = new Map();
    const descriptions = new Map();
    const execution = new Map();
    function reserve(identifier, values) {
      if (identifier in Object.prototype || staged.has(identifier) || Object.hasOwn(registry, identifier)) {
        throw new Error(`Wiki name collision: ${identifier}`);
      }
      staged.set(identifier, values);
    }
    for (const table of bundle.tables) {
      if (!/^wiki_abulafia_\d+_[a-f0-9]*$/.test(table.id) || !['ready', 'blocked'].includes(table.status)) {
        throw new Error(`Invalid wiki table: ${table.id}`);
      }
      if (table.execution !== undefined && table.execution !== 'wiki' || table.program !== undefined && table.execution !== 'wiki') {
        throw new Error(`Invalid wiki execution mode: ${table.id}`);
      }
      if (core && table.execution === 'wiki') throw new Error(`Wiki expressions cannot enter the compatibility bundle: ${table.id}`);
      let values = table.values;
      if (table.status === 'blocked') {
        const name = String(table.name).replace(/[&<>{}]/g, character => `&#${character.charCodeAt(0)};`);
        values = [`[Wiki table unavailable: ${name}]`];
      } else if (table.execution === 'wiki') {
        const name = String(table.name).replace(/[&<>{}]/g, character => `&#${character.charCodeAt(0)};`);
        values = [`[Wiki table requires Table Atlas: ${name}]`];
      }
      if (!values || typeof values !== 'object' || !Object.keys(values).length ||
          !Object.values(values).every(value => typeof value === 'string')) {
        throw new Error(`Invalid wiki table values: ${table.id}`);
      }
      reserve(table.id, Object.freeze(Array.isArray(values) ? Array.from(values) : { ...values }));
      const { values: unusedValues, ...description } = table;
      descriptions.set(table.id, { ...description, legacyAvailable: core });
      execution.set(table.id, Object.freeze({ id: table.id, name: String(table.name), status: table.status,
        ...(table.status === 'ready' && table.execution === 'wiki' ? programRows(table) : valueRows(values, table.id)) }));
    }
    for (const [alias, target] of Object.entries(bundle.aliases || {})) {
      if (!/^\w+$/.test(alias) || descriptions.get(target)?.status !== 'ready' || descriptions.get(target)?.execution === 'wiki') {
        throw new Error(`Unvalidated wiki alias: ${alias}`);
      }
      reserve(alias, Object.freeze([`{${target}}`]));
    }
    for (const [identifier, label] of Object.entries(bundle.labels || {})) {
      if (Object.hasOwn(api.labels, identifier) && api.labels[identifier] !== label) {
        throw new Error(`Wiki label collision: ${identifier}`);
      }
    }
    const installed = [];
    try {
      for (const [identifier, values] of staged) {
        registry[identifier] = values;
        installed.push(identifier);
      }
    } catch (error) {
      for (const identifier of installed) delete registry[identifier];
      throw error;
    }
    for (const [identifier, description] of descriptions) api.metadata.set(identifier, description);
    for (const [identifier, executable] of execution) executables.set(identifier, executable);
    Object.assign(api.labels, bundle.labels || {});
    Object.assign(api.aliases, bundle.aliases || {});
    if (bundle.summary) api.summary = bundle.summary;
  }

  function roll(identifier) {
    const steps = [];
    const active = new Set();
    let calls = 0;
    function fail(type, table, message) { throw Object.assign(new Error(message), { type, table }); }
    function append(first, second, table) {
      if (first.length + second.length > 32768) fail('limit', table, `Expansion limit: output exceeds 32768 characters at ${table}.`);
      return first + second;
    }
    function expandValue(value, depth, table) {
      let text = '';
      let cursor = 0;
      for (const match of value.matchAll(/\{(\w+)\}/g)) {
        const literal = value.slice(cursor, match.index);
        if (/[{}]/.test(literal)) fail('syntax', table, `Unsupported runtime syntax at ${table}.`);
        text = append(text, literal, table);
        text = append(text, evaluate(match[1], depth + 1), table);
        cursor = match.index + match[0].length;
      }
      const suffix = value.slice(cursor);
      if (/[{}]/.test(suffix)) fail('syntax', table, `Unsupported runtime syntax at ${table}.`);
      return append(text, suffix, table);
    }
    function expandParts(parts, depth, table) {
      let text = '';
      for (const part of parts) {
        let value;
        if (typeof part === 'string') value = part;
        else if (part.ref) value = evaluate(part.ref, depth + 1);
        else {
          const argument = expandParts(part.parts, depth, table);
          if (argument.trim() !== argument || !argument.isWellFormed() || /[\u0000-\u001f\u007f{}\[\]<>&|]|%[^%]+%|\$(?:[$&`']|<)/.test(argument)) {
            fail('syntax', table, `Unsupported ${part.op} argument at ${table}.`);
          }
          if (part.op === 'po') value = argument + (/[sS]$/.test(argument) ? '\u2019' : '\u2019s');
          else {
            if (argument.charCodeAt(0) > 127) fail('syntax', table, `Non-ASCII ucfirst argument at ${table}.`);
            value = argument.charAt(0).toUpperCase() + argument.slice(1);
          }
        }
        text = append(text, value, table);
      }
      return text;
    }
    function evaluate(table, depth = 0) {
      calls += 1;
      if (depth >= 32 || calls > 512) fail('limit', table, `Expansion limit reached at ${table}.`);
      const target = executables.get(table);
      if (!target) fail('missing', table, `No registered wiki table named ${table}.`);
      if (target.status !== 'ready') fail('blocked', table, `${target.name} is quarantined.`);
      if (active.has(table)) fail('cycle', table, `Cyclic wiki expansion at ${table}.`);
      const sample = Math.random();
      if (!Number.isFinite(sample) || sample < 0 || sample >= 1) fail('error', table, 'Random sample must be in [0, 1).');
      const side = Math.floor(sample * target.total) + 1;
      const row = target.rows.find(candidate => side >= candidate.start && side <= candidate.end);
      if (!row) fail('error', table, `No selectable wiki row at ${table}.`);
      steps.push({ id: table, depth, value: row.value });
      active.add(table);
      try {
        return row.parts ? expandParts(row.parts, depth, table) : expandValue(row.value, depth, table);
      } finally {
        active.delete(table);
      }
    }
    try {
      return { text: evaluate(identifier), steps, warnings: [] };
    } catch (error) {
      return { text: '', steps, warnings: [{ type: error.type || 'error', id: error.table || identifier, message: error.message }] };
    }
  }

  async function loadCompressed(encoded) {
    if (typeof DecompressionStream !== 'function') throw new Error('The wiki catalog requires a browser with gzip DecompressionStream support');
    const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    register(await new Response(stream).json());
  }

  Object.defineProperty(root, 'WikiImport', { value: api });
})(globalThis);