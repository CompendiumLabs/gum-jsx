# Positions and general coordinates

Status: implemented and validated; all five steps are complete as of 2026-09-27.
The decisions below were approved for the breaking coordinate change before Gum 2.0.

## Goal

Replace element placement props `x` and `y` with a single `pos` prop, and let
projections map named coordinate records to named coordinate records. Source
coordinates can then describe polar, geographic, three-dimensional, or other
spaces without assigning every dimension to an artificial `x` or `y` slot.

The existing layout boundary supports this: source positions are projected
before placement and drawing. Resolved points, fragment offsets, bounds, and
rendering commands continue to use two-dimensional pixel geometry.

## Proposed API

### Element positions

```jsx
<Text pos={[0.5, 0.5]} anchor="center">Center</Text>
<Text pos={{x: px(20), y: em(2)}}>Local position</Text>
<Text pos={{theta: pi / 4, r: 0.8}}>Polar position</Text>
<Text pos={{x: 1, y: 2, z: 3}}>Three-dimensional input</Text>
```

- `pos={[x, y]}` is shorthand for `pos={{x, y}}`.
- Numeric records may contain any set of named dimensions. The active projection
  interprets those names and must receive the entire record.
- Local positions use `{x, y}` or a pair of lengths. In Group and Overlay, bare
  numbers retain their fractional meaning.
- In Graph, numeric positions pass through the active projection and then the
  graph's limits and flips. Without a projection, data positions require `x`
  and `y`.
- A supplied Cartesian position requires both components. A custom projection
  may accept a different set of dimensions, including a single named dimension.
- Omitting `pos` preserves the container's unpositioned behavior. In Graph, this
  means no placement offset; it must not become an implicit projected `{x: 0,
  y: 0}`. Element defaults such as Node's origin remain explicit defaults.
- `anchor` keeps its existing meaning: the point on the child placed at `pos`.
  The immediate parent still owns placement.

### Projections

The conceptual contract becomes:

```ts
type Coordinate = Readonly<Record<string, number>>
type ProjectionFunction = (point: Coordinate) => Coordinate | null
```

The contract is a flat record of finite numbers on each side, with `null` for an
unavailable point. Inputs and outputs are copied and frozen; callbacks remain
pure, and Projection identity continues to participate in layout caching.

```jsx
<Graph
  aspect={1}
  xlim={[-1, 1]}
  ylim={[-1, 1]}
  projection={({theta, r}) => ({
    x: r * cos(theta),
    y: r * sin(theta),
  })}
>
  <CoordLine
    points={linspace(0, tau, 121).map(theta => ({theta, r: 0.8}))}
    stroke={blue}
    fill={none}
  />
  <Text pos={{theta: pi / 4, r: 0.8}} anchor="center">
    45°
  </Text>
</Graph>
```

A Projection can produce another named space. Graph's final projection result
must contain finite `x` and `y`; those are the coordinates consumed by viewport
mapping. Additional output dimensions can remain available to callers composing
projections. Graph reports a clear error if its final result lacks `x` or `y`.

Graph continues to accept a Projection object or a callback. Projected graphs
still require explicit output-space `xlim` and `ylim`, or `coord`.

### Point-bearing props

Use the same source-coordinate representation for projected `points`, `from`,
`to`, `segments`, `tip`, `origin`, and `center` inputs. This includes Points,
CoordLine, Spline, RoundedLine, Arrow, Segments, ArrowHead, Ray, and Arc centers,
plus Line and Polyline when `space="data"`.

Parametric sampling through `f(t)` should also preserve arbitrary named records.
Marker callbacks should receive the complete source coordinate. Construction
still evaluates samplers and marker callbacks once; projection happens during
layout when the coordinate frame is known.

## Coordinate and geometry rules

### Separate source coordinates from resolved points

Introduce helpers for reading and validating general source records. Keep the
existing strict 2D geometry helpers for drawing, offsets, vectors, sizes, and
other operations whose meaning depends on `x` and `y`.

The data path becomes:

```text
source tuple or record
  -> normalize tuple shorthand; preserve every named dimension
  -> apply projection, if present
  -> require finite x and y for Graph
  -> apply limits and flips
  -> resolved pixel point
```

Local positions resolve their lengths directly. Arbitrary named records require
a projection before they can become local geometry.

### Units and missing samples

- Numeric data coordinates are the only inputs to projections.
- A Cartesian pair of tagged lengths bypasses projection, as it does today.
  `space="local"` continues to bypass data mapping for mark geometry.
- Under projection, mixing a data number with a local length remains an error.
  Ordinary Cartesian layouts retain their existing mixed-length behavior.
- A coordinate with custom dimension names and length-valued components is an
  error; lengths belong to local Cartesian geometry.
