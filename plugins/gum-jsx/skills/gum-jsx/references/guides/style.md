# Style

Typography and paint inherit through containers. Dimensions, positioning, flex
weights, padding, backgrounds, and borders do not inherit.

| Property | Default | Meaning |
|---|---|---|
| `theme` | `"light"` | Inherited `"light"` or `"dark"` palette; see [Themes](themes.md) |
| `font-size` | `px(16)` | **Text** size; relative forms use the inherited font |
| `font-family` | `"IBM Plex Sans"` | Registered font family |
| `font-weight` | `400` | Numeric weight from 1 to 1000, or `"light"` (300), `"regular"`/`"normal"` (400), `"bold"` (700) |
| `font-style` | `"normal"` | "normal" or "italic" |
| `line-height` | `em(1.2)` | Line box height, not glyph scaling |
| `color` | Theme foreground (`black` in light) | **Text** color and default **Box** border color |
| `fill` | `"none"` | Shape fill |
| `stroke` | Theme foreground (`black` in light) | Shape stroke |
| `stroke-width` | `px(1)` | Shape stroke thickness |
| `stroke-linecap` | `"butt"` | "butt", "round", or "square" |
| `stroke-linejoin` | `"miter"` | "miter", "round", or "bevel" |
| `stroke-miterlimit` | `4` | Dimensionless miter limit |
| `stroke-dasharray` | `[]` | A nonnegative layout length for equal dashes/gaps, or an array for a custom pattern; zero or an empty/all-zero array is solid |
| `opacity` | `1` | Per-drawing paint opacity from 0 to 1 |

Use paint strings such as `"#317969"`, `"tomato"`, or `"none"`. **Text** uses
color, not fill. For a **Box**'s own fill use background; setting fill on a **Box** instead
changes the inherited shape paint.

Semantic paints such as `"theme:accent"`, `"theme:muted"`, and `"theme:area"`
resolve from the inherited palette during layout. Literal colors stay fixed
when the theme changes.

Built-in constants are available in evaluated JSX and as named imports from
`gum-jsx-core`. Use `font-family={sans}` or `{mono}` for IBM Plex Sans or Mono,
and `font-weight={light}`, `{regular}`, or `{bold}` for weights 300, 400, or 700.
Quoted weight names work too: `font-weight="bold"` is equivalent to
`font-weight={bold}` or `font-weight={700}`, including on spans and scoped props
such as `title-font-weight`.

Examples use `blue` as the default accent, followed by `red`, `green`, `yellow`,
and `purple` for additional distinct items. Backgrounds and ordinary text use
neutral colors where needed for readability.

Paint constants use the Gum palette, so `fill={blue}` differs
from the CSS color `fill="blue"`:

| Constant | Value | Constant | Value |
|---|---|---|---|
| none | "none" | white | #ffffff |
| black | #000000 | blue | #1e88e5 |
| red | #ff0d57 | green | #4caf50 |
| yellow | #ffb300 | purple | #9c27b0 |
| gray | #f0f0f0 | lightgray | #f6f6f6 |
| darkgray | #888888 | slate | #1e252e |

Numeric constants are also available: `e`, `pi`, `tau` (2 pi), `phi` (the golden ratio),
`r2d` (180 / pi), and `d2r` (pi / 180). Host-provided `scope` bindings can
override any built-in constant for an evaluation.

[Math helpers](math_helpers.md) supplies bare numeric functions. Use
[interp and palette](colors.md) to generate colors from numeric data.

