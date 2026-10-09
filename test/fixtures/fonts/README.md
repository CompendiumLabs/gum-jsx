# Test fonts

These original, minimal OpenType/CFF faces contain only space and a triangular
`A`. They have no external font dependency or third-party artwork. Each uses
1000 units per em, an ascender of 800, a descender of -200, and a space advance
of 250. The `A` advances are 600 (regular), 500 (light), 700 (bold), and 650
(italic), making face selection visible in layout and exported paths.

The family is `Gum Test`. Light uses the legacy family `Gum Test Light` with
preferred family `Gum Test`, exercising typographic-family grouping. Weight and
italic flags live in the OS/2 table. The files were generated with opentype.js.
