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
| Validated, ready tables | 20,291 |
| Ready static tables | 19,643 |
| Ready wiki-runtime tables | 648 |
| Quarantined tables | 5,457 |
| Recorded contributor identities | 240 |
| Source pages | 1,554 |
| Preserved current entries | 482,281 |
| Tables with retained historical attribution | 25,202 |

The [manifest](manifest.json) records the source commit, selected contributors,
table identities, validation issues, aliases, source hashes, and generated-file
sizes and hashes. Per-page JSON files in [source](source/) preserve source data
and attribution snapshots. The 1,557 generated artifacts total 259,048,835 bytes
(about 259 MB); this documentation is not a generated artifact.

The expanded macro runtime added 444 tables beyond the preceding compact
`po`/`ucfirst` runtime. Two source-bound case repair batches add another 389:
292 static and 97 wiki-runtime tables. All previously ready values and programs,
source archives, identifiers, contributors, and compatibility aliases are unchanged. The 408
current wiki tables outside the contributor-based selection remain unimported.

## Safe Names and Conversion

Imported identifiers have the form `wiki_abulafia_<page-id>_<subtable-utf8-hex>`.
Exact subtable spelling, capitalization, punctuation, and Unicode are retained
in the identity. Readable names remain available in metadata and the explorer.
The importer rejects duplicate source identities, legacy-key collisions,
prototype-key collisions, and aliases that would replace existing definitions.
Browser registration validates each batch before writing any keys.

Weights must be nonnegative safe integers with a positive table total. Only
positive-weight entries, validated expressions, and exact simple references are
converted. Existing simple cases remain static data for the unchanged legacy
generator. Other validated cases become immutable wiki-only expression programs.
Formatting is reduced to inert text; source strings are never evaluated as
JavaScript. Unsupported markup and expression shapes are rejected.

Valid zero-weight rows remain intact in the archive and inspector, including
their original text, weights, and source references. They have 0% probability
and are excluded from executable validation, dependency propagation, and
expansion limits. The source relationship map still includes their references.
Invalid weights and extractor parse warnings remain blocking. A table-level
unresolved-target diagnostic remains unless every executable use is covered by
an approved correction or all remaining recorded uses have zero weight.

### Explicit Reference Corrections

The [reviewed correction file](../../explorer/tools/case-reference-corrections.json)
contains 366 row-level corrections across 199 tables and 165 misspelled target
names. Each target was already imported and ready, with exactly one case-only
match. No contributor selection, table identity, source archive, or compatibility
alias changes. Table-name lookup remains exact and case-sensitive.

The original 363-rule approval is retained intact. `followUpBatches` records the
three-rule follow-up against its own pre-repair report and manifest hashes and
checkpoint `925b812`. The loader validates each batch's scope, pinned source
revision, and hash format, and rejects duplicate row/token rules across batches.
These hashes identify approval snapshots, not the regenerated current report.

Each correction binds the source ID, source file and hash, one-based row, exact
row-text hash, weight, original reference token and target name, reference count,
and the destination ID, name, and source hash. The visible token must also match
a valid target spelling up to case. Stale bindings, duplicate rules, ambiguous
matches, zero-weight rows, unrelated tokens, and targets outside the selected
import are rejected before compilation.

Corrections apply only to compile-time copies. Archive JSON and catalog `rawText`
keep their original spelling; corrected entries and dependencies use the existing
target's namespaced ID. Each affected table records its `referenceCorrections` in
the manifest and runtime catalog. Remaining unresolved uses still block a table.
All dependency, expression, cycle, probability, and resource checks run normally.

The first pre-repair report estimated 337 recoverable tables. Full compilation enabled
377 because 40 additional tables no longer fail dependent macro validation.
Acceptance covered 8,802 deterministic rolls over all 2,934 selectable compiled
choices in those 377 tables, with zero warnings, plus offline desktop/mobile and
classic-page browser checks.

The follow-up estimated and enabled 12 additional tables: 10 static and two
wiki-runtime tables. All 20,279 previously ready tables remain exact. Acceptance
covered 456 deterministic rolls across all 152 newly selectable compiled choices,
with zero warnings. Positive-weight empty outcomes remain valid: the optional
accessory table retains its original 3-in-11 chance of no accessory. The complete
98-test unit/integrity suite and 16 offline browser tests passed.

The [current recovery report](../../Docs/quarantine-report.md) contains no eligible
case-only correction candidates. The Star Wars contact reference was corrected,
but unrelated blocked dependencies still quarantine that caller. Missing sources,
malformed rows, recursion, and resource limits require separate repair decisions;
none were bypassed to complete this pass.

### Static Choices

Small `ucfirst` and `po` cases retain their exact precomputed alternatives, with
at most 4,096 alternatives per table and safe-integer cumulative weights. Exact
rational arithmetic preserves source-row and referenced-choice probabilities.
Source rows, original weights, and leaf values are intact.
Static traces show compiled choices rather than an extra call for the expanded
argument. This path remains first choice to preserve existing behavior.

### Wiki Expressions

The separate browser evaluator supports multiple and nested operations. It keeps
large validated reference chains compact instead of enumerating their Cartesian
products. Each reference occurrence rolls independently; a template's argument
is evaluated at most once per invocation, even when its source template uses the
parameter repeatedly. Conditional results are lazy, while import preflight
conservatively validates dependencies in every branch.

