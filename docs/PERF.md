# Gum 2.0 performance findings

Latest measurements: September 27, 2026 CDT (September 28 UTC). The supported
implementation repeats 12 focused timings and checks all 90 outputs across core,
math, maps, and the docs demos. Earlier sections retain their full 90-case freeze
comparison and original 66-case results.

## Supported immutability policy

The benchmark variant is now implemented as a supported core policy. Copying,
validation, and reference ownership remain independent of runtime freezing.
Core's exported `freeze_owned` binds once to the native freeze function or an
identity function; math shares that helper and maps uses core constructors.

- `NODE_ENV=production` disables freezing; other process environments default
  to enforcement.
- `GUM_FREEZE=1` or `0` explicitly selects the mode before Gum is imported.
- Browser bundles can define the boolean `__GUM_FREEZE__`, which takes precedence
  over process settings. Studio production and MCP viewer builds disable checks
  by default and honor `GUM_FREEZE` at build time. Unconfigured browsers default
  to enforcement.
- `FREEZE_ENABLED` exposes the selected mode. Readonly API types remain the same
  in either mode; consumers must not mutate shared elements or layout results.

Use the regular benchmark commands to compare modes:

```sh
GUM_FREEZE=1 bun run perf --json > /tmp/gum-freeze.json
GUM_FREEZE=0 bun run perf --json > /tmp/gum-no-freeze.json
GUM_FREEZE=0 bun run perf:demos
```

