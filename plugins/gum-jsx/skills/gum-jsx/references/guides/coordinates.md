# Coordinates

Data coordinates are distinct from layout lengths. Numeric graph points are data;
width, height, stroke widths, and other lengths use the ordinary [units](units.md).
Unit strings in point coordinates are local lengths: `"50%"` uses half the
corresponding drawing dimension, and `"10px"` is a pixel offset. They do not pass
through data-axis mapping. Bare numeric points keep their data meaning.

`infer_coordinates(children, options)` returns an immutable
{xlim,ylim,flip_x,flip_y} record. An optional core `Projection` maps coordinate
pairs before the axis mapping. `map_point(point, coordinates, size)` maps to
pixels, returning `null` if the projection omits the point. `unmap_point` reverses
linear mapping; custom projections and zero-sized frames cannot be inverted.
point_bounds, merge_bounds, and `data_bounds(element)` support inference.

Point arguments accept `{x,y}` or `[x,y]`; point lists can mix the two.
Non-null mapping results have named `{x,y}` coordinates. See [Point values](point_values.md)
for the shared input convention and examples using zip and length tuples.

A custom element reports bounds with a static method:

```ts
class Mark extends Element {
  static data_bounds(_props: ElementProps): DataBounds {
    return { xlim: [0, 10], ylim: [-1, 1] }
  }
  static layout(props: ElementProps, query: LayoutQuery) {
    // Map data with query.coordinates and the selected pixel size here.
    return make_fragment({ size: shape_size(query.request, query.sizing) })
  }
}
```

These helpers and types are exports from `gum-jsx-core`. The factory form
`define_element` also accepts `data_bounds` in its fourth options argument.
See [Custom elements](custom_elements.md) for both forms and inherited hooks.

Ordinary containers contribute descendant bounds. A data_bounds callback is a
boundary: returning null excludes the subtree. **Graph** and **Plot** use this to
isolate their internal data.

LayoutQuery and LayoutContext expose coordinates. query.child accepts a fifth
context argument: {coordinates} establishes a context, {coordinates:null} clears
it, and omission inherits it. Coordinates participate in layout-cache identity.
query.prepare must stay independent of coordinates, requests, and references.
The engine transports context; inference and mapping remain element policies.

Use `coordinate_point(value, size, query.measure, query.coordinates)` when a
custom element accepts either numeric data pairs or tagged local lengths.
Pairwise mapping supports polar and geographic projections; mapping x and y
separately with `coordinate_length` cannot do that. See [Projections](projections.md)
for the callback contract and examples.

## Example

```jsx
// Directed limits reverse x while annotations and custom markers remain upright.
const samples = [
  [1, 2],
  [3, 4],
  [6, 3],
  [8, 7],
]
return <Box padding={em(1.75)}>
  <Graph aspect={1.5} xlim={[10, 0]} ylim={[0, 8]}>
    <Mesh2D xlim={[0, 10]} ylim={[0, 8]} />
    <Spline points={samples} stroke={blue} stroke-width={px(2)} />
    <Points
      points={samples}
      point-size={(p, i) => px(8 + i * 2)}
      shape={<Square fill={blue} stroke={white} stroke-width={px(1)} />}
    />
    <Text x={8} y={7.25} anchor={['center', 'end']} font-size={em(0.9)} color={blue}>Peak</Text>
    <HAxis lim={[10, 0]} />
    <VAxis lim={[0, 8]} />
  </Graph>
</Box>
```
