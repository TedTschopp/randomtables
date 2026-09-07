# Table Atlas

A browser-only explorer for the existing Random Tables collection.

## Open the App

Open [index.html](index.html) directly in a modern browser with native
`DecompressionStream` support. No installation, build, server, internet
connection, or account is required. Keep this directory
beside the original JavaScript and table directories so relative paths resolve.

The same files can also be served by an ordinary static host such as GitHub
Pages. The **Classic view** link opens the original generator with the selected
table when that table is available there. Full-catalog-only imports open the
classic home page without an unsupported table parameter. The original engine
is unchanged; the classic pages load only the small compatibility import.

## Browse the Collection

- Search table names, identifiers, recorded editors, and earliest retained
  contributors; filter by collection, source file, relationship status, or
  validation state. Sort by name, connections, or entry count.
- **Focus** shows one to three steps of incoming and outgoing relationships
  around the selected table. Arrows point from a table to a table it references.
- **All tables** shows the collection subject to the catalog's active filters.
  Unconnected tables are included. Collection colors come from source files.
- Large maps draw at most 600 nodes and 3,000 links, prioritizing the selected
  table and its neighbors before highly connected tables. The footer reports
  displayed and total counts. Search, inspection, and JSON export still cover
  the complete catalog; SVG export contains the displayed graph only.
- Select graph nodes, entry references, or the **Connections** lists to move
  between tables. Pan, zoom, drag nodes, or fit the graph to the viewport.
- Inspect list entries and weighted ranges with their per-roll probabilities.
  Empty entries, overlapping ranges, and unassigned probability are preserved.
- Imported tables show contributor attribution and a link to their local source
  snapshot. Blocked imports retain source entries and validation details, but
  cannot be rolled or chosen by **Random table**.
- **Roll table** generates one to ten results using the original generator or
  the isolated wiki expression evaluator, as required by the selected table.
  Expand the roll trace to inspect selected entries; the corresponding graph
  path is highlighted. Results and table tokens can be copied.
- Bookmark tables locally, export the complete data index as JSON, or download
  the visible graph as a standalone SVG.

On narrow screens, the catalog opens as a keyboard-accessible drawer and the
inspector follows the map. The `/` key focuses table search; Escape closes the
drawer. Browser Back and Forward restore table, graph scope, and depth.

## Data Boundaries

The explorer loads the same ordered table-script list as the classic home page,
including its compatibility bundle, then adds the full Abulafia catalog. This
snapshot indexes 26,871 tables and 46,584 directed relationships. The wiki import
contains 25,748 tables: 19,902 ready and 5,846 quarantined. Ready imports comprise
19,351 static tables and 551 wiki-runtime tables. Unregistered scripts
and alternate JSON formats elsewhere in the repository are not automatically
imported.

All 34 previously unresolved classic targets have been repaired through local
reference corrections or five explicit compatibility aliases. The classic/core
registry has no unresolved targets. The preserved wiki corpus still contains
1,050 unresolved targets, shown as dashed nodes and accessible through the
**unresolved** control. Imports with executable dependencies on them are
quarantined. These are source-data defects, not missing browser downloads.

Zero-weight rows remain visible as original source text at 0% probability. Their
references remain in the source relationship map, but cannot be rolled and do
not contribute to executable dependencies or expansion limits. Unsupported
syntax in a zero-weight row does not block otherwise valid selectable entries.
Invalid weights, tables with no positive total weight, and extractor parse
warnings remain blocking.

Existing repeated definitions retain the original last-loaded-wins behavior,
with the active source shown in the inspector. Imported identifiers are distinct
and collision-checked before registration. See the
[import documentation](../tables/abulafia/README.md) and
[manifest](../tables/abulafia/manifest.json) for the pinned source revision,
selection policy, validation rules, and retained attribution evidence.

The original generator still recognizes only `{table_name}` references. Imported
references resolve to exact namespaced table IDs. Small `ucfirst` and `po` cases
retain their previously compiled choices, exact probabilities, and original leaf
values. Those traces show precomputed choices, not separate argument calls.

