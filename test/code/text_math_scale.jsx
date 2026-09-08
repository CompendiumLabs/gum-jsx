// Text and math share an em. Scale compounds; anchors stay aligned.
const teal = '#137f89'
return <Box padding fill="#f5f3ee">
  <TextCol width={28} gap={1.2} color="#182d3b" font-weight={regular}>
    <Text scale={1.4} font-weight={bold}>One scale for text and math</Text>
    {[0.75, 1, 1.5].map(scale =>
      <TextRow valign="anchor" gap={1}>
        <Text width={4} scale={0.7}>{scale}×</Text>
        <Text width={5} scale={scale}>Hello =</Text>
        <MathText scale={scale}>
          <Latex>{String.raw`x = \frac{a}{b}`}</Latex>
        </MathText>
      </TextRow>
    )}
    <Text>Inline: <Tex scale={1.5}>x+1</Tex> and <Text scale={1.5}>hello</Text>.</Text>
    <Text>Symbols: <MathSymbol scale={2} color={teal}>x</MathSymbol> and <MathSymbol>=</MathSymbol>.</Text>
    <MathText scale={1.25}>
      <Text>Nested:</Text>
      <Tex scale={1.5}>{String.raw`\sqrt{x^2+1}`}</Tex>
      <MathSymbol>=</MathSymbol>
      <Text scale={1.5}>bigger</Text>
    </MathText>
    <TextRow valign="anchor" gap={1}>
      <Text width={9}>Components scale too:</Text>
      <Frac scale={1.5} color={teal}>
        <Circle fill={teal} stroke={none} />
        <Square fill="#e77654" stroke={none} />
      </Frac>
      <Sqrt scale={1.5}>x</Sqrt>
      <Bracket scale={1.5}>x+1</Bracket>
    </TextRow>
  </TextCol>
</Box>
