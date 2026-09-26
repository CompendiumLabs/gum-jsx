# Gum 2.0 release readiness

## beta.2 preparation — 2026-09-25

Target: `2.0.0-beta.2`, a small stabilization release on the way to 2.0.
The seven findings from the audit of workspace `e8bb974` have been addressed
according to the review comments. Source changes and verification are complete;
public publication and Git release commits/tags remain separate release steps.

### Resolve before beta.2

- [x] **Retire the standalone release manifest gate.**
  Kept the requested removal from [rehearse.sh](../scripts/rehearse.sh) and removed
  the obsolete instructions to run `release:check`. No replacement standalone
  gate was added. Rehearsal retains its existing checks of the metadata actually
  published to the temporary registry. Also fixed registry startup: downloading
  Verdaccio now explicitly uses npm's public registry before the loopback registry
  is running; package publication and consumer resolution still use loopback.

- [x] **Include maps throughout publication and consumer checks.**
  Rehearsal now publishes all **nine** public packages, checks the CLI's maps
  dependency, verifies both bundled atlases and their license files, and renders
  country/state maps to SVG, PNG, and PDF. The installed browser fixture bundles
  maps and renders both atlases plus math in Chromium, checking SVG image decoding,
  font loading, and map PDF export. All checks passed from fresh local-registry
  installations without tarball overrides or workspace dependencies.

