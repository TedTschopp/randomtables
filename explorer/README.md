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
snapshot indexes 26,871 tables and 46,573 directed relationships. The wiki import
contains 25,748 tables: 20,332 ready and 5,416 quarantined. Ready imports comprise
19,674 static tables and 658 wiki-runtime tables. Unregistered scripts
and alternate JSON formats elsewhere in the repository are not automatically
imported.

All 34 previously unresolved classic targets have been repaired through local
reference corrections or five explicit compatibility aliases. The classic/core
registry has no unresolved targets. The compiled wiki catalog still contains
928 unresolved targets, shown as dashed nodes and accessible through the
**unresolved** control. Imports with executable dependencies on them are
quarantined. These are source-data defects, not missing browser downloads.

Zero-weight rows remain visible as original source text at 0% probability. Their
references remain in the source relationship map, but cannot be rolled and do
not contribute to executable dependencies or expansion limits. Unsupported
syntax in a zero-weight row does not block otherwise valid selectable entries.
Invalid weights, tables with no positive total weight, and extractor parse
warnings without an explicit, source-bound correction remain blocking.

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

## Quarantine Recovery

The first repair batch applies 363 exact row-level case corrections across 196
tables. It enables 377 additional tables: 282 static and 95 wiki-runtime tables.
This exceeds the report's 337-table conditional estimate because 40 additional
tables no longer fail dependent macro validation. All previously ready values and
programs are unchanged. The original archives and row text retain their spelling.

A follow-up batch adds three corrections across three tables, enabling 12 more:
10 static and two wiki-runtime tables. Combined, the two batches apply 366
corrections across 199 tables and enable 389 tables. No eligible case-only
candidates remain under the existing rules. All 20,279 tables ready before the
follow-up and all 1,554 source archives are unchanged.

Follow-up acceptance covered 456 deterministic rolls over all 152 selectable
compiled choices, with zero warnings. The optional empty accessory outcome
retains its original 3-in-11 probability. All 98 unit/integrity tests and 16
offline browser tests passed, including repaired references and nested traces.

The [correction records](tools/case-reference-corrections.json) bind each change to
its source file and hash, row text hash, original token, weight, reference count,
and target ID and hash. The importer rejects stale, ambiguous, out-of-scope,
nonselectable, or non-case-only changes. No global case folding or alias is added.
The manifest and catalog retain each applied table's `referenceCorrections` trail.
Each batch retains its own pre-repair report and manifest hashes; the original
approval remains separate from `followUpBatches`. The importer validates each
batch's scope and pinned revision and rejects duplicate rules across batches.
The published report below reflects the current remaining backlog.

The [source-extraction corrections](tools/source-extraction-corrections.json)
record a separate two-table pass against checkpoint `1351cba`. The lair table
recovers two literal rows with weights 7 and 13 from archived semicolon-delimited
source. The Blues interjection restores a documented trailing space and clears
only the warning for that exact non-executable note. Original archives, existing
parsed row text, weights, identities, and contributor selection are preserved.

This pass enables 41 tables: 31 static and 10 wiki-runtime tables. The estimate
was 31; ten additional Blues macro tables became valid after their dependency
was repaired. All 20,291 previously ready tables remain exact. The catalog now
has 482,283 wiki rows, including two recovered from raw source; the archives
still preserve their original 482,281 parsed entries.

Acceptance covered all 129 newly selectable compiled choices in 387 deterministic
rolls, with zero warnings. All 104 unit/integrity tests and 17 offline browser
tests passed. Browser checks cover 35%/65% probabilities, composed-word spacing,
source evidence, traces, and desktop/mobile layout. The UI continues to trim only
the outer edges of final displayed results; runtime composition retains the space.

The [ranked recovery report](../Docs/quarantine-report.md) separates local defects
from dependency failures and groups recursive tables into joint repair components.
It includes source examples, proposed repairs, confidence, effort, and conditional
recovery estimates. Reach is not the number of tables a single repair will enable.
The [JSON evidence](../Docs/quarantine-report.json) retains all component memberships,
per-table blocker sets, input hashes, and case-only reference candidates.

Generate the reports from the pinned manifest, matching macro inventory, and local
source archives:

```sh
node explorer/tools/quarantine-report.cjs --output Docs
npm --prefix explorer run test:quarantine
```

Omit `--output` for a read-only summary. Different existing reports and changed
input hashes are rejected. Review a later snapshot in a new output directory
before replacing published reports. The tool does not rewrite archives, import
additional contributors, change identifiers, or promote quarantined tables.
The 408 current but unimported wiki tables remain a separate scope decision.

## Archive.org Checks

The optional [Wayback checker](tools/check-wayback.cjs) looks for archived wiki
pages associated with missing tables. It reads the matching quarantine report,
manifest, and hash-verified source snapshots. It does not import, rename, repair,
or change the readiness of any table. The application remains browser-only and
offline; this command uses the optional Node development environment below.

From the repository root, preview the plan without network access or writes:

