# Standalone math exports

Use `mathToElement` for a naturally sized formula viewport, or `mathToSvg` to
render directly to an SVG string. Both accept TeX or an existing Gum element.
The [gum-tex command](cli.md) exposes the same export through SVG, PNG, PDF, kitty
graphics, a fragment tree, and JSON.

```ts
import { px, em } from '@gum-jsx/core'
import { mathToElement, mathToSvg, mathToSvgAsync } from '@gum-jsx/math'

const tex = String.raw`\int_0^\infty e^{-x^2}\,dx=\frac{\sqrt\pi}{2}`
const element = mathToElement(tex, { font_size: px(36), padding: em(0.25) })
const svg = mathToSvg(tex, { font_size: px(36), title: 'Gaussian integral' })
// This version preloads fonts before layout, including in a browser.
const browserSvg = await mathToSvgAsync(tex, { font_size: px(36) })
```

`mathToElement` returns an immutable **Svg**, with no parsing, measurement, or
font I/O during construction. Its viewport is determined during ordinary layout.
It can be returned from a JSX program or placed inside another layout.

| Option | Default | Meaning |
|---|---|---|
| `font_size` | `px(24)` | Base em, using normal Gum lengths |
| `padding` | `px(0)` | Extra space around the logical and visible bounds; accepts Gum insets |
| `inline` | `false` | Text style instead of display style |
| `strut` | `true` | Reserve the minimum formula line box |
| `style`, `size_index` | inherited math policy | Explicit TeX style and size declaration |
| `color`, `opacity`, `font_family` | inherited style | Formula paint and an optional math face |
| `macros`, `warnings`, `on_error` | same as **Latex** | Parsing and error policy |
| `width`, `height` | natural | Explicit **Svg** dimensions, using `px()`; the formula shrinks to fit |
| `fit`, `fit_align` | Automatic shrink-only, `"center"` | `false` disables fitting; `"contain"` also enlarges; `"cover"` fills and crops |

The viewport includes the union of logical dimensions and visible ink, then
adds padding. Leading and trailing laps, negative kerns, tall operators,
accents, and smashed ink remain visible. Phantom's reserved logical space also
remains. Each natural export axis has a minimum of one pixel, so empty and
all-space formulas are valid SVG and PNG sources. `strut: false` with an empty
formula gives a 1 × 1 viewport; explicit zero dimensions still produce a
zero-sized, clipped SVG and cannot be rasterized.

**Latex** and **Tex** use typographic advances rather than ink-expanded viewport
bounds. Use those elements for inline prose, where they retain the paragraph's
font scale; the export helper reserves additional space for ink.
The completed export shrinks to constrained dimensions;
`fit: false` instead keeps the natural formula size and lets the viewport clip.

## Font size and fitting

Changing `font_size` lays out typography at that em. To scale a completed
formula, pass the same [fitting props](sizing.md#fitting) to the export helper:

```jsx
return mathToElement(String.raw`\frac{a+b}{c+d}`, {
  font_size: px(30),
  padding: em(0.2),
  width: px(300),
  fit: 'contain',
})
```

On the command line, `-s 30` sets the em. `-W 300` shrinks only when necessary;
`--fit -W 300` also permits enlargement, while `--no-fit -W 300` clips at natural size.
`--ratio 2` changes raster sampling without changing layout.

## Fonts, passes, and asynchronous helpers

SVG helpers create their own fonts and pass by default. Repeated callers can
supply `fonts`, `pass`, or both; if both are present they must refer to the same
font resource. Supplied fonts must already have math faces registered through
`createMathFonts` or `registerMathFonts`. Helpers preserve custom registrations.
Core itself remains independent of math.

```ts
import { LayoutPass, render_svg } from '@gum-jsx/core'
import { createMathFonts, mathToElementAsync, mathToSvgAsync } from '@gum-jsx/math'

const fonts = createMathFonts()
const pass = new LayoutPass({ fonts: { value: fonts, version: fonts.version } })
const source = await mathToElementAsync(String.raw`\mathscr{A}`, { pass })
const svg = render_svg(pass.layout(source))
const other = await mathToSvgAsync(String.raw`\mathbf{B}`, { pass })
```

`mathToElementAsync` requires caller-owned `fonts` or `pass`, so preloaded
resources remain available when you lay out its returned source. Async helpers
load all registered faces, including the optional math alphabets and bundled
prose; concurrent calls sharing a font object share requests and can retry a
failed fetch. Imports and synchronous source construction perform no fetching.
For selective preload, use `loadBaseMathFonts` or `loadMathFonts`, then call the
synchronous helpers. An unloaded browser face reports **FontNotLoadedError**.

SVG helpers accept `request` and the core's `title`, `background`, and
`id_prefix` options. Formula source labels survive in the fragment tree and as
escaped accessible labels in SVG. Output consists of paths and needs no
installed fonts or page CSS. A custom **FontProvider** can be supplied through
a pass to synchronous helpers; its host is responsible for preloading it.

## PNG output from the library

PNG conversion stays in `gum-jsx-png`. Pass the completed fragment's size to
preserve fractional viewport dimensions when selecting raster resolution:

```ts
import { LayoutPass, render_svg } from '@gum-jsx/core'
import { createMathFonts, mathToElement } from '@gum-jsx/math'
import { rasterize_svg } from '@gum-jsx/png'

const fonts = createMathFonts()
const pass = new LayoutPass({ fonts: { value: fonts, version: fonts.version } })
const fragment = pass.layout(mathToElement(String.raw`\widehat{ABC}`))
const png = rasterize_svg(render_svg(fragment), { size: fragment.size, ratio: 2 })
await Bun.write('formula.png', png)
```

See also [math authoring](math.md), [plot labels](../gallery/math.md#math_plot_labels), and
[math in slides](../gallery/math.md#math_slides).

## Example

```jsx
// Standalone exports include overhanging ink; font size and explicit fitting have separate roles.
const formula = String.raw`\mathllap{f}\!\int_0^\infty e^{-x^2}\,dx=f\frac{\sqrt\pi}{2}`
const exportOptions = { font_size: em(1.7), padding: em(0.2) }
return (
  <Box font-size={px(18)} padding={em(1.3)}>
    <VStack gap={em(1.1)} align="start">
      <Text font-weight={bold}>A formula becomes its own viewport</Text>
      <Text>Natural size at 1.7 times the base font, with room for the leading italic ink.</Text>
      {mathToElement(formula, exportOptions)}
      <Text>A 2.7em font lays out the typography at a larger size.</Text>
      {mathToElement(formula, { ...exportOptions, font_size: em(2.7), color: blue })}
      <Text>Contain scales the completed 1.7em formula into the available width.</Text>
      {mathToElement(formula, { ...exportOptions, fit: 'contain' })}
      <Text>Smash suppresses logical height; the export still includes its visible ink.</Text>
      {mathToElement(String.raw`\smash{\widehat{ABC}}`, {
        font_size: em(2.2), strut: false, padding: em(0.2), color: purple,
      })}
    </VStack>
  </Box>
)
```
