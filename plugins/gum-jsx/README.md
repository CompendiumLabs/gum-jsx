# Gum plugin

This plugin packages the Gum authoring skill generated from the maintained
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
The plugin icon lives in `assets/logo_icon_dark.svg`. Its editable Gum source
is `assets/logo_icon_dark.jsx`, reconstructed from the original logo. It renders
at 512×512 while retaining the original proportions and transparent margin.
Change the source's `size` constant to adjust the output dimensions, then
regenerate the SVG from the top-level repository:

```sh
bun gum-jsx-cli/src/cli.ts plugins/gum-jsx/assets/logo_icon_dark.jsx -o plugins/gum-jsx/assets/logo_icon_dark.svg
```

Repack after regenerating the icon to include the new SVG in the release ZIP.

## Install for testing

The top-level repository includes the `gum-jsx` marketplace catalog and
the complete generated plugin. Testers can install it directly from GitHub:

```sh
codex plugin marketplace add CompendiumLabs/gum-jsx
codex plugin add gum-jsx@gum-jsx
```

Start a new task after installation to load the skill.

Rendering requires an environment that can run commands and a **separate Gum
executable**. The skill reuses an established renderer invocation, then checks PATH before
the current project's local CLI. It uses the first command found without a
version check. If none is found, it installs the CLI with npm in a writable
task directory. Explicit setup preferences and installation restrictions still apply.

### CLI installation

Use Node.js 24 or newer. In a dedicated writable tools directory with a minimal
`package.json` containing `{"private":true}`, run:

```sh
npm install --save-exact @gum-jsx/cli
```

Invoke `node /absolute/tools-dir/node_modules/@gum-jsx/cli/dist/npm/cli.js`
and retain that invocation for rendering from the task's working directory. If npm's default cache is not writable, set `npm_config_cache` to a
writable temporary directory and retry.

Bun 1.4.2 or newer works equally well: use `bun add --exact @gum-jsx/cli`
and invoke the CLI with `bun` in place of `node`.

If neither Node nor Bun is available, download the standalone archive for your
OS and CPU architecture from [GitHub releases](https://github.com/CompendiumLabs/gum-jsx-cli/releases),
extract it into a writable directory, and run the included `gum` executable
(`gum.exe` on Windows). It includes its runtime.

For project integration, use `npm install --save-dev @gum-jsx/cli` and the
local `node_modules/.bin/gum` executable. For a global command, use
`npm install -g @gum-jsx/cli`. Source library integration requires Bun or a
browser bundler; see the skill's [rendering guide](skills/gum-jsx/references/guides/rendering.md).

If you decline setup or your host cannot run commands, the skill can still
provide JSX source and rendering instructions and will state that rendering
was not performed.

To test the package in ChatGPT, open Plugins, choose **Add plugin** →
**Upload plugin**, select `dist/gum-jsx-plugin.zip`, and start a new Work chat.

## Support

Report bugs, setup problems, and feature requests in the
[Gum issue tracker](https://github.com/CompendiumLabs/gum-jsx/issues).
For rendering problems, include your operating system, CPU architecture, Gum
version, installation method and Node or Bun version,
the command and error output, and a small JSX example that reproduces the issue.
