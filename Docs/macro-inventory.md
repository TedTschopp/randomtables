{% raw %}
# Macro Inventory

Snapshot: 2026-09-08. Source revision: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

## Bottom Line

The current wiki tables use **29 macro names in selectable rows**. **28 names** have implemented support through bounded evaluation or explicit plain-text projections. **1 name** remains unsupported. An implemented name does not guarantee that its arguments or dependencies pass validation.

The scan covers **26,156 current wiki tables**: 26,156 imported and 0 not imported. It separately includes **6,099 imported historical definitions**. It also covers every local table script, both alternate JSON collections, and the local wordlists. Source data and runtime behavior were not changed by this inventory.

## Coverage

| Scope | Tables or Definitions | Entries |
| --- | ---: | ---: |
| Current wiki corpus | 26,156 | 488,128 |
| Imported historical definitions | 6,099 | 102,811 |
| Local JavaScript and JSON definitions | 2,273 | 62,985 |

Local sources: 38 JavaScript files (36 loaded by the classic home page), 2 JSON files, and 15 text wordlists. Local definitions include shadowed and unloaded data and are not added to the active browser table count.

Wiki state counts: `ready-static`: 20,261; `ready-runtime`: 962; `blocked`: 4,933.

Historical state counts: `ready-static`: 4,301; `blocked`: 1,606; `ready-runtime`: 192. Historical macro usage and diagnostics are retained separately in the JSON; the selectable-macro table below describes the current corpus only.

Local state counts: `legacy-active`: 1,118; `legacy-shadowed`: 64; `legacy-unloaded`: 16; `legacy-json`: 1,071; `legacy-json-prototype`: 4.

## Selectable-Row Macros

Counts below are distinct source tables containing well-closed, unprotected macro calls in positive, valid-weight rows. They are not predicted unlock counts. One table may appear in several rows, so columns must not be summed. Names are grouped case-insensitively with underscores treated as spaces; actual spellings remain in the JSON evidence, and grouping does not imply that every spelling is supported.

| Macro | Source Tables | Calls | Ready Static | Ready Runtime | Blocked | Not Imported | Support |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `ia` | 267 | 486 | 0 | 137 | 130 | 0 | Bounded |
| `ucfirst` | 222 | 564 | 27 | 72 | 123 | 0 | Bounded |
| `article` | 102 | 232 | 0 | 28 | 74 | 0 | Bounded |
| `plural` | 78 | 329 | 0 | 39 | 39 | 0 | Bounded |
| `lcfirst` | 40 | 75 | 0 | 12 | 28 | 0 | Bounded |
| `po` | 40 | 123 | 3 | 17 | 20 | 0 | Bounded |
| `#expr` | 24 | 109 | 0 | 14 | 10 | 0 | Bounded |
| `lc` | 24 | 41 | 0 | 14 | 10 | 0 | Bounded |
| `link` | 22 | 1,029 | 0 | 22 | 0 | 0 | Plain text |
| `hover` | 19 | 536 | 0 | 19 | 0 | 0 | Plain text |
| `uc` | 16 | 31 | 0 | 5 | 11 | 0 | Bounded |
| `#replace` | 15 | 35 | 0 | 11 | 4 | 0 | Bounded |
| `pronoun` | 10 | 10 | 0 | 0 | 10 | 0 | Bounded |
| `#pos` | 8 | 27 | 0 | 7 | 1 | 0 | Bounded |
| `#rpos` | 8 | 14 | 0 | 7 | 1 | 0 | Bounded |
| `#sub` | 8 | 15 | 0 | 6 | 2 | 0 | Bounded |
| `comma` | 5 | 11 | 0 | 5 | 0 | 0 | Bounded |
| `concat` | 2 | 9 | 0 | 2 | 0 | 0 | Bounded |
| `linkme` | 2 | 6 | 0 | 0 | 2 | 0 | Plain text |
| `numtostring` | 2 | 6 | 0 | 1 | 1 | 0 | Bounded |
| `#ifeq` | 1 | 1 | 0 | 0 | 1 | 0 | Bounded |
| `array implode` | 1 | 1 | 0 | 1 | 0 | 0 | Bounded |
| `array norepeat` | 1 | 2 | 0 | 1 | 0 | 0 | Bounded |
| `currentyear` | 1 | 1 | 0 | 1 | 0 | 0 | Bounded |
| `dieroll` | 1 | 1 | 0 | 1 | 0 | 0 | Plain text |
| `fc` | 1 | 1 | 0 | 0 | 1 | 0 | Plain text |
| `font color` | 1 | 10 | 0 | 0 | 1 | 0 | Plain text |
| `psychon norepeat` | 1 | 1 | 0 | 1 | 0 | 0 | Bounded |
| `sgdisplaygreatertemplate` | 1 | 1 | 0 | 0 | 1 | 0 | Source review |

