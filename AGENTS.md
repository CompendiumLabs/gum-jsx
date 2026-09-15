# Repository structure

This is a Bun workspace. Each package is a separate Git repository included as a submodule:

- `gum-jsx-core`: core rendering library.
- `gum-jsx-math`: math layout, TeX parsing, and math fonts.
- `gum-jsx-png`: SVG-to-PNG rendering.
- `gum-jsx-cli`: command-line interface.
- `gum-jsx-edit`: web editor.
- `gum-jsx-docs`: documentation and runnable examples.

Run `bun install` from the top level. The root `package.json` provides shared commands, and `bun.lock` is the workspace lockfile.

# Examples

Keep JSX examples readable with indented, multiline nested elements, following
the formatting in `gum-jsx-docs/elements/code`. Put compound math operands on
separate lines rather than compressing an expression's element tree onto one line.

# Prior Work

This is a ground-up rewrite of gum-1, which resides in `../gum-org` and uses a similar workspace structure. This project (gum-jsx) uses a different layout engine that hews closer to a flexbox-like model. Absolute sizes are more welcome here, and there is less of an attempt to automatically infer sizing and aspect ratios in elements like Stack. However, there is a lot of good and useful stuff in gum-1 that is worth using as inspiration.

# Git workflow

Write short, single-line commit messages based on your memory of the changes from
the current session. Avoid re-reading diffs or re-analyzing completed work solely
to compose commit messages.

“Commit and push everything” means:

1. In each sub-repo, commit all pending changes and push to its `origin` remote.
2. Once all sub-repo pushes succeed, commit all top-level changes, including updated submodule pointers, and push the top-level repo to `origin`.

Skip creating commits where there are no changes, but push any existing unpushed commits. Use the current branches unless instructed otherwise.
