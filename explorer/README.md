# Table Atlas

A browser-only explorer for the existing Random Tables collection.

## Open the App

Open [index.html](index.html) directly in a modern browser. No installation,
build, server, internet connection, or account is required. Keep this directory
beside the original JavaScript and table directories so relative paths resolve.

The same files can also be served by an ordinary static host such as GitHub
Pages. The **Classic view** link opens the original generator with the selected
table. Existing generator, roll, and print pages remain unchanged.

## Browse the Collection

- Search table names and identifiers; filter by collection, source file, or
  relationship status. Sort by name, connections, or entry count.
- **Focus** shows one to three steps of incoming and outgoing relationships
  around the selected table. Arrows point from a table to a table it references.
- **All tables** shows the collection subject to the catalog's active filters.
  Unconnected tables are included. Collection colors come from source files.
- Select graph nodes, entry references, or the **Connections** lists to move
  between tables. Pan, zoom, drag nodes, or fit the graph to the viewport.
- Inspect list entries and weighted ranges with their per-roll probabilities.
  Empty entries, overlapping ranges, and unassigned probability are preserved.
- **Roll table** generates one to ten results using the original generator.
  Expand the roll trace to inspect selected entries; the corresponding graph
  path is highlighted. Results and table tokens can be copied.
- Bookmark tables locally, export the complete data index as JSON, or download
  the visible graph as a standalone SVG.

On narrow screens, the catalog opens as a keyboard-accessible drawer and the
inspector follows the map. The `/` key focuses table search; Escape closes the
drawer. Browser Back and Forward restore table, graph scope, and depth.

## Data Boundaries

The explorer loads the same 36 table scripts, in the same order, as the original
page. It currently indexes 1,116 tables and 1,137 distinct directed relationships.
Unregistered scripts and alternate JSON formats elsewhere in the repository
are not automatically imported.

The current source data contains 36 unresolved reference targets. These appear
as dashed nodes and can be isolated with the **unresolved** control. The explorer
does not repair missing definitions or change source data. Repeated definitions
retain the original last-loaded-wins behavior, with the active source shown in
the inspector.

Only the `{table_name}` tokens recognized by the original generator are treated
as references. Traced rolls make missing references visible and stop expansion
at 48 nested calls or 800 table calls per result. These guards apply only to the
explorer; the original generator files and behavior on legacy pages are untouched.

Generated HTML is converted to inert plain text before display. Table entries
are displayed as text with explicit reference links, not executed as HTML.

Bookmarks and display preferences use the browser's local storage under
`randomtables.table-atlas.v1`. They do not modify files or synchronize elsewhere.
When browser storage is unavailable, changes remain in memory for the session.

## Maintenance

[registry.js](registry.js) observes table registrations and records their source.
[model.js](model.js) indexes entries and references without rewriting table data.
[graph.js](graph.js) uses D3 for layout, navigation, and SVG rendering.
[app.js](app.js) connects that model to the interface.

Script tags are explicit so the app works with `file://` URLs, without `fetch`,
module loading, or a build step. When changing the original page's table script
list, mirror its order in [index.html](index.html). The integration test detects
drift between the two pages. Changes inside existing table files are picked up
on the next page load.

## Optional Tests

Node is needed only for development checks, never to use the app.

From the repository root, run the dependency-free model and integration tests:

```sh
node --test explorer/tests/model.test.cjs
```

For isolated local-file browser checks, install the development dependencies
and a test browser:

```sh
cd explorer
npm ci
npx playwright install chromium
npm run test:browser
```

Alternatively, use an installed Google Chrome:

```sh
ATLAS_BROWSER_CHANNEL=chrome npm run test:browser
```

The browser tests block HTTP requests and check rendering, navigation, rolls,
data preservation, clipboard access, exports, responsive layouts from 320px to
1440px, keyboard behavior, and automated WCAG A/AA rules. Screenshots and audit
results are written to the ignored test-results directory. Automated accessibility
checks supplement, but do not replace, manual review.

## Bundled Assets

All runtime dependencies are vendored; there are no CDN requests.

| Asset | Package Version | Original License |
| --- | --- | --- |
| D3 | 7.9.0 | [D3 license](vendor/d3-LICENSE.txt) |
| Lucide | 0.468.0 | [Lucide license](vendor/lucide-LICENSE.txt) |
| Manrope variable font via Fontsource | 5.3.0 | [Manrope license](assets/manrope-LICENSE.txt) |
| Bricolage Grotesque variable font via Fontsource | 5.3.0 | [Bricolage Grotesque license](assets/bricolage-grotesque-LICENSE.txt) |
