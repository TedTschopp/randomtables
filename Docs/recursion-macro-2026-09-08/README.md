# Recursion-Aware Macro Recovery

The first recommended repair is complete. `Secret Society Title.main` and 68
other tables are now ready because macro preflight recognizes the two existing,
source-approved finite recursion policies. No additional recursion policy was
approved, and no missing source was substituted.

## Catalog Result

| Scope | Imported | Ready | Quarantined |
| --- | ---: | ---: | ---: |
| Current corpus | 26,156 | 21,223 | 4,933 |
| Imported history | 6,099 | 4,493 | 1,606 |
| Total wiki catalog | 32,255 | 25,716 | 6,539 |

The 69 promotions comprise 62 current and seven historical tables. All use the
wiki runtime. Ready totals are 24,562 static and 1,154 wiki-runtime tables.
The earlier graph estimate for the title component was 57; recompilation also
enables other callers affected by the shared compiler rejection.

The Atlas still has 33,378 tables, 57,013 relationships, and 842 unresolved
targets. The source graph retains the original recursive relationships.

## Compiler Repair

Macro validation previously walked raw self-references while calculating costs
and possible argument values. It rejected those cycles even when the importer
and results engine had a valid finite recursion policy for the dependency.

The [macro compiler](../../explorer/tools/compile-wiki-expressions.cjs) now uses
the [shared finite-policy validator](../../JS/wiki-recursion.js). The
[importer](../../explorer/tools/import-abulafia.cjs) supplies only policies whose
original source IDs, hashes, rows, text, and weights have already been checked.
Source corrections are projected before macro preflight. Final dependency
assessment and browser registration retain their independent validation.

Cost checks account for the approved bounded expansion and conservative
expression operations. Sensitive argument checks include both normal terminal
results and the approved compound results. Unique pairs exclude equal normalized
members. Invalid arithmetic, unapproved or mutual cycles, invalid terminals,
and oversized domains remain blocked.

The existing limits remain 32 table levels, 512 table calls, 4,096 expression
operations, and 32,768 output characters. Finite argument validation retains
its 4,096-value and 1 MiB limits. Nested recursive policies are not introduced.

## Preservation

- All 25,647 previously ready compiled table objects are unchanged.
- All 2,170 source archive files are byte-for-byte unchanged.
- Exact IDs, names, source hashes, contributors, recovery selection, and aliases
  are unchanged; no new table or contributor is imported.
- All case, source-extraction, historical-recovery, and recursion approval files
  remain unchanged. The malformed descriptor row stays intact in its archive.
- The complete classic compatibility bundle is byte-for-byte unchanged.
- Only the full compressed browser catalog and manifest change among generated
  import artifacts. Current reports are refreshed against their new hashes.
- The app remains static HTML and browser JavaScript, usable directly from disk.

## Validation

The compressed catalog registered successfully in the actual shared runtime.
All 373 positive-weight root rows across the 69 newly ready tables were rolled
with three deterministic dependency profiles: 1,119 rolls, zero warnings.
Coverage is every newly ready root choice, not every Cartesian combination.

There were 80 traced policy uses and 25 valid empty outcomes. Observed maxima
were 310 output characters, 34 table calls, and trace depth 7. Registry and
metadata hashes stayed unchanged throughout the rolls.

Focused importer/runtime tests verify both existing policy shapes through macro
cost and argument-domain validation, including the 4,096-value boundary and
call-budget rejection. Browser checks cover the actual title macro, unchanged
source rows and weights, approved policy traces, blocked roll controls, and
desktop/mobile layouts with HTTP requests blocked.

Final gates passed: 177 unit/integrity tests and 22 offline Chrome browser tests,
with no failures or skips. The standard full-import command reproduced all 2,173
artifacts with zero writes. The macro inventory and both current reports also
reproduced identical output; the guarded quarantine and reference writers each
reported zero writes. All 96 local documentation links resolved, and the root
README retained its CRLF line endings.

## Next Decisions

These are proposals, not new approvals. Both recursive tables remain inspectable
but blocked, and the existing two-policy approval file is unchanged.

| Order | Table | Recommended Next Action |
| ---: | --- | --- |
| 1 | `Secret Society Title.main` | Complete: approved finite recursion is recognized inside macros. |
| 2 | `Utility.GeometricSymbol` | Approve at most one generated `A in a B` layer, with repeated symbols allowed. Preserve literal source rows, including `eight-pointed star in a shield`. |
| 3 | `Jewelry.JewelryMaterial` | Approve one precious metal plus one distinct terminating material; no third recursively added material. Preserve weighted source paths and exclude equal normalized resolved materials only within this combination. |
| 4 | `Utility.Jewels` | Recover or explicitly replace the missing `MagicalWondrous.Gemstones` definition. Do not drop its weight-4 source row or guess an alias. |
| 5 | Mutually recursive groups and Pathfinder alternatives | Review their termination, exclusions, and probability rules independently after the simpler shared policies. |

The geometry combination row retains probability 1/25; the jewelry combination
row retains probability 4/54. Constraining child draws to terminating paths
would change conditional output probabilities. Distinct jewelry materials would
also require conditioning the second draw on the first resolved material.
These result rules need confirmation before implementation.

Current conditional recovery estimates are 31 for geometry, 24 for jewelry
materials, and 146 for the missing gemstone dependency. They overlap and are
not promises of readiness. `MagicalWondrous.Gemstones` was
[not found in inspected backup sources](../backup-comparison-2026-09-07/backup-report.md);
new source evidence or an explicit replacement decision is still required.

## Evidence

- [Recovery report](recovery-report.json): every promoted identity, preserved
  baseline, protected-file hashes, artifact changes, and refreshed report totals.
- [Roll acceptance](roll-acceptance.json): coverage and observed runtime bounds
  for each of the 69 newly ready tables.
- [Current quarantine report](../quarantine-report.md): ranked remaining blockers.
- [Current reference inventory](../missing-unresolved-references.md): all 842
  unresolved targets and their source rows.
- [Previous case-repair checkpoint](../complete-case-repair-2026-09-07/README.md):
  the unchanged dated baseline for this repair.
