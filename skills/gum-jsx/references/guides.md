# Guides

Each page includes its runnable JSX example.

## Guides

- [Gum](guides/gum.md) — Gum describes diagrams with JSX and renders them as SVG.
- [JSX](guides/jsx.md) — A Gum source file is JavaScript with JSX expressions.
- [Sizing](guides/sizing.md) — Gum separates a parent's request, an element's preferred dimensions, and the size of the rendered content.
- [Style](guides/style.md) — Explain which typography and paint properties inherit through containers.
- [Themes](guides/themes.md) — Apply a light or dark theme to a complete figure.
- [Units](guides/units.md) — Lengths accept numbers, helper calls, and unit strings.
- [Fitting](guides/fitting.md) — Put fit on a composition that should scale as a complete drawing.
- [Positioning](guides/positioning.md) — Place elements with pos and anchor in local or data coordinates.
- [Stacks](guides/stack.md) — Explain flex sizing, wrapping, and alignment in HStack and VStack.
- [Point values](guides/point_values.md) — Point inputs accept either [x, y] or {x, y} in JSX and host code.
- [Projections](guides/projections.md) — Project coordinates for polar and logarithmic plots, maps, and custom elements.
- [Making maps](guides/maps.md) — Build a map from geographic data, feature styles, a fitted view, and projected annotations.
- [Fonts](guides/fonts.md) — Core measures text and converts glyph outlines into paths during layout.
- [Math authoring](guides/math.md) — Math is available in the CLI and editor through the optional gum-jsx-math package.
- [Standalone math exports](guides/math_export.md) — Use mathToElement for a naturally sized formula viewport, or mathToSvg to render directly to an SVG string.
- [Math fonts and macros](guides/math_fonts.md) — Select math alphabets, faces, and bold styles in TeX expressions.
- [Arrays](guides/arrays.md) — Array helpers generate figure data and repeated components.
- [Colors](guides/colors.md) — Create interpolated colors and numeric color palettes with helper functions.
- [Coordinates](guides/coordinates.md) — Explain how graph data coordinates differ from layout lengths.
- [Custom elements](guides/custom_elements.md) — Implement custom primitives and layout policies with the Element API.
- [Math helpers](guides/math_helpers.md) — Math helpers are available directly in JSX and as named imports from gum-jsx-core.
- [Random](guides/random.md) — Every evaluate(source, {seed?}) call starts its own random stream, with seed 42 by default.
- [Rendering and embedding](guides/rendering.md) — Trace the path from source elements through layout fragments to SVG output.
- [Vectors](guides/vectors.md) — Point and vector helpers are available in JSX and as named imports.

## External

- [loadCSV](guides/load_csv.md) — Read CSV rows with headers and configurable type conversion using loadCSV(path, options?).
- [loadJSON](guides/load_json.md) — Read structured data and configuration from a local JSON file with loadJSON(path).
- [loadPNG](guides/load_png.md) — Read a local PNG into an embedded data URL with loadPNG(path), then display it with PngImage.
