# CLI

The `gum` command evaluates JSX, lays out the result, and writes SVG, PNG, PDF,
kitty graphics, a fragment tree, or JSON. **Standalone is the recommended setup**
for making figures and decks. It includes the runtime and rendering assets, so
Bun and `node_modules` are unnecessary. The authoring plugin does not install
an executable automatically.

Check `gum --version` and the project's existing CLI or scripts first; reuse a
working installation. If setup is needed, offer standalone by default, with
optional development/library mode. Reuse any installation choice already made
in the conversation.

## Standalone downloads

Use the matching archive from
[Gum v2.0.0-beta.3](https://github.com/CompendiumLabs/gum-jsx-cli/releases/tag/v2.0.0-beta.3):

| Platform | Archive |
|---|---|
| macOS, Apple Silicon (ARM64) | [macos-arm64.tar.gz](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-macos-arm64.tar.gz) |
| macOS, Intel (x64 / x86_64) | [macos-x64.tar.gz](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-macos-x64.tar.gz) |
| Linux, x64 / x86_64 (glibc) | [linux-x64.tar.gz](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-linux-x64.tar.gz) |
| Windows, x64 / AMD64 | [windows-x64.zip](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-windows-x64.zip) |

1. Detect the OS and CPU architecture. Do not substitute a different architecture
   when a matching release is absent. Offer package installation or a source
   build for platforms such as Linux ARM64.
2. Download the matching archive and
   [SHA256SUMS](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/SHA256SUMS).
   Compare the archive's SHA-256 hash against its filename's entry using
   `sha256sum`, `shasum -a 256`, or PowerShell `Get-FileHash -Algorithm SHA256`.
   Verify the selected file; the checksum list also contains other platforms.
3. Extract the `.tar.gz` with `tar -xzf <archive>` or the Windows `.zip` with
   PowerShell `Expand-Archive`. Each archive contains a versioned directory with
   `gum` or `gum.exe`, installation notes, and license notices. Keep it in a
   writable tools directory. Adding the executable to PATH is optional; invoke
   its full path when needed. Do not change shell profiles for a one-off render.
4. Run the extracted executable with `--version` (expected `2.0.0-beta.3`), then
   render the figure. For example, `./gum figure.jsx -o figure.svg`, or
   `.\gum.exe figure.jsx -o figure.svg` in PowerShell.

Standalone includes JSX, math through `Tex`/`Latex`, maps, and PDF decks. The
archives provide the executable; install `@gum-jsx/*` packages separately for
library integration. External `--plugin` modules still need their own
project dependencies. Linux x64 rendering has been tested; the published macOS
ARM64/x64 and Windows x64 builds still need runtime verification on those platforms.

## Development and library mode

Choose this route for integration into a code project or source development.
It requires Bun; follow the
[Bun setup instructions](https://bun.sh/docs/installation) if it is missing.

- **Project CLI:** `bun add --dev --exact @gum-jsx/cli@2.0.0-beta.3`, then use
  `./node_modules/.bin/gum` (or the corresponding Windows executable).
- **Global CLI:** `bun install -g @gum-jsx/cli@2.0.0-beta.3`, then use `gum`.
- **Library integration:** add the libraries the host code needs, for example
  `bun add --exact @gum-jsx/core@2.0.0-beta.3 @gum-jsx/math@2.0.0-beta.3`.
  See [Rendering](rendering.md) for evaluation, layout, and export APIs, and
  [Math export](math_export.md) for fonts and standalone formulas.
- **Source development:** use the existing Gum checkout and its `bun run gum`
  script. For a new checkout, follow the repository's
  [development instructions](https://github.com/CompendiumLabs/gum-jsx#development).

Choose project-local CLI installation when the user wants dependencies managed
with the project; use global installation when they ask for commands across
projects. Preserve any scope already chosen. Verify the selected CLI with
`--version`.
If installation is declined or commands cannot run, provide source and rendering
instructions without claiming to have rendered it.

## Render a figure

The examples below assume `gum` is on PATH; substitute the local executable when
needed. In a Gum workspace checkout, use `bun run gum` instead of `gum`.
Save the example below as `figure.jsx`:

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
| --plugin | Load extra bindings from a package or local module; repeat for more |
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
Add `--plugin <package>` or `--plugin ./elements.ts` to load another module's named
exports into the evaluator. Extra packages must be installed in the current project;
package names and relative paths resolve from the current working directory.
Repeat the option to load more modules. Later plugins override earlier bindings,
and default exports are ignored. Plugin bindings are available in ordinary
files, stdin, deck preludes, and slides.

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
do not affect PDF output. See the [PDF API](https://github.com/CompendiumLabs/gum-jsx-pdf/blob/master/README.md)
for supported colors and page-size limits.

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
