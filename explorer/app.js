(function () {
  'use strict';

  const element = id => document.getElementById(id);
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const icon = name => {
    const node = make('i');
    node.dataset.lucide = name;
    node.setAttribute('aria-hidden', 'true');
    return node;
  };

  function start() {
    if (!globalThis.d3 || !globalThis.lucide) throw new Error('The local graph or icon library is missing.');
    const model = TableAtlas.buildModel(gen_data, AtlasRegistry.sources);
    if (!model.tables.length) throw new Error('No table data was loaded.');
    const collectionIndex = new Map(TableAtlas.collections.map(collection => [collection.id, collection]));
    collectionIndex.set('missing', { label: 'Unresolved reference', color: '#b86754' });
    const missing = model.nodes.filter(table => table.missing);
    const sourceFiles = Array.from(new Set(Object.values(AtlasRegistry.sources))).sort();
    const storageKey = 'randomtables.table-atlas.v1';
    let preferences = {};
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (stored && typeof stored === 'object') preferences = stored;
    } catch {}
    const readLocation = () => {
      const hash = new URLSearchParams(location.hash.slice(1));
      const requested = hash.get('table') || new URL(location.href).searchParams.get('table');
      return {
        selected: model.byId.has(requested) ? requested : model.byId.has('welcome_to_town') ? 'welcome_to_town' : model.tables[0].id,
        scope: hash.get('view') === 'all' ? 'all' : 'focus',
        depth: [1, 2, 3].includes(Number(hash.get('depth'))) ? Number(hash.get('depth')) : [1, 2, 3].includes(preferences.depth) ? preferences.depth : 2
      };
    };
    const state = {
      ...readLocation(), query: '', collection: 'all', source: 'all', relation: 'all', sort: 'name',
      showMissing: preferences.showMissing !== false, bookmarksOnly: false, catalogLimit: 80,
      bookmarks: new Set(Array.isArray(preferences.bookmarks) ? preferences.bookmarks.filter(id => model.byId.has(id)) : []),
      entryQuery: '', entryLimit: 40, tab: 'entries', results: [], traceLimit: 80
    };
    const graph = new AtlasGraph(element('relationship-graph'), id => selectTable(id, false));
    const mobile = matchMedia('(max-width: 760px)');
    let filtered = [];
    let toastTimer;
    let previousFocus;

    function notify(message) {
      clearTimeout(toastTimer);
      element('toast').textContent = message;
      element('toast').hidden = false;
      toastTimer = setTimeout(() => { element('toast').hidden = true; }, 3500);
    }

    function persist() {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ bookmarks: [...state.bookmarks], depth: state.depth, showMissing: state.showMissing }));
      } catch {
        notify('Changes kept for this session. Browser storage is unavailable.');
      }
    }

    function updateLocation(replace = false) {
      const hash = `#${new URLSearchParams({ table: state.selected, view: state.scope, depth: String(state.depth) })}`;
      if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null, '', hash);
    }

    function tableLink(table, className) {
      const link = make('a', className);
      link.href = `#${new URLSearchParams({ table: table.id, view: 'focus', depth: String(state.depth) })}`;
      link.dataset.tableLink = table.id;
      return link;
    }

    function colorDot(table) {
      const dot = make('span', 'catalog-dot');
      dot.style.backgroundColor = collectionIndex.get(table.collection).color;
      dot.setAttribute('aria-hidden', 'true');
      return dot;
    }

    function filterTables() {
      const candidates = state.relation === 'unresolved' ? model.nodes : model.tables;
      const matchesSource = table => (state.collection === 'all' || table.collection === state.collection) && (state.source === 'all' || table.source === state.source);
      return candidates.filter(table => {
        if (!table.searchText.includes(state.query.toLowerCase().trim())) return false;
        if (state.bookmarksOnly && !state.bookmarks.has(table.id)) return false;
        if (table.missing ? !table.incoming.some(id => matchesSource(model.byId.get(id))) : !matchesSource(table)) return false;
        const degree = table.incoming.length + table.outgoing.length;
        if (state.relation === 'connected' && !degree) return false;
        if (state.relation === 'isolated' && degree) return false;
        if (state.relation === 'unresolved' && !table.missing && !table.outgoing.some(id => model.byId.get(id).missing)) return false;
        return true;
      }).sort((first, second) => {
        if (state.sort === 'links') {
          const difference = second.incoming.length + second.outgoing.length - first.incoming.length - first.outgoing.length;
          if (difference) return difference;
        }
        if (state.sort === 'entries' && second.entries.length !== first.entries.length) return second.entries.length - first.entries.length;
        return first.label.localeCompare(second.label, undefined, { numeric: true });
      });
    }

    function catalogItem(table) {
      const link = tableLink(table, `catalog-item${table.missing ? ' is-missing' : ''}`);
      link.setAttribute('aria-current', String(table.id === state.selected));
      link.title = `${table.id}\n${table.file}\n${table.entries.length.toLocaleString()} entries`;
      const copy = make('span');
      copy.append(make('span', 'catalog-item-title', table.label), make('span', 'catalog-item-id', table.id));
      const count = make('span', 'catalog-item-count');
      count.title = `${table.incoming.length + table.outgoing.length} relationships`;
      count.append(icon(table.missing ? 'circle-alert' : 'git-fork'), document.createTextNode(String(table.incoming.length + table.outgoing.length)));
      link.append(colorDot(table), copy, count);
      return link;
    }

    function renderCatalog() {
      filtered = filterTables();
      const content = document.createDocumentFragment();
      const visible = filtered.slice(0, state.catalogLimit);
      const selected = model.byId.get(state.selected);
      if (!state.query && filtered.includes(selected) && !visible.includes(selected)) {
        content.append(make('div', 'catalog-label', 'SELECTED'), catalogItem(selected), make('div', 'catalog-label', 'ALL TABLES'));
      }
      for (const table of visible) content.append(catalogItem(table));
      if (filtered.length > state.catalogLimit) {
        const more = make('button', 'text-button catalog-more', `Show ${Math.min(80, filtered.length - state.catalogLimit)} more`);
        more.addEventListener('click', () => { state.catalogLimit += 80; renderCatalog(); });
        content.append(more);
      }
      if (!filtered.length) {
        const empty = make('div', 'catalog-empty', state.bookmarksOnly ? 'No bookmarks match these filters.' : 'No tables match these filters.');
        const reset = make('button', 'text-button', 'Reset filters');
        reset.addEventListener('click', resetFilters);
        empty.append(reset);
        content.append(empty);
      }
      element('catalog-list').replaceChildren(content);
      const noun = state.relation === 'unresolved' ? 'result' : 'table';
      element('catalog-count').textContent = `${filtered.length.toLocaleString()} ${noun}${filtered.length === 1 ? '' : 's'}`;
      element('bookmarks-only').setAttribute('aria-pressed', String(state.bookmarksOnly));
      element('bookmarks-only').title = state.bookmarksOnly ? 'Show all tables' : 'Show bookmarked tables';
      element('bookmarks-only').setAttribute('aria-label', element('bookmarks-only').title);
      const activeFilters = Number(state.source !== 'all') + Number(state.relation !== 'all');
      element('active-filter-count').textContent = activeFilters ? `(${activeFilters})` : '';
      lucide.createIcons();
    }

    function renderMap() {
      let data;
      if (state.scope === 'focus') {
        data = TableAtlas.neighborhood(model, state.selected, state.depth);
      } else {
        const ids = new Set(filtered.map(table => table.id));
        if (state.showMissing) {
          for (const table of filtered) {
            for (const target of table.outgoing) if (model.byId.get(target).missing) ids.add(target);
          }
        }
        data = { nodes: model.nodes.filter(table => ids.has(table.id)), edges: model.edges.filter(edge => ids.has(edge.source) && ids.has(edge.target)) };
      }
      if (!state.showMissing) {
        data = { nodes: data.nodes.filter(table => !table.missing), edges: data.edges.filter(edge => !model.byId.get(edge.source).missing && !model.byId.get(edge.target).missing) };
      }
      graph.render(model, data, state.selected, state.scope);
      if (state.results.length) graph.highlightTrace(state.results.flatMap(result => result.steps));
      element('focus-view').setAttribute('aria-pressed', String(state.scope === 'focus'));
      element('all-view').setAttribute('aria-pressed', String(state.scope === 'all'));
      element('graph-depth').disabled = state.scope === 'all';
      element('graph-depth').value = String(state.depth);
      element('show-missing').checked = state.showMissing;
      element('map-eyebrow').textContent = state.scope === 'all' ? state.relation === 'unresolved' ? 'UNRESOLVED REFERENCES' : 'COLLECTION MAP' : 'NEIGHBORHOOD';
      element('map-title').textContent = state.scope === 'focus' ? model.byId.get(state.selected).label : state.collection === 'all' ? 'All tables' : collectionIndex.get(state.collection).label;
      element('graph-count').textContent = `${data.nodes.length.toLocaleString()} nodes / ${data.edges.length.toLocaleString()} links`;
      element('graph-empty').hidden = data.nodes.length > 0;
      element('export-graph').disabled = data.nodes.length === 0;
      const visibleCollections = new Set(data.nodes.map(table => table.collection));
      const legend = document.createDocumentFragment();
      for (const [id, collection] of collectionIndex) {
        if (!visibleCollections.has(id)) continue;
        const item = make('span', `legend-item${id === 'missing' ? ' is-missing' : ''}`);
        const dot = make('span', 'catalog-dot');
        dot.style.backgroundColor = collection.color;
        item.append(dot, document.createTextNode(id === 'missing' ? 'Missing' : collection.label));
        legend.append(item);
      }
      element('graph-legend').replaceChildren(legend);
    }

    function appendTokens(container, text) {
      let cursor = 0;
      for (const match of text.matchAll(/\{(\w+)\}/g)) {
        container.append(document.createTextNode(text.slice(cursor, match.index)));
        const table = model.byId.get(match[1]);
        if (table) {
          const link = tableLink(table, `table-ref${table.missing ? ' is-missing' : ''}`);
          link.textContent = match[0];
          link.title = table.missing ? `${table.label}: unresolved reference` : `${table.label}: ${table.entries.length} entries`;
          container.append(link);
        } else container.append(document.createTextNode(match[0]));
        cursor = match.index + match[0].length;
      }
      container.append(document.createTextNode(text.slice(cursor)));
    }

    function renderEntries() {
      const table = model.byId.get(state.selected);
      const matches = table.entries.filter(entry => `${entry.key} ${entry.text}`.toLowerCase().includes(state.entryQuery.toLowerCase().trim()));
      const content = document.createDocumentFragment();
      for (const entry of matches.slice(0, state.entryLimit)) {
        const row = make('article', 'entry-row');
        const meta = make('div', 'entry-meta');
        const percentage = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 2 }).format(entry.probability);
        const probability = make('span', 'entry-probability', percentage);
        probability.title = 'Probability per roll';
        meta.append(make('span', 'entry-key', table.kind === 'List' ? entry.key.padStart(2, '0') : entry.key), probability);
        const text = make('p', 'entry-text');
        if (entry.text) appendTokens(text, entry.text);
        else text.append(make('em', '', '(empty result)'));
        const track = make('div', 'probability-track');
        track.setAttribute('aria-hidden', 'true');
        const fill = make('span');
        fill.style.width = `${entry.probability * 100}%`;
        track.append(fill);
        row.append(meta, text, track);
        content.append(row);
      }
      if (!matches.length) content.append(make('p', 'empty-content', table.missing ? 'This reference has no definition in the loaded source files.' : table.entries.length ? 'No matching entries.' : 'This table has no entries.'));
      element('entry-list').replaceChildren(content);
      element('entry-search').closest('.search-field').hidden = !table.entries.length;
      element('more-entries').hidden = matches.length <= state.entryLimit;
      element('more-entries').textContent = `Show ${Math.min(40, Math.max(0, matches.length - state.entryLimit))} more entries`;
      let countText = matches.length ? `${Math.min(matches.length, state.entryLimit).toLocaleString()} of ${matches.length.toLocaleString()} entries` : '';
      const unassigned = 1 - table.entries.reduce((total, entry) => total + entry.probability, 0);
      if (!table.missing && table.kind === 'Weighted' && unassigned > 0.00001) countText += `${countText ? ' / ' : ''}${new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 2 }).format(unassigned)} unassigned`;
      element('entry-count').textContent = countText;
    }

    function renderConnections() {
      const table = model.byId.get(state.selected);
      const content = document.createDocumentFragment();
      for (const [heading, ids, emptyText] of [['Uses', table.outgoing, 'No outgoing references.'], ['Used by', table.incoming, 'No incoming references.']]) {
        const section = make('section', 'connection-section');
        section.append(make('h3', '', `${heading} (${ids.length.toLocaleString()})`));
        for (const id of ids.slice().sort()) {
          const target = model.byId.get(id);
          const link = tableLink(target, `connection-link${target.missing ? ' is-missing' : ''}`);
          const text = make('span', '', target.label);
          text.append(make('small', '', target.missing ? 'Missing definition' : target.file));
          link.append(colorDot(target), text, icon('arrow-up-right'));
          section.append(link);
        }
        if (!ids.length) section.append(make('p', 'empty-content', emptyText));
        content.append(section);
      }
      element('connection-list').replaceChildren(content);
    }

    function renderInspector() {
      const table = model.byId.get(state.selected);
      const collection = collectionIndex.get(table.collection);
      element('table-title').textContent = table.label;
      element('table-token').textContent = `{${table.id}}`;
      element('table-collection').textContent = collection.label;
      element('table-collection').style.setProperty('--collection-color', collection.color);
      element('table-kind').textContent = table.kind;
      element('table-source').hidden = !table.source;
      element('table-source').href = `../${table.source.split('/').map(encodeURIComponent).join('/')}`;
      element('table-source').querySelector('span').textContent = table.file;
      element('stat-entries').textContent = table.entries.length.toLocaleString();
      element('stat-outgoing').textContent = table.outgoing.length.toLocaleString();
      element('stat-incoming').textContent = table.incoming.length.toLocaleString();
      const definitions = AtlasRegistry.definitions[table.id] || [];
      element('definition-note').hidden = definitions.length < 2;
      element('definition-note').textContent = `${definitions.length} definitions. Active source: ${table.file}.`;
      element('definition-note').title = definitions.join('\n');
      const bookmarked = state.bookmarks.has(table.id);
      element('bookmark-table').setAttribute('aria-pressed', String(bookmarked));
      element('bookmark-table').title = bookmarked ? 'Remove bookmark' : 'Bookmark table';
      element('bookmark-table').setAttribute('aria-label', element('bookmark-table').title);
      element('roll-button').disabled = table.missing || !table.entries.length;
      element('roll-count').disabled = element('roll-button').disabled;
      element('roll-output').hidden = !state.results.length;
      document.querySelector('.header-nav a').href = table.missing ? '../index.html' : `../index.html?table=${encodeURIComponent(table.id)}`;
      document.title = `${table.label} | Table Atlas`;
      renderEntries();
      renderConnections();
      lucide.createIcons();
    }

    function selectTable(id, focus = true, writeHistory = true) {
      if (!model.byId.has(id)) return;
      const changed = state.selected !== id;
      state.selected = id;
      if (focus) state.scope = 'focus';
      if (changed) {
        state.entryQuery = '';
        state.entryLimit = 40;
        state.results = [];
        element('entry-search').value = '';
        element('roll-trace').open = false;
        document.querySelector('.inspector-content').scrollTo(0, 0);
      }
      renderCatalog();
      renderInspector();
      if (state.scope === 'all' && !focus) graph.select(id);
      else renderMap();
      if (writeHistory) updateLocation();
      closeCatalog();
    }

    function showTab(tab, focus = false) {
      state.tab = tab;
      for (const name of ['entries', 'connections']) {
        const active = name === tab;
        element(`${name}-tab`).setAttribute('aria-selected', String(active));
        element(`${name}-tab`).tabIndex = active ? 0 : -1;
        element(`${name}-panel`).hidden = !active;
      }
      if (focus) element(`${tab}-tab`).focus();
    }

    function plainResult(text) {
      const template = document.createElement('template');
      template.innerHTML = text;
      const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      const parts = [];
      let current;
      while ((current = walker.nextNode())) {
        if (current.parentElement?.closest('script, style')) continue;
        if (current.nodeType === Node.TEXT_NODE) parts.push(current.textContent);
        else if (['BR', 'P', 'DIV', 'LI', 'TR'].includes(current.tagName)) parts.push('\n');
      }
      return parts.join('').trim();
    }

    function renderTrace() {
      const steps = state.results.flatMap(result => result.steps);
      const content = document.createDocumentFragment();
      for (const step of steps.slice(0, state.traceLimit)) {
        const link = tableLink(model.byId.get(step.id), 'trace-step');
        link.textContent = TableAtlas.labelFor(step.id);
        link.style.marginLeft = `${Math.min(step.depth, 4) * 9}px`;
        link.append(make('small', '', step.value.length > 100 ? `${step.value.slice(0, 100)}...` : step.value || '(empty result)'));
        content.append(link);
      }
      if (steps.length > state.traceLimit) {
        const more = make('button', 'text-button catalog-more', 'Show more steps');
        more.addEventListener('click', () => { state.traceLimit += 80; renderTrace(); });
        content.append(more);
      }
      element('trace-list').replaceChildren(content);
      element('trace-count').textContent = `Roll trace / ${steps.length.toLocaleString()} steps`;
    }

    function rollSelected() {
      const requested = Number(element('roll-count').value);
      const count = Number.isFinite(requested) ? Math.max(1, Math.min(10, Math.floor(requested))) : 1;
      element('roll-count').value = String(count);
      state.results = Array.from({ length: count }, () => TableAtlas.roll(state.selected, globalThis));
      state.traceLimit = 80;
      const content = document.createDocumentFragment();
      for (const result of state.results) {
        content.append(make('p', 'roll-result', plainResult(result.text) || '(Empty result)'));
        for (const warning of result.warnings) content.append(make('p', 'roll-warning', warning.message));
      }
      element('roll-results').replaceChildren(content);
      element('roll-output').hidden = false;
      renderTrace();
      graph.highlightTrace(state.results.flatMap(result => result.steps));
    }

    async function copyText(text, message) {
      try {
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(text);
        notify(message);
      } catch {
        const field = make('textarea');
        field.value = text;
        field.setAttribute('aria-label', 'Copy buffer');
        field.style.cssText = 'position:fixed;left:-10000px;top:0;';
        const focused = document.activeElement;
        document.body.append(field);
        field.select();
        let copied = false;
        try { copied = document.execCommand('copy'); } catch {}
        field.remove();
        focused?.focus({ preventScroll: true });
        notify(copied ? message : 'Clipboard access was denied by the browser.');
      }
    }

    function download(filename, content, type) {
      const url = URL.createObjectURL(new Blob([content], { type }));
      const link = make('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function changeFilters() {
      state.catalogLimit = 80;
      element('catalog-list').scrollTop = 0;
      renderCatalog();
      if (state.scope === 'all') renderMap();
    }

    function resetFilters() {
      Object.assign(state, { query: '', collection: 'all', source: 'all', relation: 'all', bookmarksOnly: false });
      element('table-search').value = '';
      element('collection-filter').value = 'all';
      element('source-filter').value = 'all';
      element('relation-filter').value = 'all';
      element('collection-swatch').style.backgroundColor = '#879990';
      changeFilters();
    }

    function setBackgroundInert(inert) {
      for (const region of document.querySelectorAll('.app-header, .page-heading, .map-panel, .inspector')) region.inert = inert;
    }

    function openCatalog() {
      if (!mobile.matches) { element('table-search').focus(); return; }
      previousFocus = document.activeElement;
      element('catalog').classList.add('is-open');
      element('catalog').setAttribute('role', 'dialog');
      element('catalog').setAttribute('aria-modal', 'true');
      element('catalog-scrim').hidden = false;
      element('open-catalog').setAttribute('aria-expanded', 'true');
      document.body.classList.add('catalog-open');
      setBackgroundInert(true);
      element('table-search').focus({ preventScroll: true });
    }

    function closeCatalog(restoreFocus = true) {
      if (!element('catalog').classList.contains('is-open')) return;
      element('catalog').classList.remove('is-open');
      element('catalog').removeAttribute('role');
      element('catalog').removeAttribute('aria-modal');
      element('catalog-scrim').hidden = true;
      element('open-catalog').setAttribute('aria-expanded', 'false');
      document.body.classList.remove('catalog-open');
      setBackgroundInert(false);
      if (restoreFocus) previousFocus?.focus({ preventScroll: true });
    }

    for (const collection of model.collections) {
      const option = make('option', '', `${collection.label} (${collection.count})`);
      option.value = collection.id;
      element('collection-filter').append(option);
    }
    for (const source of sourceFiles) {
      const option = make('option', '', source.split('/').pop());
      option.value = source;
      element('source-filter').append(option);
    }
    for (const [value, label] of [[model.tables.length, 'tables'], [model.entryCount, 'entries'], [model.collections.length, 'collections']]) {
      if (element('overview-stats').dataset.ready) element('overview-stats').append(make('span', 'stat-separator', '/'));
      else { element('overview-stats').replaceChildren(); element('overview-stats').dataset.ready = 'true'; }
      element('overview-stats').append(make('strong', '', value.toLocaleString()), document.createTextNode(` ${label}`));
    }
    element('missing-filter').hidden = !missing.length;
    element('missing-count').textContent = `${missing.length} unresolved`;
    element('source-count').textContent = `${document.querySelectorAll('script[src^="../tables/"]').length} source files loaded`;
    if (AtlasRegistry.errors.length) {
      element('load-error').textContent = AtlasRegistry.errors.join(' ');
      element('load-error').hidden = false;
    }

    document.addEventListener('click', event => {
      const link = event.target.closest('[data-table-link]');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      selectTable(link.dataset.tableLink);
    });
    element('table-search').addEventListener('input', event => { state.query = event.target.value; changeFilters(); });
    element('collection-filter').addEventListener('change', event => {
      state.collection = event.target.value;
      element('collection-swatch').style.backgroundColor = collectionIndex.get(state.collection)?.color || '#879990';
      changeFilters();
    });
    element('source-filter').addEventListener('change', event => { state.source = event.target.value; changeFilters(); });
    element('relation-filter').addEventListener('change', event => { state.relation = event.target.value; changeFilters(); });
    element('catalog-sort').addEventListener('change', event => { state.sort = event.target.value; changeFilters(); });
    element('clear-filters').addEventListener('click', resetFilters);
    element('bookmarks-only').addEventListener('click', () => { state.bookmarksOnly = !state.bookmarksOnly; changeFilters(); });
    element('bookmark-table').addEventListener('click', () => {
      if (state.bookmarks.has(state.selected)) state.bookmarks.delete(state.selected);
      else state.bookmarks.add(state.selected);
      persist();
      renderCatalog();
      renderInspector();
      if (state.scope === 'all' && state.bookmarksOnly) renderMap();
    });
    element('entry-search').addEventListener('input', event => { state.entryQuery = event.target.value; state.entryLimit = 40; renderEntries(); });
    element('more-entries').addEventListener('click', () => { state.entryLimit += 40; renderEntries(); });
    element('entries-tab').addEventListener('click', () => showTab('entries'));
    element('connections-tab').addEventListener('click', () => showTab('connections'));
    document.querySelector('.inspector-tabs').addEventListener('keydown', event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        showTab(event.key === 'Home' ? 'entries' : event.key === 'End' ? 'connections' : state.tab === 'entries' ? 'connections' : 'entries', true);
      }
    });
    for (const scope of ['focus', 'all']) element(`${scope}-view`).addEventListener('click', () => { state.scope = scope; renderMap(); updateLocation(); });
    element('graph-depth').addEventListener('change', event => { state.depth = Number(event.target.value); renderMap(); persist(); updateLocation(); });
    element('show-missing').addEventListener('change', event => { state.showMissing = event.target.checked; renderMap(); persist(); });
    element('zoom-in').addEventListener('click', () => graph.zoomBy(1.35));
    element('zoom-out').addEventListener('click', () => graph.zoomBy(1 / 1.35));
    element('fit-graph').addEventListener('click', () => graph.fit());
    element('random-table').addEventListener('click', () => {
      const candidates = filtered.filter(table => !table.missing && table.entries.length);
      if (!candidates.length) { notify('No rollable tables match these filters.'); return; }
      selectTable(candidates[Math.floor(Math.random() * candidates.length)].id);
      rollSelected();
    });
    element('roll-button').addEventListener('click', rollSelected);
    element('copy-token').addEventListener('click', () => copyText(`{${state.selected}}`, 'Table token copied.'));
    element('copy-result').addEventListener('click', () => copyText(state.results.map(result => plainResult(result.text)).join('\n\n'), 'Results copied.'));
    element('export-index').addEventListener('click', () => {
      const tables = model.tables.map(table => ({ id: table.id, source: table.source, collection: table.collection, kind: table.kind, entries: table.entries }));
      download('random-tables-index.json', JSON.stringify({ tables, relationships: model.edges, unresolved: missing.map(table => table.id), definitions: AtlasRegistry.definitions }, null, 2), 'application/json');
      notify('Table index exported.');
    });
    element('export-graph').addEventListener('click', () => {
      download(`table-atlas-${state.scope === 'all' ? 'all' : state.selected.replace(/[^a-z0-9_-]/gi, '-')}.svg`, graph.serialize(), 'image/svg+xml');
      notify('Relationship map exported.');
    });
    element('missing-filter').addEventListener('click', () => {
      resetFilters();
      state.relation = 'unresolved';
      state.scope = 'all';
      state.showMissing = true;
      state.selected = missing.slice().sort((first, second) => second.incoming.length - first.incoming.length)[0].id;
      state.results = [];
      state.entryQuery = '';
      element('entry-search').value = '';
      element('relation-filter').value = 'unresolved';
      document.querySelector('.filters').open = true;
      renderCatalog();
      renderInspector();
      renderMap();
      showTab('connections');
      updateLocation();
    });
    element('open-catalog').addEventListener('click', openCatalog);
    element('close-catalog').addEventListener('click', () => closeCatalog());
    element('catalog-scrim').addEventListener('click', () => closeCatalog());
    mobile.addEventListener('change', () => { if (!mobile.matches) closeCatalog(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeCatalog();
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        openCatalog();
      }
      if (event.key === 'Tab' && element('catalog').classList.contains('is-open')) {
        const focusable = Array.from(element('catalog').querySelectorAll('button:not([disabled]), a[href], input, select, summary')).filter(node => node.getClientRects().length);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    const syncLocation = () => {
      const next = readLocation();
      if (next.selected === state.selected && next.scope === state.scope && next.depth === state.depth) return;
      const changed = state.selected !== next.selected;
      Object.assign(state, next);
      if (changed) { state.results = []; state.entryQuery = ''; state.entryLimit = 40; element('entry-search').value = ''; }
      renderCatalog();
      renderInspector();
      renderMap();
    };
    addEventListener('popstate', syncLocation);
    addEventListener('hashchange', syncLocation);
    renderCatalog();
    renderInspector();
    renderMap();
    updateLocation(true);
  }

  try { start(); }
  catch (error) {
    element('load-error').textContent = `The explorer could not start: ${error.message}`;
    element('load-error').hidden = false;
    console.error(error);
  }
})();