```sh
node explorer/tools/check-wayback.cjs
```

Network requests require `--check`. A bounded scan can write its evidence to a
new directory inside the repository:

```sh
node explorer/tools/check-wayback.cjs --check --max-requests 20 --output Docs/wayback-new
```

The default budget is 10 requests. Requests are sequential, at least one second
apart, with a 10-second timeout and a 64 KiB response limit. HTTP 403, 429, or 503
stops the run. Errors and timeouts remain incomplete checks, not negative results.
Only public wiki page URLs are sent to Archive.org, never source rows or author
records. The checker reads JSON metadata; it does not download or execute pages.

The current plan covers 683 absent target names on 260 distinct source page names.
Another 174 targets have local case-only candidates, and four malformed references
need source review. Those groups remain visible but are not queried automatically.
This is the active wiki quarantine scope, not every graph placeholder or the 408
unimported tables. Absence from the import does not prove absence from the source.

The [complete source audit](../Docs/wayback-complete-2026-09-07/missing-sources.md)
lists all 260 source pages and retains 914 distinct availability-query results.
It found candidate snapshots for 174 pages associated with 462 missing targets.
Another 86 pages, associated with 221 missing targets, returned no accessible
snapshot for all eight tested URL forms. No planned pages remain pending, and
no API errors were recorded. The full evidence also lists the 174 local candidates
and four malformed references separately.

The [original trial report](../Docs/wayback-2026-09-07/wayback-report.md) is retained;
the completed audit reuses its five queries without changing its evidence.
An archived page does **not** confirm the requested subtable is present. A negative
result across all planned variants is still not proof that the source was lost.

Check the completed audit for remaining work without making network requests:

```sh
node explorer/tools/check-wayback.cjs --check --max-requests 0 \
  --resume Docs/wayback-complete-2026-09-07/wayback-report.json
```

Each output contains `wayback-report.json` and `wayback-report.md`. Use a new output
directory for each run: different existing files and symlinks are rejected.
Resume requires the same source, checker, plan, and requested capture date; it
reuses successful and negative queries and retries errors. Respect a recorded
`Retry-After` before resuming a rate-limited run. Start without `--resume` to refresh
old results, or use `--timestamp 20100101` to seek captures near a historical date.

Both protocols, both wiki host spellings, and page/raw-source URL variants are
checked, stopping at the first valid capture for a page. Page identity must match;
table names are never folded or merged. Other historical URL layouts and actual
subtable contents still require review. Any later import must retain the existing
contributor-wide selection, attribution, probability, and collision safeguards.

Run focused checks with `npm --prefix explorer run test:wayback`. All automated
tests use mocked API responses; the CLI preview test makes no network requests.
Exit code 2 means the report includes API errors; exit code 1 means invalid input
or a refused write. A budget-limited run can exit successfully with work pending.

## Backup Definition Comparison

The [completed comparison](../Docs/backup-comparison-2026-09-07/backup-report.md)
checks actual subtable definitions, not just archived page availability. It covers
15 explicitly inventoried history XML snapshots from the three WikiTeam archive
collections and 982 table files from three pinned converted collections.

Of the 683 exact target identities, 129 have historical definitions already in the
current XML export, 54 have definitions in additional XML snapshots, and five have
candidates only in converted copies. Three have definitions without positive-weight
rows, and 492 were not found in the inspected sources. The 174 local case candidates
and four malformed references remain separate. No tables were imported or enabled.
Matching definitions still need historical, dependency, probability, attribution,
and contributor-wide import review; these are not guaranteed runnable recoveries.

The optional [comparator](tools/compare-backups.cjs) reads the local audit cache and
rechecks its frozen jobs, tool hashes, source files, and current quarantine inputs.
It makes no network requests and does not execute downloaded code. From the
repository root, preview the completed comparison without writes:

```sh
node explorer/tools/compare-backups.cjs \
  --audit-root explorer/test-results/backup-comparison-20260907 --date 2026-09-07
```

Add `--output Docs/backup-comparison-new` to publish guarded JSON and Markdown.
Identical output is left unchanged; conflicting files, symbolic links, and output
outside the repository are refused. The report retains source URLs, pinned commits,
file and definition hashes, exact page identities, and revision summaries without
republishing table rows. Complete definition text and revision evidence remain in
the ignored scan cache. The cache is local maintenance data, not an app dependency
or a checked-in download bundle. A clean clone can read the published report but
must acquire the recorded sources and rebuild the cache before rerunning the audit.

The [source reader](tools/scan-backups.py) accepts a JSON job on standard input:
`extractor` supplies a trusted local `file` and `sha256`; `targets` supplies exact
`name`, `page`, and `subtable` fields; `source` supplies `id`, `kind`, `root`, and
`files` with relative `name` and `sha256` fields. Source kinds are `baseline`,
`wiki-export`, and `converted-tables`. Compressed XML files also specify one exact
`member`. It writes scan JSON to standard output and returns nonzero on a failed
hash, unsafe path, or parse error. It never imports downloaded repository code.

