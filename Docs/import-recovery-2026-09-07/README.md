# Current Import and Historical Recovery

Snapshot: 2026-09-07. Source commit: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

## Result

The requested operations were completed in order. The catalog now contains
**32,255 wiki tables: 25,222 ready and 7,033 quarantined**. It remains a static,
browser-only application. Open [Table Atlas](../../explorer/index.html) directly
from disk; the classic generator, roll, and print pages remain available.

| Checkpoint | Imported | Ready | Blocked |
| --- | ---: | ---: | ---: |
| Before these operations | 25,748 | 20,332 | 5,416 |
| After Step 1: all current tables | 26,156 | 20,685 | 5,471 |
| After Step 2: verified history and references | 32,255 | 25,222 | 7,033 |

The final catalog separates current membership from imported history:

| Scope | Tables | Ready | Blocked |
| --- | ---: | ---: | ---: |
| Current corpus | 26,156 | 20,850 | 5,306 |
| Imported historical definitions | 6,099 | 4,372 | 1,727 |

Current blockers decreased by **165** during Step 2. The higher combined blocked
count reflects newly preserved historical defects, not regressions in previously
ready tables. Ready imports comprise 24,393 static and 829 wiki-runtime tables.
Including existing local data and compatibility aliases, the explorer indexes
33,378 tables and 57,046 directed relationships.

## Step 1: Complete Current Membership

The five original seeds selected a contributor/dependency closure that omitted
408 current tables on 38 pages. All 408 already existed in the pinned checkout;
they were a selection gap, not missing source data.

Explicit all-current selection imports them separately: **353 ready and 55
blocked**. It preserves all 25,748 previous compiled table objects, including
20,332 ready tables, and all 1,554 previous source archives. Current source
archives increase to 1,592. No failed validation was waived to complete membership.

## Step 2: Recover Verified Definitions

The recovery investigates the original **183 unresolved target names** supported
by XML evidence. Complete dispositions are in
[recovery-targets.md](recovery-targets.md).

| Target Disposition | Names | Treatment |
| --- | ---: | --- |
| Baseline historical definition, ready | 98 | Restored with exact identity and source evidence |
| Baseline historical definition, blocked | 31 | Restored for inspection; still cannot roll |
| Identical renamed literal leaf | 7 | Explicit corrections at 12 bound call sites |
| Other renamed historical target | 47 | Withheld; existing IDs are not replaced or aliased |

The 129 baseline targets select their latest retained non-deleted definitions,
not their latest runnable revisions. Newer empty or defective definitions remain
empty or blocked. Contributor/dependency closure brings in **6,056 pinned-history
records** plus **43 collision-free XML records**, for 6,099 historical additions.
Of these additions, 4,372 are ready and 1,727 remain blocked.

All 54 additional-XML target names were old page-title forms sharing runtime IDs
with pinned definitions. Seven match warning-free literal leaves exactly: the
six `LotFP Spell Lists` levels now under `LAMENT Spell Lists`, and `Village.digit`
now under `DOG WIZARDS Villages and Hamlets.digit`. Their 12 exact row-level
corrections preserve original raw text and require matching identity, definition,
ordered text/weight pairs, token counts, and hashes. There are no global aliases.

Across the broader 883 additional historical-name identities in the census,
43 can be admitted safely, **829 collide with pinned IDs**, and **11 have
conflicting definitions within one revision**. The 43 admitted records are
separate from the 54 renamed targets; they do not create replacement identities
for those targets. Withheld XML snapshots remain available as evidence.

## Safeguards

- Import all available selected-contributor tables through the existing current
  and earliest-retained attribution/dependency closure; unknown users are not
  merged into a synthetic shared account.
- Preserve exact page/subtable IDs, case, punctuation, Unicode, empty subtable
  names, raw source, integer weights, and attribution. Do not rename empty IDs
  to `main`, infer converted colon weights, or substitute adapted source copies.
- Keep historical archives separate. All **20,685 previously ready compiled
  objects** and **1,592 current source archives** remain byte-identical after
  Step 2; existing compatibility aliases and classic behavior are unchanged.
- Preserve prior case-approval scope and current zero-weight reference metadata.
  Restored case variants cannot silently retarget an approved current reference.
- Retain missing, malformed, unsafe, cyclic, and over-budget records in quarantine.
  No recursion capability, macro support, or execution limit was added or relaxed.

The [refreshed quarantine report](../quarantine-report.md) includes the new
historical backlog and new, unapplied case-only review candidates. Graph reach
and conditional recovery estimates do not authorize repairs or guarantee readiness.
The former 408-not-imported and 492-not-found lists remain dated audit evidence,
not current catalog claims. Their original input hashes were not rewritten.

## Verification

- **149 unit/integrity tests passed**, including historical selection, attribution,
  collisions, source bindings, exact renamed-leaf evidence, and report guards.
- **18 offline Chrome browser tests passed**, with HTTP blocked. Checks include
  desktop/mobile layouts, accessibility, source inspection, historical quarantine,
  recovered references, and all three classic pages.
- **288,483 deterministic rolls** exercised every one of **96,161 newly selectable
  compiled choices** across 4,890 newly ready tables, with **zero warnings**.
  There are three dependency profiles per root choice, not every Cartesian
  combination. The 911 empty samples are valid source outcomes, not failures or
  an empirical probability estimate. Registry and metadata hashes stayed exact.
- All 1,663 retained XML snapshot files matched their evidence hashes. Dated
  comparison and census approval hashes remained unchanged.
- Production import regeneration wrote **zero files**. The refreshed quarantine
  report also reproduced with zero writes and verified all input hashes.

The app still contains 1,076 unresolved source-graph targets across current and
historical data, including preserved zero-weight references. These are not
missing browser downloads. The 47 unrepaired renamed targets and 31 blocked
restored target definitions require further content/dependency review.

## Reproduce

From the repository root, with the pinned source checkout alongside it and the
optional development dependencies installed:

```sh
node explorer/tools/import-abulafia.cjs --source ../random-generator-com-wiki-dump --all-current --recover-history --write
npm --prefix explorer test
ATLAS_BROWSER_CHANNEL=chrome npm --prefix explorer run test:browser
node explorer/tools/inventory-macros.cjs --source ../random-generator-com-wiki-dump
node explorer/tools/quarantine-report.cjs --output Docs
```

Omit `--write` for a dry run. Different existing generated files are rejected;
there is no force-overwrite mode. Optional report tools use Node only for
maintenance. The app itself needs no Node installation, source checkout, server,
or network. Older frozen archive-audit commands require their original input and
tool checkpoints; do not rebind old hashes to the expanded live catalog.

## Evidence

- [recovery-report.json](recovery-report.json): both sequential deltas, preservation
  checks, all target dispositions, new/promoted identities, and publication hashes.
- [roll-acceptance.json](roll-acceptance.json): per-table deterministic coverage,
  counts, bounds, and immutable runtime hashes.
- [recovery-targets.md](recovery-targets.md): all 183 original target names.
- [Recovery configuration](../../explorer/tools/historical-recovery.json): exact
  definition, deletion-snapshot, and reviewed call-site bindings.
- [XML evidence index](../../archive/abulafia-recovery/2026-09-07/manifest.json):
  admitted records, collisions, conflicting revisions, and local source snapshots.
- [Current manifest](../../tables/abulafia/manifest.json),
  [macro inventory](../macro-inventory.md), and
  [quarantine report](../quarantine-report.md): the published catalog and backlog.