`ready-static` means the imported table uses existing compiled choices. `ready-runtime` means the new wiki-only evaluator is required. Other tables may depend on these macros without containing them directly.

The wiki-only parser supports multiple and nested calls, positional arguments, allowlisted named arguments, and verified aliases. Repeated table references roll independently; each evaluated template argument is cached for that invocation. Existing static choices and the classic engine are unchanged. Source text is never evaluated as JavaScript.

Bounds: 32 levels of parsed expressions and table expansion, 512 table calls, 4,096 expression operations, and 32,768 output characters per roll. Arithmetic and sensitive dynamic arguments must pass finite-domain validation, limited to 4,096 combinations and 1 MiB of distinct text. First-character casing remains ASCII-only for `ucfirst` and `lcfirst`; full-string `uc` and `lc` use Unicode casing. Invalid, ambiguous, cyclic, and over-budget expressions remain quarantined.

Presentation templates are plain-text projections: links retain visible labels, Hover retains visible text, and font-color wrappers retain text without styling. DieRoll retains its text or dice label; it does not create an interactive button or roll dice. CURRENTYEAR uses the browser UTC year from one timestamp per roll. `#ifexist` checks registered imported table pages only, not the entire archived wiki namespace.

The nine bundled grammar and array template bodies retain their reviewed source rules, including irregular pluralization, prefix-based array membership, and duplicate Numtostring cases. SGDisplayGreaterTemplate and source-brace repairs remain outside executable support. See the [conversion rules](../tables/abulafia/README.md#safe-names-and-conversion) and the evaluator, importer, and offline browser tests for exact supported forms.

## Capability Requirements

These source-derived contracts remain acceptance criteria for implemented operations. Counts below deduplicate aliases within each group; they are not predictions of table readiness. The original implementation priorities remain in the JSON evidence.

| Capability | Names | Source Tables |
| --- | --- | ---: |
| Indefinite articles | `ia`, `article` | 369 |
| Case conversion | `ucfirst`, `lcfirst`, `lc`, `uc` | 295 |
| Pluralization | `plural` | 78 |
| Possessives | `po` | 40 |
| String operations | `#replace`, `#sub`, `#pos`, `#rpos`, `concat`, `comma` | 29 |
| Arithmetic and number words | `#expr`, `numtostring` | 26 |
| Conditional expressions | `#ifeq` | 1 |
| Pronoun tokens | `pronoun` | 10 |
| Pipe-delimited arrays | `array norepeat`, `array implode`, `psychon norepeat` | 3 |
| Links, tooltips, and colors | `link`, `hover`, `linkme`, `fc`, `font color` | 45 |
| Interactive dice control | `dieroll` | 1 |
| Current year | `currentyear` | 1 |
| Generator display wrapper | `sgdisplaygreatertemplate` | 1 |

- **Indefinite articles:** Preserve the archived Article behavior and its Ia alias. The archived rule handles initial vowels with a uni exception; it is not a general pronunciation engine. Preserve its casing and empty-input behavior.
- **Case conversion:** Support first-character and full-string case conversion through the bounded expression parser. ucfirst and lcfirst remain ASCII-only at the first character; uc and lc use Unicode casing. Arguments are trimmed, and multiple and nested calls are validated.
- **Pluralization:** Preserve the custom Plural template, including explicit override arguments and its suffix rules. This is a custom inflection template, not MediaWiki's numeric PLURAL magic word. Do not silently replace its rules with a different inflection library.
- **Possessives:** Preserve existing static po choices and support validated aliases, nested calls, and optional arguments in the wiki evaluator. The optional second argument overrides only the non-s branch. Terminal s/S, explicit empty arguments, and existing apostrophes follow the archived template.
- **String operations:** Provide literal replacement, substring, forward/reverse position, boundary-aware concatenation, and a literal comma helper. Concat removes one duplicate boundary character, so ta + al becomes tal. Comma emits comma plus space. Pin negative offsets, missing matches, and argument trimming to source behavior.
- **Arithmetic and number words:** Use bounded arithmetic parsing for #expr and a verified number-word lookup for Numtostring. Never evaluate source as JavaScript. Numtostring retains the archive's duplicate keys and first-match behavior: 1 yields one while 21 yields an empty result. Arithmetic div means ordinary division and chained powers associate left to right.
- **Conditional expressions:** Provide equality branching with lazy result branches and exact integer-string comparison. Although directly used by one current table, this capability also underlies many custom template definitions. Avoid evaluating unused branches or rerolling an already evaluated argument.
- **Pronoun tokens:** Replace the template's !HESHE, !HIMHER, and !HISHER tokens for m, f, and z modes. This is explicit token substitution with sentence capitalization rules, not general grammatical rewriting.
- **Pipe-delimited arrays:** Support the archived pipe-string array representation, append-if-absent behavior, and delimiter rendering. These are not generic random sampling without replacement; membership uses the source's prefix-search rule. The latest Psychon norepeat operational body matches Array implode despite its name, and is preserved unchanged.
- **Links, tooltips, and colors:** Project presentation templates to their visible plain text without links, tooltips, or color styling. Fc aliases Font Color. LinkMe retains its text without reproducing the wiki-page-existence presentation; direct #ifexist checks cover registered imported table pages only. Never execute arbitrary HTML, CSS, or URLs from source.
- **Interactive dice control:** Project DieRoll to its explicit text or dice label, defaulting to 1d1; no interactive control or immediate dice roll is created. DieRoll is an interactive presentation template with named title, dice, and text parameters, not simply an eager random number operation.
- **Current year:** Evaluate CURRENTYEAR using the browser UTC year, with one clock snapshot per roll. It is a context value, not a template or random choice. Fixed-clock tests cover reproducible output.
- **Generator display wrapper:** Review the original sgdisplay extension and damaged table invocation before attempting support. The observed table call has an unclosed inner reference, and the archived wrapper uses dynamic template-like syntax. Do not enable it based solely on balanced outer braces.

## Source Examples

Examples link to exact table JSON at the pinned source commit or to hash-verified local XML snapshots. Entry numbers refer to the parsed source entry array, starting at 1. The machine-readable report retains every occurrence, exact spellings, weights, states, offsets, and available local archive paths.

| Macro | Exact Spellings | Source Table | Entry | Expression |
| --- | --- | --- | ---: | --- |
| `ia` | `ia` | [1st Level Dungeon.details](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/1st-level-dungeon/subtables/details/table.json) | 1 | `{{ia\|[dtype]}}` |
| `ucfirst` | `ucfirst` | [100 Bookshelves.shelf](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/100-bookshelves/subtables/shelf/table.json) | 1 | `{{ucfirst:[entry].}}` |
| `article` | `Article`, `article` | [Available Dog Generator.d100WarDogs](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/available-dog-generator/subtables/d100wardogs/table.json) | 46 | `{{Article\|[WarDogNames]}}` |
| `plural` | `Plural`, `plural` | [100 even less useful items.item](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/100-even-less-useful-items/subtables/item/table.json) | 68 | `{{plural\|[Animal.fantasyHumanoid]}}` |
| `lcfirst` | `lcfirst` | [Bag of Tricks.main](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/bag-of-tricks/subtables/main/table.json) | 102 | `{{lcfirst:[dead]}}` |
| `po` | `Po`, `po` | [Armor.ServantUniformMale](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/armor/subtables/servantuniformmale/table.json) | 1 | `{{po\|[ServantType]}}` |
| `#expr` | `#expr` | [DnD-5e-NPC.ArmorClass](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/dnd-5e-npc/subtables/armorclass/table.json) | 1 | `{{#expr: 10 + [Dice.1d6]}}` |
| `lc` | `lc` | [Alignment.all](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/alignment/subtables/all/table.json) | 1 | `{{lc:[allCap]}}` |
| `link` | `link` | [Critical Hit.bludgeoning-special](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/critical-hit/subtables/bludgeoning-special/table.json) | 5 | `{{link\|http://www.d20srd.org/srd/combat/specialAttacks.htm#trip\|trip}}` |
| `hover` | `Hover` | [SGNP arabic.female_ism](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/sgnp-arabic/subtables/female-ism/table.json) | 1 | `{{Hover\|Life vivacious\|A’isha}}` |
| `uc` | `UC`, `uc` | [DOG WIZARDS Curse.cursename](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/dog-wizards-curse/subtables/cursename/table.json) | 6 | `{{uc:[Creepy Fantasy Villain.main]}}` |
| `#replace` | `#replace` | [Faction Leader Random Events.assassination_great](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/faction-leader-random-events/subtables/assassination-great/table.json) | 4 | `{{#replace:[assassin]\|is\|are}}` |
| `pronoun` | `Pronoun` | [Temperament Traits.cholericfemalesentences](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/temperament-traits/subtables/cholericfemalesentences/table.json) | 2 | `{{Pronoun\|[cholericsentences]\|f}}` |
| `#pos` | `#pos` | [User:Serpentine Cougar.test3](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/user-serpentine-cougar/subtables/test3/table.json) | 10 | `{{#pos:[syl1]\|>}}` |
| `#rpos` | `#rpos` | [User:Serpentine Cougar.test3](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/user-serpentine-cougar/subtables/test3/table.json) | 10 | `{{#rpos:[syl1]\|<}}` |
| `#sub` | `#sub` | [Fantasy Plane Description.dragon](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasy-plane-description/subtables/dragon/table.json) | 1 | `{{#sub:[Dragon type.main_lowercase]\|0\|-1}}` |
| `comma` | `Comma` | [FantasyMenu.WithSide](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasymenu/subtables/withside/table.json) | 4 | `{{Comma}}` |
| `concat` | `Concat` | [Goblin.namethreeparts](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/goblin/subtables/namethreeparts/table.json) | 1 | `{{Concat\|{{Concat\|[namefthird]\|[namesthird]}}\|[nametthird]}}` |
| `linkme` | `LinkMe` | [Crate.main](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/crate/subtables/main/table.json) | 4 | `{{LinkMe\|[edibles]}}` |
| `numtostring` | `Numtostring` | [Goblin Rations.grubs](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/goblin-rations/subtables/grubs/table.json) | 2 | `{{Numtostring\|[Dice.2d6]}}` |
| `#ifeq` | `#ifeq` | [User:Serpentine Cougar.test3](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/user-serpentine-cougar/subtables/test3/table.json) | 10 | `{{#ifeq:{{#sub:[syl1]\|0\|1}}\|<\|{{#sub:[syl1]\|{{#expr:{{#pos:[syl1]\|>}}+1}}\|{{#expr:{{#rpos:[syl1]\|<}}-{{#pos:[syl1]\|>}}-1}}}}\|[syl1]}}` |
| `array implode` | `Array_implode` | [Psychon.starting_armour](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/psychon/subtables/starting-armour/table.json) | 1 | `{{Array_implode\|[norepeat_get_three_armour]\|,&#32;}}` |
| `array norepeat` | `Array_norepeat` | [Psychon.norepeat_get_three_armour](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/psychon/subtables/norepeat-get-three-armour/table.json) | 1 | `{{Array_norepeat\| {{Array_norepeat\|[starting_armour_options]\|[starting_armour_options]}} \| [starting_armour_options] }}` |
| `currentyear` | `CURRENTYEAR` | [Chuck Norris Facts.main](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/chuck-norris-facts/subtables/main/table.json) | 56 | `{{CURRENTYEAR}}` |
| `dieroll` | `DieRoll` | [Drinking Binge.drink](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/drinking-binge/subtables/drink/table.json) | 1 | `{{DieRoll\|title=Gold pieces\|dice=1d20x4+5}}` |
| `fc` | `fc` | [Bad Year in Bear Lake.m_end](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/bad-year-in-bear-lake/subtables/m-end/table.json) | 10 | `{{fc\|\|#FCC\|debug_line}}` |
| `font color` | `Font Color` | [Jgbaxter.Personality Sins and Virtues.Disposition](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/jgbaxter-personality-sins-and-virtues/subtables/disposition/table.json) | 1 | `{{Font Color\|red\|☺}}` |
| `psychon norepeat` | `Psychon_norepeat` | [Psychon.norepeat_get_two_armour](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/psychon/subtables/norepeat-get-two-armour/table.json) | 1 | `{{Psychon_norepeat\|[starting_armour_options]\|[starting_armour_options]\|, }}` |
| `sgdisplaygreatertemplate` | `SGDisplayGreaterTemplate` | [Jgbaxter.Personality Sins and Virtues.Disposition](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/jgbaxter-personality-sins-and-virtues/subtables/disposition/table.json) | 1 | `{{SGDisplayGreaterTemplate\|[TraitLevelLow}}` |

## Template Dependencies

The archived template definitions reveal helper operations that are not all named directly in selectable table rows. These are implementation dependencies if the original templates are interpreted; a tested native implementation can provide the same behavior without exposing every helper as a public macro.

Additional helper names beyond the selectable-row list: `!`, `#if`, `#ifexist`, `#len`, `#switch`, `p`. The pipe helpers `!` and `p` produce the same literal character. Do not count template documentation examples such as Purge as runtime requirements.

| Archived Template | Page ID | Revision ID | Operational Dependencies or Alias |
| --- | ---: | ---: | --- |
| Template:Article | 2166 | 29088 | `lcfirst`, `lc`, `#sub`, `#ifeq` |
| Template:Ia | 2227 | 7648 | Alias of Template:Article |
| Template:Plural | 2271 | 39767 | `lc`, `#sub`, `#ifeq`, `#if` |
| Template:Po | 3854 | 28408 | `lc`, `#sub`, `#ifeq`, `#if` |
| Template:Pronoun | 4503 | 37261 | `#ifeq`, `#replace` |
| Template:Concat | 4415 | 36814 | `#sub`, `#expr`, `#len`, `#ifeq` |
| Template:Comma | 4421 | 36137 | Literal output |
| Template:Numtostring | 4487 | 36911 | `#switch` |
| Template:Array norepeat | 4678 | 40044 | `#if`, `#pos`, `!` |
| Template:Array implode | 4680 | 40163 | `#if`, `#ifeq`, `#rpos`, `#replace`, `#sub`, `#expr`, `!` |
| Template:Psychon norepeat | 4677 | 40153 | `#if`, `#ifeq`, `#rpos`, `#replace`, `#sub`, `#expr`, `!` |
| Template:Link | 2459 | 24321 | `#ifeq`, `#sub`, `#if`, `p` |
| Template:Hover | 3926 | 29258 | `#ifeq` |
| Template:LinkMe | 4119 | 33476 | `#ifexist`, `hover` |
| Template:Font Color | 2593 | 24734 | `#if` |
| Template:Fc | 3626 | 24551 | Alias of Template:Font Color |
| Template:DieRoll | 2225 | 7617 | Clickable dice span interpreted by the original wiki's browser code |
| Template:SGDisplayGreaterTemplate | 2597 | 11036 | sgdisplay |
| Template:! | 4494 | 37032 | Literal output |
| Template:P | 2458 | 35009 | Literal output |

Evidence comes from the latest retained revisions in the source checkout's `archive/source-export/spycraftrandom_generatorcom-20200209-history.xml`, SHA-256 `0469074d589f473c8078103effddd56a915a5a01c5b63d1ed3c5e32f4261aef9`. That XML export is not tracked by the upstream Git repository, so its hash is recorded separately from the table-data commit. The reviewed metadata is maintained in [macro-requirements.json](../explorer/tools/macro-requirements.json); the scan does not reread the large XML archive on every run.

## Additional Source Syntax

There are 11 brace-structure diagnostics in parsed wiki entries and 13 additional macro occurrences found in raw table source but not matched to parsed entries. Their line numbers and examples are in the JSON report. Raw-only expressions have unknown execution weight and are not added to the selectable-row counts.

Macro names observed only outside selectable, well-formed rows:

- `!`: 7 occurrences; 7 zero-weight, 0 malformed.
- `#len`: 2 occurrences; 2 zero-weight, 0 malformed.
- `ie took out re-roll calls`: 1 occurrences; 1 zero-weight, 0 malformed.

Local JavaScript/JSON data contains 1 double-brace macro names; text wordlists contain 0 double-brace macro occurrences.

The local double-brace usages are `ucfirst` strings in `CompassDirection` and `TerrainsCap`, repeated in the alternate old-object JSON collection. They mix legacy single-brace references with double-brace macro delimiters. These are not evidence of working classic macro support; source-brace repairs and an explicit compatibility decision are separate work. Prototype JSON payloads are inspected as stored data, not declared to be supported runtime schemas.

Raw-source exceptions are listed separately below. The `subst:Generator start` calls are wiki authoring/scaffolding syntax, not an additional per-roll operation. Other raw-only cases include parser-damaged or omitted rows; a balanced outer macro does not validate its inner references.

| Source Table | Raw-Source Line | Macro | Outer Call Closed | Example |
| --- | ---: | --- | --- | --- |
| [Magical Pilgrimage Generator.requests](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/magical-pilgrimage-generator/subtables/requests/table.json) | 12 | `article` | No | `{{Article\|[GTFTJ] 2,studying your spellbook for hidden writings 2,befriending an enemy 1,racing them to {{Article\|[MPGplacenameA]}} of [MPGplacenameB] 2,adopting pacifism in your next adventure, tell no one why 2,building a statue in tribut` (truncated) |
| [Marriedto.mod{{#expr:{{#time: U  /  now }} mod 10}}](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/marriedto/subtables/mod-expr-time-u-now-mod-10/history/2017-11-18T18-57-41Z/table.json) | 1 | `#expr` | Yes | `{{#expr:{{#time: U \| now }} mod 10}}` |
| [Marriedto.mod{{#expr:{{#time: U  /  now }} mod 10}}](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/marriedto/subtables/mod-expr-time-u-now-mod-10/history/2017-11-18T18-57-41Z/table.json) | 1 | `#time` | Yes | `{{#time: U \| now }}` |
| [Marriedto.reldesc{{#expr:{{#time: U  /  now }} mod 10}}](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/marriedto/subtables/reldesc-expr-time-u-now-mod-10/history/2017-11-18T18-57-41Z/table.json) | 1 | `#expr` | Yes | `{{#expr:{{#time: U \| now }} mod 10}}` |
| [Marriedto.reldesc{{#expr:{{#time: U  /  now }} mod 10}}](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/marriedto/subtables/reldesc-expr-time-u-now-mod-10/history/2017-11-18T18-57-41Z/table.json) | 1 | `#time` | Yes | `{{#time: U \| now }}` |
| [Mothership adventure seed generator.main](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/mothership-adventure-seed-generator/subtables/main/table.json) | 2 | `subst` | Yes | `{{subst:Generator start  }}` |
| [Murder Ballad Adventure seed generator.main](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/murder-ballad-adventure-seed-generator/subtables/main/table.json) | 2 | `subst` | Yes | `{{subst:Generator start  }}` |
| [Planarch Codex Parish.job](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/planarch-codex-parish/subtables/job/table.json) | 2 | `ucfirst` | Yes | `{{ucfirst:[Elements.tablename]}}` |
| [Police Reports.BurglaryPet](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/police-reports/subtables/burglarypet/history/2015-07-03T05-52-38Z/table.json) | 7 | `lc` | No | `{{lc:[Dog Description.ShortBreed])} 1,fish [Animal.animalother] 1,goat 1,horse 1,insects, [Animal.animalinsect]s 1,reptile, [Animal.animalreptile] 1,rodent 1,snake     <!-- PREAMBLE -->` |
| [Police Reports.LarcenyPet](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/police-reports/subtables/larcenypet/table.json) | 7 | `lc` | No | `{{lc:[Dog Description.ShortBreed])} 1,fish [Animal.animalother] 1,goat 1,horse 1,insects, [Animal.animalinsect]s 1,reptile, [Animal.animalreptile] 1,rodent 1,snake     <!-- PREAMBLE -->` |
| [Shadowrun Border Crossing Generator.WaterCrossing](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/shadowrun-border-crossing-generator/subtables/watercrossing/table.json) | 5 | `article` | No | `{{Article\|[Shadowrun Utility.AAA] Corp cargo vessel is on a nearby waterway. 27, 27, 25, 36,Speed boats patrol the area nearby. 16,[Patrol] Patrol notices the group. 4,Naval (green or brown water) ship is nearby on a major waterway.` |
| [The World's Unknown.s](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/the-world-s-unknown/subtables/s/table.json) | 3 | `uc` | No | `{{uc: 1,<ul>` |
| [Wampus Country Henchpersons and Hangers-On.ananimate](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/wampus-country-henchpersons-and-hangers-on/subtables/ananimate/table.json) | 9 | `article` | Yes | `{{Article\|[adescriptors]}}` |

Separate syntax candidates, not automatically additional macros:

| Syntax | Source Tables or Definitions | Occurrences |
| --- | ---: | ---: |
| percent-delimited candidate | 87 | 242 |
| non-simple single-brace expression | 63 | 202 |
| single-brace table reference | 770 | 3,830 |
| double-bracket wiki link | 21 | 24 |
| generator extension tag | 17 | 88 |

Ordinary table references and dice tables are data references, not new macros. Candidate syntax requires source review; a percent sign or wiki link is not proof that a new operation is needed. The JSON report includes examples and source states.

The classic generator only expands simple word-like identifiers inside single braces. Existing non-simple references with spaces, punctuation, or non-ASCII characters, and inline dice-like strings such as `{d8*10}` and `{1d3+2}`, need a separate compatibility audit. None were rewritten by this scan.

## Composition Requirements

The bounded parser supports multiple and nested operations. These source patterns also include tables that remain blocked by invalid arguments, dependencies, or resource limits:

| Pattern | Tables | Rows |
| --- | ---: | ---: |
| `ucfirst(ia)` | 29 | 34 |
| `ia + ia` | 16 | 19 |
| `ucfirst + ucfirst` | 15 | 40 |
| `ucfirst + ucfirst + ucfirst` | 13 | 34 |
| `ucfirst(pronoun)` | 10 | 10 |
| `plural + plural` | 9 | 14 |
| `#replace(#replace)` | 5 | 8 |
| `article + article` | 5 | 8 |
| `lc(ia)` | 5 | 6 |
| `lcfirst(ia)` | 5 | 5 |
| `uc + uc` | 4 | 4 |
| `ucfirst + ucfirst + ucfirst + ucfirst` | 3 | 3 |
| `#sub(#expr(#pos), #expr(#rpos, #pos))` | 2 | 2 |
| `array norepeat(array norepeat)` | 2 | 2 |
| `hover + hover` | 2 | 3 |

## Other Blocking Causes

Macro support alone will not clear quarantine. Current manifest diagnostics count distinct tables per issue; a table can have multiple issues.

| Validation Issue | Imported Tables |
| --- | ---: |
| `blocked_dependency` | 5,084 |
| `invalid_weight` | 815 |
| `unsupported_reference` | 788 |
| `empty_table` | 782 |
| `missing_reference` | 726 |
| `cycle` | 669 |
| `unsupported_syntax` | 551 |
| `expansion_limit` | 439 |
| `unsupported_macro_expression` | 372 |
| `source_warning` | 168 |
| `unsupported_runtime_expression` | 70 |
| `unsupported_ucfirst` | 60 |
| `unsafe_html` | 26 |
| `source_unresolved` | 10 |
| `unsupported_po` | 10 |

## Reproduce

From the repository root:

```sh
node --test explorer/tests/macro-inventory.test.cjs
node explorer/tools/inventory-macros.cjs --source ../random-generator-com-wiki-dump --output Docs
```

Current membership follows page manifests. Only explicitly imported historical definitions enter the separate historical and combined catalog totals; unused retained revisions remain outside the backlog. Source archives are not counted again as separate tables. Raw source is compared with parsed entries for coverage gaps; template implementations and transitive template dependencies are not added to direct table-usage counts.

The scanner reads wiki content as JSON and text, never as executable code. Local JavaScript data definitions are evaluated only in an isolated, time-limited development VM to preserve their actual registration and range semantics. No browser runtime or server dependency is introduced. Existing output files are never overwritten unless their contents are identical.

Full per-occurrence evidence: [macro-inventory.json](macro-inventory.json). Scanner: [inventory-macros.cjs](../explorer/tools/inventory-macros.cjs).
{% endraw %}
