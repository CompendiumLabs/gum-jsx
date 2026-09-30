# Gum JSX plugin

This plugin packages the Gum JSX authoring skill generated from the maintained
prompts and documentation in `gum-jsx-docs`. The root `plugin.json` uses the portable
Agent Plugins layout, with OpenAI presentation settings under
`extensions["com.openai"].interface`. Skills are discovered from `skills/`.
The plugin does not configure an MCP server.

## Build and package

From the top-level `gum-jsx` repository, run:

```sh
bun run plugin:build
bun run plugin:pack
```

The builder replaces `plugins/gum-jsx/skills/gum-jsx/` with the current skill
and references. This is the sole generated authoring-skill output. Edit the
source prompts and docs in `gum-jsx-docs`, rebuild, and commit the generated files
in the top-level repository so GitHub marketplace installations include the
complete plugin. The build scripts remain in `gum-jsx-docs/scripts/`.
`plugin:pack` rebuilds the skill before packaging it; a separate build is optional.
The ZIP is written to `dist/gum-jsx-plugin.zip` with the plugin manifest at
the archive root. The ZIP is ignored by Git and can be attached to a release.
The plugin icon lives in `assets/logo_icon_dark.svg`. Its editable Gum JSX source
is `assets/logo_icon_dark.jsx`, reconstructed from the original logo. It renders
at 512×512 while retaining the original proportions and transparent margin.
Change the source's `size` constant to adjust the output dimensions, then
regenerate the SVG from the top-level repository:

```sh
bun run gum plugins/gum-jsx/assets/logo_icon_dark.jsx -o plugins/gum-jsx/assets/logo_icon_dark.svg
```

Repack after regenerating the icon to include the new SVG in the release ZIP.

## Install for testing

The top-level repository includes the `gum-jsx-beta` marketplace catalog and
the complete generated plugin. Testers can install it directly from GitHub:

```sh
codex plugin marketplace add CompendiumLabs/gum-jsx
codex plugin add gum-jsx@gum-jsx-beta
```

Start a new task after installation to load the skill.

Rendering requires an environment that can run commands and a **separate Gum
executable**. The skill checks PATH and the current project/workspace's local
CLI or Gum script. If neither works, it installs a fresh standalone copy in a
writable task directory and continues rendering. It does not search Codex
directories or caches for old executables. Explicit setup preferences and
installation restrictions still apply. **Development/library mode** is available
when requested for package integration or source development.

### Standalone (default)

Download the matching archive from the
[Gum CLI release](https://github.com/CompendiumLabs/gum-jsx-cli/releases/tag/v2.0.0-beta.3):

- [macOS ARM64](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-macos-arm64.tar.gz)
- [macOS x64 (Intel)](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-macos-x64.tar.gz)
- [Linux x64](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-linux-x64.tar.gz) (glibc)
- [Windows x64](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/gum-v2.0.0-beta.3-windows-x64.zip)

Verify the download against the release's
[SHA256SUMS](https://github.com/CompendiumLabs/gum-jsx-cli/releases/download/v2.0.0-beta.3/SHA256SUMS),
extract it, and run `gum --version` using the executable's path. Putting it on
PATH is optional. Standalone includes its runtime, fonts, math, maps, and PNG
renderer; no Bun installation or project dependencies are needed for built-in
rendering. It provides `gum` only.

### Development/library mode (optional)

Use Bun packages for library integration or source development:

- Project CLI: `bun add --dev --exact @gum-jsx/cli@2.0.0-beta.3`.
- Global CLI: `bun install -g @gum-jsx/cli@2.0.0-beta.3`.
- Libraries: `bun add --exact @gum-jsx/core@2.0.0-beta.3 @gum-jsx/math@2.0.0-beta.3`
  for host code that evaluates and renders Gum with math.

For local installs, invoke `./node_modules/.bin/gum` or an existing project
script. This mode needs Bun; standalone does not. The skill's
[CLI guide](skills/gum-jsx/references/guides/cli.md) covers both setup paths.

Linux x64 standalone rendering has been tested; macOS ARM64/x64 and Windows x64
runtime verification is pending. If you decline setup or your host cannot run
commands, the skill can still provide JSX source and references and will state
that rendering was not performed.

To test the package in ChatGPT, open Plugins, choose **Add plugin** →
**Upload plugin**, select `dist/gum-jsx-plugin.zip`, and start a new Work chat.

## Support

Report bugs, setup problems, and feature requests in the
[Gum JSX issue tracker](https://github.com/CompendiumLabs/gum-jsx/issues).
For rendering problems, include your operating system, CPU architecture, Gum
version, installation method (and Bun version for package installs),
the command and error output, and a small JSX example that reproduces the issue.