Pixel strokes remain the same thickness when shapes are laid out at new sizes.
An em stroke follows the local font size. A fractional stroke follows the shape's
shorter side. Explicit [fitting](sizing.md#fitting) scales the completed stroke with everything
else in its child.

Dash lengths resolve like stroke widths: pixels stay fixed, em follows font size,
and fractions use the shorter side. A scalar broadcasts to a dash/gap pair:
`stroke-dasharray={px(4)}` (or `stroke-dasharray="4px"`) is equivalent to
`stroke-dasharray={[px(4), px(4)]}`. Use an array such as `[px(6), px(3)]` for
unequal dashes and gaps. Bare numbers are fractions, so `{0.04}` means 4% of the
shorter side, not pixels. This also works in scoped props such as `grid-stroke-dasharray`.

Opacity inherits and applies to individual
drawings, including text and box decoration. It is not a composited group opacity;
overlapping drawings can accumulate alpha.

## Scoped component props

Use prefixes to configure generated subcomponents:

```jsx
<Plot title="Measurements" axis-stroke={slate}
  xaxis-tick-size={px(8)} xaxis-label-color={blue}
  title-font-size={em(1.4)} title-wrap={false} />
```

JSX accepts dashes or underscores; JavaScript props use underscores.
`xaxis-label-color` goes to the x axis, then to its generated labels. Routing is
local to the owner and happens once during construction, before layout.

| Owner | Scopes |
|---|---|
| **Arrow** / **Field** / **SymField** | `head-` shape and paint options |
| **Axis** / **Scale** / **Label** / **Labels**, including directional variants | `line-`, `tick-` styles; `label-` text options |
| **Plot** / **BarPlot** | `axis-`, `xaxis-`, `yaxis-` axis options; `tick-` styles |
| **Plot** / **BarPlot** | `label-`, `title-`, `xlabel-`, `ylabel-` text options |
| **Plot** / **BarPlot** | `grid-`, `xgrid-`, `ygrid-` mesh options; `legend-` legend options |
| **Legend** | `label-` text options |
| **TitleBox** / **TitleFrame** / **Slide** | `title-` text options |
| **TextFigure** | `caption-` text options |

**Text** options include font/paint, dimensions, wrap, whitespace, and `justify`;
content is supplied by the owner. For example, `title-wrap={false}` keeps a title
on one line, and `legend-label-font-size={em(0.85)}` controls generated legend text.

**ArrowHead** options include `open`, `curve`, and paint: `head-open` draws open
barbs, and `head-curve={0.7}` curves them independently of the shaft. The same
options work in `head-style={{open: true, curve: 0.7}}`.

Nested `*-style` objects remain supported. At the same scope, flat props override
matching fields in the nested object. Shared settings supply defaults for more
specific scopes, merging part option records per field. **Plot**'s common tick/label
settings precede common axis settings, then xaxis/yaxis option objects, then flat
`xaxis-`/`yaxis-` props. Shared grid and label settings precede x/y-specific settings.
Unit records and arrays remain individual values, not recursively merged objects.

Owner geometry props keep their meanings: **Arrow**'s `head-size`/`head-width`, **Axis**'s
`tick-size`/`label-offset` and ordinary `line-height`, and **Plot**'s `label-gap`. An explicit
disabled axis stays disabled. Caller-supplied title, caption, label, and legend
**Element**s retain their own props; scopes configure parts created by the owner.

For custom components, [prefix_split and prefix_join](custom_elements.md#scoped-props)
are available in JSX and as named exports. Supported styles remain an explicit
vocabulary; gradients, arbitrary CSS classes, and general SVG attribute injection
are deferred. Unknown props may be ignored, so use the component reference.

## Example

```jsx
// Inherit shape paint separately from text color, with local overrides.
<Box
  font-size={px(20)}
  padding={em(1)}
  background={lightgray}
  color={slate}
  fill={blue}
  stroke={none}
  font-family={sans}
>
  <VStack gap={em(0.7)}>
    <Text>Text uses <Span color={red} font-weight="bold">color</Span>.</Text>
    <HStack gap={em(0.7)}>
      <Square width={px(64)} />
      <Circle width={px(64)} fill={red} />
      <RoundedRect
        width={px(100)}
        height={px(64)}
        fill={none}
        stroke={green}
        stroke-width={px(3)}
        stroke-dasharray={px(4)}
      />
    </HStack>
  </VStack>
</Box>
```
