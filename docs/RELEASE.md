# Gum 2.0 release checklist

Release preparation for the current workspace. Checked items require verification;
an implemented feature is not by itself evidence that its published package works.
Publishing and release tags are separate final steps.

## 1. Clean installations

- [x] Replace obsolete unscoped package imports with declared `@gum-jsx/*` dependencies.
- [x] Check source, tests, scripts, examples, and generated authoring instructions.
- [x] Verify a clean workspace without old dependency aliases.
- [x] Add a repeatable check that catches undeclared workspace imports.

## 2. Package contract and release artifacts

- [x] Set coordinated 2.0 prerelease versions and public package metadata.
- [x] Define the umbrella-package policy and supported runtimes.
- [x] Limit published files and include fonts, documentation assets, and licenses.
- [x] Verify packed manifests contain usable dependency versions and entry points.
- [x] Install packed artifacts in an isolated consumer and exercise CLI and library usage.
- [x] Verify browser bundling and font asset delivery from the packaged libraries.
- [x] Document build, pack, verification, and publication order.

## 3. PDF decoder scope

- [x] Use unmodified `fast-png` and remove the workspace dependency patch.
- [x] Document the accepted tiny-RGB transparency limitation and RGBA workaround.
- [x] Verify supported PNG images and the accepted rejection in packed Bun and browser consumers.

Scope decision (2026-09-22): accept `fast-png` 8.0.0's rejection of RGB PNGs with
one or two pixels and a `tRNS` transparency key. This is no longer a release
blocker. Ordinary RGBA PNGs (including transparent 1×1 images) and larger RGB
images with transparency keys remain supported. Convert affected inputs to RGBA.
Revisit the rejection tests when a future decoder release fixes the issue.

## 4. Prop diagnostics

- [x] Diagnose unknown built-in props, including common spelling mistakes.
- [x] Suggest close spelling matches for unknown props.
- [x] Preserve supported scoped props, parent-owned layout metadata, and custom elements.
- [x] Cover diagnostics through JSX and direct constructors with focused tests.
- [x] Document the diagnostic behavior and extension contract.

## 5. Migration and documentation

- [x] Replace removed `Fit` wrappers and incorrect rectangle radius guidance.
- [x] Reconcile wrapping stacks, deterministic random streams, scoped props, and debug support.
- [x] Distinguish renamed capabilities from intentionally retired APIs and deferred work.
- [x] Document breaking package, layout, CLI, font, and export changes accurately.
- [x] Align public installation instructions with the release artifacts.

## Feature decisions

These are scope decisions, not automatic requirements for 2.0:

- [ ] Decide whether decks, shared preludes, multipage PDF, and CLI watch mode ship in 2.0.
- [ ] Decide whether Grid/TextGrid and SVG image embedding ship in 2.0.
- [x] Explicitly document selectable text and PDF emoji limitations ([migration](./MIGRATION.md#layout-contracts), [fonts](../gum-jsx-docs/docs/gallery/text/Fonts.md#fallback-faces-and-emoji)).
- [x] Explicitly document linear-only plot axes and unsupported equation numbering/tags ([plotting](./PLOTTING.md), [math](./MATH.md)).

## Final validation and publication

- [ ] Run all workspace tests and typechecks after the final changes.
- [ ] Build and inspect the editor, documentation previews, and visual report.
- [ ] Run browser and packed-consumer checks on the release candidate.
- [ ] Verify native PNG installation on the supported operating systems.
- [ ] Resolve every release blocker or record an explicit scope decision.
- [ ] Review release notes and version numbers.
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

All eight currently use `2.0.0-beta.0`, public access, and the `beta` tag.
The root `gum-jsx` workspace, editor, and MCP application remain private.
No umbrella package is published. The CLI provides `gum`, `gum-tex`, and
`gum-mark`; React provides `gum-react`.

Artifacts contain TypeScript source and declared entry points, licensed fonts,
and the documentation assets needed at runtime. Bun 1.4.2 or newer is the
supported native runtime. Core, math, PDF, React, and `@gum-jsx/png/selection`
are checked with a TypeScript-aware browser bundler. Direct Node execution is
outside this release contract. PNG rasterization uses native node-canvas;
installation on other operating systems still needs verification.

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
bun run props:check
bun run build
bun run visual-report
bun run --cwd gum-jsx-math test:browser
bun run release:check
bun run release:pack
```

`props:check` needs Node for the development-only TypeScript 7.0.2 schema
generator. After changing constructor input types, run `bun run props:generate`
and check in the resulting registrations and schemas.

Browser checks need Chromium; set `GUM_CHROME` if it is not on PATH.
`release:check` packs every public package, installs the tarballs in a temporary
consumer, and exercises library entry points, all four commands, browser exports,
and delivery of all 25 bundled font faces. It checks licenses and dependency
versions and ensures dependencies do not resolve back into the workspace.
Use `bun run release:check --offline` with a populated Bun cache, or add `--keep`
to retain the consumer for inspection. PNG-to-PDF checks cover supported RGBA
and RGB transparency-key images plus the accepted one- and two-pixel RGB
rejection, in both Bun and the browser. No dependency patches are applied.

`release:pack` writes tarballs and `artifacts.json` to `dist/release`. Packing
rewrites `workspace:*` dependencies to the coordinated version. Native packages
ship source, so the editor build is a browser regression check rather than a
prerequisite for assembling their tarballs.

## Verification recorded during preparation

On 2026-09-22, with Bun 1.4.2 on Linux:

- A fresh temporary workspace installed with the frozen lockfile and passed
  every package's tests, typechecks, and the editor production build.
- Import checks and generated prop-schema checks passed (89 core constructors,
  36 math constructors).
- All 221 visual examples rendered successfully. The corrected typography and
  matrix examples and the editor browser previews were visually inspected.
- The editor browser regression and isolated packed-consumer checks passed,
  including all four CLIs, native PNG/PDF, browser text/math/PDF, and font loading.
- After removing the decoder patch, packed Bun and browser consumers verified
  RGBA and larger RGB transparency-key images, and the documented rejection of
  one- and two-pixel RGB transparency keys at both 8- and 16-bit depths.

These are preparation results. Rerun the final checklist against the exact
candidate after resolving remaining blockers. The editor build still reports
large bundle chunks; this is an optimization follow-up, not a failed build.

## Publication procedure

After the unchecked release gates are resolved, coordinate the package versions
and dist-tag, update the lockfile, rerun verification, and pack the final candidate.
Review `dist/release/artifacts.json` and publish those exact tarballs in the order
above. For example, the first candidate package would be:

```sh
bun publish --access public --tag beta dist/release/gum-jsx-core-2.0.0-beta.0.tgz
```

Repeat for each subsequent package only after its dependencies are available.
Verify a new registry-only consumer without local tarball overrides, including
native installation and CLI commands. Commit/tag each package and the workspace
with its matching submodule pointers according to the release workflow. A stable
2.0 release requires `2.0.0` versions and an explicit decision to publish to
`latest`; the preparation scripts never publish or create tags.
