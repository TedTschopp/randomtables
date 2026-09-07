# Quarantine Recovery Report

Snapshot: 2026-09-07. Source revision: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

The imported catalog contains **20,279 ready** and **5,469 quarantined** tables. This report changes neither source data nor readiness.

The **408 current tables that are not imported** remain outside this repair scope. No new contributor or table is imported, and no global alias is proposed.

## Recommendation

Review the **case-only reference corrections** first: 3 repair components reference 3 distinct misspelled target names, each with exactly one case-only match already imported and ready.

Their combined conditional recovery is **12 tables**, calculated as a union rather than a sum. Their total reach is 1,082 blocked tables; other defects still prevent recovery of the remainder.

These are review candidates, not automatic corrections. Preserve original spelling in the archive and record any approved mapping against its source table, row, and hash.

## How Counts Work

- A repair component is a table with local diagnostics, or a strongly connected group of tables that must be reviewed together. It can contain more than one defect.
- Reach counts each blocked table once per component, including the component itself. A shared descendant is not counted twice within that component.
- Conditional recovery counts tables whose complete recorded blocker set would be removed by repairing that component or the specified batch. It is a graph estimate, not a promise of readiness.
- New dependencies, previously unrecorded references, probabilities, and expansion costs must be checked again. These can reduce actual recovery; removing a shared compiler rejection may also enable additional tables not captured by this estimate.
- Component reach, diagnostic counts, and family totals overlap and must not be added. The single-family column includes only tables whose recorded blockers all belong exclusively to that family.
- Confidence describes evidence for a proposed repair, not certainty that the original author intended it. Effort is qualitative and is not a delivery estimate.

The graph has **2,443 repair components**, including **442 cyclic components**. **2,902 tables have only dependency diagnostics**; **3,045 depend on multiple repair components**. Unexplained blocked tables: 0.

## Blocker Families

| Family | Locally Implicated Tables | Components | Reach | Single-Family Conditional Recovery |
| --- | ---: | ---: | ---: | ---: |
| Missing, ambiguous, or unsupported references | 973 | 939 | 3,627 | 1,097 |
| Empty tables, weights, or extraction warnings | 621 | 621 | 1,292 | 770 |
| Recursive generation | 880 | 551 | 2,949 | 680 |
| Expressions or malformed source syntax | 493 | 488 | 2,311 | 165 |
| Unsafe source markup | 23 | 23 | 60 | 16 |
| Expansion or validation limits | 311 | 265 | 681 | 1 |

Families classify recorded diagnostics, not verified independent causes. Generic syntax errors can be secondary to missing references or macro argument failures.

## Ranked Repair Components

Ordered by conditional recovery, then reach. Source links open preserved local archives; complete memberships and blocker sets are in the [JSON report](quarantine-report.json).

