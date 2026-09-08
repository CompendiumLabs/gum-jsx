# Stacking scenarios

Seven standalone gum.jsx slides for the experimental unified metrics model.
Start with the two example stacks near the top of each file. The rest of the
file draws the slide, code snippets, allocation outlines, and measured labels.

| Slide | Comparison |
| --- | --- |
| [1](slide_1.jsx) | An aspect-only shape beside text: inferred matching height versus explicit unequal heights |
| [2](slide_2.jsx) | Two non-text shapes with matching or different aspects, sharing a width budget |
| [3](slide_3.jsx) | Aspected versus aspect-free geometry beside the same text |
| [4](slide_4.jsx) | A drawing whose aspect matches its reserved slot versus one that leaves empty space |
| [5](slide_5.jsx) | A fixed-size figure beside text that wraps under two width budgets |
| [6](slide_6.jsx) | Text/text: equal growth weights versus a fixed child width beside a growing child |
| [7](slide_7.jsx) | Vertical stacking: inferred figure height versus an explicitly sized figure |

The diagrams render the actual HStack/VStack results. Dashed colored outlines
show the immediate child allocations; the gray outline shows the stack's box.
Filled geometry and glyphs show the drawing inside those allocations. Dimension
labels come from the resulting rectangles, rounded to two decimal places.
These examples have no ink overhang, so the placement rectangles also describe
the allocated layout boxes.

Both panels on a slide use the same diagram scale; the scale can differ between
slides. Presentation helpers place the completed stacks in explicit drawing
coordinates, so the slide itself does not offer them a new wrapping width.

Code captions omit shared styling: rows use `justify="left"` and `valign="top"`,
and sample text uses regular IBM Plex Mono with zero line spacing. Teal and
coral distinguish the first and second children. The source above each helper
section includes all of those settings. Here “matched” covers both matching
child heights/aspects and a drawing matching the aspect of its allocated slot.

From the `gum-jsx` directory, render the deck to a vector PDF:

```sh
mkdir -p test/data/stacking
bun scripts/gum.ts test/decks/stacking --strict -t light -s 1600 -o test/data/stacking/stacking.pdf
```

Render one slide, or substitute another slide number:

```sh
bun scripts/gum.ts test/decks/stacking/slide_1.jsx --strict -t light -s 1600 -o test/data/stacking/slide_1.png
bun scripts/gum.ts test/decks/stacking/slide_1.jsx --strict -t light -s 1600 -o test/data/stacking/slide_1.svg
```

The suite (`bun test/run.ts`) renders every deck under `test/decks` in strict
mode alongside the examples, and `--report` adds each deck to the report as a
card that opens a slide viewer. To run just this deck:

```sh
bun -e 'import { runUnitTests } from "./test/unit"; const { failed } = runUnitTests({ groups: [], decks: [{ name: "stacking", dir: "test/decks/stacking" }] }); process.exit(failed ? 1 : 0)'
```

Generated PDFs, PNGs, and SVGs belong under the ignored `test/data/stacking`
directory; the JSX sources and this README are the deck's maintained files.
