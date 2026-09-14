# Repository structure

This is a Bun workspace. Each package is a separate Git repository included as a submodule:

- `gum-next-core`: core rendering library.
- `gum-next-png`: SVG-to-PNG rendering.
- `gum-next-cli`: command-line interface.
- `gum-next-edit`: web editor.
- `gum-next-docs`: documentation and runnable examples.

Run `bun install` from the top level. The root `package.json` provides shared commands, and `bun.lock` is the workspace lockfile.

# Git workflow

“Commit and push everything” means:

1. In each sub-repo, commit all pending changes and push to its `origin` remote.
2. Once all sub-repo pushes succeed, commit all top-level changes, including updated submodule pointers, and push the top-level repo to `origin`.

Skip creating commits where there are no changes, but push any existing unpushed commits. Use the current branches unless instructed otherwise.
