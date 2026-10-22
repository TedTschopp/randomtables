# Quarantine Recovery Report

Snapshot: 2026-09-08. Source revision: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

The imported catalog contains **25,716 ready** and **6,539 quarantined** tables. This report changes neither source data nor readiness.

The catalog includes **6,099 imported historical definitions**, separate from 26,156 current tables. Current tables with blockers: **4,933**; historical tables with blockers: **1,606**.

The **0 current tables that are not imported** remain outside this repair scope. No new contributor or table is imported, and no global alias is proposed.

## Recommendation

No eligible case-only corrections remain under the current safety rules.

Review the ranked source-data blockers next. Missing targets, malformed rows, and recursion still require separately approved repairs; this report does not authorize new imports or relaxed execution limits.

## How Counts Work

- A repair component is a table with local diagnostics, or a strongly connected group of tables that must be reviewed together. It can contain more than one defect.
- Reach counts each blocked table once per component, including the component itself. A shared descendant is not counted twice within that component.
- Conditional recovery counts tables whose complete recorded blocker set would be removed by repairing that component or the specified batch. It is a graph estimate, not a promise of readiness.
- New dependencies, previously unrecorded references, probabilities, and expansion costs must be checked again. These can reduce actual recovery; removing a shared compiler rejection may also enable additional tables not captured by this estimate.
- Component reach, diagnostic counts, and family totals overlap and must not be added. The single-family column includes only tables whose recorded blockers all belong exclusively to that family.
- Confidence describes evidence for a proposed repair, not certainty that the original author intended it. Effort is qualitative and is not a delivery estimate.

The graph has **2,948 repair components**, including **607 cyclic components**. **3,458 tables have only dependency diagnostics**; **3,392 depend on multiple repair components**. Unexplained blocked tables: 0.

## Blocker Families

| Family | Locally Implicated Tables | Components | Reach | Single-Family Conditional Recovery |
| --- | ---: | ---: | ---: | ---: |
| Recursive generation | 1,211 | 774 | 3,978 | 1,498 |
| Missing, ambiguous, or unsupported references | 788 | 766 | 3,426 | 1,019 |
| Empty tables, weights, or extraction warnings | 872 | 872 | 1,724 | 1,007 |
| Expressions or malformed source syntax | 551 | 546 | 2,198 | 235 |
| Unsafe source markup | 26 | 26 | 104 | 23 |
| Expansion or validation limits | 508 | 448 | 1,056 | 1 |

Families classify recorded diagnostics, not verified independent causes. Generic syntax errors can be secondary to missing references or macro argument failures.

## Ranked Repair Components

Ordered by conditional recovery, then reach. Source links open preserved local archives; complete memberships and blocker sets are in the [JSON report](quarantine-report.json).

| Rank | Component | Conditional Recovery | Reach | Downstream | Confidence | Effort |
| ---: | --- | ---: | ---: | ---: | --- | --- |
| 1 | [Utility.Jewels](../tables/abulafia/source/1625.json) | 146 | 1,020 | 1,019 | low | small to large |
| 2 | [Forgotten Realms Icons.MacGuffin](../tables/abulafia/source/3378.json) + [Forgotten Realms Icons.map of](../tables/abulafia/source/3378.json) | 49 | 55 | 53 | low | large |
| 3 | [Premade Pathfinder Character.Barbarian Rage Powers 3](../tables/abulafia/source/4578.json) | 38 | 47 | 46 | low | large |
| 4 | [Poetic Destinations.Place](../tables/abulafia/source/1571.json) | 32 | 729 | 728 | low | small to large |
| 5 | [Utility.GeometricSymbol](../tables/abulafia/source/1625.json) | 31 | 870 | 869 | low | large |
| 6 | [Fish People Names.CoreChance](../tables/abulafia/source/1940.json) + [Fish People Names.Noncapitalized](../tables/abulafia/source/1940.json) | 26 | 778 | 776 | low | large |
| 7 | [Jewelry.JewelryMaterial](../tables/abulafia/source/1558.json) | 24 | 674 | 673 | low | large |
| 8 | [Traps.Trap](../tables/abulafia/source/2328.json) + [Traps.TrapContents](../tables/abulafia/source/2328.json) | 22 | 56 | 54 | low | large |
| 9 | [Pathfinder Character Generator.Barbarian Rage Powers 3](../tables/abulafia/source/historical/4067.json) | 19 | 41 | 40 | low | large |
| 10 | [Far East Plot Oracle.Male Name](../tables/abulafia/source/2473.json) | 19 | 30 | 29 | low | small to large |
| 11 | [New Monster Name.main](../tables/abulafia/source/1681.json) | 18 | 483 | 482 | medium | multiple changes |
| 12 | [Fantasy Town Feature.inspiration](../tables/abulafia/source/1746.json) | 16 | 70 | 69 | low | small to large |
| 13 | [Mixed Pathfinder/3 5 Character Generator.Barbarian Rage Powers 3](../tables/abulafia/source/historical/4102.json) | 16 | 34 | 33 | low | large |
| 14 | [Weird Fantasy Monster.Monster](../tables/abulafia/source/2713.json) | 15 | 100 | 99 | low | small to large |
| 15 | [Fantasy Landmarks.inland](../tables/abulafia/source/1741.json) + [Fantasy Landmarks.ruins](../tables/abulafia/source/1741.json) | 14 | 658 | 656 | low | multiple changes |
| 16 | [Fantasy-CC-Main-Events.DEITIES](../tables/abulafia/source/4746.json) | 14 | 167 | 166 | low | large |
| 17 | [Metamorphica.creatures](../tables/abulafia/source/4029.json) + [Metamorphica.fantasticcreatures](../tables/abulafia/source/4029.json) (+1 more) | 14 | 15 | 12 | low | large |
| 18 | [Dungeon Stocker.Animals](../tables/abulafia/source/3669.json) | 13 | 15 | 14 | medium | medium |
| 19 | [SGNP byzantine greek.MALESURNAMESET](../tables/abulafia/source/1594.json) | 12 | 303 | 302 | low | large |
| 20 | [Quick Starting Equipment.cloth](../tables/abulafia/source/3068.json) | 11 | 25 | 24 | low | small to large |

