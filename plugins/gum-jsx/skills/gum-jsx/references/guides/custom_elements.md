# Custom elements

Prefer a [functional JSX component](jsx.md) when existing elements can express
the layout. Extend `Element` when you need a new primitive or layout policy.
The inherited constructor handles the name, defaults, source ownership, and
layout descriptor. An ordinary primitive needs only a static layout method.

```ts
import {
  Element, element_children, px, shape_size, make_fragment, make_rect, draw_rect,
  green, none, red,
  type ElementProps, type LayoutQuery,
} from '@gum-jsx/core'

class Tile extends Element {
  static defaults: Partial<ElementProps> = {
    width: px(80), height: px(40), fill: green,
  }

  static layout(props: ElementProps, query: LayoutQuery) {
    if (element_children(props.children).length)
      throw new TypeError('Tile has no children')
    const size = shape_size(query.request, query.sizing)
    return make_fragment({
      size,
      draw: [draw_rect(make_rect(0, 0, size.width, size.height), {
        fill: query.style.fill, stroke: none, stroke_width: 0,
      })],
    })
  }
}

const tile = new Tile({ fill: red })
```

`Element` is also available directly inside evaluated JSX: omit the imports and
TypeScript annotations, define the class, and use `<Tile />`. A class defined in
host code can be supplied through `evaluate(code, { scope: { Tile } })`.

## Scoped props

`prefix_split(prefixes, props, keep?)` separates component scopes without mutating
the input. It returns one object per prefix, in the requested order, then the
remaining props. The longest matching prefix wins when prefixes overlap. Optional
exact `keep` keys remain with the owner. `prefix_join(prefix, props)` adds the
prefix to every key. Neither helper resolves units or executes callbacks.

Both helpers are available in JSX and as named exports from `gum-jsx-core`:

```jsx
const Captioned = props => {
  const [caption, rest] = prefix_split(['caption'], props)
  return <TextFigure {...rest} caption-style={caption} />
}

return <Captioned caption="A diagram" caption-color={blue}>
  <Arrow {...prefix_join('head', { fill: red })} />
</Captioned>
```

`Prefixed<Prefix, Props>` derives scoped TypeScript names while retaining each
property's value type and optionality:

```ts
type CaptionedProps = BoxProps & { caption?: string }
  & Prefixed<'caption', TextOptions>
```

