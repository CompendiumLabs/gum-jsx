# Gum plugin

[Gum](https://github.com/CompendiumLabs/gum-jsx) — installation, quickstart, and user documentation.

This plugin packages the Gum authoring skill generated from the maintained
prompts and documentation in `gum-jsx-docs`. The root `plugin.json` uses the portable
Agent Plugins layout, with OpenAI presentation settings under
`extensions["com.openai"].interface`. Skills are discovered from `skills/`.
The plugin does not configure an MCP server.

## Build and package

From the top-level `gum-jsx-meta` workspace, run:

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
The plugin icon lives in `assets/logo_icon_dark.png`. Its editable Gum source
is `assets/logo_icon_dark.jsx`, reconstructed from the original logo. It renders
at 512×512 while retaining the original proportions and transparent margin.
The SVG is retained as the vector master. Convert it to PNG from the top-level
repository with librsvg:

```sh
bun gum-jsx/src/cli.ts plugins/gum-jsx/assets/logo_icon_dark.jsx -o plugins/gum-jsx/assets/logo_icon_dark.svg
```

Repack after regenerating the icon to include the new PNG in the release ZIP.

## Install for testing

The top-level repository includes the `gum-jsx` marketplace catalog and
the complete generated plugin. Testers can install it directly from GitHub:

```sh
codex plugin marketplace add CompendiumLabs/gum-jsx-meta
codex plugin add gum-jsx@gum-jsx
```

Start a new task after installation to load the skill.

Rendering requires an environment that can run commands and a **separate Gum
executable**. The skill reuses an established renderer invocation, then checks PATH before
the current project's local CLI. It uses the first command found. If none is found, it explains the required
download and follows the host approval flow, asking for setup approval when
needed. New installs use Gum 2.1.0-beta.0 in a writable task directory.

Install the renderer using the [main Gum installation guide](https://github.com/CompendiumLabs/gum-jsx#install).
The maintained [CLI setup prompt](../../gum-jsx-docs/prompt/cli.md) defines
renderer discovery, pinned local installs, runtime requirements, and fallback
behavior. Edit that source and rebuild the skill when changing setup.

To test the package in ChatGPT, open Plugins, choose **Add plugin** →
**Upload plugin**, select `dist/gum-jsx-plugin.zip`, and start a new Work chat.

## Support

Report bugs, setup problems, and feature requests in the
[Gum issue tracker](https://github.com/CompendiumLabs/gum-jsx/issues).
For rendering problems, include your operating system, CPU architecture, Gum
version, installation method and Node or Bun version,
the command and error output, and a small JSX example that reproduces the issue.