## Case-Correction Review Batch

Only components with verified selectable source tokens and no remaining local diagnostic outside missing-reference resolution qualify. Case folding is used to suggest candidates, never to merge or resolve IDs. Zero-weight rows do not qualify.

The current batch is empty. Case-only candidates that are themselves blocked, ambiguous matches, and absent targets remain excluded.

The JSON report records the empty batch and retains the remaining reference classifications and blocker sets.

## Source Evidence

### 1. Utility.Jewels

Conditional recovery: **146**. Reach: **1,020**. Confidence: **low**. Effort: small to large.

Diagnostics: `missing_reference`, `source_unresolved`, `unsupported_reference`.

- Utility.Jewels, entry 17, weight 4, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/utility/subtables/jewels/table.json): `[MagicalWondrous.Gemstones]`
- Utility.Jewels, entry 1, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/utility/subtables/jewels/table.json): `Dragon’s Breath Amethyst`
- Target `MagicalWondrous.Gemstones`: absent-from-import; no case-only candidate in the import.

Evidence basis: No case-only target exists in the imported catalog; the correct replacement has not been established.

Proposed repair:

- Inspect the current source namespace and retained history for the absent target; absence from the import does not prove the source was lost. Do not invent a substitute or import another contributor implicitly.
- Review exact reference tokens and source history; record explicit table-scoped corrections without adding global aliases or changing identifiers.

### 2. Forgotten Realms Icons.MacGuffin + Forgotten Realms Icons.map of

Conditional recovery: **49**. Reach: **55**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Forgotten Realms Icons.MacGuffin, entry 8, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/forgotten-realms-icons/subtables/macguffin/table.json): `a map [map of]`
- Forgotten Realms Icons.MacGuffin, entry 19, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/forgotten-realms-icons/subtables/macguffin/table.json): `{{Article\|[lost artifacts]}}`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 3. Premade Pathfinder Character.Barbarian Rage Powers 3

Conditional recovery: **38**. Reach: **47**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Premade Pathfinder Character.Barbarian Rage Powers 3, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/premade-pathfinder-character/subtables/barbarian-rage-powers-3/table.json): `Abyssal Blood, Lesser (Excludes other groups of blood rage powers. (Alternative Power: [Barbarian Rage Powers 3]))`
- Premade Pathfinder Character.Barbarian Rage Powers 3, entry 8, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/premade-pathfinder-character/subtables/barbarian-rage-powers-3/table.json): `Atavism Totem, Lesser (Excludes other groups of blood rage powers. (Alternative Power: [Barbarian Rage Powers 3]))`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 4. Poetic Destinations.Place

Conditional recovery: **32**. Reach: **729**. Confidence: **low**. Effort: small to large.

Diagnostics: `missing_reference`, `unsupported_reference`.

- Poetic Destinations.Place, entry 62, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/poetic-destinations/subtables/place/table.json): `[Fantasy Place Name.postplace]`
- Poetic Destinations.Place, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/poetic-destinations/subtables/place/table.json): `Banks`
- Target `Fantasy Place Name.postplace`: absent-from-import; no case-only candidate in the import.

Evidence basis: No case-only target exists in the imported catalog; the correct replacement has not been established.

Proposed repair:

- Inspect the current source namespace and retained history for the absent target; absence from the import does not prove the source was lost. Do not invent a substitute or import another contributor implicitly.
- Review exact reference tokens and source history; record explicit table-scoped corrections without adding global aliases or changing identifiers.

### 5. Utility.GeometricSymbol

