# Complete Case Repair

This checkpoint applies 1,438 source-bound capitalization corrections across
408 imported tables. It enables 192 additional tables and removes every
identified case-only reference problem without rewriting original sources.
The application remains HTML/browser-only and works directly from local files.

## Result

| Scope | Imported | Ready | Blocked |
| --- | ---: | ---: | ---: |
| Current corpus | 26,156 | 21,161 | 4,995 |
| Imported history | 6,099 | 4,486 | 1,613 |
| Total wiki catalog | 32,255 | 25,647 | 6,608 |

The 192 newly ready tables comprise 126 static and 66 wiki-runtime tables,
including 162 current and 30 historical definitions. Of the 408 directly
corrected sources, 98 become ready and 310 retain unrelated blockers; another
94 dependent tables become ready. Ready totals are now 24,562 static and 1,085
wiki-runtime tables.

The Atlas contains 33,378 total tables and 57,013 relationships. Its unresolved
target count falls from 1,048 to 842. The
[remaining-reference inventory](../missing-unresolved-references.md) contains
834 absent definitions and eight exact-name references still unresolved in the
source graph. No case-only or ambiguous-case candidates remain.

## Correction Coverage

| Correction Kind | Rules |
| --- | ---: |
| Case mismatch in the parsed target name | 615 |
| Visible token case mismatch with an already canonical parsed target | 823 |
| Total row/token approvals | 1,438 |

These rules cover 1,703 original reference occurrences in 324 current and
84 historical source tables. All 206 case-only target names from the preceding
missing-reference inventory are covered. The wider source scan also found
token-case mistakes that did not appear as missing names because the parser
already identified the correct target.

The [approval file](../../explorer/tools/all-case-reference-corrections.json)
records the original source file/hash, row/hash, weight, token, reference count,
and exact target ID/hash for each change. A rule may have identical `from` and
`to` values when only its visible `raw` token was wrong.

Two approved zero-weight rows remain unselectable, retain their original text,
and contribute no executable dependencies. Only their source-graph targets
change. Corrections to blocked targets do not make those targets runnable.

Two page-only corrections retain the exact `plaidshirtA` and `plaidshirtC`
subtable spellings when differently cased definitions coexist. Three explicit
`simplecolors` page-alias approvals require the pinned extractor's recorded
`Simple Colors` target and a unique compact page identity. No global
case-insensitive lookup, whitespace matching, runtime alias, or table rename
was added.

## Preserved Behavior

- All 25,455 previously ready compiled table objects remain identical.
- All 2,170 source archives remain byte-identical, including raw rows and weights.
- Table IDs, exact names, membership, contributor selection, and attribution remain unchanged.
- Earlier case, source-extraction, and recursion approval files remain byte-identical.
- The compatibility bundle changes only summary counts; its tables, labels, aliases, and classic engine behavior are unchanged.
- Zero-weight rows stay at zero probability. Existing executable row weights are unchanged.

Missing definitions, invalid syntax or weights, unsafe markup, unsupported
recursion, and resource-limit failures still block execution. Correcting a
reference can reveal an existing cycle; it does not authorize that cycle.
The two existing bounded recursion policies and all execution limits remain
unchanged. The known macro-preflight cycle in `Secret Society Title.main`
is outside this repair pass and remains blocked.

## Verification

- 173 unit/integrity tests passed.
- 21 offline browser tests passed with HTTP requests blocked, including classic pages, desktop/mobile layouts, accessibility, traces, and source inspection.
- All 2,706 newly enabled compiled root choices were exercised with three deterministic dependency profiles: 8,118 rolls, zero warnings.
- The 18 empty outcomes were valid source choices. Maximum observed output was 1,473 characters, 65 calls, and depth 7.
- All 2,102 remaining target-row uses were matched to original text and weights in 367 hash-verified source archives.
- The guarded full import reproduced all 2,173 artifacts with zero writes.

The roll checks cover every newly enabled root choice, not every possible
Cartesian combination of dependent choices. Registration and rolling leave
the runtime registry and metadata unchanged. Desktop and mobile screenshots
are retained under the ignored browser-test output directory.

## Evidence

- [case-report.json](case-report.json): corrected sources, promotions, retained blockers, source-preservation evidence, and publication hashes.
- [roll-acceptance.json](roll-acceptance.json): per-table deterministic roll coverage and immutable runtime fingerprints.
- [Reviewed case rules](../../explorer/tools/all-case-reference-corrections.json): exact source-bound approvals and the unchanged pre-repair report basis.
- [Remaining references](../missing-unresolved-references.md) and [JSON details](../missing-unresolved-references.json): the complete current unresolved-reference inventory.
- [Quarantine report](../quarantine-report.md): all remaining root causes and dependent blockers.

Earlier [bracket/case](../repair-followup-2026-09-07/README.md) and
[recursion](../bounded-recursion-2026-09-07/README.md) evidence retains its original
checkpoint counts. Current catalog totals are reported above and in the
[manifest](../../tables/abulafia/manifest.json).
