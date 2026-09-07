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

The explorer includes 25,748 namespaced tables from the archived Abulafia wiki:
20,279 validated tables and 5,469 preserved but quarantined tables. The import
follows both recorded editors and earliest retained contributors, recursively
including contributors encountered through dependencies. Existing table names
are never overwritten by imported data.

The browser-only wiki evaluator supports bounded nested macros for grammar,
casing, arithmetic, strings, conditionals, and array helpers. Its expansion added
444 tables; 363 source-bound case corrections now enable another 377 without
changing previously ready choices, archived source data, or the classic engine.
Presentation templates retain plain text; unsupported or invalid expressions
remain quarantined. See the [macro inventory](Docs/macro-inventory.md) for coverage.

The [recovery report](Docs/quarantine-report.md) ranks the remaining blockers.
Corrections use explicit source and target identities, not global case-insensitive
lookup. The 408 current but unimported tables remain outside this repair scope.

See [tables/abulafia/README.md](tables/abulafia/README.md) for source attribution,
compatibility aliases, validation limits, and repeatable import commands. The
generated import occupies about 259 MB, mostly source snapshots and audit data.
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
