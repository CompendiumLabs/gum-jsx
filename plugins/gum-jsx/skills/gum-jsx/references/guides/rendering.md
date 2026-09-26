# Rendering and embedding

The core pipeline has three boundaries: source elements describe intent,
LayoutPass produces immutable pixel fragments, and render_svg serializes those
fragments. Rendering does not query elements, resolve units, or load fonts.

## From JSX to SVG

```ts
import { evaluate, LayoutPass, render_svg, inspect_fragment, white } from '@gum-jsx/core'

const source = '<Svg><Square width={px(80)} fill={green} stroke={none} /></Svg>'
const element = evaluate(source, { name: 'example.jsx' })
const pass = new LayoutPass()
const fragment = pass.layout(element)
const svg = render_svg(fragment, {
  title: 'An eighty-pixel square',
  background: white,
  id_prefix: 'example',
  precision: 10,
})
console.log(inspect_fragment(fragment))
console.log(pass.stats) // queries, layouts, hits
```

evaluate executes JavaScript. Use it only for trusted source, or provide a
separate isolation boundary in your application. Its optional scope adds or
overrides evaluator bindings. It returns an **Element**, not an SVG string, and
sources ending in a return statement may hand back a plain value instead.
render_element below wraps bare elements in **Svg**; the core evaluator does not.

To reuse package exports and shared bindings across figures, configure an
**Evaluator** once:

```ts
import { Evaluator } from '@gum-jsx/core'
import * as math from '@gum-jsx/math'

const evaluator = new Evaluator({ scope: math, seed: 7 })
const formula = evaluator.evaluate('<Latex>{expression}</Latex>', {
  name: 'formula.jsx',
  scope: { expression: 'a+b=c' },
})
```

