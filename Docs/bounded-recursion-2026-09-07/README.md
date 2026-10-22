# Bounded Recursion Results

The importer and offline results engine now support two explicitly reviewed
recursion policies. They enable 180 tables without changing source tables,
archived rows, source weights, identities, contributor selection, or the classic
generator. Open [Table Atlas](../../explorer/index.html) directly from disk.

## Current Catalog

| Scope | Imported | Ready | Blocked |
| --- | ---: | ---: | ---: |
| Current corpus | 26,156 | 20,999 | 5,157 |
| Imported history | 6,099 | 4,456 | 1,643 |
| Total wiki catalog | 32,255 | 25,455 | 6,800 |

Ready tables comprise 24,436 static tables and 1,019 wiki-runtime tables.
All 180 promotions are wiki-runtime tables: 145 current and 35 historical.
All 25,275 previously ready compiled tables and all 2,170 source archives are
unchanged. The compatibility bundle is byte-identical to the preceding checkpoint.
The graph retains 33,378 total tables, 57,045 relationships, and 1,048 unresolved
source targets, including the approved self-reference edges.

`Ship Names.main` is now runnable through the wiki evaluator; its classic alias
still targets `Ship Names.Special`. More complex dependents such as
`Secret Society Title.main` remain blocked where existing expression preflight
cannot prove a bounded expansion. Readiness is validated per table, not assumed
for every dependent of an approved policy.

## Approved Policies

| Table | Policy | Result When the Approved Row Is Selected |
| --- | --- | --- |
| `FantasyMenu.VeggiesCookable` | `unique-pair`, row 4, depth 1 | Exactly two distinct terminating items joined by `" and "` |
| `Secret Society Title.TitleDescriptor` | `bounded-wrapper`, row 1, depth 1 | One `"Most "` prefix and one terminating descriptor |

The pair-producing row can be selected once. Each child then selects from a
validated terminating pool; it cannot select another recursive row. Ordinary
acyclic references such as `VeggiesMundane` and `Fruit` remain available within
that pool. A pair cannot grow into three or more items.

Uniqueness compares completed values after Unicode NFC normalization, whitespace
collapse, trimming, and lowercase conversion. Original display text is preserved.
Different source rows that resolve to the same normalized value are treated as
duplicates for the second item. The exclusion applies to one combination only;
independent combinations and later rolls may repeat values.

The descriptor's original archived row remains `10,Most [TitleDescriptor]]`.
The [earlier bracket repair](../repair-followup-2026-09-07/README.md) fixes only its
compiled reference. The new wrapper policy permits `Most Able`, but not another
recursive wrapper such as `Most Most Able`.

## Probability and Limits

The outer row weights remain unchanged: the pair row has weight 2 out of 79;
the wrapper row has weight 10 out of 218. Terminal pools retain exact rational
source-path probabilities, converted to safe integer weights. Pair selection
is weighted sampling without replacement by normalized resolved value.

These constraints intentionally change conditional output probabilities:
recursive alternatives are excluded from terminal draws, and every path matching
the first item's normalized value is excluded from the second draw. The engine
does not delete source rows, change stored weights, repeatedly retry random draws,
or deduplicate completed output afterward. Ordinary unapproved repeated references
retain their existing independent-draw behavior.

Approvals are separate from source data and bind namespaced IDs, pinned source
files and hashes, complete raw-source hashes, exact row and line evidence,
original text hashes, and weights. The importer and browser share the validator;
browser registration validates policies before installing the batch. The private
execution data is copied and frozen.

Only these two one-level shapes are supported. General mutual recursion, nested
policies, invalid terminal paths, and unsupported expressions remain blocked.
Terminal validation is bounded to 4,096 choices and 1 MiB of retained text/trace
data. Existing limits remain active: 32 table levels, 512 table calls, 4,096
expression operations, and 32,768 output characters. Traces identify the applied
policy and terminal-only draws; the original source graph is not rewritten.

## Verification and Evidence

The full unit/integrity suite passes 163 tests, and all 20 offline browser tests
pass, including classic pages and automated WCAG A/AA checks. The
[roll audit](roll-acceptance.json) covers all 2,086 newly selectable root choices
in 6,258 deterministic rolls, with zero warnings. Its 33 empty results are valid
source outcomes outside the pair terminal pools. Maximum observed output was
2,357 characters, 181 calls, and depth 10. Coverage uses three dependency profiles
per root choice, not every Cartesian combination.

Offline browser checks force both approved branches, verify visible policy
traces, preserve an unapproved cycle's disabled controls, and check desktop and
320/390-pixel mobile layouts with HTTP requests blocked. Registry and metadata
hashes remain unchanged after the roll audit. The normal importer reproduces all
2,173 artifacts byte-for-byte with zero writes.

- [recursion-report.json](recursion-report.json): promotions, source-preservation checks, artifact hashes, and report publication evidence.
- [roll-acceptance.json](roll-acceptance.json): per-table root-choice coverage, policy examples, limits, and runtime hashes.
- [Reviewed policies](../../explorer/tools/recursion-policies.json): the two exact approvals and their unchanged pre-policy basis hashes.
- [Current recovery report](../quarantine-report.md): 6,800 remaining blocked tables and five newly eligible case-only review components.

The newly eligible case batch has two target names and an estimated six-table
recovery. It is recorded for review, not automatically applied. Other recursion
forms require their own source-bound decision and tests.
