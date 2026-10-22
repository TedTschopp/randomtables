# Abulafia Import

This is a static, namespaced import from
[TedTschopp/random-generator-com-wiki-dump](https://github.com/TedTschopp/random-generator-com-wiki-dump),
pinned to commit
[`6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`](https://github.com/TedTschopp/random-generator-com-wiki-dump/commit/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0).
Open [Table Atlas](../../explorer/index.html) to search, inspect, and roll the
validated tables. There is no server-side application.

## Scope and Attribution

The original seed-based mode starts with `Cheeses.Cheeseadj`, `GheronUtility.DeitySymbol`,
`GheronUtility.OrganizationSymbol`, `Ship Names.main`, and
`Fantasy Town Names.main`. It follows both the recorded contributor of each
current table and the contributor of its earliest retained nonempty revision.
All current tables attributed to either identity are included. Dependencies and
their contributors extend that selection recursively until it stops growing.
The published catalog uses `--all-current --recover-history`: every current
table is included, and explicitly reviewed historical targets extend the same
contributor/dependency closure over the available verified historical corpus.

"Earliest retained contributor" is the available evidence for original
authorship, not a guarantee that the complete edit history survived. Anonymous
or unknown contributors are not merged into one shared account. Positive user
IDs identify registered accounts; name-only history joins an account only when
the name is unambiguous. ID `0` is not treated as a shared identity.

Current membership comes from each page's manifest, not every directory found
on disk. Historical mode selects the latest retained non-deleted definition of
an inactive subtable, even when that definition is empty or defective. It does
not search backward for a runnable version. Selected records preserve canonical
JSON and available earliest retained nonempty attribution snapshots; this is
not a copy of every revision. Historical records use separate source archives.

| Item | Count |
| --- | ---: |
| Imported tables | 32,255 |
| Current tables | 26,156 |
| Imported historical definitions | 6,099 |
| Validated, ready tables | 25,716 |
| Ready static tables | 24,562 |
| Ready wiki-runtime tables | 1,154 |
| Quarantined current tables | 4,933 |
| Quarantined historical tables | 1,606 |
| Recorded contributor identities | 275 |
| Source pages | 1,638 |
| Source archive files | 2,170 |
| Preserved archived parsed entries | 590,939 |
| Catalog rows, including recovered raw rows | 590,941 |
| Tables with retained historical attribution | 31,704 |

The [manifest](manifest.json) records the source commit, selected contributors,
table identities, validation issues, aliases, source hashes, and generated-file
sizes and hashes. Per-page JSON files in [source](source/) preserve source data
and attribution snapshots. The 2,173 generated artifacts total 334,726,302 bytes
(about 335 MB); this documentation and separate XML recovery evidence are not
included in that generated-artifact total.

The expanded macro runtime added 444 tables beyond the preceding compact
`po`/`ucfirst` runtime. Two source-bound case repair batches add another 389:
292 static and 97 wiki-runtime tables. All previously ready values and programs,
source archives, identifiers, contributors, and compatibility aliases are unchanged.
Two reviewed source-extraction corrections enable another 41 tables: 31 static
and 10 wiki-runtime tables, with all 20,291 previously ready tables preserved.
The [subsequent two-step recovery](../../Docs/import-recovery-2026-09-07/README.md)
first imported the 408 remaining current tables, adding 353 ready and 55 blocked.
It then added 6,099 historical definitions, of which 4,372 are ready, and enabled
165 current tables. All 20,685 tables ready after Step 1 and all 1,592 current
source archives are unchanged.

The [bracket and case follow-up](../../Docs/repair-followup-2026-09-07/README.md)
then applies 90 additional case rules and enables 53 tables. The later
[bounded recursion policies](../../Docs/bounded-recursion-2026-09-07/README.md)
enable another 180 wiki-runtime tables. The recursion pass preserves all 25,275
previously ready compiled objects, all 2,170 archives, and the compatibility bundle.
The [complete case-repair pass](../../Docs/complete-case-repair-2026-09-07/README.md)
adds 1,438 corrections across 408 tables and enables another 192 tables:
126 static and 66 wiki-runtime. All 25,455 tables ready before that pass and all
source archives are unchanged; the compatibility bundle changes only summary counts.
The [recursion-aware macro repair](../../Docs/recursion-macro-2026-09-08/README.md)
then enables 69 wiki-runtime tables: 62 current and seven historical. It preserves
all 25,647 previously ready compiled objects, all 2,170 archives, and the complete
compatibility bundle. Only the full compressed catalog and manifest change.
Current readiness totals appear in the table above; earlier counts describe
their separate checkpoints.

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
Invalid weights and uncorrected extractor parse warnings remain blocking. A table-level
unresolved-target diagnostic remains unless every executable use is covered by
an approved correction or all remaining recorded uses have zero weight.

### Historical Definitions and Renamed References

The [recovery configuration](../../explorer/tools/historical-recovery.json) binds
129 historical target names to exact source and deletion-snapshot hashes. At the
initial recovery checkpoint, 98 were ready and 31 remained blocked. Contributor/dependency
closure includes 6,056 pinned-history definitions and 43 collision-free records
from verified XML snapshots. The
[XML evidence index](../../archive/abulafia-recovery/2026-09-07/manifest.json)
records the source pin, baseline corpus fingerprint, revision evidence, and
snapshot hashes. Unsafe paths, symlinks, stale definitions, and duplicate IDs
are rejected before compilation.

All 54 target names found only in additional XML snapshots refer to historical
page titles whose runtime IDs are already occupied. None is registered under a
replacement ID or an automatic alias. Seven are byte-identical, warning-free
literal leaves: six `LotFP Spell Lists` names now under `LAMENT Spell Lists`, and
`Village.digit` now under `DOG WIZARDS Villages and Hamlets.digit`. Twelve reviewed
call-site corrections require identical page/subtable identity, raw definitions,
ordered text/weight pairs, and exact source row/token/hash bindings. Original
rows remain visible and unchanged; all normal compilation checks still apply.

The other 47 renamed target names remain unrepaired. Across the broader 883-name
XML census, 829 identities collide with pinned IDs and 11 have conflicting
definitions within a revision. Their snapshots are preserved as evidence, not
executable records. Empty subtable names remain empty; they are never renamed
to `main`. See [every target disposition](../../Docs/import-recovery-2026-09-07/recovery-targets.md).

Existing case approvals continue to validate within their original current-corpus
scope. Historical names cannot retarget approved references. Without an explicit
new all-row approval, current zero-weight reference metadata retains its original
lookup scope. Previously ready compiled objects remain unchanged. Historical archives
live under [source/historical](source/historical/),
without replacing the current source archives. That recovery changed neither
recursion semantics nor runtime limits. The later controlled recursion policies
are documented separately below.

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
import are rejected before compilation by these original selective batches.

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

The case-only batch was empty at completion of those earlier repairs. Expansion
of the corpus later exposed more candidates, addressed by the complete pass below.
The Star Wars contact reference was corrected,
but unrelated blocked dependencies still quarantine that caller. Missing sources,
malformed rows, recursion, and resource limits require separate repair decisions;
none were bypassed to complete this pass.

The separate [recovery case approvals](../../explorer/tools/recovery-case-corrections.json)
add 90 rules across 41 source tables under the explicit
`all-current-with-history` selection: 71 rules followed by 19 newly eligible
rules. They enable 53 tables, preserving all 25,222 prior ready objects. The
original 366 rules retain their current-only scope and cannot be retargeted by
historical names. The subsequent recursion checkpoint exposed five additional
eligible components; those are included in the complete case-repair pass.

### Complete Case Repair

The separate [all-row approval batch](../../explorer/tools/all-case-reference-corrections.json)
contains 1,438 source-bound corrections across 408 current and historical tables:
615 repair case in parsed target names, and 823 repair visible token spelling
where the parser already recorded the canonical target. In the latter case,
`from` and `to` are identical; `raw` records the token that actually changed.
The rules cover 1,703 original reference occurrences and all 206 previously
reported case-only unresolved target names.

This batch requires `all-current-with-history` and binds original row hashes,
weights, source tokens, reference counts, and exact target identities. It runs
after older approvals without changing their source scope or historical basis.
Blocked targets can receive spelling corrections but cannot bypass dependency
validation. Two explicitly approved zero-weight rows retain their original text
and zero probability while their source-graph links use the corrected IDs.

Two page-only corrections preserve exact subtable spelling even where
case-distinct subtables coexist. Three explicit compact-page alias rules require
the pinned extractor's recorded target page/subtable and a unique compact page
identity. Neither path merges identities or introduces runtime aliases. Unapproved
tokens, stale evidence, invalid weights, and ambiguous identities remain rejected.

The pass enables 192 tables: 98 directly corrected sources and 94 dependents.
The remaining 310 corrected sources still have unrelated blockers. All 25,455
previously ready compiled objects and 2,170 archives are unchanged. The
[complete audit](../../Docs/complete-case-repair-2026-09-07/README.md) records
8,118 deterministic rolls with no warnings, 173 passing unit/integrity tests,
and 21 passing offline browser tests. The
[current reference inventory](../../Docs/missing-unresolved-references.md) has
842 unresolved targets and no remaining case-only candidates.

### Source Extraction Corrections

The [source-extraction approval](../../explorer/tools/source-extraction-corrections.json)
is separate from reference corrections. Its original two-table batch binds the
pinned upstream revision and the pre-repair report and manifest hashes at
checkpoint `1351cba`. An independently bound follow-up adds one bracket repair.
The importer applies `sourceCorrections` only to compile-time
copies, never to the archived JSON or upstream parser.

`ODnD Wilderness Encounter Cruncher.lair35` recovers the complete empty parsed
table from `7;(in lair)` and `13;(not in lair)`, preserving the literal texts and
exact 35%/65% probabilities. Semicolon recovery is limited to approved literal
rows and cannot introduce references or expressions.

`The Blues Engine.interjection` verifies the exact `0 NOTE: trailing spc!` line
and restores the trailing space in the raw row, represented as the JSON string
`"1,[ij], "`. Only the warning for that non-executable note is cleared; the note
and warning remain in the source archive.

`Secret Society Title.TitleDescriptor` repairs exactly one extra closing bracket
in `10,Most [TitleDescriptor]]`. Its original raw row and weight remain intact;
the executable projection exposes the self-reference. The bracket repair alone
kept the table blocked. Only the separate, reviewed runtime wrapper policy below
enables it. Source correction batches retain independent approval hashes and
reject duplicate table approvals.

Guards check the source ID, file and hash, complete raw-source hash, exact line,
original row and weight, and the specific extractor warning. Incomplete recovery,
changed probabilities, invented text, duplicate approvals, and out-of-scope tables
are rejected. Unrelated warnings, unresolved references, cycles, and resource
limits still block compilation. There is no global semicolon or warning exception.

Each corrected table carries `sourceCorrections` in the manifest and runtime
catalog. Existing parsed-entry `rawText` remains exact. Newly recovered entries
use the entire original raw line as `rawText`, with `rawSourceLine` giving its
one-based position within the archived `raw_source` block. The two additional
catalog rows do not change the archived parsed-entry count.

The report estimated 31 recoverable tables; full validation enabled 41 because
ten additional Blues macro tables no longer fail dependent validation. All 1,554
archives and all 20,291 previously ready tables stayed exact. Acceptance covered
387 deterministic rolls across all 129 recovered compiled choices, with zero
warnings, plus 104 unit/integrity and 17 offline browser tests. Whitespace is
preserved during composition; existing final-display edge trimming is unchanged.

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

### Controlled Recursion

The [reviewed policies](../../explorer/tools/recursion-policies.json) approve only
`FantasyMenu.VeggiesCookable` row 4 as a `unique-pair` and
`Secret Society Title.TitleDescriptor` row 1 as a `bounded-wrapper`, each at
recursion depth 1. Approval binds the namespaced ID, original source file/hash,
complete raw-source hash, exact row/line/text/weight evidence, and policy shape.
No global cycle exception, alias, or source rewrite is introduced.

The shared [validator](../../JS/wiki-recursion.js) accepts only finite, acyclic,
plain-text terminal paths with at most one simple reference per terminal row.
The pair policy requires at least two distinct normalized resolved values;
nested policies and compound terminal items are rejected. Finite validation is
bounded to 4,096 choices and 1 MiB of retained text/trace data. Gaps, overlapping
ranges, unsafe integer weights, and unrepresentable exact probabilities are
rejected. Browser registration repeats validation before installing the batch.

Selecting the approved pair row produces exactly two terminating items; selecting
the wrapper produces one prefix and one terminating descriptor. Ordinary acyclic
references remain available, but terminal draws cannot recurse. Pair uniqueness
uses Unicode NFC normalization, collapsed whitespace, trimming, and lowercase
conversion without changing display text. Exclusions reset for each combination.

Stored source weights remain exact. The outer pair row retains weight 2/79 and
the wrapper row 10/218. Terminal paths use exact rational-derived integer weights;
pair selection excludes all paths sharing the first item's normalized value.
This weighted sampling without replacement intentionally changes conditional
output probabilities. It does not retry indefinitely, alter source rows, or
deduplicate finished output. Other repeated references remain independent.

The [dated audit](../../Docs/bounded-recursion-2026-09-07/README.md) records 180
promotions and 6,258 warning-free rolls across all 2,086 newly ready root choices
with three dependency profiles. Runtime traces mark approved policy use and
terminal-only draws. General mutual recursion and unsupported forms remain
quarantined, and all global execution limits still apply.

Macro preflight also calls the shared finite-policy validator for explicitly
approved source tables, after source corrections but before ordinary dependency
assessment. Its source projection validates exact references, warnings, weights,
terminal shapes, and policy boundaries. Final importer assessment and browser
registration still validate the executable dependency graph independently.

Worst-case costs use the prepared finite expansion, with conservative expression
operation counts. Sensitive macro argument domains include ordinary terminal
results and one approved recursive-row expansion. Pair domains exclude equal
normalized members and remain within the existing 4,096-value and 1 MiB limits.
Arithmetic and other argument validation is not bypassed. The
[macro integration audit](../../Docs/recursion-macro-2026-09-08/README.md) records
the resulting 69 promotions; neither source-approved policy changes.

### Quarantine and Bounds

Unsupported expressions, missing references, unsafe markup, source warnings,
invalid weights, unapproved cycles, and excessive expansion quarantine a table. Quarantine
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

The full ship-name root is now ready through the bounded descriptor policy.
Both it and the full town-name root use the wiki evaluator, not the classic engine.
Both roots and all selected contributors' tables remain preserved. Compatibility
aliases keep the validated subtables shown above and do not reproduce the full
roots' output distributions. The compatibility tables, labels, and aliases are
unchanged; the entire bundle is byte-identical across the recursion pass.
Wiki-only tables carry inert classic registry markers
and cannot be installed as compatibility aliases.

Local reference corrections resolve the other 29 original missing targets,
including case mismatches and the overwritten Gaelic/Scottish gender lists.
The classic/core registry has zero unresolved targets. The compiled wiki
catalog has 1,048 unresolved targets across current and historical source data;
tables with executable dependencies
on them cannot generate.

## Browser Packaging

The compatibility bundle is about 56 KB. Table Atlas additionally loads
[../../explorer/abulafia-catalog.js](../../explorer/abulafia-catalog.js), about
19.7 MB of JavaScript containing gzip/base64 data. The browser uses native
`DecompressionStream`, `Blob`, and `Response` APIs to decode it, then parses
JSON. There is no `fetch`, `eval`, network dependency, or server requirement.
An unsupported browser receives a startup error instead of a partial catalog.

The explorer also loads local template data, the shared evaluator and recursion validator, and the
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
node explorer/tools/import-abulafia.cjs --source ../random-generator-com-wiki-dump --all-current --recover-history
node explorer/tools/import-abulafia.cjs --source ../random-generator-com-wiki-dump --all-current --recover-history --write
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

Omitting both flags retains the original seed-based selection, not the published
full current-and-historical catalog. `--recover-history` requires `--all-current`
and the checked-in, hash-verified recovery snapshots. Browser use requires none
of the source checkout, Node tools, or archive-scanning environment.

## Content Rights

Attribution and source preservation do not establish a reuse license. No new
license is asserted for imported wiki content. Review upstream content rights
before redistribution; the public-domain statement for the original generator
code does not extend to this imported collection.
