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

Rendering requires **Bun and a separate Gum CLI installation**.
Installing the plugin does not install these dependencies. On first use, the
skill checks for `gum` on PATH and in the project, and reuses an existing CLI.
If none is available, it asks you to choose a global or project-local install
before carrying it out:

- Global: `bun install -g @gum-jsx/cli@2.0.0-beta.2`.
- Local: `bun add --dev --exact @gum-jsx/cli@2.0.0-beta.2` in the project directory.

For local installs, invoke `./node_modules/.bin/gum` or an existing project
script. If Bun is also missing, its setup is a prerequisite for either option.
Native PNG rendering has been tested on Linux x64, macOS, and Windows. If you
decline installation or your host cannot run commands, the skill can still
provide JSX source and references; it will state that rendering was not performed.

To test the package in ChatGPT, open Plugins, choose **Add plugin** →
**Upload plugin**, select `dist/gum-jsx-plugin.zip`, and start a new Work chat.

## Support

Report bugs, setup problems, and feature requests in the
[Gum JSX issue tracker](https://github.com/CompendiumLabs/gum-jsx/issues).
For rendering problems, include your operating system, Bun and Gum CLI versions,
the command and error output, and a small JSX example that reproduces the issue.
