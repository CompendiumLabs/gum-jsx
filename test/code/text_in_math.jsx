// a text block carries em metrics, so dropped into a formula it is placed by
// them: its first line's axis meets the math axis (TeX's \parbox[t]) and its
// other lines hang below, rather than the whole block shrinking into one em
<MathText>
  <MathSymbol>f</MathSymbol>
  <MathSymbol>=</MathSymbol>
  <Text width={8}>the first line aligns and the rest hang below the axis</Text>
  <MathSymbol>+</MathSymbol>
  <MathSymbol>g</MathSymbol>
</MathText>
