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
The plugin icon lives in `assets/logo_icon_dark.svg`.

## Install for testing

The top-level repository includes the `gum-jsx-beta` marketplace catalog and
the complete generated plugin. Testers can install it directly from GitHub:

```sh
codex plugin marketplace add CompendiumLabs/gum-jsx
codex plugin add gum-jsx@gum-jsx-beta
```

Start a new task after installation to load the skill.

The skill's rendering workflow uses the local Gum CLI. Installing the plugin
does not install the CLI. Native PNG rendering has been tested on Linux x64,
macOS, and Windows. Hosts without a working local CLI can still use the skill's
authoring references, but cannot render through this plugin.

To test the package in ChatGPT, open Plugins, choose **Add plugin** →
**Upload plugin**, select `dist/gum-jsx-plugin.zip`, and start a new Work chat.
