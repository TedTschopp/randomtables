# Quarantine Recovery Report

Snapshot: 2026-09-07. Source revision: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

The imported catalog contains **20,291 ready** and **5,457 quarantined** tables. This report changes neither source data nor readiness.

The **408 current tables that are not imported** remain outside this repair scope. No new contributor or table is imported, and no global alias is proposed.

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

The graph has **2,472 repair components**, including **442 cyclic components**. **2,858 tables have only dependency diagnostics**; **3,004 depend on multiple repair components**. Unexplained blocked tables: 0.

## Blocker Families

| Family | Locally Implicated Tables | Components | Reach | Single-Family Conditional Recovery |
| --- | ---: | ---: | ---: | ---: |
| Missing, ambiguous, or unsupported references | 970 | 936 | 3,477 | 1,085 |
| Empty tables, weights, or extraction warnings | 621 | 621 | 1,292 | 770 |
| Recursive generation | 880 | 551 | 2,949 | 685 |
| Expressions or malformed source syntax | 493 | 488 | 2,311 | 233 |
| Unsafe source markup | 23 | 23 | 60 | 16 |
| Expansion or validation limits | 365 | 309 | 713 | 1 |

Families classify recorded diagnostics, not verified independent causes. Generic syntax errors can be secondary to missing references or macro argument failures.

## Ranked Repair Components

Ordered by conditional recovery, then reach. Source links open preserved local archives; complete memberships and blocker sets are in the [JSON report](quarantine-report.json).

| Rank | Component | Conditional Recovery | Reach | Downstream | Confidence | Effort |
| ---: | --- | ---: | ---: | ---: | --- | --- |
| 1 | [Utility.Jewels](../tables/abulafia/source/1625.json) | 106 | 881 | 880 | low | small to large |
| 2 | [Secret Society Title.TitleDescriptor](../tables/abulafia/source/1611.json) | 71 | 1,394 | 1,393 | low | medium to large |
| 3 | [Forgotten Realms Icons.MacGuffin](../tables/abulafia/source/3378.json) + [Forgotten Realms Icons.map of](../tables/abulafia/source/3378.json) | 36 | 39 | 37 | low | large |
| 4 | [Hoard Class.jewelry](../tables/abulafia/source/4096.json) | 21 | 71 | 70 | low | small to large |
| 5 | [Fish People Names.CoreChance](../tables/abulafia/source/1940.json) + [Fish People Names.Noncapitalized](../tables/abulafia/source/1940.json) | 18 | 666 | 664 | low | large |
| 6 | [Traps.Trap](../tables/abulafia/source/2328.json) + [Traps.TrapContents](../tables/abulafia/source/2328.json) | 17 | 49 | 47 | low | large |
| 7 | [FantasyMenu.VeggiesCookable](../tables/abulafia/source/1537.json) | 16 | 949 | 948 | low | large |
| 8 | [The Blues Engine.interjection](../tables/abulafia/source/3896.json) | 16 | 30 | 29 | medium | medium |
| 9 | [ODnD Wilderness Encounter Cruncher.lair35](../tables/abulafia/source/3258.json) | 15 | 15 | 14 | medium | medium |
| 10 | [Fantasy-CC-Main-Events.DEITIES](../tables/abulafia/source/4746.json) | 14 | 153 | 152 | low | large |
| 11 | [Metamorphica.creatures](../tables/abulafia/source/4029.json) + [Metamorphica.fantasticcreatures](../tables/abulafia/source/4029.json) (+1 more) | 14 | 15 | 12 | low | large |
| 12 | [Poetic Destinations.Place](../tables/abulafia/source/1571.json) | 13 | 622 | 621 | low | small to large |
| 13 | [ClothingFemale.Cloth\_Color](../tables/abulafia/source/1517.json) | 13 | 505 | 504 | low | small to large |
| 14 | [Dungeon Stocker.Animals](../tables/abulafia/source/3669.json) | 13 | 15 | 14 | medium | medium |
| 15 | [Far East Plot Oracle.Male Name](../tables/abulafia/source/2473.json) | 11 | 20 | 19 | low | small to large |
| 16 | [Inn Patrons.SoupType](../tables/abulafia/source/3123.json) | 11 | 11 | 10 | low | small to large |
| 17 | [Quick Starting Equipment.cloth](../tables/abulafia/source/3068.json) | 10 | 21 | 20 | low | small to large |
| 18 | [Random Fantasy Entertainer.cloth](../tables/abulafia/source/4666.json) | 10 | 16 | 15 | low | small to large |
| 19 | [Star Wars Plot Generator.gueststar](../tables/abulafia/source/3808.json) | 9 | 13 | 12 | low | small to large |
| 20 | [CoatOfArms.Monsters](../tables/abulafia/source/3980.json) | 7 | 301 | 300 | low | small to large |

