# Gum 2.0 release checklist

Release preparation for the current workspace. Checked items require verification;
an implemented feature is not by itself evidence that its published package works.
Publishing and release tags are separate final steps.

## 1. Clean installations

- [x] Replace obsolete unscoped package imports with declared `@gum-jsx/*` dependencies.
- [x] Check source, tests, scripts, examples, and generated authoring instructions.
- [x] Verify a clean workspace without old dependency aliases.

## 2. Package contract and release artifacts

- [x] Set coordinated 2.0 prerelease versions and public package metadata.
- [x] Define the umbrella-package policy and supported runtimes.
- [x] Limit published files and include fonts, documentation assets, and licenses.
- [x] Verify packed manifests contain usable dependency versions and entry points.
- [x] Use concrete sibling versions in source manifests so npm publication preserves installable dependencies.
- [x] Install packed artifacts in an isolated consumer and exercise CLI and library usage.
- [x] Verify browser bundling and font asset delivery from the packaged libraries.
- [x] Document build, verification, and publication order.

## 3. PDF decoder scope

- [x] Use unmodified `fast-png` and remove the workspace dependency patch.
- [x] Document the accepted tiny-RGB transparency limitation and RGBA workaround.
- [x] Verify supported PNG images and the accepted rejection in packed Bun and browser consumers.

Scope decision (2026-09-22): accept `fast-png` 8.0.0's rejection of RGB PNGs with
one or two pixels and a `tRNS` transparency key. This is no longer a release
blocker. Ordinary RGBA PNGs (including transparent 1×1 images) and larger RGB
images with transparency keys remain supported. Convert affected inputs to RGBA.
Revisit the rejection tests when a future decoder release fixes the issue.

## 4. Prop validation scope

Scope decision: omit runtime unknown-prop detection and generated prop metadata.
Constructor TypeScript types and existing value/layout checks remain in place.

## 5. Migration and documentation

- [x] Replace removed `Fit` wrappers and incorrect rectangle radius guidance.
- [x] Reconcile wrapping stacks, deterministic random streams, scoped props, and debug support.
- [x] Distinguish renamed capabilities from intentionally retired APIs and deferred work.
- [x] Document breaking package, layout, CLI, font, and export changes accurately.
- [x] Align public installation instructions with the release artifacts.

## Feature decisions

These are scope decisions, not automatic requirements for 2.0:

- [x] Include decks, shared preludes, and multipage PDF.
- [x] Omit CLI watch/live-preview mode from 2.0.
- [x] Include focused Grid/TextGrid layout in 2.0.
- [x] Defer SVG image embedding (`SvgImage`); omit it from 2.0.
- [x] Explicitly document selectable text and PDF emoji limitations ([migration](./MIGRATION.md#layout-contracts), [fonts](../gum-jsx-docs/docs/gallery/text/Fonts.md#fallback-faces-and-emoji)).
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

## Final validation and publication

- [x] Run all workspace tests and typechecks after the final changes.
- [x] Build and inspect the editor, documentation previews, and visual report.
- [x] Run browser and packed-consumer checks on the release candidate.
- [x] Verify native PNG installation on the supported platform: Linux x64.
- [x] Resolve every release blocker or record an explicit scope decision.
- [x] Review release notes and version numbers.
- [ ] Publish packages in dependency order, verify registry installs, then tag the release.

## Package and runtime contract

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
[font guide](../gum-jsx-docs/docs/gallery/text/Fonts.md).

## Repeatable verification

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

`bun run release:check` validates source manifests without publishing. It runs
as the first step of the root `bun run test` command and again in rehearsal,
rejecting local dependency protocols and mismatched sibling versions.

Packages ship source, so the editor build is a browser regression check rather
than a prerequisite for publication. Public source manifests pin sibling packages
to the same prerelease version; this is required even when publishing with npm,
which preserves dependency ranges from the source manifest.

## Verification recorded during preparation

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

## Final validation recorded on 2026-09-23

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

## beta.0 registry incident

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

## Publication procedure

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
