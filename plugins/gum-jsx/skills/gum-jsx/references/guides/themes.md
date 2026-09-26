# Themes

Set `theme="light"` or `theme="dark"` on the root element. Its content inherits the palette,
including text, math, strokes, points, filled areas, bars, grids, plot borders,
legends, and slide text. The accompanying example renders the same chart
in both themes.

```jsx
<Box theme="dark" padding={em(1)}>
  <VStack gap={em(0.75)}>
    <Text>Uses the theme foreground</Text>
    <Text color="tomato">Keeps this explicit color</Text>
    <Square width={px(48)} fill="theme:accent" />
  </VStack>
</Box>
```

Theme selection inherits like typography and can be overridden on any container
or element, including **Span**. Semantic paint defaults follow the new palette;
explicit literal paints keep their values. Component defaults still apply locally:
for example, **Plot** uses the palette's text and muted stroke colors, and **Mesh**
uses its grid color. Set a component's own paint props or scoped styles to override
those defaults.

## Palette colors

Use `theme:<name>` wherever an element accepts a paint, including `color`, `fill`,
`stroke`, `background`, and `border-color`:

| Name | Light | Dark | Default use |
|---|---|---|---|
| `foreground` | `black` | `white` | Text, strokes, points, arrowheads |
| `text` | `#334155` | `#e2e8f0` | Plot text |
| `muted` | `#64748b` | `#94a3b8` | Plot axes and strokes |
| `border` | `#cbd5e1` | `#475569` | Plot and legend borders |
| `grid` | `#e2e8f0` | `#334155` | Mesh lines |
| `accent` | `#2563eb` | `#60a5fa` | Bars and legend badges |
| `area` | `#dbeafe` | `#1e3a5f` | Filled graph areas |

The palettes are exported as `THEMES.light` and `THEMES.dark`. Custom element
layout code can resolve paint with `theme_color(paint, query.style.theme)`.
Ordinary `blue`, `red`, and other color constants remain literal colors.

## Backgrounds and hosts

Themes do not specify backgrounds. SVGs, slides, and legends are transparent
unless given an explicit `background` prop. To paint a backdrop at render time,
use `render_svg(fragment, { background: 'white' })` or CLI `--background white`.
The example supplies its light and dark panel backgrounds explicitly.

The web editor supplies a light root theme when the source omits one. The CLI
supplies dark for kitty terminal graphics and light for SVG, PNG, tree, and JSON.
A root theme in the source overrides that default; `--theme light` or
`--theme dark` overrides the source root selection. Nested theme selections and
explicit paint props still apply. `--background` paints behind the rendered
fragment without changing layout. Omit it for transparent output; any explicit
backgrounds in the source still apply.

Both `gum` and `gum-tex` accept these options. TeX uses the selected foreground
unless `--color` is supplied. Library helpers such as `mathToElement` can be
nested inside a themed element to inherit the same palette.

```sh
gum-tex 'x^2' --theme dark
gum-tex 'x^2' -t light --background white -o formula.png
```

## Example

```jsx
// The same chart inherits light and dark palettes from the theme set on its Slide.
const Panel = ({ theme, background, ...props }) => (
  <Slide
    theme={theme}
    background={background}
    title={`${theme} theme`}
    min-height={em(20)}
    padding={em(1)}
    {...props}
  >
    <BarPlot
      values={[2, 5, 3, 7]}
      title="Measurements"
      xlabel="Sample"
      border-width={px(1)}
      legend={[{ label: 'Count', kind: 'bar' }]}
      legend-background={background}
    />
  </Slide>
)

return <HStack wrap gap={em(1)} align="stretch">
  <Panel grow={1} shrink={1} basis={em(18)} theme="light" background={white} />
  <Panel grow={1} shrink={1} basis={em(18)} theme="dark" background={slate} />
</HStack>
```