- Preserve null and nonfinite sample gaps before projection. General sample
  validation must examine all supplied numeric dimensions instead of only `x`
  and `y`. Malformed records should produce useful diagnostics.
- Direct Projection calls require finite inputs and finite non-null outputs.
  Returning `null` is the supported way to hide a projected point.
- Hidden annotations and markers are omitted. Lines split at hidden samples,
  and arrowheads remain attached only to visible original endpoints.

### Bounds and Cartesian operations

Complete explicit limits now bypass source bounds discovery. This allows
projected annotations with `{theta, r}` or `{x, y, z}` positions without invoking
Cartesian source-bound calculations. Marks and samplers preserve complete
source records. Ordinary graphs with inferred limits retain their Cartesian
bounds behavior and ignore samples with any nonfinite dimension.

Some elements construct geometry before projection using explicit axes:

| Operation | Proposed treatment |
|---|---|
| Fill with two explicit point arrays | Accept general coordinates on both boundaries; preserve matching indices and gaps. |
| Fill with a scalar boundary | Require Cartesian source coordinates because `direction` selects an axis to replace. |
| Bars | Continue constructing opposite corners from Cartesian values, positions, bases, and widths, then project those corners. |
| Arc | Accept a general projected center; projected radii still require local lengths. |
| Field and SymField | Keep Cartesian vector arithmetic and sampling domains; general named vectors need a separate contract. |
| `fx`, `fy`, `xvals`, and `yvals` sampling | Keep their explicit Cartesian meanings; general coordinates use `f(t)`. |
| Plot axes and Network | Migrate placement to `pos`; retain their current Cartesian coordinate behavior. |

Projection changes supplied points. Curve construction, marker dimensions,
stroke widths, and text layout continue to operate in the established spaces.
Automatic path sampling, nonlinear bounds inference, inverse projection, and
general geometric clipping remain outside this change.

## Accepted decisions

1. **Tuple names.** Always expand `[a, b]` to `{x: a, y: b}`. Named spaces use
   objects. Higher-dimensional tuples and ordered dimension schemas are outside
   this implementation.
2. **Projection composition.** Support record-to-record calls and manual
   composition first. A public chaining helper or Graph projection list can
   follow if needed; composition must propagate `null`.
3. **GeoMap names.** Use `{lon, lat}` as the descriptive child-coordinate form,
   with the existing `[longitude, latitude]` shorthand retained through a GeoMap
   adapter accepting `{x, y}`. Reject inputs that mix the two name sets. GeoJSON
   and the map library's own coordinate arrays keep their established formats.
4. **TypeScript contract.** Distinguish source coordinates, Cartesian length
   positions, and resolved pixel points. Named callback destructuring receives
   contextual numeric types under strict TypeScript. Cross-element inference
   from a JSX parent's projection is outside this contract.
5. **Placement props.** Built-in placement uses `pos`. The `x` and `y` props
   receive the same handling as other unknown props. Custom component parameters
   may still be named `x` and `y`; migrate their placement forwarding deliberately.

### Core names selected for step 1

- `Coordinate<T = number>`: a readonly record of named components. The numeric
  default is the projection contract; the generic reader can also preserve
  source length components before their interpretation.
- `CoordinateValue<T = number>`: a record or `[x, y]` source shorthand.
- `CoordinatePosition`: a numeric record or `PointValue<Length>`. Only Cartesian
  local positions may contain lengths.
- `read_coordinate`: copy/freeze the representation and expand tuples; leave
  nonfinite sample handling to the consumer.
- `copy_coordinate`: require a nonempty record of finite numbers and return an
  immutable snapshot. Direct Projection inputs and outputs use this boundary.
- `ProjectionFunction`: the dynamic `(Coordinate) => Coordinate | null` contract.
  It has no dimension schema or schema-specific generics. Named destructuring
  works through contextual typing; required dimensions are interpreted by the
  callback and validated at the final Cartesian mapping boundary.
- `Point`, `PointValue<Length>`, and the existing 2D geometry helpers retain their
  separate resolved-geometry and Cartesian-length roles.

## Implementation roadmap

### 1. Establish the coordinate contract

- [x] Settle the decisions above and choose public type/helper names.
- [x] Add source-record normalization and validation separately from 2D geometry.
- [x] Change Projection to immutable record input/output, retaining identity
      caching, purity expectations, and null visibility.
- [x] Update `map_point` and `coordinate_point` to preserve source dimensions
      until projection, then validate the final Cartesian result.
- [x] Add focused checks for record preservation, dimensions beyond two, units,
      invalid results, null propagation, and projection cache separation.

Primary files: `gum-jsx-core/src/engine/{coordinate,projection,coordinates}.ts`,
public exports, and relevant tests under `gum-jsx-core/test/`.