## Case-Correction Review Batch

Only components with verified selectable source tokens and no remaining local diagnostic outside missing-reference resolution qualify. Case folding is used to suggest candidates, never to merge or resolve IDs. Zero-weight rows do not qualify.

The current batch is empty. Case-only candidates that are themselves blocked, ambiguous matches, and absent targets remain excluded.

The JSON report records the empty batch and retains the remaining reference classifications and blocker sets.

## Source Evidence

### 1. Utility.Jewels

Conditional recovery: **106**. Reach: **881**. Confidence: **low**. Effort: small to large.

Diagnostics: `missing_reference`, `source_unresolved`, `unsupported_reference`.

- Utility.Jewels, entry 17, weight 4, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/utility/subtables/jewels/table.json): `[MagicalWondrous.Gemstones]`
- Utility.Jewels, entry 1, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/utility/subtables/jewels/table.json): `Dragon’s Breath Amethyst`
- Target `MagicalWondrous.Gemstones`: absent-from-import; no case-only candidate in the import.

Evidence basis: No case-only target exists in the imported catalog; the correct replacement has not been established.

Proposed repair:

- Inspect the current source namespace and retained history for the absent target; absence from the import does not prove the source was lost. Do not invent a substitute or import another contributor implicitly.
- Review exact reference tokens and source history; record explicit table-scoped corrections without adding global aliases or changing identifiers.

### 2. Secret Society Title.TitleDescriptor

Conditional recovery: **71**. Reach: **1,394**. Confidence: **low**. Effort: medium to large.

Diagnostics: `unsupported_syntax`.

- Secret Society Title.TitleDescriptor, entry 1, weight 10, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/secret-society-title/subtables/titledescriptor/table.json): `Most [TitleDescriptor]]`
- Secret Society Title.TitleDescriptor, entry 2, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/secret-society-title/subtables/titledescriptor/table.json): `Able`

Evidence basis: The recorded dependency graph omits a possible self-reference in malformed source.

Proposed repair:

- The unrecorded self-reference may introduce a new cycle after delimiter repair. Do not count a bracket-only edit as recovery.
- Distinguish malformed delimiters, unsupported reference operators, and argument restrictions from unsupported macro names before implementing a conversion rule.

### 3. Forgotten Realms Icons.MacGuffin + Forgotten Realms Icons.map of

Conditional recovery: **36**. Reach: **39**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Forgotten Realms Icons.MacGuffin, entry 8, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/forgotten-realms-icons/subtables/macguffin/table.json): `a map [map of]`
- Forgotten Realms Icons.MacGuffin, entry 19, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/forgotten-realms-icons/subtables/macguffin/table.json): `{{Article\|[lost artifacts]}}`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 4. Hoard Class.jewelry

Conditional recovery: **21**. Reach: **71**. Confidence: **low**. Effort: small to large.

Diagnostics: `missing_reference`, `unsupported_reference`.

- Hoard Class.jewelry, entry 1, weight 20, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/hoard-class/subtables/jewelry/table.json): `[Jewelry.startItemOnly] worth [Dice.1d4]0 gp`
- Hoard Class.jewelry, entry 2, weight 10, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/hoard-class/subtables/jewelry/table.json): `[Jewelry.startItemOnly] worth [Dice.2d4]0 gp`
- Target `Jewelry.startItemOnly`: unique-case-blocked; `Jewelry.StartItemOnly` (blocked).

Evidence basis: The proposed target adds unresolved blockers that are absent from the current graph estimate.

Proposed repair:

- A case-only candidate is itself blocked. Confirm the mapping and repair that target as well; correcting spelling alone cannot make this table ready.
- Review exact reference tokens and source history; record explicit table-scoped corrections without adding global aliases or changing identifiers.