The wiki-only evaluator handles multiple and nested calls, verified aliases,
grammar templates, casing, arithmetic, strings, conditionals, and pipe-array
helpers. It follows nine reviewed archived template bodies instead of guessing
English grammar. References roll independently; each evaluated template argument
is cached for its invocation. Runtime traces include the tables actually called.
No original generator functions or source tables are rewritten.

First-character casing remains ASCII-only; full-string casing supports Unicode.
Arithmetic uses a restricted numeric AST, never JavaScript evaluation. Links,
hover text, and color wrappers produce plain text; DieRoll produces a label, not
an interactive button or an extra dice roll. CURRENTYEAR uses UTC. Page-existence
checks cover registered imported table pages, not the entire archived wiki.
See the [conversion rules](../tables/abulafia/README.md#safe-names-and-conversion)
for supported forms and remaining source-review cases.

Traced classic rolls stop at 48 nested calls or 800 table calls per result.
Validated wiki imports have stricter limits: 32 table levels, 512 table calls,
4,096 expression operations, and 32,768 output characters. Import preflight
checks dependencies, sensitive argument domains, and worst-case expansion before
enabling a table. Invalid or over-budget expressions remain quarantined.

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
[../JS/wiki-import.js](../JS/wiki-import.js) registers validated imports without
overwriting existing keys; the app waits for catalog decompression before
building its model.
[../JS/wiki-expressions.js](../JS/wiki-expressions.js) validates and evaluates
immutable programs; [../JS/wiki-template-data.js](../JS/wiki-template-data.js)
contains the reviewed grammar and array template bodies. The importer uses the
same evaluator through [tools/compile-wiki-expressions.cjs](tools/compile-wiki-expressions.cjs).

Script tags are explicit so the app works with `file://` URLs, without `fetch`,
module loading, or a build step. When changing the original page's table script
list, mirror its order in [index.html](index.html). The integration test detects
drift between the two pages. Changes inside existing table files are picked up
on the next page load. Generated import files must be updated through the
[import tool](tools/import-abulafia.cjs), not hand-edited.

## Macro Inventory

The [macro inventory](../Docs/macro-inventory.md) covers all 26,156 current wiki
tables, including imported-ready, quarantined, and not-imported tables, plus local
JavaScript definitions, alternate JSON collections, and wordlists. It separates
current support, remaining operations, archived template dependencies, and source
repairs. The [JSON evidence](../Docs/macro-inventory.json) retains each occurrence.

The scanner is an optional development tool; it does not change tables or add a
server requirement. Run its focused tests with `npm --prefix explorer run test:inventory`.
The report contains the reproduction command and exact source revision.

## Optional Tests

Node is needed only for development checks, never to use the app.

From the repository root, install the optional development dependencies and run
the model, data, converter, browser-runtime, and artifact-integrity tests:

```sh
npm --prefix explorer ci
npm --prefix explorer test
```

Run just the expression, converter, and registration checks with
`npm --prefix explorer run test:macros`.

For isolated local-file browser checks, install a test browser:

```sh
cd explorer
npx playwright install chromium
npm run test:browser
```

Alternatively, use an installed Google Chrome:

```sh
ATLAS_BROWSER_CHANNEL=chrome npm run test:browser
```

The browser tests block HTTP requests and check all three classic pages, wiki
attribution and quarantine, rendering, navigation, rolls, data preservation,
clipboard access, complete JSON and bounded SVG exports, responsive layouts from
320px to 1440px, keyboard behavior, and automated WCAG A/AA rules. Screenshots and audit
results are written to the ignored test-results directory. Automated accessibility
checks supplement, but do not replace, manual review.

## Bundled Assets

All runtime dependencies are vendored; there are no CDN requests.

| Asset | Package Version | Original License |
| --- | --- | --- |
| D3 | 7.9.0 | [D3 license](vendor/d3-LICENSE.txt) |
| Lucide | 0.468.0 | [Lucide license](vendor/lucide-LICENSE.txt) |
| jsep arithmetic parser | 1.4.0 | [jsep license](vendor/jsep.LICENSE) |
| Manrope variable font via Fontsource | 5.3.0 | [Manrope license](assets/manrope-LICENSE.txt) |
| Bricolage Grotesque variable font via Fontsource | 5.3.0 | [Bricolage Grotesque license](assets/bricolage-grotesque-LICENSE.txt) |