- [x] **Ship declarations required by TypeScript consumers.**
  Moved `@types/fontkit` into [core's dependencies](../gum-jsx-core/package.json)
  and `@types/react-reconciler` into [React's dependencies](../gum-jsx-react/package.json).
  Rehearsal now installs only ordinary consumer tooling and typechecks the
  installed APIs and React component with strict TypeScript, bundler resolution,
  and `skipLibCheck`. It passes without separately installing either declaration
  package in the consumer.

- [x] **Repair the production browser regression.**
  The [editor build](../gum-jsx-edit/vite.config.ts) now declares an independent
  renderer entry alongside the app entry, preserving its exports. Importing it
  no longer mounts the app. The [browser test](../gum-jsx-math/test/browser.ts)
  dynamically imports the renderer inside its error handler, so module-load
  failures produce a diagnostic. Its full font-count, concurrency, SVG-parity,
  repeat-rendering, and error-recovery assertions pass. The actual editor page
  also renders successfully after the build change.

- [x] **Remove obsolete `--natural` guidance.**
  Removed the option and its instructions from the [CLI README](../gum-jsx-cli/README.md),
  [CLI guide](../gum-jsx-docs/docs/guides/text/cli.md), and
  [authoring prompt](../gum-jsx-docs/prompt/cli.md). The guide also describes the
  current multiple-file input contract. [Migration notes](./MIGRATION.md#changes-from-beta1-to-beta2)
  record the removed option and the current 640 × 480 offer/explicit-axis behavior.

- [x] **Prepare coordinated beta.2 versions and verify their artifacts.**
  All nine public package versions and every workspace sibling dependency pin
  are `2.0.0-beta.2`; `bun.lock` is updated and a frozen install passes.
  [MIGRATION.md](./MIGRATION.md#changes-from-beta1-to-beta2) summarizes maps,
  evaluator changes, plugins, projections, path clips, CLI changes, and consumer
  declaration fixes. The actual beta.2 packages passed publication and fresh
  installation through temporary Verdaccio, including native/browser rendering,
  all four executables, npm resolution, strict typechecking, and isolated global
  commands. Nothing was published to the public registry.

- [x] **Reconcile release scope and capability documentation.**
  [MIGRATION.md](./MIGRATION.md) now agrees with the maintained READMEs about
  tested native support on Linux x64, macOS, and Windows with Bun 1.4.2 or newer.
  This preparation run revalidated Linux x64; it did not repeat the previously
  reported macOS/Windows checks. Migration and [FEATURES.md](./FEATURES.md) now
  distinguish named-module CLI plugins and fragment `clip_path` support from the
  deferred legacy Env protocol, general masks, and arbitrary element clip props.

### Current package contract and verification

The public packages use `2.0.0-beta.2`, public access, and the `beta` dist-tag.
Publish in runtime dependency order:

1. `@gum-jsx/core`
2. `@gum-jsx/math`
3. `@gum-jsx/maps`
4. `@gum-jsx/png`
5. `@gum-jsx/pdf`
6. `@gum-jsx/mark`
7. `@gum-jsx/react`
8. `@gum-jsx/docs`
9. `@gum-jsx/cli`

The root workspace, editor, and MCP application remain private. Packages ship
TypeScript source for Bun and supported browser bundlers; direct Node execution
is outside this contract. PNG rasterization uses native node-canvas. Browser
hosts must serve core's font assets at the URLs relative to the emitted module
and emit math's font imports, or explicitly register their own font resources.

```sh
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run build
bun run visual-report
bun run --cwd gum-jsx-math test:browser
bun run rehearse
```

Rehearsal requires Bun, Node/npm, curl, tar, `setsid`, Chromium, and network access
for Verdaccio and external dependencies. Set `GUM_CHROME` if Chromium is not on
PATH. `KEEP=1 PORT=4874 bun run rehearse` retains artifacts and selects a local
port. All package publishes target the temporary loopback registry; personal npm
configuration and global installations are unchanged.

Verification completed on Linux x64 with Bun 1.4.2, npm 12.0.2, TypeScript 7.0.2,
and Google Chrome 151.0.7922.173:

- Frozen workspace install, all eleven package test suites, and all eleven
  typechecks passed.
- Editor production build, the full production browser regression, and an
  actual-editor browser smoke check passed. The existing chunk-size warning remains.
- The visual report rendered 212 examples with zero failures.
- MCP viewer, fonts, and the updated documentation snapshot built successfully.
- Full rehearsal passed for all nine beta.2 packages, including maps, fonts,
  PNG/PDF, browser rendering, consumer TypeScript, and isolated global commands.

Rehearsal artifacts and logs are in `/tmp/gum-rehearse.znqP3C`; other verification
logs are `/tmp/gum-beta2-fixes-*.log`. The repaired browser regression's screenshot
is in `gum-jsx-math/out/browser.png`. Temporary artifacts are diagnostic aids,
not permanent release evidence. Prior PDF visual comparison results are recorded
below; PDF rendering code was unchanged during this preparation.

Public registry publication, registry-only install verification, dist-tag checks,
and matching release commits/tags have not been performed. Those remain the final
release steps after choosing to publish these changes.

### Follow-ups that need not expand beta.2

- The editor build still warns about large chunks (approximately 824 kB and
  1,065 kB minified). This is an existing optimization follow-up; the build and
  actual editor preview pass.
- [DESIGN.md](./DESIGN.md) contains broken historical relative links, including
  `./README.md`, `./test/contracts.ts`, and `../elems/core.ts`. Repair or label
  those archived references when reconciling the 2.0 contributor docs.
- Keep the existing explicit deferrals: watch mode, `SvgImage`, expanded Grid
  sizing/spans, selectable SVG text, equation tags/numbering, and the documented
  tiny-RGB PNG decoder limitation. The `Svg` API decision in [TODO.md](./TODO.md)
  remains a design follow-up, not a new beta.2 feature requirement.

### Initial audit verification — before the fixes above

Environment: Bun 1.4.2, npm 12.0.2, TypeScript 7.0.2, Google Chrome
151.0.7922.173, Linux x64.

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` in the existing workspace | Passed; no lockfile changes. This was not a fresh workspace install. |
| `bun run test` and `bun run typecheck` | All eleven packages passed. |
| `bun run build` | Editor production build passed, with the existing chunk-size warning. |
| `bun run visual-report` | 212 examples rendered; zero failures. Rendering success is not visual inspection of every example. |
| `bun run --cwd gum-jsx-pdf test:visual` | Ten PDFs and a 12-page deck validated; SVG/PDF raster comparisons passed, including path clips. |
| `bun run --cwd gum-jsx-mcp build` | Viewer, 25 font files, and documentation snapshot built successfully. |
| `npm pack --ignore-scripts` for all nine public packages | Passed; inspected entry points, licenses, versions, and concrete sibling dependency pins. |
| Fresh tarball consumer with a fresh dependency cache | Installed all nine packages with local sibling overrides; core/math/maps/PNG/PDF/React/docs API smoke checks passed. |
| Installed executables | `gum` rendered a map/math figure to SVG, PNG, and PDF; `gum-tex`, `gum-mark`, and `gum-react` passed. |
| Installed browser entry points | Core, math, maps, PDF, React, and PNG selection bundled. Actual Chrome map/math/font/PDF smoke checks passed after serving core font assets at their required URLs. |
| Production editor browser smoke check | Starter rendered without an alert; screenshot inspected. Packed browser map/math screenshot also inspected. |
| Strict installed-consumer TypeScript check | Failed on missing fontkit/reconciler declarations; passed after adding those two declaration packages only in the temporary consumer. |
| Existing production browser regression | Failed; diagnosed above. Its full assertions remain unverified for this candidate. |
| `bun run release:check` / `bun run rehearse` | Both failed because the manifest gate is missing. No rehearsal publication occurred. |

Logs are in `/tmp/gum-beta2-*.log`; packed artifacts and the consumer are in
`/tmp/gum-beta2-packs/` and `/tmp/gum-beta2-consumer/`. Browser screenshots are
`/tmp/gum-beta2-editor.png` and `/tmp/gum-beta2-packed.png`. These temporary files
are diagnostic aids, not permanent release evidence. Public registry versions,
dist-tags, global installation, and native macOS/Windows were not revalidated.
No packages were published, versions changed, commits created, or tags pushed.

## Earlier preparation record — beta.0 and beta.1

The remainder preserves prior preparation and scope decisions. Its checked gates,
package counts, version numbers, platform scope, and statements about registry
state describe those earlier checkpoints. Use the completed beta.2 preparation above
for current readiness.

### 1. Clean installations

- [x] Replace obsolete unscoped package imports with declared `@gum-jsx/*` dependencies.
- [x] Check source, tests, scripts, examples, and generated authoring instructions.
- [x] Verify a clean workspace without old dependency aliases.

### 2. Package contract and release artifacts

- [x] Set coordinated 2.0 prerelease versions and public package metadata.
- [x] Define the umbrella-package policy and supported runtimes.
- [x] Limit published files and include fonts, documentation assets, and licenses.
- [x] Verify packed manifests contain usable dependency versions and entry points.
- [x] Use concrete sibling versions in source manifests so npm publication preserves installable dependencies.
- [x] Install packed artifacts in an isolated consumer and exercise CLI and library usage.
- [x] Verify browser bundling and font asset delivery from the packaged libraries.
- [x] Document build, verification, and publication order.

### 3. PDF decoder scope

- [x] Use unmodified `fast-png` and remove the workspace dependency patch.
- [x] Document the accepted tiny-RGB transparency limitation and RGBA workaround.
- [x] Verify supported PNG images and the accepted rejection in packed Bun and browser consumers.

Scope decision (2026-09-22): accept `fast-png` 8.0.0's rejection of RGB PNGs with
one or two pixels and a `tRNS` transparency key. This is no longer a release
blocker. Ordinary RGBA PNGs (including transparent 1×1 images) and larger RGB
images with transparency keys remain supported. Convert affected inputs to RGBA.
Revisit the rejection tests when a future decoder release fixes the issue.

### 4. Prop validation scope

Scope decision: omit runtime unknown-prop detection and generated prop metadata.
Constructor TypeScript types and existing value/layout checks remain in place.

### 5. Migration and documentation

- [x] Replace removed `Fit` wrappers and incorrect rectangle radius guidance.
- [x] Reconcile wrapping stacks, deterministic random streams, scoped props, and debug support.
- [x] Distinguish renamed capabilities from intentionally retired APIs and deferred work.
- [x] Document breaking package, layout, CLI, font, and export changes accurately.
- [x] Align public installation instructions with the release artifacts.

### Feature decisions

These are scope decisions, not automatic requirements for 2.0:

- [x] Include decks, shared preludes, and multipage PDF.
- [x] Omit CLI watch/live-preview mode from 2.0.
- [x] Include focused Grid/TextGrid layout in 2.0.
- [x] Defer SVG image embedding (`SvgImage`); omit it from 2.0.
- [x] Explicitly document selectable text and PDF emoji limitations ([migration](./MIGRATION.md#layout-contracts), [fonts](../gum-jsx-docs/docs/guides/text/fonts.md#fallback-faces-and-emoji)).
- [x] Explicitly document linear-only plot axes and unsupported equation numbering/tags ([plotting](./PLOTTING.md), [math](./MATH.md)).

Scope decision (2026-09-23): omit CLI watch/live-preview mode from 2.0.
The CLI remains a one-shot renderer; use the web editor for live authoring previews.

Scope decision (2026-09-23): include Grid and TextGrid with explicit column counts,
equal/length/auto column widths, content-sized rows, gaps, and cell alignment.
Spans, automatic column counts, CSS track sizing, and inferred overall aspect
remain deferred. See the [Grid reference](../gum-jsx-docs/docs/elements/text/Grid.md).

Scope decision (2026-09-23): do not implement SVG image embedding for now.
`SvgImage` is outside the 2.0 scope. Convert external SVG artwork to PNG and use
`PngImage` when embedding is needed.

### Final validation and publication

- [x] Run all workspace tests and typechecks after the final changes.
- [x] Build and inspect the editor, documentation previews, and visual report.
- [x] Run browser and packed-consumer checks on the release candidate.
- [x] Verify native PNG installation on the supported platform: Linux x64.
- [x] Resolve every release blocker or record an explicit scope decision.
- [x] Review release notes and version numbers.
- [ ] Publish packages in dependency order, verify registry installs, then tag the release.

### Package and runtime contract

Only scoped packages are published, in this dependency order:

1. `@gum-jsx/core`
2. `@gum-jsx/math`
3. `@gum-jsx/png`
4. `@gum-jsx/pdf`
5. `@gum-jsx/mark`
6. `@gum-jsx/react`
7. `@gum-jsx/docs`
8. `@gum-jsx/cli`

All eight release candidates now use `2.0.0-beta.1`, public access, and the `beta` tag.
The root `gum-jsx` workspace, editor, and MCP application remain private.
No umbrella package is published. The CLI provides `gum`, `gum-tex`, and
`gum-mark`; React provides `gum-react`.

Artifacts contain TypeScript source and declared entry points, licensed fonts,
and the documentation assets needed at runtime. Bun 1.4.2 or newer on Linux x64
is the supported native runtime for this prerelease. Core, math, PDF, React, and `@gum-jsx/png/selection`
are checked with a TypeScript-aware browser bundler. Direct Node execution is
outside this release contract. PNG rasterization uses native node-canvas.

Scope decision (2026-09-23): limit verified native support for this prerelease to
Linux x64. macOS and Windows native installation are outside this release's
support contract and are no longer gates for this prerelease.

Browser applications must serve core's `src/fonts` assets at the URLs relative
to their emitted module (or register font bytes/URLs themselves). Math's 18
static font imports must be emitted by the bundler. See the
[font guide](../gum-jsx-docs/docs/guides/text/fonts.md).

### Repeatable verification

From a fresh recursive checkout, with no existing `node_modules`:

```sh
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run build
bun run visual-report
bun run --cwd gum-jsx-math test:browser
bun run rehearse
```

Browser checks need Chromium; set `GUM_CHROME` if it is not on PATH.

`bun run rehearse` runs [scripts/rehearse.sh](../scripts/rehearse.sh). It publishes
the eight public packages with npm to a temporary Verdaccio registry, then installs the
CLI into a fresh Bun project before adding React and docs separately. Checks
cover the four executables, library entry points, packaged fonts and docs,
PNG-to-PDF support and its accepted limitation, browser bundling, npm dependency
resolution without lifecycle scripts, and an isolated global Bun installation.
The separate browser regression above checks actual browser rendering.

The rehearsal requires Bun, Node/npm, curl, tar, and `setsid`, plus network access
to download Verdaccio and external dependencies. Gum packages are resolved only
from the local registry. It uses temporary publication copies, credentials,
caches, and global directories; source manifests and personal npm configuration
are unchanged. Set `KEEP=1` to retain logs and artifacts or `PORT=4874` to choose
another port:

```sh
KEEP=1 PORT=4874 bun run rehearse
```

Packages ship source, so the editor build is a browser regression check rather
than a prerequisite for publication. Public source manifests pin sibling packages
to the same prerelease version; this is required even when publishing with npm,
which preserves dependency ranges from the source manifest.

### Verification recorded during preparation

On 2026-09-22, with Bun 1.4.2 on Linux:

- A fresh temporary workspace installed with the frozen lockfile and passed
  every package's tests, typechecks, and the editor production build.
- All 221 visual examples rendered successfully. The corrected typography and
  matrix examples and the editor browser previews were visually inspected.
- The editor browser regression and isolated packed-consumer checks passed,
  including all four CLIs, native PNG/PDF, browser text/math/PDF, and font loading.
- After removing the decoder patch, packed Bun and browser consumers verified
  RGBA and larger RGB transparency-key images, and the documented rejection of
  one- and two-pixel RGB transparency keys at both 8- and 16-bit depths.
- The local-registry rehearsal passed for all eight public packages: fresh
  CLI-only installation, React/docs usage, browser bundling, npm resolution,
  and isolated global commands.

The editor build still reports large bundle chunks; this is an optimization
follow-up, not a failed build.

### Final validation recorded on 2026-09-23

All non-publication gates passed for `2.0.0-beta.0` on the agreed Linux x64 native
support scope. Validation used Bun 1.4.2 and Chromium 153.0.8010.52. The source
workspace started at `23bba13`; subsequent changes were the platform/install
documentation and this validation record.

- A fresh workspace copy, with a new dependency cache and no `node_modules`,
  installed with `bun install --frozen-lockfile`. All ten package test suites,
  all workspace typechecks, and the production editor build passed.
- The visual report rendered all 223 examples with zero failures. Browser
  captures of the production editor, Grid documentation/preview, and visual
  report were inspected. The production browser regression passed, including
  loading all 25 font faces once, concurrent rendering, browser/library SVG
  agreement, and error recovery.
- `bun pm pack` created all eight public tarballs. Their versions, public/beta
  metadata, concrete dependency versions, entry points, and license files were
  checked. Versions remain coordinated at `2.0.0-beta.0`; no version bump was made.
- A fresh CLI-only tarball consumer rendered SVG, native PNG, PDF, a two-page
  Grid/TextGrid PDF, TeX, and terminal Markdown. React and docs were installed
  separately and their APIs, bundled assets, Grid bindings, and generated skill
  references passed. A five-page deck and a single slide with its shared prelude
  also rendered successfully.
- The installed packages passed browser bundling and actual Chromium rendering
  of core/math/fonts, Grid/TextGrid, React, PNG selection, and PDF output. Both Bun
  and browser consumers checked PNG alpha masks and the accepted tiny-RGB
  transparency-key decoder rejection. Native PNG installation and rendering
  passed on Linux x64.
- npm 12.0.2 installed the tarballs with lifecycle scripts disabled and linked all
  four executables. An isolated global Bun installation rendered SVG/PDF and
  React output without changing the user's global installation.
- Release notes and runtime scope were reconciled in MIGRATION and package docs.
  The root and generated authoring instructions now install the prerelease CLI
  globally with `@beta`. Documentation checks passed again, and the updated
  public tarballs passed a fresh consumer installation and browser/API checks.

At that point, no registry publication or release tagging had been performed.
Packed-consumer checks used local tarballs and explicit dependency overrides; the local-registry
`rehearse` script was not run because it performs publication. Registry installs
remain part of the deliberately pending publication step. Validation logs,
tarballs, consumer fixtures, and browser captures were retained in
`/tmp/gum-final-validation.F00E0U`; the generated visual report is in
`gum-jsx-cli/visual-report/dist/`.

Rerun affected checks if package contents, versions, or release scope change
before publication.

### beta.0 registry incident

The subsequently published `2.0.0-beta.0` packages retained `workspace:*` in
their registry metadata. This breaks installation of the CLI and other dependent
packages, despite the earlier Bun-packed tarballs having concrete dependencies.
Published npm versions cannot be replaced. The repair candidate is the coordinated
`2.0.0-beta.1` set, with explicit sibling versions in every source manifest.
The registry currently points both `beta` and `latest` at the broken beta.0 CLI;
when publication is authorized, publish beta.1 under `beta`, verify a fresh
registry-only install, and correct `latest` deliberately rather than leaving it
on the broken version. No beta.1 package has been published to the public registry.

For beta.1, the frozen workspace install, all package tests and typechecks, and
the editor build passed. All eight npm-packed manifests contain concrete sibling
versions. An isolated npm consumer installed those tarballs with local overrides
and ran the CLI to render SVG. The full rehearsal also passed: npm published all
eight packages only to temporary loopback Verdaccio, and fresh Bun, npm, and
isolated global consumers succeeded. Installation from the public registry remains
unverified until beta.1 is published. Bun's lockfile may still record workspace
links for local checkout resolution; the source and npm-packed manifests are the
release contract.

### Publication procedure

After the unchecked release gates are resolved, check every source and packed
manifest for local dependency protocols, update the lockfile, and rerun
verification. Publish from each public package directory in the order above.
For example, from `gum-jsx-core`:

```sh
bun publish --access public --tag beta
```

Repeat for each subsequent package only after its dependencies are available.
After each publish, inspect `npm view @gum-jsx/<name>@beta dependencies --json`
and reject any local dependency protocol. Verify a new registry-only consumer
without local tarball overrides, including native installation and CLI commands.
Commit/tag each package and the workspace
with its matching submodule pointers according to the release workflow. A stable
2.0 release requires `2.0.0` versions and an explicit decision to publish to
`latest`.