### 5. Fish People Names.CoreChance + Fish People Names.Noncapitalized

Conditional recovery: **18**. Reach: **666**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Fish People Names.CoreChance, entry 2, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fish-people-names/subtables/corechance/table.json): `[Noncapitalized]`
- Fish People Names.CoreChance, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fish-people-names/subtables/corechance/table.json): ``

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 6. Traps.Trap + Traps.TrapContents

Conditional recovery: **17**. Reach: **49**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Traps.Trap, entry 1, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/traps/subtables/trap/table.json): `[TrapContents] inside [TrapAdverb] hidden pits`
- Traps.Trap, entry 2, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/traps/subtables/trap/table.json): `[TrapTriggers] connected up to [TrapMissiles]`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 7. FantasyMenu.VeggiesCookable

Conditional recovery: **16**. Reach: **949**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- FantasyMenu.VeggiesCookable, entry 4, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasymenu/subtables/veggiescookable/table.json): `[VeggiesCookable] and [VeggiesCookable]`
- FantasyMenu.VeggiesCookable, entry 1, weight 15, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasymenu/subtables/veggiescookable/table.json): `[VeggiesMundane]`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 8. The Blues Engine.interjection

Conditional recovery: **16**. Reach: **30**. Confidence: **medium**. Effort: medium.

Diagnostics: `source_warning`.

- The Blues Engine.interjection, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/the-blues-engine/subtables/interjection/table.json): `[ij],`
- Extractor warning: `Line 324: preserved nonstandard row before first entry: 0 NOTE: trailing spc!`

Evidence basis: The recorded defect is identifiable; repair semantics and post-repair dependencies still require validation.

Proposed repair:

- Review archived raw source and extractor warnings; recover verified rows through documented corrections, preserving weights and leaving genuinely empty sources blocked.

### 9. ODnD Wilderness Encounter Cruncher.lair35

Conditional recovery: **15**. Reach: **15**. Confidence: **medium**. Effort: medium.

Diagnostics: `empty_table`, `invalid_weight`, `source_warning`.

- ODnD Wilderness Encounter Cruncher.lair35, raw source, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/odnd-wilderness-encounter-cruncher/subtables/lair35/table.json): `;lair35 7;(in lair) 13;(not in lair)`
- Extractor warning: `Line 323: preserved nonstandard row before first entry: 7;(in lair)`
- Extractor warning: `Line 324: preserved nonstandard row before first entry: 13;(not in lair)`

Evidence basis: The recorded defect is identifiable; repair semantics and post-repair dependencies still require validation.

Proposed repair:

- Review archived raw source and extractor warnings; recover verified rows through documented corrections, preserving weights and leaving genuinely empty sources blocked.

### 10. Fantasy-CC-Main-Events.DEITIES

Conditional recovery: **14**. Reach: **153**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Fantasy-CC-Main-Events.DEITIES, entry 13, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasy-cc-main-events/subtables/deities/table.json): `Evil version of [DEITIES]`
- Fantasy-CC-Main-Events.DEITIES, entry 1, weight 4, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasy-cc-main-events/subtables/deities/table.json): `Ancestor Worship`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

## Recorded Diagnostics

Counts are distinct tables per diagnostic code. One source defect can produce several codes; these are not separate recoverable-table counts.

| Diagnostic | Tables |
| --- | ---: |
| `blocked_dependency` | 4,262 |
| `unsupported_reference` | 970 |
| `missing_reference` | 795 |
| `invalid_weight` | 580 |
| `empty_table` | 549 |
| `cycle` | 495 |
| `unsupported_syntax` | 493 |
| `unsupported_macro_expression` | 363 |
| `expansion_limit` | 317 |
| `unsupported_runtime_expression` | 86 |
| `unsupported_ucfirst` | 74 |
| `source_warning` | 46 |
| `unsafe_html` | 23 |
| `unsupported_po` | 12 |
| `source_unresolved` | 5 |

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

Manifest: [source manifest](../tables/abulafia/manifest.json), SHA-256 `41d51505b142920c5a6681ae9a3581ef18b1dee3ff47988261b1f47734765fd8`.

Evidence: 566 inspected source archives. Input hashes, source links, per-table blocker sets, case candidates, and every ranked component are retained in [quarantine-report.json](quarantine-report.json).