| Capability | Supported Names |
| --- | --- |
| Grammar and text templates | `Article`, `ia`, `Plural`, `Po`, `Pronoun`, `Concat`, `Comma`, `Numtostring` |
| Casing | `ucfirst`, `lcfirst`, `uc`, `lc` |
| Arithmetic | `#expr` |
| Strings | `#replace`, `#sub`, `#pos`, `#rpos`, `#len` |
| Conditions | `#if`, `#ifeq`, `#ifexist`, `#switch` |
| Pipe-array helpers | `Array_norepeat`, `Array_implode`, `Psychon_norepeat` |
| Plain-text presentation | `link`, `Hover`, `LinkMe`, `Font Color`, `fc`, `DieRoll` |
| Clock and literals | `CURRENTYEAR`, `!`, `p` |

Names are normalized case-insensitively, with underscores treated as spaces and
an optional `Template:` prefix. Verified aliases are `ia` to `article`, `fc` to
`font color`, and `p` to `!`. Named arguments are allowlisted: `title`, `dice`,
and `text` for DieRoll; `link` and `dotted` for Hover. Numeric parameter slots are
bounded. Unknown names, dynamic template names, unbound parameters, and malformed
delimiters are not interpreted.

The [template data](../../JS/wiki-template-data.js) contains nine reviewed
operational bodies and their archive revision IDs. Their source-specific behavior
is retained, including Article's `uni` exception, Plural's suffix rules, Po's
terminal `s`/`S` apostrophe rule and optional override, and Pronoun substitutions.
No general English inflector replaces these rules. Concat removes a repeated
boundary character; Array_norepeat follows source prefix-membership behavior,
not general sampling without replacement. Numtostring retains duplicate source
cases and their first-match behavior. The archived Psychon_norepeat body matches
Array_implode. See the [inventory evidence](../../Docs/macro-inventory.md#template-dependencies).

`ucfirst` and `lcfirst` trim their arguments and change only the first character;
that character must be ASCII or absent. Full-string `uc` and `lc` use Unicode
casing. String positions and lengths count Unicode code points. Arithmetic uses
the vendored jsep parser with an allowlisted numeric AST and finite results;
`div` is ordinary division and chained powers associate left to right. It is a
bounded floating-point implementation, not a recreation of every historical PHP
integer-overflow or server-formatting quirk. Calls, member access, assignment,
arbitrary identifiers, and nonfinite results are rejected.

Presentation helpers deliberately retain visible text, not HTML, styling, links,
or hover interactions. DieRoll emits its text or dice label (default `1d1`), not
an interactive button or an immediate dice roll. CURRENTYEAR uses the browser's
UTC year from one timestamp per roll. `#ifexist` checks registered imported table
pages only, not all historical, template, or special pages in the archived wiki.
SGDisplayGreaterTemplate remains quarantined because its source invocation and
wrapper require repair. These are explicit compatibility boundaries, not claims
of complete MediaWiki emulation.

### Quarantine and Bounds

Unsupported expressions, missing references, unsafe markup, source warnings,
invalid weights, cycles, and excessive expansion quarantine a table. Quarantine
propagates through executable dependencies. Table expansion is limited to 32
levels, 512 table calls, 4,096 expression operations, and 32,768 output characters.
Expression parsing is limited to 32 levels, 32 argument slots, and 65,536 program
nodes per table. Sensitive arithmetic, offset, and casing arguments require
finite-domain validation within 4,096 combinations and 1 MiB of distinct text.
Conservative checks can keep a large otherwise plausible expression blocked;
the importer does not reweight or simplify source data to bypass these limits.
Runtime guards remain active after import. Blocked tables remain
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

The full ship-name root still depends on invalid source data. The full town-name
root is now ready through the wiki evaluator, but is not a classic-engine table.
Both roots and all selected contributors' tables remain preserved. Compatibility
aliases keep the validated subtables shown above and do not reproduce the full
roots' output distributions. The compatibility tables, labels, and aliases are
unchanged; only the bundle's global readiness summary is refreshed. Wiki-only tables carry inert classic registry markers
and cannot be installed as compatibility aliases.

Local reference corrections resolve the other 29 original missing targets,
including case mismatches and the overwritten Gaelic/Scottish gender lists.
The classic/core registry has zero unresolved targets. The compiled wiki
catalog still has 928 unresolved targets; tables with executable dependencies
on them cannot generate.

## Browser Packaging

The compatibility bundle is about 56 KB. Table Atlas additionally loads
[../../explorer/abulafia-catalog.js](../../explorer/abulafia-catalog.js), about
15.8 MB of JavaScript containing gzip/base64 data. The browser uses native
`DecompressionStream`, `Blob`, and `Response` APIs to decode it, then parses
JSON. There is no `fetch`, `eval`, network dependency, or server requirement.
An unsupported browser receives a startup error instead of a partial catalog.

The explorer also loads local template data, the shared evaluator, and the
10.9 KB jsep 1.4.0 browser build. Its [MIT license](../../explorer/vendor/jsep.LICENSE)
is bundled alongside it. These scripts load before the catalog; the classic
pages do not load or require them.

Source snapshots and the audit manifest are not part of the runtime
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
