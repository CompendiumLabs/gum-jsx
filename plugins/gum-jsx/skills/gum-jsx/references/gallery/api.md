# Api gallery

<a id="clipping"></a>

## Clipping and transforms
The three placements show an original rectangle, a clipped fragment, and an
affine transform of that same clipped fragment. Clipping restricts painted ink
while preserving the child's allocation and overflow in the fragment tree.
The two clipped placements share their clip definition in SVG output.

This example uses the low-level fragment API from [Custom elements](../guides/custom_elements.md).
For ordinary composition, use [Box clipping](layout.md#box_clip),
[Group clipping](layout.md#group_clip), or [TransformBox](../elements/layout.md#TransformBox).

<a id="clipping-example"></a>

### Example

```jsx
// Clip and transform operate on measured results and keep overflow inspectable.
class Clipping extends Element {
  static layout(props, query) {
    const size = finish_size(make_size(320, 144), query.request, query.sizing)
    const [tile] = element_children(props.children)
    const leaf = query.child(tile, make_request({ width: exact(80), height: exact(60) }), size)
    const clipped = make_fragment({
      name: 'Clip', size: make_size(40, 40), clip: make_rect(0, 0, 40, 40),
      children: [place_fragment(leaf)],
    })

    return make_fragment({ size, children: [
      place_fragment(leaf, make_point(16, 32)),
      place_fragment(clipped, make_point(128, 32)),
      place_fragment(clipped, make_point(224, 32), [1.5, 0.4, -0.4, 1.5, 0, 0]),
    ] })
  }
}

return <Clipping><Rect fill={blue} stroke={none} /></Clipping>
```

---

<a id="repeated"></a>

## Reusing fragments
A custom parent queries one **Rect** description at two exact sizes. It places the
smaller fragment twice and the larger fragment once. Placing a completed fragment
does not run layout again; all three rectangles keep the same 3px stroke.

Use tree output with `--stats` to inspect allocations and layout queries. See
[Custom elements](../guides/custom_elements.md) for the parent protocol and
[Rendering](../guides/rendering.md) for the source-to-fragment pipeline.

<a id="repeated-example"></a>

### Example

```jsx
// A custom parent reuses one fragment at two positions and lays out a larger copy.
class Repeated extends Element {
  static layout(props, query) {
    const width = query.request.width.kind === 'natural' ? 432 : query.request.width.value
    const size = finish_size(make_size(width, width / 3), query.request, query.sizing)
    const [tile] = element_children(props.children)
    const unit = size.width / 27
    const small = query.child(tile, make_request({ width: exact(6 * unit), height: exact(4 * unit) }), size)
    const large = query.child(tile, make_request({ width: exact(9 * unit), height: exact(6 * unit) }), size)

    // Two placements share one result; the larger rectangle is a second layout.
    return make_fragment({ size, children: [
      place_fragment(small, make_point(unit, 1.5 * unit)),
      place_fragment(small, make_point(8.5 * unit, 1.5 * unit)),
      place_fragment(large, make_point(16.5 * unit, 1.5 * unit)),
    ] })
  }
}

return <Repeated>
  <Rect fill={blue} stroke={slate} stroke-width={px(3)} />
</Repeated>
```