Run modes sequentially, alternate their order across repeats, and use the same
Bun version and inputs. Reference reuse and mutation behavior are covered by
core tests. See the [API contract](../gum-jsx-core/API.md#immutability-policy).

### Implementation timings

The real implementation retains the gains from the experiment. These are 12
focused cases, including all six complete demo renders, measured in three fresh
processes per mode. Run order was frozen, unfrozen, unfrozen, frozen, frozen,
unfrozen, from `2026-09-28 03:28:54` to `03:30:50 UTC`. The runner uses Bun 1.4.2,
Mitata 1.0.34, and AMD Ryzen 9 7900X on Linux. No tests or builds ran concurrently;
CPU frequency was not locked.

The table reports the **median of three run means**. Compare modes within this
table: the focused selection has different warmup and ordering from the earlier
full suite. [Implementation results](perf-immutability-results.json) retain every
run mean and the run metadata. Memory was not measured again.

| Case | Frozen (ms) | Unfrozen (ms) | Speedup |
| --- | ---: | ---: | ---: |
| Core text-grid layout, 100 items | 10.242 | 3.661 | 2.80× |
| Core styled paragraph layout | 13.191 | 3.098 | 4.26× |
| Core scatter-plot layout, 2,000 points | 7.414 | 4.878 | 1.52× |
| Core JSX-grid render, 100 items | 21.882 | 11.328 | 1.93× |
| Math matrix layout, 8×8 | 13.463 | 9.142 | 1.47× |
| Maps world layout, prepared resource | 7.286 | 3.806 | 1.91× |
| Route 66 render | 81.588 | 57.360 | 1.42× |
| Silk Road render | 53.535 | 35.286 | 1.52× |
| Spherical Spiral render | 95.657 | 47.151 | 2.03× |
| Winkel Tripel render | 69.775 | 39.888 | 1.75× |
| Winkel Tripel, minimal render | 7.256 | 3.769 | 1.93× |
| Xuanzang's travels render | 494.518 | 398.797 | 1.24× |

Paragraph layout takes 76.5% less time; full demo renders take 19.4–50.7% less
time. These measurements cover Bun; the browser checks below establish correct
behavior in Chromium, not equivalent browser timing gains.

### Verification

- All 90 perf output hashes match the saved pre-change baseline with checks
  both enabled and disabled, including full demo SVGs and signed-zero geometry.
- `bun run test:immutability` passes all 11 workspace package suites in each mode.
  The tests retain input isolation, validation, and cache checks; freezing
  assertions follow the selected policy.
- Startup tests cover defaults, production mode, explicit overrides, invalid
  settings, and setting changes after import. Browser bundles are checked without
  Node globals, with both compile-time flags, and with conflicting runtime settings.
- Workspace typechecks pass. Readonly return types and literal inference are
  tested in both modes.
- Production Studio and MCP viewer builds succeed. The Chromium regression
  verifies the real Studio bundle with checks off and forced on, including exact
  browser/library SVG agreement and an unchanged native `Object.freeze`.

## Freeze removal experiment

This section records the initial experiment, before the supported implementation
above. Its source-loading hook has since been replaced by the runtime policy.

**Removing runtime freezing produces substantial gains even with input copying
and validation retained.** Complete demo renders take 20–46% less time, and
paragraph layout is about four times faster. Production freezing remained enabled
at the time of this isolated benchmark experiment.

### Method

The baseline is the current working tree, including the second optimization pass
below. Core is based on `952c1d1`, math on `f23e22a`, maps on `187dbcf`, and docs
on `d6854c1`. Both variants use the same perf case factories and Mitata 1.0.34
runner, Bun 1.4.2, and AMD Ryzen 9 7900X on Linux.

The experiment replaces `Object.freeze` in Gum's core, math, and maps source with
identity functions during module loading. It leaves external dependencies and
the global native function alone. All copying, numeric validation, and existing
ownership caches remain. Seven reference-box constructors use a WeakSet marker
so `make_measure` retains its original copy decisions despite the objects being
unfrozen. An untimed audit checks those decisions against tracking every removed
freeze. The experimental runner and audit have since been removed.

Six full runs completed from `2026-09-28 02:18:05` to `02:26:39 UTC`: frozen,
unfrozen, unfrozen, frozen, frozen, unfrozen. Each run used a fresh process and
measured all 90 cases. No tests or other benchmark processes ran concurrently.
CPU frequency was not locked. Tables report the **median of three run means**,
not a median individual operation or a confidence interval. The
[complete results](perf-freeze-results.json) retain all per-run means and memory
measurements.

### Full demos

`bun run perf:demos` now discovers all six `gum-jsx-docs/demos/**/*.jsx` files and
provides evaluation, layout, SVG-only, and complete-render cases for each. The
workspace's `bun run perf` includes these 24 additional cases. The docs repository
also exposes `bun run perf` and `bun run perf:demos`.

These full-render timings include JSX parsing/evaluation, element construction,
layout with a fresh pass, and SVG serialization at the authored dimensions.
Source reads and font warmup happen outside timing; no PNG/PDF conversion or
process startup is included.

| Demo | Frozen (ms) | Unfrozen (ms) | Speedup | Less time |
| --- | ---: | ---: | ---: | ---: |
| Route 66 | 82.407 | 58.655 | 1.40× | 28.8% |
| Silk Road | 51.562 | 36.183 | 1.43× | 29.8% |
| Spherical Spiral | 93.645 | 50.897 | 1.84× | 45.6% |
| Winkel Tripel | 68.789 | 41.280 | 1.67× | 40.0% |
| Winkel Tripel, minimal | 7.003 | 3.902 | 1.79× | 44.3% |
| Xuanzang's travels | 499.323 | 401.065 | 1.24× | 19.7% |

The complete-render ranges remain separated across all three repeats. For
example, Spherical Spiral takes 90.19–95.70 ms frozen versus 49.45–51.71 ms
unfrozen; Xuanzang takes 489.93–507.02 ms versus 389.04–409.52 ms.

Breaking the same demos into stages shows where the gains occur:

| Demo | Evaluation speedup | Layout speedup | SVG speedup |
| --- | ---: | ---: | ---: |
| Route 66 | 1.30× | 1.91× | 1.16× |
| Silk Road | 2.10× | 1.82× | 1.10× |
| Spherical Spiral | 5.50× | 1.74× | 1.13× |
| Winkel Tripel | 2.76× | 1.78× | 1.14× |
| Winkel Tripel, minimal | 3.75× | 1.81× | 1.14× |
| Xuanzang's travels | 1.21× | 2.04× | 1.15× |

Stage times have different reuse boundaries and should not be added together to
predict a full render. Evaluation includes data preparation performed by the JSX.
In particular, Xuanzang still spends 346.2 ms in evaluation without freezing,
versus 15.4 ms in layout. An untimed diagnostic counted **276 calls to
`project_geo_point` per evaluation**. The demo passes the raw world source each
time, and that helper prepares geography and fits a projection on every call.
Reusing a prepared source and fitted projection is a concrete follow-up target;
these timings do not isolate how much of evaluation those calls consume.

SVG cases operate on fragments prepared outside timing. Their improvements
therefore also reflect downstream costs of consuming frozen data. This comparison
measures the total effect of the variant, including runtime object representation,
optimization, and ownership-marker costs; it does not isolate only time spent
inside the native `Object.freeze` call.

### Core, math, and maps

| Case | Frozen (ms) | Unfrozen (ms) | Speedup |
| --- | ---: | ---: | ---: |
| `core/layout/shapes-1000` | 9.578 | 7.419 | 1.29× |
| `core/layout/text-grid-100` | 9.974 | 3.802 | 2.62× |
| `core/layout/styled-paragraph` | 12.926 | 3.216 | 4.02× |
| `core/layout/scatter-plot-2000` | 6.642 | 4.525 | 1.47× |
| `core/render/jsx-grid-100` | 19.689 | 11.182 | 1.76× |
| `math/layout/matrix-8x8` | 12.077 | 8.878 | 1.36× |
| `math/render/inline-prose-20-formulas` | 11.635 | 7.915 | 1.47× |
| `maps/layout/world-prepared-resource` | 7.219 | 3.955 | 1.83× |
| `maps/layout/states-albers` | 34.911 | 26.380 | 1.32× |

The benefit extends beyond text: core construction improves 1.44–4.01×, math
layout 1.36–1.45×, and map layout 1.32–2.02×. Source atlas cloning is essentially
unchanged. The largest median slowdown anywhere in the 90 cases is 1.3%, in
`maps/data/world-clone`; its repeat ranges overlap. These results do not establish
equivalent gains in browser runtimes.

### Memory

Two fresh processes per mode and workload ran ten warmup operations, then two
batches of 30 operations. Only the latest result was retained; `Bun.gc(true)` ran
after warmup and each batch. These checks ran separately from the timing suites.

| Workload | Frozen peak RSS (MiB) | Unfrozen peak RSS (MiB) | Frozen final heap (MiB) | Unfrozen final heap (MiB) |
| --- | ---: | ---: | ---: | ---: |
| Paragraph layout | 218.9–221.4 | 201.5–209.0 | 22.5 | 20.6–20.8 |
| Route 66 complete render | 414.5–474.9 | 378.6–388.3 | 28.6 | 27.0–27.3 |
| Xuanzang complete render | 440.7–467.5 | 379.5–380.3 | 28.7–32.3 | 26.8–26.9 |

Peak process memory and heap after the final GC are lower in these unfrozen
checks. Peak RSS includes startup, JIT compilation, and allocation policy, so
these short runs do not establish long-term memory behavior. Their shorter
protocol also differs from the earlier bounds/path stress checks below; compare
variants within this table.

### Correctness and next step

- All 90 cases have identical output hashes in separate frozen/unfrozen runs.
  Snapshots include complete SVG strings and canonical source/layout records,
  with signed zero preserved explicitly. Functions and private cache state are
  outside the snapshot.
- The ownership audit passes two executions of every case. Startup checks verify
  that source snapshots survive edits to caller-owned points and reference boxes,
  and that invalid geometry is still rejected.
- All six demos remain unchanged. Normal perf commands retain runtime freezing.
- Workspace tests and typechecks pass across all 11 packages. A separate
  TypeScript check also covers the workspace benchmark and experiment scripts.

The gains justify designing a build-time freeze helper while keeping snapshotting
and validation independent of it. Production adoption would change the runtime
mutation guarantee: these matching outputs establish behavior for the measured
workloads, not protection against consumers mutating Gum-owned objects. The
current experiment adds no production option.

## Second optimization pass: bounds and path construction

Implemented on September 27, 2026 CDT (September 28 UTC), following the profiles
below. The changes are confined to core's geometry and path helpers:

- `union_rects` collects all four extrema in one pass, avoiding the filter and
  four intermediate coordinate arrays. Empty unions still return `null`.
- `transform_rect` handles translations without creating and transforming four
  corner points. It calculates the translated endpoints before deriving width
  and height, preserving floating-point rounding and signed-zero behavior.
  Explicit affine matrices and invalid source corners retain the general path.
- Numeric path copies and transforms construct validated, frozen commands
  directly. They avoid the temporary frozen points and object spreads used by
  the generic mapper. The public `map_path` callback behavior is unchanged, and
  caller-owned commands still pass through copying and validation.

### Incremental latency results

The before column uses the already-optimized core revision `952c1d1`.
A saved copy of that core supplied all three
packages for the before run; a diagnostic verified math and maps used its
`LayoutPass`. Math and maps source revisions remain `f23e22a` and `187dbcf`.

The table uses two sequential, unprofiled full-suite runs on the same Ryzen/Bun/
Mitata setup: before at `2026-09-28 01:19:05 UTC` and after at `01:20:40 UTC`.
All 66 cases completed. CPU frequency was not locked, and these means are point
estimates. No tests or other benchmarks ran alongside them.

| Case | Before (ms) | After (ms) | Speedup |
| --- | ---: | ---: | ---: |
| `core/layout/shapes-1000` | 12.463 | 9.568 | 1.30× |
| `core/layout/text-grid-100` | 13.724 | 9.504 | 1.44× |
| `core/layout/styled-paragraph` | 18.246 | 12.534 | 1.46× |
| `core/layout/scatter-plot-2000` | 9.508 | 6.599 | 1.44× |
| `core/layout/paragraph-resize-3-widths` | 54.402 | 37.791 | 1.44× |
| `math/layout/matrix-8x8` | 15.502 | 11.704 | 1.32× |
| `core/render/jsx-grid-100` | 25.203 | 19.355 | 1.30× |
| `math/render/inline-prose-20-formulas` | 14.751 | 11.457 | 1.29× |
| `maps/layout/world-prepared-resource` | 8.069 | 7.286 | 1.11× |
| `maps/layout/states-albers` | 36.055 | 34.741 | 1.04× |

An intermediate run with only the bounds changes measured scatter at 6.894 ms
and 1,000 rectangles at 10.102 ms, while paragraph layout remained at 18.166 ms.
This separates the broad bounds improvement from the subsequent text-path gain.
The final table measures the combined change; intermediate differences should
not be treated as additive speedups.

The largest slowdown in the final full comparison is 3.8%, in unchanged quadratic
parsing. Small changes in parsing, construction, cache hits, and serialization
are within the variation observed in earlier runs. Albers' 4% improvement is also
small enough to warrant more repeats before treating it as a reliable gain;
its projection code was unchanged.

### Allocation and memory checks

Untimed diagnostics show fewer calls to `Object.freeze` per operation:

| Layout | Before | After |
| --- | ---: | ---: |
| Styled paragraph | 240,196 | 102,732 |
| 2,000-point scatter | 96,034 | 77,604 |
| Prepared world | 39,578 | 21,309 |

Paragraph point-record freezes fall from 142,978 to 5,514. These counts confirm
the removed temporary records; they are not measurements of allocated bytes.

Memory was checked separately in two fresh processes per version and workload.
Each process warmed up for 20 operations, then ran two batches of 100 operations,
keeping the latest fragment and requesting a full Bun GC between batches.
Peak RSS includes process startup, JIT compilation, and runtime allocation policy.

| Layout | Before peak RSS (MiB) | After peak RSS (MiB) |
| --- | ---: | ---: |
| Styled paragraph | 328.0–337.6 | 355.7–356.1 |
| 2,000-point scatter | 175.1–176.8 | 178.6–182.1 |
| Prepared world | 185.2–194.3 | 204.0–204.6 |

Heap usage after the final GC was similar or lower: paragraph about 23.9 MiB
before versus 22.4–22.7 MiB after, scatter about 14.8–14.9 MiB, and world about
14.5–14.6 MiB. Lower latency comes with **higher peak RSS in these stress checks**.
The short runs
do not establish long-term memory behavior; no new cache was introduced.

### Correctness

- All 66 benchmark outputs match the saved baseline. Complete layout and source
  results were compared after sorting object keys; SVG strings match exactly.
- New geometry tests compare translation against the general identity-matrix
  path across signed zero, extreme values, rounded extents, and invalid inputs.
  They also cover empty/zero-area unions, many rectangles, and immutable output.
- New numeric-path tests compare every command/control coordinate with the
  unchanged generic mapper, including affine transforms, nonfinite values,
  overflow, and ownership behavior.
- Workspace `bun run test` and `bun run typecheck` pass across all 11 packages.

## CPU profiles after the first optimization pass

This section records the evidence that motivated the second pass above. Its
timings and profile shares describe core `952c1d1`, before those latest changes.

Refreshed on September 27, 2026 CDT (September 28 UTC). **Bounds aggregation is
the next shared core target.** Paragraphs remain dominated by outline construction
and serialization, while Albers maps now spend most of their time in projection.
Reusing placement records alone would address a much smaller share of the work.

### Method and timings

- Profiled nine workloads twice, each in a separate process: fixture setup,
  five warmup calls, then at least five seconds of repeated operations. The two
  profile batches began at `2026-09-28 00:56:39 UTC` and `00:59:06 UTC`.
- Used the same Ryzen 9 7900X, Bun 1.4.2, and Mitata 1.0.34. Source revisions:
  workspace `ebea83e`, core `952c1d1`, math `f23e22a`, maps `187dbcf`.
- Each loop retained 4,849–4,922 samples. Shares are weighted by sampled time
  within the loop; startup, setup, and warmup are excluded. Categories count a
  sample once even when a function appears repeatedly in its stack.
- Ran the same nine benchmarks twice without profiling for latency. These were
  focused runs, not another full 66-case sweep. All benchmarks and profiles ran
  sequentially without concurrent agent-launched tests, builds, or benchmarks.
  CPU frequency was not locked; the largest latency change between repeats was
  4.23%. Ranges below show the two run means, not confidence intervals.
- Profile shares are inclusive of callees unless marked **self**. Nested shares
  overlap and must not be added. About 5–7% of the map profiles is in unknown
  frames; it remains unattributed. No retained-memory or GC conclusion follows
  from these profiles.

| Workload | Mean latency across two runs (ms) | Main profile shares across two runs |
| --- | ---: | --- |
| `core/layout/shapes-1000` | 12.28–12.82 | `make_fragment` 46.8–46.9%; `union_rects` 12.2–12.5% |
| `core/layout/styled-paragraph` | 18.28–18.72 | `transform_path` 88.0–88.1%; `Object.freeze` **self** 54.1–54.6% |
| `core/svg/styled-paragraph` | 27.08–27.28 | `path_data` 82.1–83.3%; number formatting 57.3–58.7% |
| `core/layout/scatter-plot-2000` | 9.66–10.01 | `make_fragment` 44.3–45.9%; `transform_rect` 29.1–29.4% |
| `math/layout/matrix-8x8` | 15.50–15.80 | `make_fragment` 43.1–43.5%; `transform_rect` 12.6–12.7% |
| `maps/layout/states-albers` | 33.56–33.94 | D3 projection/streaming 60.9–61.0%; projection fitting 25.6–25.7% |
| `maps/layout/world-prepared-resource` | 8.23–8.28 | `copy_path` 46.5–48.3%; D3 projection/streaming 35.7% |
| `core/render/jsx-grid-100` | 25.49–25.91 | `transform_path` 36.3–37.0%; `make_fragment` 16.2–16.4% |
| `math/render/inline-prose-20-formulas` | 14.94–15.30 | `make_fragment` 27.6–28.8%; `transform_path` 23.5–25.0% |

### What the profiles change about the next fixes

**1. Start with rectangle transforms and bounds aggregation.**
[transform_rect](../gum-jsx-core/src/engine/geometry.ts#L208) builds four corner
arrays, four frozen points, and several temporary arrays even when a placement
only translates a rectangle. [union_rects](../gum-jsx-core/src/engine/geometry.ts#L180)
filters its inputs and builds four more arrays to find extrema.
[make_fragment](../gum-jsx-core/src/engine/fragment.ts#L107) invokes these helpers
while walking children separately for ink, overflow, and outsets.

A separate untimed diagnostic counted non-null rectangle transformations:

| Layout | Translation only (no matrix) | Axis-aligned matrix | Other affine matrix |
| --- | ---: | ---: | ---: |
| 1,000 rectangles | 2,000 | 0 | 0 |
| 2,000-point scatter | 4,104 | 24 | 3 |
| 8×8 matrix | 2,192 | 208 | 0 |

Thus 99.3% of scatter's rectangle transformations only translate the bounds.
A translation fast path and a single-pass bounds union are concrete experiments
with relevance to shapes, plots, and math. Next, test whether fragment aggregation
can share more calculations between its child traversals. Preserve finite-value
validation, null versus zero-area bounds, singular transforms, clipping, and
outsets. `place_fragment` accounts for only 2.9–3.2% of scatter and about 1% of
matrix layout, so avoiding placement copies alone has limited headroom.

**2. Reduce temporary objects in path construction before adding more caches.**
The remaining paragraph cost is concentrated in
[transform_path/map_path](../gum-jsx-core/src/engine/path.ts#L38). Each coordinate
callback constructs a frozen point, then `map_path` copies its fields into a
separately frozen command. Those temporary points and object spreads are worth
testing with direct construction of validated commands, retaining immutable
outputs and the generic mapping API's behavior.

This may also help maps: [projected_commands](../gum-jsx-maps/src/path.ts#L54)
returns mutable command records, so `draw_path` still performs the first ownership
copy. That copy takes 46.5–48.3% of prepared-world layout and 19.5–20.4% of Albers
layout. The earlier optimization removed downstream copies; it did not remove
this initial validation and ownership boundary. A direct command builder is a
candidate, subject to measurements and the existing mutable-input contract.

**3. Text reuse still has substantial upside, especially for long paragraphs.**
Paragraph layout spends just 2.6–3.0% in fragment construction now. Reusing scaled
outlines across positions and reflow widths targets the much larger transformation
cost. For SVG, investigate serialization of shared paths and eventual `<defs>`/
`<use>` output. Both ideas need measurements of memory, SVG size, and any extra
placements, plus visual equivalence checks if output structure changes.

Further general number-cache tuning is less compelling for the full renders:
number formatting is now about 4% of JSX-grid rendering and 6.7–6.9% of inline-math
rendering, although it remains 57–59% of the large paragraph's serialization stage.
The latter still deserves attention as its own workload.

**4. Treat map projection fitting as a separate target.**
[create_geo_projection](../gum-jsx-maps/src/projection.ts#L128), including
`fitExtent`, takes about 26% of Albers layout. Streaming the actual paths takes
another roughly 35%. The prepared-world case spends only about 0.2% in projection
creation, so an Albers fitting improvement would not apply uniformly to maps.
Neither profile samples `geo_aspect`; duplicate natural-aspect measurement is
not the issue in these fixed-size cases. Add matched viewport/border controls
before experimenting with fit or projected-geometry reuse. These benchmarks use
fresh passes, so a cache scoped to one pass needs separate resize/restyle cases
to demonstrate its value.

These profiles led to the rectangle-transform, bounds-union, and direct path
construction changes reported above. More extensive glyph reuse and map fitting
remain follow-ups. No runtime code changed during the profile refresh itself.

## Optimization follow-up: priorities 1–3

The first implementation pass improves shared core code. Math and maps benefit
without changes to their layout implementations. A fresh full run before these
changes and a full run afterward used the same 66 cases, machine, runtime, and
benchmark settings described below. The earlier baseline tables remain unchanged.

### Changes

1. **Reuse owned geometry.** Private weak sets identify paths, drawings, and
   fragments produced by core. Constructors reuse validated immutable records;
   external records still go through copying and validation. `path_bounds` scans
   coordinates without allocating a replacement path. Layout metadata attaches
   to an owned fragment without recalculating its drawing and placement bounds.
   Stroke bounds also stop scanning once enough segments establish a miter join.
2. **Reduce SVG number formatting.** Integers bypass the rounding round trip.
   Each formatter caches up to 4,096 fractional values, reusing strings for
   repeated glyph coordinates. The precision and resulting output are unchanged.
   Caching stops if fewer than 64 of the first 512 fractional values hit the cache;
   this avoids a measured slowdown on line plots with mostly unique coordinates.
   The entry limit bounds retained cache growth; peak memory usage has not been
   benchmarked.
3. **Reduce work before cache lookup.** Each layout pass remembers an element's
   resolved style for its most recent immutable inherited style. Serialized style
   keys are reused, and requests use a smaller key representation. Caller-created
   styles are resolved again so mutable inputs remain observable. Resource epochs,
   reference sizes, coordinate/projection contexts, and math contexts remain part
   of cache identity.

### Measured results

Mean latency in milliseconds; speedup is the before/after ratio. These are
combined results from all three changes, not additive estimates of their effects.

| Case | Before (ms) | After (ms) | Speedup |
| --- | ---: | ---: | ---: |
| `core/layout/shapes-1000` | 18.940 | 12.236 | 1.55× |
| `core/layout/text-grid-100` | 34.466 | 13.941 | 2.47× |
| `core/layout/styled-paragraph` | 52.865 | 18.382 | 2.88× |
| `core/layout/scatter-plot-2000` | 18.834 | 10.007 | 1.88× |
| `math/layout/matrix-8x8` | 25.164 | 15.705 | 1.60× |
| `maps/layout/world-prepared-resource` | 20.914 | 8.195 | 2.55× |
| `maps/layout/states-albers` | 56.205 | 36.657 | 1.53× |
| `core/svg/text-grid-100` | 22.147 | 5.392 | 4.11× |
| `core/svg/styled-paragraph` | 44.882 | 26.284 | 1.71× |
| `math/svg/matrix-8x8` | 4.297 | 1.423 | 3.02× |
| `core/render/jsx-grid-100` | 65.419 | 26.282 | 2.49× |
| `math/render/inline-prose-20-formulas` | 30.790 | 14.372 | 2.14× |
| `maps/render/states-choropleth` | 53.478 | 42.438 | 1.26× |

The three root cache-hit cases fall from **2.7–2.9 µs to about 0.9 µs**
(2.97–3.22× faster). An intermediate run with geometry changes alone measured
scatter layout at 13.91 ms; style and query changes bring it down to 10.01 ms.
The scatter diagnostic still reports 2,032 queries, 33 layouts, and 1,999 hits:
the gain comes from less work per query and placement, with the same cache reuse.

Untimed allocation diagnostics confirm the removed work. Paragraph command
freezes fall from 269,442 to 89,814, and total freezes from 699,267 to 240,196.
The states map falls from 102,552 command freezes to 25,638. Both now freeze each
final path command once in these workloads.

Across the final full run, no case is more than 4.4% slower; that largest change
is in unchanged matrix parsing. Construction, parsing, and map preparation remain
within the variation seen in the original repeated runs. SVG map ratios range
from 0.99× to 1.09×, consistent with fewer repeated coordinates. Line-plot SVG
serialization is unchanged at 1.151 ms after adding the cache cutoff.

Targeted and intermediate runs checked the gains during implementation; the
table uses one final full run. For example, repeated states-layout measurements
ranged from 33.6 to 36.7 ms. Treat the numbers as point estimates, with the large
text and geometry gains providing stronger evidence than small timing changes.

### Correctness and remaining work

- All 66 benchmark outputs match the baseline: object keys were sorted before
  comparing complete construction/layout results, and SVG strings match exactly.
- Root `bun run test` and `bun run typecheck` pass across all 11 packages.
- Added regressions cover external mutable and shallow-frozen geometry, fragment
  metadata and connection ownership, mutable inherited styles, invalid inputs,
  and number formatting across rounding boundaries and cache capacity.
- This pass preserves output size. Reusing glyph outlines through SVG definitions,
  reducing placement aggregation further, and optimizing geographic projection
  remain possible follow-ups. Updated profiles appear above; the original baseline
  profiles below remain for comparison.

## Original findings and priorities

The profiles and original result tables below describe the code before the
optimization follow-up above.

**The first optimization target is repeated geometry construction in core.**
Drawing and fragment creation repeatedly copy, validate, and freeze data that
earlier stages already own. This cost appears in text, ordinary shapes, scatter
plots, math, and maps. Improving these shared operations should reach more of the
suite than optimizing an individual element.

The next targets are SVG number formatting and layout-query overhead. Geographic
projection is also substantial, especially for Albers USA, but map rendering
spends considerable time in core's drawing machinery too.

| Priority | Target | Evidence | Workloads that benefit |
| --- | --- | --- | --- |
| 1 | Repeated drawing/path copies and fragment normalization | `Object.freeze` takes 19–56% of sampled time in the eight profiled layout/full-render workloads; fragment construction is another view of much of the same work. | Core, math, maps |
| 2 | SVG coordinate formatting | Number formatting accounts for 79% of paragraph serialization, 27% of the full JSX grid render, and 22% of inline-math rendering. | Text-heavy SVGs; other path-heavy output |
| 3 | Work before a layout cache lookup and repeated placement/bounds work | Scatter layout records 1,999 cache hits but still costs 18.86 ms; JSON serialization takes 20% of its profile. | Scatter plots, large element trees, math |
| 4 | Geographic projection, resampling, and clipping | D3 occupies 38% of the US states layout profile and 15% of the prepared world layout profile. | Maps |

These are priorities for experiments, not measured speedups. Profile categories
overlap: for example, a freeze inside path copying inside fragment construction
belongs to all three call stacks. Their percentages must not be added.

“Common” here means shared across the benchmark workloads. We do not have usage
frequencies that would support a weighted estimate of typical application time.

## Measurement basis

- AMD Ryzen 9 7900X, Linux x86-64, kernel `6.18.53-1-lts`; Bun `1.4.2`,
  Mitata `1.0.34`.
- Two unprofiled full runs, beginning at 17:28:53 and 17:37:33 UTC. All 66 cases
  completed. Tables below use the second run's mean latency.
- Median absolute change between the two runs: **0.97%**; largest: **5.03%**.
  The ranking is stable. Small differences need more repeats before drawing
  conclusions; these two runs do not establish confidence intervals.
- Benchmarks ran sequentially, without concurrent agent-launched builds, tests,
  or benchmarks. CPU frequency was not locked.
- Nine separate CPU profiles used one benchmark operation per process: setup,
  five warmup calls, then a loop lasting at least five seconds. Shares below are
  weighted by profile sample time inside that loop, excluding startup and setup.
  Sampling is approximately 1 ms; JIT inlining can affect symbol attribution.
  Latencies come from the unprofiled runs, not these diagnostic loops.
- Separate, untimed diagnostics wrapped `Object.freeze` and `LayoutPass.layout`
  for one operation to count calls, queries, and output geometry. These wrappers
  were not present during benchmarks or CPU profiles.

Source revisions, with the new benchmark scripts still uncommitted:

| Repository | HEAD |
| --- | --- |
| Workspace | `b57f36ace3e8ab13ab088be6ceb0274e4d3811f2` |
| Core | `5f01b2be56bafa3f9727e95f791339a8abf6866c` |
| Math | `a994b35599de3591b4e88dbeb8f894a14114ac2b` |
| Maps | `31d8e515c4d927046daf0f2dba769f9b6b724a62` |

Most layout cases use an existing element tree, a new layout pass per operation,
and an already-warmed font provider. SVG cases serialize a prepared fragment.
Cache-hit cases reuse the exact element, pass, and query. This suite measures
Bun rendering to SVG; browser painting, rasterization, PDF output, network I/O,
and process startup need separate measurements.

## Where the time goes

### 1. Text costs are dominated by outline geometry after shaping

The styled paragraph has 40 repeated prose sections and 40 bold spans. Its
construction costs only **0.027 ms**, but layout costs **52.65 ms** and SVG output
costs **44.37 ms**. The 100-cell text grid shows the same pattern: **0.039 ms** to
construct, **33.78 ms** to lay out, and **21.81 ms** to serialize.

The paragraph layout profile attributes:

- **53.4%** directly to `Object.freeze`.
- **33.0%** to stacks containing `copy_path` and **15.8%** to `transform_path`.
- **1.5%** to text preparation, **0.13%** to font code, and **0.08%** to line packing.

The [font provider](../gum-jsx-core/src/engine/fonts.ts#L166) already caches shaped
strings. Warm runs mostly hit that cache. The next stage,
[text layout](../gum-jsx-core/src/elems/text.ts#L259), transforms the cached outlines
into pixel coordinates for each word/run and creates drawing records for them.

One paragraph operation produces **89,814 path commands** in 520 paths and a
**1,960,000-byte SVG**. It performs **269,442 command freezes**, exactly three
times the final command count, and **699,267 total freeze calls**. The three
command passes are transformation, `draw_path`'s ownership copy, and the line
fragment's drawing copy. This happens with just two layout queries: the box and
its text child. The cost is primarily geometry volume, not a large element tree.

The resize case costs **168.37 ms for three widths**, or about 56.1 ms per width
averaged over the batch. The pass shares prepared text across those widths, but
each layout rebuilds positioned paths and line fragments. It makes **2,097,434
freeze calls** across the three layouts. A cache of shaped text alone cannot
remove this work.

**Suggested experiments:** reuse internally owned immutable paths/drawings at
ownership boundaries; retain scaled local glyph outlines and position them using
fragment transforms; consider SVG path reuse for repeated outlines if output
size remains important. Preserve kerning, paint order, ink bounds, inline math,
and font-resource invalidation while testing these changes.

### 2. Repeated fragment normalization is the broadest shared cost

[make_fragment](../gum-jsx-core/src/engine/fragment.ts#L107) copies every drawing,
normalizes placements, and recomputes ink, bounds, overflow, and outsets.
[LayoutPass.layout](../gum-jsx-core/src/engine/pass.ts#L117) then calls it again to
attach element metadata to an element's completed result. Owned child fragments
already retain their identity in `place_fragment`; drawing and path records
do not have the equivalent shortcut.

| Profiled operation | `make_fragment`, inclusive | `Object.freeze`, self |
| --- | ---: | ---: |
| 1,000 rectangles, layout | 63.8% | 19.7% |
| 2,000-point scatter plot, layout | 47.3% | 18.7% |
| 8×8 math matrix, layout | 56.0% | 24.0% |
| Styled paragraph, layout | 36.5% | 53.4% |
| Prepared world map, layout | 43.9% | 55.8% |
| US states, layout | 25.8% | 35.7% |

Even the rectangle case has **182,089 freeze calls** for 1,001 layout queries.
Increasing rectangle count from 100 to 1,000 increases layout from **1.89 ms** to
**18.99 ms**, almost exactly tenfold. The available size pair points toward a
large per-element cost; it does not demonstrate a quadratic scaling problem.

There is also a concrete unnecessary allocation in
[path_bounds](../gum-jsx-core/src/engine/path.ts#L73): it calls `map_path` to visit
coordinates. That helper constructs and freezes a complete replacement command
array, which the bounds calculation discards. Map paths use this route when
`draw_path` has no supplied ink bounds. The states diagnostic freezes **102,552
commands** for **25,638 final commands**, a fourfold count; the prepared world
case has the same ratio. These include the discarded bounds pass and subsequent
drawing copies.

**Suggested first changes:**

1. Make bounds scanning a read-only traversal, preserving the existing bounds
   definition and validation contract.
2. Introduce an internal ownership marker for validated immutable drawing/path
   records, so downstream constructors can safely reuse them. Keep copying and
   validation for caller-supplied mutable records.
3. Attach metadata to owned fragments without copying all drawings and
   recomputing unchanged geometry. Preserve connection and fitting behavior.

Measure these separately. Removing every `Object.freeze` would change the
immutability contract and would leave the repeated copying and bounds work.

### 3. SVG number formatting is a second large, independent bottleneck

[path_data](../gum-jsx-core/src/engine/path.ts#L85) serializes every coordinate.
The default [number formatter](../gum-jsx-core/src/engine/output_number.ts)
converts each nonzero value through `value.toFixed(10)`, `Number(...)`, and
`String(...)`.

For paragraph serialization, path serialization accounts for **90.6%** of sampled
time. Number formatting, including its callees, accounts for **78.7%**; `toFixed`
alone accounts for **42.1%**. Number formatting also takes **26.8%** of the full
JSX-grid render and **22.2%** of the full inline-math render. Thus it remains
material when construction and layout are included.

**Suggested experiments:** cache repeated numeric strings within a render, avoid
the rounding round trip for values proven to produce the same representation,
and serialize reused immutable paths once per precision setting. Compare both
time and memory, especially with mostly unique map coordinates. Any replacement
must preserve the current precision, tiny-number, negative-zero, and finite-value
behavior. Lowering precision changes output and is not an equivalent optimization.

### 4. Cache hits still do enough work to matter at large counts

A root cache hit costs about **2.7–2.8 µs**, and the three cache cases successfully
avoid their expensive subtrees. However, `LayoutPass.layout` normalizes requests,
resolves style and context, and creates a JSON key before looking up that hit.

The scatter plot is a useful example: **2,032 queries, 33 actual layouts, and 1,999
hits**, yet layout takes **18.86 ms**. JSON serialization is **20.0%** of its sampled
time. The corresponding shares are **11.1%** for 1,000 rectangles and **8.0%** for
the math matrix. The scatter case also spends substantial time building
placements and aggregating fragment geometry after finding its cached marker.

The [Points implementation](../gum-jsx-core/src/elems/marks.ts#L461) shares marker
shapes already; additional marker caching alone would miss these costs.

**Suggested experiments:** canonicalize repeated requests/styles/contexts once,
use compact keys or nested maps where semantics allow, and avoid duplicate child
queries for identical marker allocations within one layout. Keep resource epochs,
reference sizes, coordinates, math styles, and font changes in cache validity.
Recheck mixed-context correctness tests alongside both hit and fresh-pass cases.

### 5. Maps combine core path costs with real projection work

The largest individual map case is Albers USA: **55.49 ms** for layout and
**8.39 ms** for SVG output. World and European map layouts range from **20.40 ms**
to **27.10 ms**. TopoJSON preparation costs only about **1.08 ms** for either atlas,
and atlas cloning costs **1.35–1.70 ms**.

The states profile spends **38.5%** in D3 projection/streaming code, including
resampling, rectangle clipping, and spherical calculations. It also spends
**50.1%** in core drawing code; `Object.freeze` accounts for **35.7%** of the
whole profile. The prepared world case spends **14.8%** in D3 and **81.8%** in
core drawing code.
Core's path machinery is therefore a major map optimization target as well.

The map path starts in [projected_commands](../gum-jsx-maps/src/path.ts#L54),
then passes through `draw_path` and fragment creation. Projection fitting and
clipping are in [projection.ts](../gum-jsx-maps/src/projection.ts#L128);
[GeoMap.layout](../gum-jsx-maps/src/map.ts#L137) projects feature fills and the
selected border mesh.

Preparing the world source in advance still leaves **20.68 ms** of layout work.
The ordinary world case takes **24.26 ms**, but it also uses different padding
(10 px versus 0), so that difference is not a controlled estimate of preparation
savings. Likewise, the choropleth uses interior borders while the states layout
case draws all borders; its **52.59 ms** full-render result is not directly
subtractable from the latter's layout time.

**Suggested experiments:** first apply the shared core path changes. Then measure
matched projection cases with identical padding, border modes, and data. Assess
fitting reuse, avoiding projection of irrelevant features, and appropriate input
simplification or projection precision. Verify geographic bounds, antimeridian
behavior, inset regions, and shared borders when making those changes.

### Lower priorities from this suite

- **JSX parsing/evaluation:** the grid evaluates in **0.317 ms**, about **0.48%**
  of its **66.45 ms** full render. The full-render hotspot should not be attributed
  to JSX merely because the case starts from JSX.
- **TeX parsing:** parse-only means are **0.013–0.525 ms**, about **1–2%** of their
  corresponding layout means. The 8×8 matrix costs **25.79 ms** to lay out;
  fragment and geometry work are the stronger first targets.
- **Font loading:** the quadratic formula takes **1.65 ms** with warm fonts and
  **2.31 ms** with new fonts. Reusing a provider matters for repeated small
  renders, but it already happens in the expensive warm-font cases above.
- **Source construction:** layout is the largest of construction, layout, and
  SVG stages for all nine core fixtures. Construction is measurable for large
  point collections, but reducing it alone leaves most of their cost intact.

## Next measurements

Profile the second pass before choosing more changes, focusing on remaining
fragment traversals, text geometry reuse, SVG serialization, and map fitting.
Preserve the current input sizes so comparisons remain useful. Track SVG size
and geometry/query counts as well as latency, and investigate the higher peak
RSS seen in stress tests before expanding any cache.

Add matched controls where the current suite is incomplete:

- A text resize case with an already-prepared pass and new widths, alongside the
  existing three-width batch and exact cache-hit case.
- Identical raw/prepared map sources with matching viewport and border options.
- Larger size sweeps for grids, point sets, paths, and matrices to test scaling.
- Repeated application renders that reflect actual element/pass/font lifetimes,
  plus browser measurements when interactive-editor latency is the target.

Mitata's heap deltas are not allocation totals or retained-memory measurements;
do not infer a leak or a dominant GC cost from them. Some slow cases have only
9–12 retained timing samples after trimming, making their reported p99 weak
evidence. The conclusions here use mean latency, repeat-run agreement, profiles,
and operation counts instead.

## Reproducing the investigation

From the workspace root:

```sh
bun run perf --json > /tmp/gum-perf-full.json
bun run perf --filter '^core/(layout|svg)/styled-paragraph$'
bun --cpu-prof --cpu-prof-dir=/tmp test/perf.ts --filter '^core/layout/shapes-1000$'
```

The last command is convenient for exploration but includes Mitata's overhead.
For profiles like the ones in this report, save the following as
`/tmp/gum-perf-profile.ts`, replacing `/path/to/gum-jsx` with the checkout path:

```ts
import { cases as core } from '/path/to/gum-jsx/gum-jsx-core/test/perf/cases'
import { cases as math } from '/path/to/gum-jsx/gum-jsx-math/test/perf/cases'
import { cases as maps } from '/path/to/gum-jsx/gum-jsx-maps/test/perf/cases'

const operation = { ...core, ...math, ...maps }[process.argv[2]]()
for (let i = 0; i < 5; i++) operation()
const start = performance.now(), start_us = Date.now() * 1000
let result: unknown, iterations = 0
while (performance.now() - start < 5000) {
  result = operation()
  iterations++
}
console.log({ start_us, end_us: Date.now() * 1000, iterations, result_type: typeof result })
```

```sh
bun --cpu-prof --cpu-prof-dir=/tmp /tmp/gum-perf-profile.ts core/layout/styled-paragraph
```

Use the printed time window to exclude setup and warmup from the profile. Compute
self shares from sampled leaf frames and inclusive shares from each sample's
ancestors, counting a category only once per sample. The untimed count diagnostics
similarly ran setup first, temporarily wrapped `Object.freeze` and
`LayoutPass.prototype.layout`, executed one operation, restored both methods, and
walked the returned fragments to count path commands and serialized bytes.

## Full results

All values are **milliseconds per operation** from the second full run. The
resize case includes three widths. Cache cases are shown to six decimal places
because their times are in microseconds. Stage cases are measured independently;
adding their means is not a separately measured full render. See the
[core](../gum-jsx-core/test/perf/README.md),
[math](../gum-jsx-math/test/perf/README.md), and
[maps](../gum-jsx-maps/test/perf/README.md) notes for timing boundaries.

| Case | Mean | Median | p99 |
| --- | ---: | ---: | ---: |
| `core/construct/shapes-100` | 0.111 | 0.104 | 0.255 |
| `core/layout/shapes-100` | 1.894 | 1.765 | 3.743 |
| `core/svg/shapes-100` | 0.138 | 0.135 | 0.175 |
| `core/construct/shapes-1000` | 1.385 | 1.355 | 1.927 |
| `core/layout/shapes-1000` | 18.987 | 18.702 | 21.014 |
| `core/svg/shapes-1000` | 1.465 | 1.429 | 1.979 |
| `core/construct/nested-stacks-243-leaves` | 0.399 | 0.387 | 0.677 |
| `core/layout/nested-stacks-243-leaves` | 9.847 | 9.636 | 11.448 |
| `core/svg/nested-stacks-243-leaves` | 0.494 | 0.486 | 0.588 |
| `core/construct/wrap-stack-200` | 0.222 | 0.214 | 0.535 |
| `core/layout/wrap-stack-200` | 5.256 | 5.166 | 6.150 |
| `core/svg/wrap-stack-200` | 0.095 | 0.091 | 0.116 |
| `core/construct/text-grid-100` | 0.039 | 0.038 | 0.052 |
| `core/layout/text-grid-100` | 33.784 | 33.482 | 35.170 |
| `core/svg/text-grid-100` | 21.810 | 21.452 | 23.925 |
| `core/construct/styled-paragraph` | 0.027 | 0.027 | 0.027 |
| `core/layout/styled-paragraph` | 52.651 | 51.948 | 53.910 |
| `core/svg/styled-paragraph` | 44.368 | 44.073 | 44.942 |
| `core/construct/line-plot-2000` | 1.385 | 1.361 | 1.996 |
| `core/layout/line-plot-2000` | 5.226 | 5.055 | 6.681 |
| `core/svg/line-plot-2000` | 1.115 | 1.107 | 1.206 |
| `core/construct/scatter-plot-2000` | 2.385 | 2.331 | 3.120 |
| `core/layout/scatter-plot-2000` | 18.856 | 18.654 | 19.659 |
| `core/svg/scatter-plot-2000` | 3.843 | 3.726 | 4.915 |
| `core/construct/network-64-nodes-112-edges` | 0.330 | 0.322 | 0.403 |
| `core/layout/network-64-nodes-112-edges` | 12.836 | 12.644 | 14.133 |
| `core/svg/network-64-nodes-112-edges` | 2.557 | 2.521 | 3.220 |
| `core/evaluate/jsx-grid-100` | 0.317 | 0.307 | 0.475 |
| `core/render/jsx-grid-100` | 66.449 | 65.403 | 72.706 |
| `core/render/line-plot-2000` | 7.810 | 7.753 | 8.838 |
| `core/cache/nested-stacks-hit` | 0.002805 | 0.002804 | 0.002924 |
| `core/layout/paragraph-resize-3-widths` | 168.372 | 170.074 | 173.626 |
| `core/fonts/new-provider-first-text-layout` | 3.263 | 3.201 | 4.302 |
| `math/parse/quadratic` | 0.013 | 0.012 | 0.020 |
| `math/layout/quadratic` | 1.268 | 1.240 | 1.940 |
| `math/svg/quadratic` | 0.247 | 0.243 | 0.324 |
| `math/parse/nested-fractions` | 0.026 | 0.026 | 0.026 |
| `math/layout/nested-fractions` | 2.065 | 2.045 | 2.917 |
| `math/svg/nested-fractions` | 0.388 | 0.381 | 0.496 |
| `math/parse/operators` | 0.041 | 0.040 | 0.057 |
| `math/layout/operators` | 2.554 | 2.521 | 3.422 |
| `math/svg/operators` | 0.530 | 0.523 | 0.666 |
| `math/parse/matrix-8x8` | 0.525 | 0.503 | 1.184 |
| `math/layout/matrix-8x8` | 25.786 | 25.163 | 28.635 |
| `math/svg/matrix-8x8` | 4.169 | 4.105 | 4.966 |
| `math/render/quadratic-warm-fonts` | 1.646 | 1.630 | 1.851 |
| `math/render/quadratic-new-fonts` | 2.309 | 2.275 | 3.459 |
| `math/cache/matrix-8x8-hit` | 0.002783 | 0.002761 | 0.002954 |
| `math/render/inline-prose-20-formulas` | 30.723 | 30.461 | 31.952 |
| `maps/data/world-clone` | 1.346 | 1.342 | 1.408 |
| `maps/data/states-clone` | 1.697 | 1.692 | 1.771 |
| `maps/data/filter-europe` | 1.350 | 1.346 | 1.431 |
| `maps/prepare/world-topojson` | 1.081 | 1.008 | 4.175 |
| `maps/prepare/states-topojson` | 1.082 | 0.994 | 3.199 |
| `maps/prepare/world-geojson` | 0.007 | 0.007 | 0.007 |
| `maps/layout/world-natural-earth` | 24.263 | 23.956 | 25.815 |
| `maps/svg/world-natural-earth` | 5.995 | 5.911 | 7.059 |
| `maps/layout/world-orthographic` | 20.401 | 19.979 | 21.934 |
| `maps/svg/world-orthographic` | 4.190 | 4.132 | 5.205 |
| `maps/layout/states-albers` | 55.492 | 55.513 | 56.456 |
| `maps/svg/states-albers` | 8.393 | 8.200 | 11.542 |
| `maps/layout/europe-clipped` | 27.101 | 26.701 | 28.785 |
| `maps/svg/europe-clipped` | 6.122 | 5.953 | 7.280 |
| `maps/layout/world-prepared-resource` | 20.679 | 20.486 | 21.900 |
| `maps/cache/world-hit` | 0.002660 | 0.002654 | 0.002800 |
| `maps/render/states-choropleth` | 52.586 | 52.306 | 53.442 |