Every evaluator includes core bindings. Its configured scope overrides those
bindings, and per-call scope takes precedence over both. The constructor copies
the binding map, retaining the identity of supplied objects and functions.
Each call starts fresh local bindings and a random stream; `name` and `seed`
default to the constructor values and can be overridden per call.
`evaluator.evaluate_prelude(code)` returns declarations for explicit reuse in
another call's scope. It does not add them to the evaluator. Font resources
still belong to layout and rendering; see [math setup](math.md#library-setup).

JSX is optional. **Element** exports are constructors, so ordinary TypeScript can
build the same source graph directly:

```ts
import { Svg, Square, px, green, none } from '@gum-jsx/core'

const element = new Svg({
  children: new Square({ width: px(80), fill: green, stroke: none }),
})
```

## Viewports and plain values

Hosts such as the [CLI](cli.md), the editor, and the MCP viewer share one
entry point that takes an evaluated result, wraps a bare element in **Svg**,
applies host viewport props, lays it out under a request, and serializes it:

```ts
import { evaluate, render_element, make_request, exact } from '@gum-jsx/core'

const result = render_element(evaluate(source), {
  request: make_request({ width: exact(400) }),
  defaults: { theme: 'light' },
  overrides: { background: 'white' },
  id_prefix: 'example',
})
if (result.kind === 'svg') console.log(result.svg, result.size)
else console.log('plain value:', result.value)
```

The result is tagged. An element yields `svg` markup, the realized `size`, the
`fragment`, and the `pass` that produced it; anything else comes back as a
`value` for the host to print. Without options a fresh LayoutPass with the core
fonts is created. Pass `fonts` to seed it with another provider, such as the
math fonts, or `pass` to reuse one across renders and keep its cache; fonts
given alongside a pass are installed on it.
`defaults` sit beneath the source's own **Svg** props, so a source theme beats a
host default, while `overrides` sit above them for hosts whose theme must win.
`wrap` props apply only to the viewport generated around a bare element, for
example `max_width` and `max_height` bounds for a preview canvas that an
explicit **Svg** should not inherit. Undefined entries in any of the three are
ignored, so optional settings can be forwarded directly. An existing **Svg**
keeps its layout descriptor and extra props, so custom viewport subclasses
survive. `request` is an ordinary LayoutRequest; the
[Svg](../elements/layout.md#Svg) `aspect` and size props resolve against it as
in any layout. Use layout_element for the same wrapping and layout without
serialization, for example to inspect or rasterize the fragment, and
make_viewport for the wrapping step alone.

SVG output uses 10 decimal places for numbers by default. Pass `precision`
from 0 to 100 to change that limit, or `'full'` to preserve JavaScript's number
strings. The setting affects serialization only; fragments keep their original
pixel coordinates. Trailing zeroes are omitted: `precision: 3` formats
`123.45678` as `123.457` and `1.2` as `1.2`. Use `0` to round to whole numbers.
`inspect_fragment(fragment, { precision })` offers the same formatting for tree
inspection. It defaults to `'full'`; the CLI tree mode supplies its usual
10 decimal places unless `--precision` overrides them.

Gum Studio offers 640 × 480 pixels during layout, then scales the resulting SVG
to its preview panel. Authored figure dimensions and font sizes determine the
composition. See [design sizes](sizing.md#design-sizes) for a fixed figure
that preserves its proportions across display sizes.

To bound the SVG output itself, pass maxima on the generated viewport:

```ts
import { px, render_element } from '@gum-jsx/core'

const result = render_element(element, {
  wrap: { max_width: px(640), max_height: px(480) },
})
```

The content lays out using those offers first. If its measured size exceeds a
maximum, the viewport uniformly shrinks the whole drawing so both dimensions
fit; it does not simply crop the bottom. This includes fonts and strokes. With
only a width and no height maximum, text can still grow naturally in height.
Use an exact request for a fixed allocation, or advisory requests without maxima
when overflow beyond the offered size is acceptable.

## Requests and results

pass.layout accepts an optional LayoutRequest. natural means no size offer,
available supplies an advisory budget, and exact fixes an allocation. Omitted,
undefined, and null axes are natural, so optional dimensions forward directly.
Values in these low-level requests are already pixels, unlike source lengths:

```ts
import { make_request, exact, available } from '@gum-jsx/core'

const fragment = pass.layout(element, make_request({
  width: exact(400), height: available(300),
}))
```

An available budget does not itself establish a percentage reference. See
[Units](units.md) and [Sizing](sizing.md) for how containers establish definite
boxes and resolve source sizes.

Fragments contain size, drawings, child placements, named guides such as text
baselines, ink bounds, and overflow. Size is the allocated rectangle; ink is
painted bounds after clipping; overflow records excess content before clipping.
inspect_fragment shows this geometry without going through SVG.

## Debugging layout

Add `debug` to a layout element to show its allocated rectangle in **solid red** and
its content rectangle, when available, in **dashed blue**:

```jsx
<Box debug padding={em(1)} width={px(240)}>
  <HStack gap={em(0.75)}>
    <Text>First</Text>
    <Text>Second</Text>
  </HStack>
</Box>
```

Only the marked element gets outlined; children can opt in separately with their
own `debug` flags. Omit the flag or use `debug={false}` to turn it off. The same
option works in TypeScript, for example `new Box({ debug: true, padding: em(1) })`.

The allocated rectangle is the element's final layout size. Containers such as
**Box** expose a separate content rectangle inside their insets; elements without
one show only the allocated rectangle. The overlays follow rotations and fitting,
appear above the artwork, and bypass content clipping within the SVG viewport.
They leave layout, ink bounds, and overflow unchanged. SVG, PNG, and terminal
graphics all include the overlays.

Inline **Span** styling is folded into its owning **Text**; mark the **Text** to
inspect its allocation.

The middle stage in the runnable example below uses `debug` to show both boxes.

## Reuse and output

Keep element identities and a LayoutPass to reuse cached results for identical
requests, inherited styles, reference boxes, and resource versions. Creating a
new equivalent element or a new pass does not preserve that cache. **Text** also
caches prepared glyphs within a pass so a new width can reuse shaping. This is
query caching, not a promise that every layout or edit is sublinear.

render_svg accepts title, background, and id_prefix. Use distinct prefixes when
embedding multiple generated SVGs in one HTML document, so clip definitions do
not collide. Prefixes start with a letter or underscore and then contain
letters, digits, underscores, dots, or hyphens. **Text** is emitted as paths.

For PNG and terminal graphics, use gum-jsx-png and gum-jsx-cli through the
[CLI](cli.md). Those host concerns are separate from core layout. The runnable
source below is a small diagram to feed through this pipeline, not a host script.

## Example

```jsx
// Immutable source becomes a pixel fragment, then self-contained SVG output.
const Stage = ({ label, color, debug }) => (
  <TextFrame
    debug={debug}
    grow={1}
    padding={em(0.4)}
    border-color={color}
    background={white}
    border-radius={em(0.5)}
  >
    <Text justify="center" color={color} font-weight={bold}>{label}</Text>
  </TextFrame>
)
return (
  <Box padding={em(1.25)} background={lightgray}>
    <HStack gap={em(0.75)} align="center">
      <Stage label="Source" color={blue} />
      <Text>→</Text>
      <Stage label="Fragment" color={red} debug />
      <Text>→</Text>
      <Stage label="SVG" color={green} />
    </HStack>
  </Box>
)
```
