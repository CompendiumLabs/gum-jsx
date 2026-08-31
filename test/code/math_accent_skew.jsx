// an accent is centered on its base character and shifted right by the
// character's skew (TeX's skewchar kern, from katex's metrics: \hat{f} rides
// well right of center, \hat{x} barely), and takes no width of its own, so
// the arrow on \vec{\imath} overhangs rather than spacing the character out;
// the Accent element sees the same skew through a string or a symbol child
<Stack>
  <Latex>{"\\hat{f} \\hat{x} \\bar{d} \\hat{A} \\hat{\\beta} \\tilde{J} \\hat{\\mathcal{A}} \\bar{\\ell} \\vec{\\imath} \\hat{\\mathbf{f}} \\hat{f}^2"}</Latex>
  <MathText>
    <Accent label="\hat">f</Accent>
    <Accent label="\hat"><MathSymbol>f</MathSymbol></Accent>
    <Accent label="\bar">d</Accent>
    <Accent label="\vec">\imath</Accent>
  </MathText>
</Stack>