Validation: workspace tests and typechecks pass, including 11 new coordinate
checks, 12 migrated projection checks, and 213 runnable docs examples across
the docs suite's viewport sizes. Public declaration emission also passes.
GeoMap's existing pair-based geographic function now has a record adapter, and
the existing polar example uses the new callback signature. Step 2 below adds
`pos`; named GeoMap inputs and built-in mark normalization remain in later steps.

### 2. Replace placement props

- [x] Replace `PositionSpec.x/y` with `pos`.
- [x] Update Group, Overlay, Graph child placement, Network bounds, and Node
      defaults. Preserve child font references, anchors, and allocation rules.
- [x] Preserve the difference between omitted positions and explicit zero.
- [x] Migrate constructor props, JSX, component forwarding, and placement tests.

Primary files: `gum-jsx-core/src/elems/{group,placement,graph,network}.ts` and
the shared element prop contract.

The `x` and `y` props receive ordinary unknown-prop handling. Custom components
can consume those input parameters during building or normalization and produce
`pos`. A supplied position is atomic; overrides do not merge its components with
defaults. Invalid local positions report `pos` diagnostics, and both tuple and
record forms use the child's local font.

The explicit-limits bounds change moved forward from step 3 because projected
Node annotations already need it. Step 3 extends named positions to mark geometry;
step 4 adds geographic dimension aliases.

Validation: workspace tests, typechecks, and public declaration emission pass.
Seven placement checks cover units, omitted/data/local zero, named and hidden
annotations, Node bounds/defaults, source snapshots, atomic overrides, and invalid
positions. All 426 SVG snapshots (213 docs examples at two viewport sizes) match
the pre-migration output exactly.

### 3. Preserve general coordinates through marks and sampling

- [x] Audit every pre-projection `read_point` call, including normalization,
      finite runs, bounds discovery, and callback arguments.
- [x] Generalize the projected point-bearing props and parametric `f(t)` output.
- [x] Update Points normalization so extra dimensions survive construction.
- [x] Support explicit Fill boundaries and enforce the Cartesian rules above
      for operations that synthesize coordinates.
- [x] Make explicit projected limits independent of Cartesian source bounds
      (completed with step 2 for projected Node annotations).
- [x] Test the same named coordinates in an annotation, marker, line, arrow,
      and sampled curve, including hidden points and resize behavior.

Primary files: `gum-jsx-core/src/elems/{marks,shapes,symbolic,bars}.ts`,
`gum-jsx-core/src/lib/sampling.ts`, and coordinate bounds helpers.

Marks now preserve all numeric dimensions through projection. Parametric
samplers and Points callbacks copy and freeze complete source records at
construction. Points infers callback field types from its input points;
SymPoints callbacks receive numeric Coordinate records. Local Cartesian lengths
retain their representation and bypass projection. Null and nonfinite samples
split paths, paired Fill boundaries split together, and Arrow heads remain on
visible original endpoints. Scalar Fill boundaries and Field/SymField reject
non-Cartesian sources; Bars still generate Cartesian corners. Edge waypoints
keep their Cartesian type independently of Arrow's generalized inputs.

Validation: workspace tests, typechecks, and declaration emission pass. Ten new
test groups cover polar, three-dimensional, and single-dimension inputs for
every supported point prop, paired boundaries, hidden points, malformed data,
callback types and counts, snapshots, caching, and resize behavior. The runnable
polar example now uses named records. All 426 SVG snapshots remain identical.

### 4. Adapt maps and migrate the workspace

- [x] Adapt GeoMap's fitted projection and child positions to the chosen naming
      policy. Preserve fitting, rotation, padding, and visibility behavior.
- [x] Migrate package code, tests, API references, runnable examples, galleries,
      guides, and generated plugin references.
- [x] Audit React, editor, CLI, Markdown, and MCP examples and integration tests
      for placement props and pair-based projection callbacks.
- [x] Verify constructor and JSX forms, including object spreads. Existing JSX
      expressions already support tuples and records; no new grammar is expected.
- [x] Update migration and release documentation with the breaking contract.

GeoMap accepts `{lon, lat}`, `{x, y}`, and tuple shorthand for numeric child
coordinates. Its adapter requires a complete pair and rejects mixed geographic
and Cartesian names. Fitting, padding, rotation, bounds, source resources, and
visibility share the existing geographic projection. GeoJSON, TopoJSON, the
map's `center`, and geographic helper arrays keep their existing formats.

The workspace audit found stale map and graph references, which now describe
the implemented contract. Runnable map routes and city annotations use named
records; generated plugin references were rebuilt. Remaining placement-like
`x`/`y` occurrences belong to migration examples, historical design notes, or
custom component inputs that explicitly produce `pos`.

