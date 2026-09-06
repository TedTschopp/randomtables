# Abulafia Import

This is a static, namespaced import from
[TedTschopp/random-generator-com-wiki-dump](https://github.com/TedTschopp/random-generator-com-wiki-dump),
pinned to commit
[`6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`](https://github.com/TedTschopp/random-generator-com-wiki-dump/commit/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0).
Open [Table Atlas](../../explorer/index.html) to search, inspect, and roll the
validated tables. There is no server-side application.

## Scope and Attribution

The import starts with `Cheeses.Cheeseadj`, `GheronUtility.DeitySymbol`,
`GheronUtility.OrganizationSymbol`, `Ship Names.main`, and
`Fantasy Town Names.main`. It follows both the recorded contributor of each
current table and the contributor of its earliest retained nonempty revision.
All current tables attributed to either identity are included. Dependencies and
their contributors extend that selection recursively until it stops growing.

"Earliest retained contributor" is the available evidence for original
authorship, not a guarantee that the complete edit history survived. Anonymous
or unknown contributors are not merged into one shared account. Positive user
IDs identify registered accounts; name-only history joins an account only when
the name is unambiguous. ID `0` is not treated as a shared identity.

Current membership comes from each page's manifest, not every directory found
on disk. Retained but inactive subtable files are excluded. For every selected
table, the archive preserves its complete current canonical JSON and, when
available, its earliest retained nonempty snapshot. Other historical revisions
remain in the upstream repository; this is not a copy of every revision.

| Item | Count |
| --- | ---: |
| Imported tables | 25,748 |
| Validated, ready tables | 19,351 |
| Quarantined tables | 6,397 |
| Recorded contributor identities | 240 |
| Source pages | 1,554 |
| Preserved current entries | 482,281 |
| Tables with retained historical attribution | 25,202 |

The [manifest](manifest.json) records the source commit, selected contributors,
table identities, validation issues, aliases, source hashes, and generated-file
sizes and hashes. Per-page JSON files in [source](source/) preserve source data
and attribution snapshots. The 1,557 generated artifacts total 258,839,620 bytes
(about 259 MB); this documentation is not a generated artifact.

## Safe Names and Conversion

Imported identifiers have the form `wiki_abulafia_<page-id>_<subtable-utf8-hex>`.
Exact subtable spelling, capitalization, punctuation, and Unicode are retained
in the identity. Readable names remain available in metadata and the explorer.
The importer rejects duplicate source identities, legacy-key collisions,
prototype-key collisions, and aliases that would replace existing definitions.
Browser registration validates each batch before writing any keys.

Weights must be nonnegative safe integers with a positive table total. Only
positive-weight entries, supported text and expressions, and exact simple references are
converted for the unchanged legacy generator. Formatting in executable entries
is reduced to inert text and escaped for legacy HTML output. Supported expressions
are compiled into static data; wiki macros and code are never executed at runtime.

Valid zero-weight rows remain intact in the archive and inspector, including
their original text, weights, and source references. They have 0% probability
and are excluded from executable validation, dependency propagation, and
expansion limits. The source relationship map still includes their references.
Invalid weights and extractor parse warnings remain blocking. A table-level
unresolved-target diagnostic is ignored only when every recorded use of that
target occurs in a zero-weight row.

One non-nested `{{ucfirst:...}}` expression per selectable row can be compiled.
It changes only the first character to uppercase and leaves the remainder
unchanged, following the documented
[MediaWiki behavior](https://www.mediawiki.org/wiki/Help:Magic_words#Formatting).
The argument must be a plain-text literal or one exact reference to a validated
leaf table whose selectable entries contain no further references. The first
character must be ASCII; empty strings are also supported. Leading or trailing
whitespace, markup, entities, pipe characters, and unsupported syntax in the
argument remain blocked. Multiple macros in one row, nested expressions,
indirect references inside the argument, and non-ASCII first characters remain
quarantined rather than assuming locale-specific casing behavior.

The compiler precomputes capitalized runtime alternatives without changing the
source table or introducing helper identifiers. Exact integer arithmetic rescales
weights to preserve both source-row and leaf-choice probabilities, with at most
4,096 alternatives per table and a safe-integer cumulative weight. Ordinary
references outside the macro still roll independently. Source rows, original
weights, and graph relationships remain intact; traces show the precomputed
selections, not an additional call for the capitalized leaf. This support enables
101 additional tables: 26 directly and 75 through their dependencies, including
`Color.huesCap` and `Compass direction.4`.

One `{{po|...}}` expression with one explicit argument per selectable row can
also be compiled. Its rule comes from `Template:Po`, page 3854, revision 28408
(2015-07-28), in the locally retained MediaWiki export described in the
[upstream archive policy](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/README.md#what-stays-out-of-git).
The template appends a right single quotation mark (U+2019) after terminal `s`
or `S`; otherwise it appends U+2019 followed by `s`. Existing apostrophes are
not normalized, and an explicitly empty argument produces U+2019 followed by
`s`, matching the source rule rather than substituting a grammatical heuristic.

Possessive arguments may contain literals and acyclic chains of exact simple
references. The compiler expands weighted choices with exact rational arithmetic
before applying the suffix. Repeated references roll independently; zero-weight
rows remain preserved but unselected. It does not introduce helper identifiers
or change the classic engine. Optional second arguments, template aliases,
nested macros, markup, entities, and final arguments with edge whitespace remain
unsupported. All referenced tables must still pass normal validation.

Possessive expansion is limited to 4,096 alternatives, safe-integer weights,
32 levels, 512 table calls, and 32,768 characters. This enables three tables:
`Artifacts.WaterBegin`, `Pathfinder Artifact.WaterBegin`, and
`Fantasy Town Feature.religiousplace`. The proposed 62-table gain was conditional
on supporting the full town and artifact-name roots. Those roots still exceed
the bounded expansion limit and remain quarantined; their preserved data is
not simplified or reweighted to bypass that limit.

Unsupported expressions, missing references, unsafe markup, source warnings,
invalid weights, cycles, and excessive expansion quarantine a table. Quarantine
propagates through executable dependencies. Ready tables must fit within a worst-case expansion
of 32 levels, 512 table calls, and 32,768 characters. Blocked tables remain
searchable with their original entries and validation issues, but generation
returns an unavailable marker. The explorer disables their roll controls and
excludes them from random selection.

## Classic Compatibility

The classic generator, roll, and print pages load only
[../abulafia.js](../abulafia.js): 11 validated dependency tables and these five
previously missing aliases. No existing imported-name collision is permitted.

| Legacy Alias | Imported Target |
| --- | --- |
| `Cheeseadj` | `Cheeses.Cheeseadj` |
| `GheronDeitySymbol` | `GheronUtility.DeitySymbol` |
| `GheronOrganizationSymbol` | `GheronUtility.OrganizationSymbol` |
| `ship_name` | `Ship Names.Special` |
| `town_name` | `Fantasy Town Names.Englishy` |

The full ship-name root depends on malformed, recursive source syntax. The full
town-name root uses an unsupported possessive macro. Both roots and all selected
contributors' tables are preserved, but the compatibility aliases use the
validated subtables shown above instead of partially interpreting those roots.
They do not reproduce the full roots' output distributions.

Local reference corrections resolve the other 29 original missing targets,
including case mismatches and the overwritten Gaelic/Scottish gender lists.
The classic/core registry has zero unresolved targets. The full preserved wiki
corpus still has 1,050 unresolved targets; tables with executable dependencies
on them cannot generate.

## Browser Packaging

The compatibility bundle is about 56 KB. Table Atlas additionally loads
[../../explorer/abulafia-catalog.js](../../explorer/abulafia-catalog.js), about
15.7 MB of JavaScript containing gzip/base64 data. The browser uses native
`DecompressionStream`, `Blob`, and `Response` APIs to decode it, then parses
JSON. There is no `fetch`, `eval`, network dependency, or server requirement.
An unsupported browser receives a startup error instead of a partial catalog.

Source snapshots and the 21.5 MB audit manifest are not part of the runtime
payload. They are opened only when inspected directly. The explorer's graph is
limited to 600 displayed nodes and 3,000 links, with displayed/total counts;
the searchable catalog and JSON export remain complete.

## Repeat the Import

Node and the optional development dependencies are required only to regenerate
or test artifacts. From the repository root, with the source checkout alongside
this repository:

```sh
npm --prefix explorer ci
node explorer/tools/import-abulafia.cjs --source ../random-generator-com-wiki-dump
node explorer/tools/import-abulafia.cjs --source ../random-generator-com-wiki-dump --write
npm --prefix explorer test
ATLAS_BROWSER_CHANNEL=chrome npm --prefix explorer run test:browser
```

The first import command is a dry run. The second requires a clean source
checkout, records its Git commit, and writes the artifacts only after checking
all output paths. Identical files are skipped; differing files, symlinks, unsafe
paths, and oversized files are rejected. Partial new writes are rolled back if
a write fails. There is deliberately no force/overwrite option. A repeat run
against the pinned source writes zero files. Changes to the source revision or
conversion rules require a separately reviewed replacement of generated files.

## Content Rights

Attribution and source preservation do not establish a reuse license. No new
license is asserted for imported wiki content. Review upstream content rights
before redistribution; the public-domain statement for the original generator
code does not extend to this imported collection.