Scanning requires Python 3, `bsdtar` with 7z support, and the original source
extractor at the recorded commit and hash. The audit cache contains reproducible
`*.job.json` inputs under `scans/<scanner-SHA256-prefix>/`; the loader also checks
the recorded scanner hash, normalized job and target hashes, and file-byte hashes.
After changing scanner code, rescan every planned source into a new hash-specific
directory. The reporting command does not download sources or rerun scans.

Run `npm --prefix explorer run test:backups` for focused checks. Python integration
fixtures use the extractor in the sibling `random-generator-com-wiki-dump`
checkout and are explicitly skipped when it is absent. Other tests require only
Node and temporary local files; no automated tests access the network.

## Preserved Archives and Completeness

The [inventory completeness report](../Docs/inventory-completeness-2026-09-07/inventory-report.md)
extends the targeted comparison to every recognized table declaration in the
identified sources. All **18 full archives, totaling 149,083,553 bytes**, are
preserved and checksum-verified under `archive/abulafia-backups/2026-09-07/`.
They were already downloaded for the earlier comparison; this pass preserved
those exact bytes outside the disposable test cache instead of downloading them
again. The [acquisition manifest](../archive/abulafia-backups/2026-09-07/acquisition.json)
records the original URLs, archive names, source-scoped paths, hashes, and pins.

The full census inspected 388,405 XML revision records across 15 snapshots and
982 converted table files across three collections. It found **33,098 distinct
archived wiki table identities**, including **883 absent from baseline history**;
750 of those additional identities have recognized positive-weight rows. The
[additional table list](../Docs/inventory-completeness-2026-09-07/new-wiki-tables.md)
retains their exact names and page IDs. Another 11,297 source-qualified converted
records are inventoried separately, including 1,222 records needing colon-format
review. They are not added to the wiki count as unique recovered tables.

No tables were imported, renamed, enabled, or repaired. Whole archives retain
the other contributor-owned tables available in each export. Any later import
must still apply the existing contributor-wide selection, attribution,
dependency, probability, and collision checks. Empty subtable names and
historical identities are preserved, not silently renamed or merged.

The current corpus remains 26,156 tables: 25,748 imported, 20,332 runnable, and
5,416 imported but blocked. Complete acquisition of the identified sources does
not establish a complete backup of the original live wiki. Other archive
packages, Wayback HTML, suppressed revisions, and unlocated sources remain
outside this census.

The optional [inventory tool](tools/backup-inventory.cjs) uses Node, local files,
and the pinned source checkout. It makes no network requests. From the repository
root, verify archives and census bindings and preview totals without writes:

```sh
node explorer/tools/backup-inventory.cjs \
  --archive-root archive/abulafia-backups/2026-09-07 \
  --source ../random-generator-com-wiki-dump \
  --comparison Docs/backup-comparison-2026-09-07/backup-report.json \
  --date 2026-09-07
```

Add `--output Docs/inventory-completeness-new` to publish the consolidated JSON,
Markdown report, and additional-table list. Changed inputs, conflicting outputs,
symlinks, and paths outside the repository are refused. An identical repeat
writes nothing. `npm --prefix explorer run check:completeness` displays usage;
when supplying arguments through npm, resolve input paths from `explorer/`.

The [full census reader](tools/census-backups.py) accepts a stored JSON job on
standard input and emits JSON on standard output. It reuses the trusted source
extractor and checked local XML reader, never downloaded repository code. XML
members and selected converted data members are streamed without extracting
arbitrary archive paths. Semicolon declarations use the original parser;
colon declarations are inventoried without guessing weight semantics.

To independently rerun one stored census and inspect its summary:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 explorer/tools/census-backups.py \
  < archive/abulafia-backups/2026-09-07/census/936422142f33/spycraftrandom_generatorcom-20200209.job.json \
  | node -e 'let input=""; process.stdin.on("data", chunk => input += chunk); process.stdin.on("end", () => console.log(JSON.parse(input).summary));'
```

Scanning requires Python 3, `bsdtar` with 7z support, and the trusted extractor at
the recorded commit and hash. All stored jobs are under
`census/<census-reader-SHA256-prefix>/`; each result is bound to its normalized
job hash and census-reader hash. The reporting tool verifies those bindings,
the XML-reader and extractor hashes, archive/member scope, and current import
evidence. It does not download archives or regenerate census files. A scanner
change requires a fresh complete census in a new hash-specific directory.

Bulk `downloads/` and detailed `census/` data are ignored local maintenance files;
the acquisition manifest and consolidated reports can be versioned. Job files
contain local absolute paths and are not published. A clean clone can read the
reports but needs the recorded archives, pinned checkout, and regenerated local
jobs and results to rerun the checks. The browser app needs none of these tools
or maintenance files. Acquisition and inventory tests run with
`npm --prefix explorer run test:backups` and are included in the full test suite.

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
