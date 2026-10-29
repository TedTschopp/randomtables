# randomtables
A random table roller based on the work started by http://donjon.bin.sh/code/random/

## Table Atlas

Open [explorer/index.html](explorer/index.html) for the new browser-only table
explorer: a searchable catalog, interactive relationship map, weighted entries,
and traced rolls. It works directly from disk with no server, build, or internet
connection. The original generator engine is unchanged; the classic generator,
roll, and print pages remain available with repaired references and a small
compatibility import.

See [explorer/README.md](explorer/README.md) for usage, data boundaries, and
optional development checks.

## Abulafia Import

The explorer includes 32,255 namespaced tables from the archived Abulafia wiki:
25,716 validated tables and 6,539 preserved but quarantined tables. All 26,156
current tables are imported, alongside 6,099 reviewed historical definitions.
Selection follows both recorded editors and earliest retained contributors,
recursively including contributors encountered through dependencies. Existing
table names are never overwritten by imported data.

The browser-only wiki evaluator supports bounded nested macros for grammar,
casing, arithmetic, strings, conditionals, and array helpers. Its expansion added
444 tables; 366 source-bound case corrections now enable another 389 without
changing previously ready choices, archived source data, or the classic engine.
Two reviewed source-extraction repairs recover 41 more tables, restoring exact
lair weights and a documented separator without suppressing unrelated warnings.
Presentation templates retain plain text; unsupported or invalid expressions
remain quarantined. See the [macro inventory](Docs/macro-inventory.md) for coverage.

The [recovery report](Docs/quarantine-report.md) ranks the remaining blockers.
Corrections use explicit source and target identities, not global case-insensitive
lookup. The [completed import and historical recovery](Docs/import-recovery-2026-09-07/README.md)
first adds the 408 omitted current tables, then restores verified dependencies
and enables 165 current tables. Historical imports retain their own blockers;
the [bracket and case follow-up](Docs/repair-followup-2026-09-07/README.md)
then applies 90 additional case rules and enables 53 tables. The malformed
`Most [TitleDescriptor]]` reference is corrected only in the compiled view;
its original archived row and weight remain intact.

Two [reviewed recursion policies](Docs/bounded-recursion-2026-09-07/README.md)
enable another 180 tables. The vegetable pair row produces exactly two distinct
resolved items, and the descriptor wrapper allows one `Most` prefix. These are
results-engine constraints, not table edits. Stored weights stay intact, while
terminal-only selection and uniqueness intentionally change conditional output
probabilities. Other recursion remains blocked.

The [complete case-repair pass](Docs/complete-case-repair-2026-09-07/README.md)
applies 1,438 additional source-bound corrections across 408 tables and enables
192 more tables. It covers misspelled tokens, blocked targets, and zero-weight
source rows without changing archived text, weights, identities, or earlier
approvals. The [remaining reference inventory](Docs/missing-unresolved-references.md)
contains no case-only candidates; other validation blockers remain in place.

The [recursion-aware macro repair](Docs/recursion-macro-2026-09-08/README.md)
enables 69 more tables, including `Secret Society Title.main`. Macro validation
now uses the existing approved finite recursion rules for argument values and
expansion costs. No new policy, source change, or relaxed limit is introduced;
all 25,647 previously ready tables and the complete classic bundle are unchanged.

See [tables/abulafia/README.md](tables/abulafia/README.md) for source attribution,
compatibility aliases, validation limits, and repeatable import commands. The
generated import occupies about 335 MB, mostly source snapshots and audit data.
The browser does not load those archives at startup. Only the explorer loads
the full compressed runtime catalog.

## Source Code

The following source code provides a simple yet flexible JavaScript random text generator, and some example data. Both are released to the public domain.

*   `generator.js`
*   `warrior_data.js`

## Using the Generator

First, you'll need to create a JavaScript data file. This file defines tables as named elements of the `gen_data` object (which is declared in `generator.js`). Typically, the first or main table in the file contains text patterns, which may include phrases or words from other tables indicated by `{name}`. Note that table names can only contain the letters a-z, digits 0-9, and the underscore. A table may be defined as a simple array list, or as a indexed object (see the `warrior_data.js` file for examples of both).

Then, include both the `generator.js` file and your data file in your HTML page. A clever person might note that you could easily create and include more than one data file here.


~~~~
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript" src="warrior_data.js"></script>
~~~~


The `generate_text()` function accepts a single argument, the name of your main table, and returns a text string. You can simply write this text string to the HTML page...

~~~~
<script type="text/javascript">
  document.write(generate_text('warrior'));
</script>
~~~~

Or assign it to a variable in your own JavaScript code. You may also be interested in the `generate_list()` function, which accepts the name of a table and a number, and returns an array of generated text strings.

## Shared TedT.org Navigation

The global header loads `https://tedt.org/assets/global-header/v1/header.js`. Menu changes belong in the TedT.org repository, rather than in this site. The small local fallback and pre-paint bootstrap keep navigation and appearance usable while loading. The shared `tedt-appearance` cookie and `tedt:theme-change` event synchronize appearance; keep local site navigation and application controls separate. See https://tedt.org/docs/global-header.md for the embed contract.
