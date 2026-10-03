# Repository structure

This is a Bun workspace. Each package is a separate Git repository included as a submodule:

- `gum-jsx-core`: core rendering library.
- `gum-jsx-math`: math layout, TeX parsing, and math fonts.
- `gum-jsx-png`: SVG-to-PNG rendering.
- `gum-jsx-pdf`: SVG-to-PDF rendering.
- `gum-jsx-mp4`: SVG-to-MP4 rendering.
- `gum-jsx-pptx`: SVG-to-PPTX rendering.
- `gum-jsx-cli`: command-line interface.
- `gum-jsx-react`: React bindings.
- `gum-jsx-edit`: web editor.
- `gum-jsx-docs`: documentation and runnable examples.

Run `bun install` from the top level. The root `package.json` provides shared commands, and `bun.lock` is the workspace lockfile.

Every package exposes `bun run test`. Keep tests and test runners in its `test/`
directory; docs examples stay in their existing collections. From the workspace
root, `bun run test` runs every package's suite sequentially. Use `bun run typecheck`
for the separate TypeScript checks.

# Examples

Keep JSX examples readable with indented, multiline nested elements, following
the formatting in `gum-jsx-docs/docs/elements/code`. Put compound math operands on
separate lines rather than compressing an expression's element tree onto one line.

# Git workflow

Write short, single-line commit messages based on your memory of the changes from
the current session. Avoid re-reading diffs or re-analyzing completed work solely
to compose commit messages.

“Commit and push everything” means:

1. In each sub-repo, commit all pending changes and push to its `origin` remote.
2. Once all sub-repo pushes succeed, commit all top-level changes, including updated submodule pointers, and push the top-level repo to `origin`.

Skip creating commits where there are no changes, but push any existing unpushed commits. Use the current branches unless instructed otherwise.

# Style Guide

Elegance! Things should be simple and beautiful. If you're adding more and more
special cases, something has probably gone wrong. Step back and rethink it.

1. Use snake_case for functions and PascalCase for class/type/interface names.
2. Keep variable names simple and one or two words (snake_case) if possible.
3. Avoid excessively long lines. Consider defining intermediate variables instead.
4. Make good use of Object packing/unpacking, using same-name assignment when possible.
5. Have comments every few lines describing what is being done. Have short comments at the top of functions describing their purpose.
6. For complex algorithms, you can have large multi-line block before the function elaborating the details.
7. Most files should follow the rough structure: imports, types, utility functions, class definitions, exports.
8. Testing is often good, but you don't have to write a test for everything.

# Related Projects

In addition to the bare-bones editor in `gum-jsx-edit`, there is a fully featured editor named "Gum Studio" in the "../gum" directory.
