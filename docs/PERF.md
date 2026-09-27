# Gum 2.0 performance findings

Measured on September 27, 2026, using the 66-case core, math, and maps suite.

## Findings and priorities

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

Start with the bounds traversal and owned-geometry experiments, then SVG number
formatting, then query keys/fragment placement. Run the affected cases and the
full suite after each change. Preserve the current input sizes so comparisons
remain useful. Track SVG size and geometry/query counts as well as latency.

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
