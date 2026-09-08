# Table Inventory Completeness

Report date: 2026-09-07.

**All 18 identified source archives are preserved and checksum-verified.** The census found 33,098 distinct wiki table identities across their retained histories, including 883 absent from the baseline XML history.

**No tables were imported, renamed, enabled, or repaired.** Download completion, definition inventory, and executable readiness are separate measures. A positive-weight row does not establish that references, macros, provenance, or probability semantics are suitable for import.

## Download Completeness

| Measure | Result |
| --- | ---: |
| Identified full-source archives verified | 18 / 18 (100%) |
| Preserved archive bytes | 149,083,553 |
| Completed source censuses | 18 |
| Wiki history snapshots | 15 |
| Converted collections | 3 |
| Converted table files inspected | 982 |

Whole original source archives are retained, not just matching rows or selected authors. The snapshots therefore retain the other tables by the same contributors that the exports contain. Any later import must still apply contributor-wide selection, attribution, dependency, and collision safeguards. No names were folded, aliased, or merged for import.

The original downloads were already acquired during the earlier comparison. This pass verified and preserved them in dedicated local backup storage; it did not need to repeat those network transfers. Bulk archives and reproducible census caches are local-only; acquisition manifests and consolidated reports can be versioned.

## Wiki Inventory

| Measure | Table Identities |
| --- | ---: |
| Distinct active declarations found anywhere in archived XML history | 33,098 |
| With at least one recognized positive-weight definition | 32,167 |
| Already represented in baseline XML history | 32,215 |
| Additional identities from alternate snapshots | 883 |
| Additional identities with recognized positive-weight rows | 750 |
| Current extracted identities absent from the active-history census | 2 |
| Known wiki identities including the current extracted inventory | 33,100 |
| Page/subtable names associated with multiple XML page IDs | 0 |

Wiki identity is the exact page ID, page title, and subtable name. Repeated revisions and copied snapshots do not create additional identities. A historical page rename or reused title remains explicit; it is not an automatic alias. Definition variants are deduplicated by hash within each identity. 15 archived identities have an empty subtable name; these are preserved and flagged without inventing replacement names.

The [additional wiki table list](new-wiki-tables.md) names every identity absent from baseline history. The [complete machine-readable inventory](inventory-report.json) includes all known wiki identities, source-qualified converted records, source hashes, and target classifications.

## Current Import

| Measure | Tables |
| --- | ---: |
| Current upstream extracted table inventory | 26,156 |
| Imported into the app | 25,748 |
| Current tables not imported | 408 |
| Runnable imported tables | 20,332 |
| Runnable static tables | 19,674 |
| Runnable wiki-runtime tables | 658 |
| Imported tables still blocked | 5,416 |

Imported coverage of the current extracted inventory: **98.44%**. Runnable coverage among imported tables: **78.97%**. Runnable coverage of the current extracted inventory: **77.73%**. These percentages describe the current corpus, not all historical definitions or the original live wiki.

### Extraction Reconciliation

The active latest-revision census has 26,139 table identities. 17 current extracted identities are not active in that census. The census masks comments and nowiki content and determines latest state across repeated page fragments. This is an extraction-scope difference, not evidence that the corresponding source files were not downloaded. Existing imported behavior is unchanged.

| Page | Page ID | Subtable | Current Import State |
| --- | --- | --- | --- |
| Available Dog Generator | 3175 | DogStats | blocked |
| Main Page | 1 | main | ready-static |
| User:Bloo | 4661 | Action | not-imported |
| User:Bloo | 4661 | MotivationCard | not-imported |
| User:Bloo | 4661 | MotivationSpirit | not-imported |
| User:Bloo | 4661 | MotivationSuit | not-imported |
| User:Bloo | 4661 | Trait | not-imported |
| User:Bloo | 4661 | Trigram | not-imported |
| User:MikeyD/Sandbox | 3606 | badguy | ready-static |
| User:MikeyD/Sandbox | 3606 | hey | ready-static |
| User:MikeyD/Sandbox | 3606 | main | ready-runtime |
| User:MikeyD/Sandbox | 3606 | num | ready-static |
| User:MikeyD/Sandbox | 3606 | what | ready-runtime |
| User:MikeyD/Sandbox | 3606 | with | ready-static |
| User:Ry | 2525 | colorbind | ready-static |
| User:Ry | 2525 | noracle | ready-static |
| User:Xcorvis | 1887 | main | ready-static |

## Converted Collections