Conditional recovery: **31**. Reach: **870**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Utility.GeometricSymbol, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/utility/subtables/geometricsymbol/table.json): `[GeometricSymbol] in a [GeometricSymbol]`
- Utility.GeometricSymbol, entry 2, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/utility/subtables/geometricsymbol/table.json): `banner (as emblem)`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 6. Fish People Names.CoreChance + Fish People Names.Noncapitalized

Conditional recovery: **26**. Reach: **778**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Fish People Names.CoreChance, entry 2, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fish-people-names/subtables/corechance/table.json): `[Noncapitalized]`
- Fish People Names.CoreChance, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fish-people-names/subtables/corechance/table.json): ``

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 7. Jewelry.JewelryMaterial

Conditional recovery: **24**. Reach: **674**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Jewelry.JewelryMaterial, entry 6, weight 4, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/jewelry/subtables/jewelrymaterial/table.json): `[Utility.MetalPrecious] and [JewelryMaterial]`
- Jewelry.JewelryMaterial, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/jewelry/subtables/jewelrymaterial/table.json): `[Utility.Chitin] chitin`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 8. Traps.Trap + Traps.TrapContents

Conditional recovery: **22**. Reach: **56**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Traps.Trap, entry 1, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/traps/subtables/trap/table.json): `[TrapContents] inside [TrapAdverb] hidden pits`
- Traps.Trap, entry 2, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/traps/subtables/trap/table.json): `[TrapTriggers] connected up to [TrapMissiles]`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 9. Pathfinder Character Generator.Barbarian Rage Powers 3

Conditional recovery: **19**. Reach: **41**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Pathfinder Character Generator.Barbarian Rage Powers 3, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/pathfinder-character-generator/subtables/barbarian-rage-powers-3/history/2017-03-04T20-37-37Z/table.json): `Abyssal Blood, Lesser (Excludes other groups of blood rage powers. (Alternative Power: [Barbarian Rage Powers 3]))`
- Pathfinder Character Generator.Barbarian Rage Powers 3, entry 4, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/pathfinder-character-generator/subtables/barbarian-rage-powers-3/history/2017-03-04T20-37-37Z/table.json): `Beast Totem, Lesser (Excludes other groups of totem rage powers. (Alternative Power: [Barbarian Rage Powers 3]))`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 10. Far East Plot Oracle.Male Name

Conditional recovery: **19**. Reach: **30**. Confidence: **low**. Effort: small to large.

Diagnostics: `missing_reference`, `unsupported_reference`.

- Far East Plot Oracle.Male Name, entry 2, weight 5, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/far-east-plot-oracle/subtables/male-name/table.json): `[Japanese names.Male] [SGNP japanese.SURNAMES]`
- Far East Plot Oracle.Male Name, entry 1, weight 10, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/far-east-plot-oracle/subtables/male-name/table.json): `[ChineseMaleFirst] [ChineseMaleLast]`
- Target `Japanese names.Male`: absent-from-import; no case-only candidate in the import.

Evidence basis: No case-only target exists in the imported catalog; the correct replacement has not been established.

Proposed repair:

- Inspect the current source namespace and retained history for the absent target; absence from the import does not prove the source was lost. Do not invent a substitute or import another contributor implicitly.
- Review exact reference tokens and source history; record explicit table-scoped corrections without adding global aliases or changing identifiers.

## Recorded Diagnostics

Counts are distinct tables per diagnostic code. One source defect can produce several codes; these are not separate recoverable-table counts.

| Diagnostic | Tables |
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

## Required Verification

1. Bind every approved correction to source identity, original token, and source hash. Preserve archived text, weights, namespaced IDs, contributor coverage, and existing aliases.
2. Add a failing focused regression before changing conversion behavior. Verify exact target resolution and row probabilities, including zero-weight rows.
3. Recompile the complete selected corpus. Recompute dependencies, cycles, and worst-case costs without relaxing browser limits. Promote only tables that pass every guard.
4. Verify prior ready values and programs remain unchanged. Check every selectable row of newly ready runtime tables with deterministic dependency choices.
5. Run unit and artifact-integrity checks, then actual offline desktop/mobile browser acceptance for any promoted tables.

## Reproduce

This optional Node development tool reads the pinned manifest, the matching macro inventory, and hash-verified local source archives. The application itself still runs directly from HTML; no server is added.

```sh
node explorer/tools/quarantine-report.cjs --output Docs
npm --prefix explorer run test:quarantine
```

Omit `--output` for a read-only summary. Identical reports are left untouched; different existing reports, symbolic links, stale inventory hashes, or changed source evidence are rejected. Use a new existing output directory to review a later snapshot before replacing published reports.

Manifest: [source manifest](../tables/abulafia/manifest.json), SHA-256 `f02311f936f57ceebcb99f6705e6fe2f0c7d90d48f31736051a939db3b09684f`.

Evidence: 727 inspected source archives. Input hashes, source links, per-table blocker sets, case candidates, and every ranked component are retained in [quarantine-report.json](quarantine-report.json).
