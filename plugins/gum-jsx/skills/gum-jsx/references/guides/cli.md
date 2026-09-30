# CLI

The `gum` command evaluates JSX, lays out the result, and writes SVG, PNG, PDF,
kitty graphics, a fragment tree, or JSON. The examples below assume `gum` is on
PATH; substitute the local executable when needed.

```sh
gum figure.jsx
gum figure.jsx -o figure.svg
gum figure.jsx -o figure.pdf
gum figure.jsx -W 320 -o figure.png --ratio 2
gum figure.jsx -f tree --stats
gum --help
```

| Option | Meaning |
|---|---|
| [files...] | JSX files or one deck directory; omit or use - for stdin |
| -f, --format | kitty, svg, png, pdf, tree, or json |
| -o, --output | Output filename instead of stdout |
| -W, --width | Exact viewport width in pixels |
| -H, --height | Exact viewport height in pixels |
| --ratio | Positive PNG/kitty sampling ratio; default 1 |
| --select | PNG/kitty crop as `x,y,width,height` in source-image pixels |
| --background | Viewport background paint |
| --theme | `light` or `dark`; overrides the source root theme |
| --title | SVG or PDF document title |
| --id-prefix | SVG definition prefix; default "gum" |
| --precision | Output decimal places, 0–100 or `full`; default 10 |
| --stats | Layout counters on stderr |
| -h, --help | Help |

An explicit format wins. Otherwise the output filename's extension chooses the
format. For a file or stdin, stdout defaults to **kitty**, even when piped or
redirected; directories and multiple files default to PDF. Choose `-f svg`
when you want text on stdout, or `-f pdf` for binary PDF output. Kitty display
requires a compatible terminal.

The root theme defaults to dark for kitty and light for all other formats.
A source `<Svg theme="dark">` or `<Svg theme="light">` takes precedence over
that default; `--theme` overrides the root selection. Explicit paint props and
nested themes still apply. Themes leave backgrounds transparent. `--background`
paints a backdrop at render time, behind any explicit source backgrounds.
See [Themes](themes.md).

With neither viewport override, `gum` offers 640 × 480 pixels. Unsized canvases
use this budget, explicit source dimensions still win, and content may hug or
grow beyond the offer.
Viewport overrides are independent: when either is supplied, the other axis
uses source dimensions or hugs content. `-W 320` reflows a document without
fixing its height. Overriding width does not uniformly scale fonts and strokes.
The sampling ratio changes raster resolution without changing layout.
For example, `--select 100,50,200,100 --ratio 3` renders a 200-by-100-pixel
region starting at `(100, 50)` as a 600-by-300 PNG. Coordinates start at the
top-left of the source viewport; width and height must be positive. Cropping
happens before rasterization, preserving sharp vector edges when magnified.
Selection is supported for PNG and kitty in both CLI commands.
SVG/tree/JSON allow zero-sized axes; PNG/PDF/kitty require positive dimensions.
`--precision` applies to SVG, PDF, and tree numeric output, and to the SVG used for
PNG and kitty. It does not change the laid-out geometry.

Core bindings are mandatory, and math and maps are included by default.
`GeoMap`, `world_countries()`, and `us_states()` are available without extra flags.

A bare element is wrapped in **Svg** by the CLI. The core evaluator itself does not
add this wrapper. Input and output paths are relative to the current directory.
Errors go to stderr and exit with status 1.

PNG and kitty use gum-jsx-png's WebAssembly renderer directly on fragments.
Text and math always use glyph outlines for raster output, including when
`--text-mode live` selects live SVG text. No native addon or host font registration
is needed. Emoji without outlines cannot be rasterized; export SVG for a browser
with suitable fonts. `--stats` writes machine-readable layout counters to stderr
independently of the rendered output.

PDF uses gum-jsx-pdf to write vector pages at 96 pixels per inch, with
the same viewport, themes, and backgrounds. Text and math are outlines rather
than selectable text; debug overlays are omitted. `--ratio` and `--id-prefix`
do not affect PDF output.

The command accepts one input: a single JSX file or stdin for ordinary rendering,
or a directory for a multipage PDF. Directory input loads its optional
`index.json` manifest and shared prelude; other output formats are rejected.
A single file or stdin uses ordinary core and math bindings without reading
neighboring manifests. Pass a deck directory to evaluate slides with its prelude.

Watch mode is not implemented.
Only run trusted JSX; the evaluator executes JavaScript.

## Example

```jsx
// Render the same source as SVG, PNG, kitty graphics, a tree, or JSON.
<TextBox width="fill" padding={em(1.25)} background={lightgray}>
  <TextCol gap={em(0.75)}>
    <Text font-size={em(1.5)} font-weight={bold}>One source, several outputs</Text>
    <Rect aspect={3} border-radius={em(0.5)} fill={blue} stroke={none} />
    <Text>Change -W to reflow this paragraph. Change --ratio to sample more pixels without changing the layout.</Text>
  </TextCol>
</TextBox>
```