The converted files contain **11,297 source-qualified table records**. 9,241 have recognized positive-weight rows; 1,222 contain colon-style declarations whose weights and expressions were not interpreted.

Converted records are counted by source ID, exact file path, and subtable name. Related MyUniverse versions are not independent corroboration, and these record counts must not be added to the wiki total as unique recovered tables. Filenames suggest identity but do not prove original wiki provenance. Wrappers, rewritten references, disabled rows, mixed formats, and attribution still require review.

## Existing Local Tables

The existing local-source inventory records **2,273 table records**, including active, shadowed, unloaded, and alternate JSON definitions. These are not all active app tables and are not deduplicated against wiki or backup records.

| Local State | Records |
| --- | ---: |
| legacy-active | 1,118 |
| legacy-shadowed | 64 |
| legacy-unloaded | 16 |
| legacy-json | 1,071 |
| legacy-json-prototype | 4 |

## Unresolved Target Coverage

These counts use exact page and subtable identities from the existing unresolved-reference report. Finding a definition does not change its live unresolved status.

| Definition Evidence | Target Names |
| --- | ---: |
| Positive definition in additional XML | 54 |
| Positive definition in baseline history | 129 |
| Positive candidate only in converted copies | 5 |
| Existing local case candidate; separate review | 174 |
| Malformed source identity; separate review | 4 |
| Definition found without recognized positive rows | 3 |
| No matching definition in inspected sources | 492 |

## Source Census

| Source | Historical Identities or Copy Records | Latest Identities | Definition Variants |
| --- | ---: | ---: | ---: |
| random\_generatorcom-20120618 | 9,046 | 9,046 | 9,064 |
| random\_generatorcom-20140203 | 14,505 | 12,201 | 34,102 |
| random\_generatorcom-20140329 | 14,973 | 12,621 | 35,919 |
| random\_generatorcom-20140706 | 16,567 | 13,967 | 40,212 |
| random\_generatorcom-20180505 | 29,003 | 23,573 | 73,372 |
| random\_generatorcom-20200225 | 32,219 | 26,143 | 82,947 |
| markanddaveyrandom\_generatorcom-20140213 | 14,519 | 12,215 | 34,128 |
| markanddaveyrandom\_generatorcom-20140325 | 14,973 | 12,621 | 35,919 |
| markanddaveyrandom\_generatorcom-20180504 | 29,003 | 23,573 | 73,372 |
| markanddaveyrandom\_generatorcom-20180505 | 29,003 | 23,573 | 73,372 |
| markanddaveyrandom\_generatorcom-20200212 | 32,215 | 26,139 | 82,925 |
| spycraftrandom\_generatorcom-20120414 | 9,921 | 8,810 | 24,327 |
| spycraftrandom\_generatorcom-20140325 | 14,973 | 12,621 | 35,919 |
| spycraftrandom\_generatorcom-20180505 | 29,003 | 23,573 | 73,372 |
| spycraftrandom\_generatorcom-20200209 | 32,215 | 26,139 | 82,925 |
| scadding-MyUniverse | 4,922 | 4,922 | 4,927 |
| scadding-MyUniverse\_V2 | 6,118 | 6,118 | 6,123 |
| ToddAT-ramban | 257 | 257 | 257 |

Per-source counts overlap. XML revision record counts include repeated fragments and replicated history; they are not unique-revision totals.

## Remaining Limits

- Complete download coverage refers only to the identified and explicitly inventoried sources. It does not prove a complete backup of the original wiki.
- The XML census identifies parser-recognized table declarations in sgtable blocks across all retained revisions, including explicitly flagged empty names. Comments, nowiki content, aliases, and other generator formats are not automatically treated as active tables.
- Converted colon declarations are listed, but their probability and expression rules remain unverified. They are not empty tables or ready-to-run imports.
- Other differently packaged wikidump archives, missing or suppressed wiki revisions, Wayback HTML captures, images, and unlocated sources remain outside this census.
- Historical definitions may have been removed intentionally. Review their source revisions, dependencies, original weights, and contributor attribution before proposing an import.
- The application remains browser-only and offline. No server, runtime dependency, import selection change, or execution-policy change was introduced.

## Next Review

Review XML-backed historical definitions before converted-only adaptations. For each proposed batch, verify the selected revision, preserve exact identifiers and probabilities, expand to the complete contributor-owned collection, and recompute all dependency and runtime checks. Downloaded and inventoried does not mean approved or runnable.
