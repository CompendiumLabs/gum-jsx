# gum.jsx test report

A browser for the test suite: every example in `@gum-jsx/docs`'s `docs/code` and
`gala/code` and this package's `test/code` as a card with its render, its source,
and its strict-mode result.

```bash
bun scripts/test.ts --report   # in the repo root: writes test/data
bun install                    # once, here
bun dev                        # then open the printed URL
PORT=4000 bun dev              # on a port other than 3000
bun run build && bun run preview   # static build in dist/, then serve it
```

`bun scripts/test.ts --report` writes one SVG per example per theme
(`test/data/<group>/<theme>/<name>.svg`) plus `test/data/manifest.json`, which
lists every example with its source, its status, and the paths of the renders
that exist. The server (`src/index.ts`) serves the manifest at `/manifest.json`
and the SVG files under `/data/` (override the directory with
`GUM_REPORT_DATA=/path/to/data`); everything else is the React app in `src/`:
`App.tsx` (filtering, sections, theme), `CardTile.tsx` (the grid and the SVG
fetching), `Dialog.tsx` (the full view), `Code.tsx` (shiki highlighting),
styled with Tailwind.

The theme button switches the page *and* which of the two renders is shown.
SVGs are fetched and inlined rather than put in an `<img>`, so they draw with
the page's fonts: `frontend.tsx` awaits `loadWebFonts()` from `@gum-jsx/web`, which
loads gum's faces through core's registry (IBM Plex, and the KaTeX ones once
`@gum-jsx/math` is imported) and installs them with the `FontFace` API, so the
figures use the same glyphs the renderer measured without any `@font-face` css.

`bun run build` writes a self-contained `dist/`: the bundle plus a copy of the
data (`dist/manifest.json` and `dist/data/`), since a static site has no server
to route those. The app fetches both *relative* to the page, so `dist/` also
works from a subdirectory (`http://host/whatever/dist/`), and the dev server
still serves them from `test/data`. It needs the data to exist, so run
`bun scripts/test.ts --report` before building.

Click a card for the full view; `←`/`→` step through the filtered set and the
open example is kept in the URL hash, so a card can be linked to.