Import `BoxProps`, `Prefixed`, and `TextOptions` as types from `gum-jsx-core`.
TextOptions is TextProps without text/children, which the owner supplies.
Components choose which scopes to support and where to route them; LayoutPass
has no prefix policy. See [Style](style.md#scoped-component-props) for built-in
scopes and precedence.

Scopes are constructor-input syntax. Class defaults below still use normalized
source props: **Arrow** defaults may specify `head_style`, while `head_fill` is an
input alias. Defaults that affect child construction belong in a component or
normalizer before the child descriptions are built.

## Class hooks and defaults

| Static member | Role |
| --- | --- |
| `defaults` | Optional source props, merged over inherited defaults |
| `layout(props, query)` | Required behavior; returns a fragment during layout |
| `normalize(input)` | Optional construction-time conversion to source props |
| `data_bounds(props)` | Optional graph bounds without measurement |
| `element_name` | Optional explicit diagnostic name; otherwise the subclass name is used |

Defaults and hook references are captured on a class's first use, including use
as an ancestor. Set them before constructing instances. Defaults are deeply
copied; the caller's original records stay mutable. Each instance overrides the
merged defaults, including explicit `undefined` values. Nested records are
replaced rather than deep-merged.

```ts
class SmallTile extends Tile {
  static defaults: Partial<ElementProps> = { width: px(32) }
}
// Retains Tile's height, fill, and layout; its diagnostic name is SmallTile.
const small = new SmallTile()
```

In TypeScript, annotate overridable defaults as `Partial<Props>` so descendants
can supply only the properties they change. A child inherits layout and optional
hooks; an override replaces that hook. Hooks receive the concrete class as
`this`, including when inherited. An explicit `element_name` belongs to the class
that declares it; descendants normally receive their own class names. Bundles
that rename classes should preserve class names or supply explicit names.

The layout method runs during layout, not construction. Source props are immutable
snapshots: plain records, arrays, primitive values, and **Element** references.
Stored props cannot contain functions, font objects, host handles, or caches.
Behavior belongs to the element type and resources belong to LayoutPass.
The base constructor freezes the instance, so ordinary instance field
initializers or assignments after `super()` cannot add mutable state.

## Normalization and components

`normalize(input)` runs once on raw constructor input, before source defaults
are merged into its result. It can consume sampling or styling callbacks and
expand child descriptions. Give the normalizer its own input fallbacks; source
defaults are not passed into it. This order matches `define_element`.

When the input differs from stored data, use `Element<SourceProps, InputProps>`:

```ts
type SourceProps = ElementProps & { points: readonly PointValue[] }
type InputProps = ElementProps & { sample?: () => readonly PointValue[] }

class SampledMark extends Element<SourceProps, InputProps> {
  static normalize({ sample, ...props }: InputProps): SourceProps {
    return { ...props, points: sample?.() ?? [] }
  }
  static data_bounds(props: SourceProps) {
    return point_bounds(props.points)
  }
  static layout(props: SourceProps, query: LayoutQuery) {
    // Map props.points with query.coordinates before drawing them.
    return make_fragment({ size: shape_size(query.request, query.sizing) })
  }
}
```

Here `PointValue` and `point_bounds` are additional exports from `gum-jsx-core`.
`data_bounds(props)` reports graphable data limits without measurement; see
[Coordinates](coordinates.md).

`define_element(name, layout, defaults?, options?)` remains available and uses
the same base-class machinery. Its defaults are captured when the factory is
called; `options` accepts `normalize` and `data_bounds`:

```ts
const AnotherTile = define_element('AnotherTile', Tile.layout, Tile.defaults)
```

`define_component(name, build)` adopts an existing element's description and
protocol, with a new name and no extra layout wrapper. It preserves the static
layout and bounds behavior without retaining the original subclass or rerunning
its normalizer. The low-level `new Element(type, props)` constructor remains
available for explicit protocol adoption.

## The query contract

| Query member | Role |
| --- | --- |
| request | Prepared natural, available, or exact requests for both axes |
| sizing | Resolved source sizes, bounds, and aspect preference |
| style | Resolved inherited style, including pixel font size |
| measure | Shared length context: local font size, parent reference, and diagnostic path |
| coordinates | Optional ambient data limits and flip directions |
| math | Optional ambient math layout context |
| `child(element, request, reference?, index?, context?)` | Measure a child; context can override style, coordinates, and math |
| `resource(name)` | Obtain a host resource from this pass |
| `prepare(name, compute)` | Cache preparation independent of requests and parent references |

Pass `query.measure` directly to length helpers. For example,
`resolve_length(props.gap, query.measure, size.width, 'gap')` resolves `em`
from that context, uses `size.width` for a numeric fraction, and adds
`.gap` to the diagnostic path. The fraction reference is explicit because each
property chooses its own axis or geometry. `resolve_insets(props.padding,
query.measure)` chooses axes from `query.measure.reference` for each side.

The context is an immutable `LengthContext`. Use
`make_measure(query.measure, { font_size })` to derive a different local font
while retaining its parent reference and path. Likewise, a patch can
replace `reference` or `path`. A container that resolves a child's placement or
sizing props before measuring it can use
`child_measure(child, query, index, reference)` to derive the child's font and
path consistently.

Return a fragment in local pixel coordinates. For a shape-like leaf,
shape_size resolves its size. For a content-sized element, measure children and
pass the desired size through finish_size before constructing the result. An
inconsistent returned size is an error; a renderer cannot repair it later.
Drawing helpers also take final pixel values, including stroke widths.

The common `aspect` property is already applied to `query.request` when one axis
is established, so custom elements receive the derived allocation before layout.
With both axes content-sized, `finish_size` adds allocation space to reach the
preferred ratio. Do not implement separate aspect inference or scale the content.

A container must establish its own percentage references where dimensions are
definite, query children through query.child, and place the returned fragments
with place_fragment. The child's default reference argument is empty, not the
container's inherited reference. Parent placement does not mutate the child or
remeasure it. Validate your own props and child policy explicitly.

Prepared values may depend on source, style, math context, and versioned resources.
Current requests, parent percentage references, and coordinates
belong in ordinary layout work. Set a new resource version on a reused pass when
external data changes; see [Fonts](fonts.md) for an example.

The runnable Meter defines a small custom leaf and a CompactMeter subclass using
only evaluator bindings. Its normalizer validates and clamps the input once.
Its drawings use the size actually allocated to it, and its value is explicit
source data. It does not add an implicit growth policy to stacks.

## Example

```jsx
// A custom meter resolves its allocated size and emits two local pixel rectangles.
class Meter extends Element {
  static defaults = { height: px(16), value: 0, fill: blue }

  static normalize({ value = 0, ...props }) {
    if (element_children(props.children).length)
      throw new TypeError("Meter has no children")
    if (!isFinite(value))
      throw new TypeError("Meter value must be finite")
    return { ...props, value: clamp(value) }
  }

  static layout(props, query) {
    const size = shape_size(query.request, query.sizing)
    const { value } = props
    const paint = (fill) => ({ fill, stroke: none, stroke_width: 0 })
    return make_fragment({
      size,
      label: `${round(value * 100)} percent`,
      draw: [
        draw_rect(make_rect(0, 0, size.width, size.height), paint(gray)),
        draw_rect(
          make_rect(0, 0, size.width * value, size.height),
          paint(query.style.fill),
        ),
      ],
    })
  }
}

class CompactMeter extends Meter {
  static defaults = { height: px(10), fill: green }
}

return (
  <Box padding={em(1.5)} background={lightgray}>
    <VStack width="fill" gap={em(0.75)}>
      <Text font-size={em(1.375)} font-weight={bold}>A custom leaf</Text>
      {[0.25, 0.6, 0.9].map((value) => (
        <HStack gap={em(0.75)} align="center">
          <Meter grow={1} shrink={1} value={value} />
          <Text>{round(value * 100)}%</Text>
        </HStack>
      ))}
      <HStack gap={em(0.75)} align="center">
        <CompactMeter grow={1} shrink={1} value={0.7} />
        <Text grow={1}>Inherited layout and normalization</Text>
      </HStack>
    </VStack>
  </Box>
)
```
