(function (root) {
  'use strict';

  const collections = [
    { id: 'places', label: 'Places & culture', color: '#16836c', icon: 'landmark' },
    { id: 'names', label: 'Names & languages', color: '#5384bb', icon: 'languages' },
    { id: 'characters', label: 'People & characters', color: '#c37051', icon: 'users' },
    { id: 'treasure', label: 'Objects & treasure', color: '#ae872c', icon: 'gem' },
    { id: 'myth', label: 'Myth & magic', color: '#9870a6', icon: 'sparkles' },
    { id: 'wasteland', label: 'Science & wastelands', color: '#578357', icon: 'orbit' },
    { id: 'utilities', label: 'Dice & utilities', color: '#70828a', icon: 'dices' },
    { id: 'other', label: 'Workbench', color: '#a87879', icon: 'wrench' }
  ];

  function collectionFor(source) {
    const file = (source || '').split('/').pop().toLowerCase();
    if (/^(city|games)\./.test(file)) return 'places';
    if (/^(names|dwarves|goblinoid)/.test(file)) return 'names';
    if (/^(warrior_data|test_tables|occupations)\./.test(file)) return 'characters';
    if (/^(books|treasure|magical_item)\./.test(file)) return 'treasure';
    if (/^(gods|temples|statue|biblical_curses)\./.test(file)) return 'myth';
    if (/^(gamma_world|robots)\./.test(file)) return 'wasteland';
    if (/^(utility|dice)\./.test(file)) return 'utilities';
    return 'other';
  }

  function labelFor(id) {
    return id.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
  }

  function references(text) {
    return Array.from(String(text).matchAll(/\{(\w+)\}/g), match => match[1]);
  }

  function entriesFor(data) {
    if (Array.isArray(data)) {
      return Array.from(data, (value, index) => ({
        key: String(index + 1), text: String(value ?? ''), weight: 1,
        probability: 1 / data.length, references: references(value ?? '')
      }));
    }
    if (!data || typeof data !== 'object') return [];
    const rows = Object.entries(data);
    const ranges = rows.map(([key]) => root.key_range(key));
    const sides = Math.max(0, ...ranges.map(range => Number.isFinite(range[1]) ? range[1] : 0));
    const covered = [];
    return rows.map(([key, value], index) => {
      const [start, end] = ranges[index];
      let remaining = Number.isFinite(start) && Number.isFinite(end) && end >= Math.max(1, start)
        ? [[Math.max(1, start), end]] : [];
      for (const [coveredStart, coveredEnd] of covered) {
        remaining = remaining.flatMap(([segmentStart, segmentEnd]) => {
          if (coveredEnd < segmentStart || coveredStart > segmentEnd) return [[segmentStart, segmentEnd]];
          const segments = [];
          if (coveredStart > segmentStart) segments.push([segmentStart, coveredStart - 1]);
          if (coveredEnd < segmentEnd) segments.push([coveredEnd + 1, segmentEnd]);
          return segments;
        });
      }
      covered.push(...remaining);
      const weight = remaining.reduce((total, [segmentStart, segmentEnd]) => total + segmentEnd - segmentStart + 1, 0);
      return {
        key, text: String(value ?? ''), weight, probability: sides ? weight / sides : 0,
        references: references(value ?? '')
      };
    });
  }

  function buildModel(registry, sources = {}) {
    const tables = Object.entries(registry).map(([id, data]) => {
      const source = sources[id] || '';
      const entries = entriesFor(data);
      return {
        id, label: labelFor(id), source, file: source.split('/').pop() || 'Unknown source',
        collection: collectionFor(source), kind: Array.isArray(data) ? 'List' : 'Weighted',
        entries, outgoing: [], incoming: [], missing: false,
        searchText: `${id} ${labelFor(id)} ${source}`.toLowerCase()
      };
    });
    const nodes = tables.slice();
    const byId = new Map(nodes.map(node => [node.id, node]));
    const edgeIndex = new Map();
    for (const table of tables) {
      for (const entry of table.entries) {
        for (const target of entry.references) {
          if (!byId.has(target)) {
            const missing = {
              id: target, label: labelFor(target), source: '', file: 'Unresolved',
              collection: 'missing', kind: 'Missing', entries: [], outgoing: [], incoming: [],
              missing: true, searchText: `${target} ${labelFor(target)}`.toLowerCase()
            };
            byId.set(target, missing);
            nodes.push(missing);
          }
          const key = `${table.id}\0${target}`;
          if (edgeIndex.has(key)) {
            edgeIndex.get(key).count += 1;
          } else {
            edgeIndex.set(key, { source: table.id, target, count: 1 });
            table.outgoing.push(target);
            byId.get(target).incoming.push(table.id);
          }
        }
      }
    }
    return {
      tables, nodes, byId, edges: Array.from(edgeIndex.values()),
      collections: collections.map(collection => ({
        ...collection, count: tables.filter(table => table.collection === collection.id).length
      })).filter(collection => collection.count > 0),
      entryCount: tables.reduce((total, table) => total + table.entries.length, 0)
    };
  }

  function neighborhood(model, id, depth = 1) {
    if (!model.byId.has(id)) return { nodes: [], edges: [] };
    const distances = new Map([[id, 0]]);
    const queue = [id];
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      if (distances.get(current) >= depth) continue;
      const node = model.byId.get(current);
      for (const neighbor of [...node.outgoing, ...node.incoming]) {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, distances.get(current) + 1);
          queue.push(neighbor);
        }
      }
    }
    return {
      nodes: model.nodes.filter(node => distances.has(node.id)),
      edges: model.edges.filter(edge => distances.has(edge.source) && distances.has(edge.target))
    };
  }

  function roll(id, runtime) {
    const originalGenerate = runtime.generate_text;
    const originalSelect = runtime.select_from;
    const steps = [];
    const stack = [];
    const warnings = [];
    const warningKeys = new Set();
    let calls = 0;
    let text = '';
    function warn(type, table, message) {
      const key = `${type}:${table}`;
      if (!warningKeys.has(key)) {
        warningKeys.add(key);
        warnings.push({ type, id: table, message });
      }
    }
    runtime.generate_text = function (table) {
      calls += 1;
      if (!Object.hasOwn(runtime.gen_data, table)) {
        warn('missing', table, `No loaded table named ${table}.`);
        return `[Missing: ${table}]`;
      }
      if (stack.length >= 48 || calls > 800) {
        warn('limit', table, `Expansion limit reached at ${table}.`);
        return `[Expansion limit: ${table}]`;
      }
      const step = { id: table, depth: stack.length, value: '' };
      steps.push(step);
      stack.push(step);
      try {
        return originalGenerate.call(runtime, table);
      } finally {
        stack.pop();
      }
    };
    runtime.select_from = function (data) {
      const value = originalSelect.call(runtime, data);
      if (stack.length) stack[stack.length - 1].value = String(value ?? '');
      return value;
    };
    try {
      text = String(runtime.generate_text(id) ?? '');
    } catch (error) {
      warn('error', id, error.message);
    } finally {
      runtime.generate_text = originalGenerate;
      runtime.select_from = originalSelect;
    }
    return { text, steps, warnings };
  }

  root.TableAtlas = { buildModel, neighborhood, roll, references, labelFor, collections };
})(globalThis);