| Rank | Component | Conditional Recovery | Reach | Downstream | Confidence | Effort |
| ---: | --- | ---: | ---: | ---: | --- | --- |
| 1 | [Utility.Jewels](../tables/abulafia/source/1625.json) | 106 | 881 | 880 | low | small to large |
| 2 | [Secret Society Title.TitleDescriptor](../tables/abulafia/source/1611.json) | 45 | 1,394 | 1,393 | low | medium to large |
| 3 | [Forgotten Realms Icons.MacGuffin](../tables/abulafia/source/3378.json) + [Forgotten Realms Icons.map of](../tables/abulafia/source/3378.json) | 36 | 39 | 37 | low | large |
| 4 | [Hoard Class.jewelry](../tables/abulafia/source/4096.json) | 21 | 71 | 70 | low | small to large |
| 5 | [Traps.Trap](../tables/abulafia/source/2328.json) + [Traps.TrapContents](../tables/abulafia/source/2328.json) | 17 | 49 | 47 | low | large |
| 6 | [FantasyMenu.VeggiesCookable](../tables/abulafia/source/1537.json) | 16 | 949 | 948 | low | large |
| 7 | [The Blues Engine.interjection](../tables/abulafia/source/3896.json) | 16 | 30 | 29 | medium | medium |
| 8 | [ODnD Wilderness Encounter Cruncher.lair35](../tables/abulafia/source/3258.json) | 15 | 15 | 14 | medium | medium |
| 9 | [Fantasy-CC-Main-Events.DEITIES](../tables/abulafia/source/4746.json) | 14 | 153 | 152 | low | large |
| 10 | [Metamorphica.creatures](../tables/abulafia/source/4029.json) + [Metamorphica.fantasticcreatures](../tables/abulafia/source/4029.json) (+1 more) | 14 | 15 | 12 | low | large |
| 11 | [Fish People Names.CoreChance](../tables/abulafia/source/1940.json) + [Fish People Names.Noncapitalized](../tables/abulafia/source/1940.json) | 13 | 666 | 664 | low | large |
| 12 | [Poetic Destinations.Place](../tables/abulafia/source/1571.json) | 13 | 622 | 621 | low | small to large |
| 13 | [ClothingFemale.Cloth\_Color](../tables/abulafia/source/1517.json) | 13 | 505 | 504 | low | small to large |
| 14 | [Dungeon Stocker.Animals](../tables/abulafia/source/3669.json) | 13 | 15 | 14 | medium | medium |
| 15 | [Far East Plot Oracle.Male Name](../tables/abulafia/source/2473.json) | 11 | 20 | 19 | low | small to large |
| 16 | [Inn Patrons.SoupType](../tables/abulafia/source/3123.json) | 11 | 11 | 10 | low | small to large |
| 17 | [Quick Starting Equipment.cloth](../tables/abulafia/source/3068.json) | 10 | 21 | 20 | low | small to large |
| 18 | [Random Fantasy Entertainer.cloth](../tables/abulafia/source/4666.json) | 10 | 16 | 15 | low | small to large |
| 19 | [Secret Society Title.Noun](../tables/abulafia/source/1611.json) | 9 | 1,074 | 1,073 | high | small |
| 20 | [CoatOfArms.Monsters](../tables/abulafia/source/3980.json) | 7 | 301 | 300 | low | small to large |

## Case-Correction Review Batch

Only components with verified selectable source tokens and no remaining local diagnostic outside missing-reference resolution qualify. Case folding is used to suggest candidates, never to merge or resolve IDs. Zero-weight rows do not qualify.

| Component | Missing Target | Ready Candidate | Individual Conditional Recovery |
| --- | --- | --- | ---: |
| [Secret Society Title.Noun](../tables/abulafia/source/1611.json) | `Animal.WeirdSymbol` | `Animal.Weirdsymbol` | 9 |
| [Wild West Personas.colors](../tables/abulafia/source/3394.json) | `Simple Colors.scan` | `Simple Colors.SCAN` | 3 |
| [Star Wars Plot Generator.contact](../tables/abulafia/source/3808.json) | `Star Wars Random NPC.Droidname` | `Star Wars Random NPC.DroidName` | 0 |

The JSON report retains the entire proposed batch, exact referring table IDs, and the deduplicated conditional recovery set. Case-only candidates that are themselves blocked, ambiguous matches, and absent targets are excluded.

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

Conditional recovery: **45**. Reach: **1,394**. Confidence: **low**. Effort: medium to large.

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

### 5. Traps.Trap + Traps.TrapContents

Conditional recovery: **17**. Reach: **49**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Traps.Trap, entry 1, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/traps/subtables/trap/table.json): `[TrapContents] inside [TrapAdverb] hidden pits`
- Traps.Trap, entry 2, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/traps/subtables/trap/table.json): `[TrapTriggers] connected up to [TrapMissiles]`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 6. FantasyMenu.VeggiesCookable

