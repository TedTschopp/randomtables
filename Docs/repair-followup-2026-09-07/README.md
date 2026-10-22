# Bracket and Case Repair Checkpoint

This dated checkpoint precedes the [bounded recursion implementation](../bounded-recursion-2026-09-07/README.md).
It records the completed source-bound bracket repair and two recovery-scoped
case-correction batches. Its counts describe that checkpoint, not the current catalog.

## Outcome

| Stage | Case Rules | Newly Ready | Ready | Blocked |
| --- | ---: | ---: | ---: | ---: |
| Import and historical recovery baseline | 0 | 0 | 25,222 | 7,033 |
| Bracket repair and first case batch | 71 | 51 | 25,273 | 6,982 |
| Newly eligible case follow-up | 19 | 2 | 25,275 | 6,980 |

The 90 new case rules cover 41 source tables: two current and 39 historical.
They are separate from the earlier 366 current-corpus rules on 199 tables.
At this checkpoint, 28 of the newly corrected source tables were ready and 13
still had other blockers. No eligible case-only candidates remained at that time.

## Source Repair

`Secret Society Title.TitleDescriptor` contains the archived row
`10,Most [TitleDescriptor]]`. The approved projection removes exactly one extra
closing bracket from the executable reference. The original raw text, row weight,
source archive, table identity, and contributor attribution remain exact.

Correcting the bracket exposed genuine self-recursion. This pass retained the
self-edge in the relationship graph and kept the table quarantined. It did not
claim that balanced delimiters proved termination. The later recursion policy
is a separate, explicitly approved runtime change.

## Preservation and Checks

All 25,222 previously ready compiled tables and all 2,170 source archives were
unchanged. The second batch also preserved all 25,273 tables ready after the first.
Membership, IDs, names, aliases, attribution, original rows, and source weights
were retained. The original current-only approvals kept their original lookup
scope after historical definitions were added.

Acceptance covered 1,202 newly selectable compiled choices across 53 tables in
3,606 deterministic rolls, with zero warnings. Each root choice used three
dependency profiles; this was not every Cartesian combination. The checkpoint
passed 155 unit/integrity tests and 19 offline browser tests. The importer and
reports reproduced their published bytes with zero writes.

## Evidence

- [repair-report.json](repair-report.json): stage counts, promotions, preservation checks, and independent manifest hashes.
- [roll-acceptance.json](roll-acceptance.json): per-table roll coverage and implementation hashes at this checkpoint.
- [Source approvals](../../explorer/tools/source-extraction-corrections.json): exact raw-source and row bindings.
- [Recovery case approvals](../../explorer/tools/recovery-case-corrections.json): original and follow-up review scopes.
- [Current recovery report](../quarantine-report.md): the remaining backlog after subsequent work.

Approval-basis hashes identify their original pre-repair snapshots. They are not
rewritten when the current manifest or reports change.