Integration tests cover records, tuple aliases, spreads, and callbacks through
React, the editor, CLI, Markdown, and MCP. React's prop extraction now selects
the ordinary constructor overload, preserving contextual
projection types and inferred Points fields while accepting React elements in
element-valued props and callback results. Its registry declarations refer to
exported constructor types so declaration emission remains portable.

Validation: all package suites and workspace typechecks pass, along with maps
and React declaration emission. All 426 SVG snapshots match, including the
migrated geographic examples. Step 5 records the final validation.

### 5. Validate the release change

- [x] Run affected package suites during implementation, then workspace
      `bun run test` and `bun run typecheck`.
- [x] Check public declaration emission and strict consumer typing for named
      projection callbacks and marker callbacks.
- [x] Render representative migrated Cartesian diagrams, Network layouts,
      polar curves, and GeoMap annotations; compare placement and geometry.
- [x] Add runnable named-coordinate examples, including a three-dimensional
      input projected into a two-dimensional graph.
- [x] Build the editor and regenerate plugin references through the existing
      workspace commands; verify examples through the usual docs checks.

Validation completed on 2026-09-27:

- `bun run test` and `bun run typecheck` pass for all eleven packages. The docs
  suite renders 214 examples at four widths and five bounded preview sizes.
- Core, math, maps, and React emit public declarations successfully. A separate
  strict TypeScript consumer passes against those declarations with
  `skipLibCheck: false`, and against the source entry points with the workspace's
  compiler settings. The declaration check uses all four emitted entry points
  without falling back to their source. It covers named callback destructuring,
  immutable and inferred Points fields, tuple and local-length callbacks,
  parametric sampling, projection composition, GeoMap children, and React
  callbacks returning elements. Negative checks reject tuple projection results
  and length-valued named dimensions.
- All 426 existing SVG snapshots (213 examples at two viewport sizes) match
  the pre-migration output exactly. The new
  [three-dimensional helix](../gum-jsx-docs/docs/gallery/code/projection_3d.jsx)
  adds two snapshots. Its curve, markers, axes, and labels share `{x, y, z}`
  records; marker sizes use the original `z` values. Its gallery page and the
  projection guide explain the mapping and drawing order.
- `bun run visual-test --output /tmp/gum-coords5/visual-report` renders 213
  examples with zero failures. This collection includes dedicated visual tests
  and excludes guides, so its count differs from the docs suite. PNG inspection
  confirms the Cartesian diagram, Network connections, polar curve, GeoMap
  route and annotations, and the helix have the intended geometry and placement.
- `bun run build` and `bun run plugin:build` pass. The generated plugin includes
  the new gallery example and projection guide. The editor's existing large
  chunk warning remains a nonblocking optimization item.

Validation logs, consumer fixtures, emitted declarations, snapshot comparisons,
the visual report, and inspected PNGs are in `/tmp/gum-coords5/` (temporary).
The coordinate change is ready for the release workflow described in
[RELEASE.md](./RELEASE.md).

## Migration details

| Existing source | Proposed source |
|---|---|
| `x={a} y={b}` | `pos={[a, b]}` or `pos={{x: a, y: b}}` |
| `{x: a, y: b, anchor: 'center'}` as placement props | `{pos: [a, b], anchor: 'center'}` |
| `projection={([x, y]) => [x + y, y]}` | `projection={({x, y}) => ({x: x + y, y})}` |
| Polar pairs `[theta, r]` interpreted by a callback | Named `{theta, r}` inputs and a matching callback |
| Cartesian `points`, `from`, and `to` pairs | Same tuple shorthand, expanded before projection |

Single-axis placements need a semantic migration. In an ordinary Cartesian
Graph, an omitted axis previously meant local zero, while a supplied numeric zero
means data zero. For example, `x={v}` may need `pos={[v, px(0)]}` to preserve its
position. Under an existing custom projection, the old placement code fills a
missing numeric component with data zero. Group and Overlay use local lengths.
Review these cases by container instead of applying one global replacement.

Also audit spreads and component defaults: separate `x` and `y` overrides become
one atomic `pos` value. A mechanical text replacement cannot preserve all such
merging behavior. Two-dimensional geometry fields in fragments, SVG paths,
vectors, and third-party geographic data retain their established meanings.

## Completion criteria

The change is complete when named records survive every supported input path,
all built-in placement uses `pos`, migrated examples retain their intended
geometry, and public docs describe one consistent coordinate contract. The
tests must demonstrate a projection that changes dimension names and one that
reduces more than two dimensions to `{x, y}`, alongside the existing Cartesian,
unit, visibility, and cache behavior.