Conditional recovery: **16**. Reach: **949**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- FantasyMenu.VeggiesCookable, entry 4, weight 2, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasymenu/subtables/veggiescookable/table.json): `[VeggiesCookable] and [VeggiesCookable]`
- FantasyMenu.VeggiesCookable, entry 1, weight 15, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasymenu/subtables/veggiescookable/table.json): `[VeggiesMundane]`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 7. The Blues Engine.interjection

Conditional recovery: **16**. Reach: **30**. Confidence: **medium**. Effort: medium.

Diagnostics: `source_warning`.

- The Blues Engine.interjection, entry 1, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/the-blues-engine/subtables/interjection/table.json): `[ij],`
- Extractor warning: `Line 324: preserved nonstandard row before first entry: 0 NOTE: trailing spc!`

Evidence basis: The recorded defect is identifiable; repair semantics and post-repair dependencies still require validation.

Proposed repair:

- Review archived raw source and extractor warnings; recover verified rows through documented corrections, preserving weights and leaving genuinely empty sources blocked.

### 8. ODnD Wilderness Encounter Cruncher.lair35

Conditional recovery: **15**. Reach: **15**. Confidence: **medium**. Effort: medium.

Diagnostics: `empty_table`, `invalid_weight`, `source_warning`.

- ODnD Wilderness Encounter Cruncher.lair35, raw source, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/odnd-wilderness-encounter-cruncher/subtables/lair35/table.json): `;lair35 7;(in lair) 13;(not in lair)`
- Extractor warning: `Line 323: preserved nonstandard row before first entry: 7;(in lair)`
- Extractor warning: `Line 324: preserved nonstandard row before first entry: 13;(not in lair)`

Evidence basis: The recorded defect is identifiable; repair semantics and post-repair dependencies still require validation.

Proposed repair:

- Review archived raw source and extractor warnings; recover verified rows through documented corrections, preserving weights and leaving genuinely empty sources blocked.

### 9. Fantasy-CC-Main-Events.DEITIES

Conditional recovery: **14**. Reach: **153**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Fantasy-CC-Main-Events.DEITIES, entry 13, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasy-cc-main-events/subtables/deities/table.json): `Evil version of [DEITIES]`
- Fantasy-CC-Main-Events.DEITIES, entry 1, weight 4, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/fantasy-cc-main-events/subtables/deities/table.json): `Ancestor Worship`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

### 10. Metamorphica.creatures + Metamorphica.fantasticcreatures

Conditional recovery: **14**. Reach: **15**. Confidence: **low**. Effort: large.

Diagnostics: `cycle`.

- Metamorphica.creatures, entry 6, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/metamorphica/subtables/creatures/table.json): `[fantasticcreatures]`
- Metamorphica.creatures, entry 8, weight 1, [pinned source](https://github.com/TedTschopp/random-generator-com-wiki-dump/blob/6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0/tables/metamorphica/subtables/creatures/table.json): `[fantasticpeople]`

Evidence basis: The cycle is proven, but a terminating semantics-preserving repair has not been established.

Proposed repair:

- Establish terminating, bounded wiki-only recursion semantics with probability tests; do not remove recursive rows or weaken execution limits.

## Recorded Diagnostics

Counts are distinct tables per diagnostic code. One source defect can produce several codes; these are not separate recoverable-table counts.

| Diagnostic | Tables |
| --- | ---: |
| `blocked_dependency` | 4,275 |
| `unsupported_reference` | 973 |
| `missing_reference` | 798 |
| `invalid_weight` | 580 |
| `empty_table` | 549 |
| `cycle` | 495 |
| `unsupported_syntax` | 493 |
| `unsupported_macro_expression` | 363 |
| `expansion_limit` | 265 |
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

Manifest: [source manifest](../tables/abulafia/manifest.json), SHA-256 `5a443dc4e2f6612f367c6e3f9672a5abb13fa76fe76c0ef8fab25f5fb6828965`.

Evidence: 563 inspected source archives. Input hashes, source links, per-table blocker sets, case candidates, and every ranked component are retained in [quarantine-report.json](quarantine-report.json).
