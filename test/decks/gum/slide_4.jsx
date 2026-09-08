// Native text metrics set the formula scale; geometry can be a math atom too.

return <Page n={4} title="Text and math, together." subtitle="Measured in em. Aligned by shared anchors.">
  <HStack even spacing={0.06}>
    <Box aspect={1.4} rounded={12} padding={1} fill="#ffffff">
      <TextCol width={12} gap={0.8} align={['left', 'top']}>
        <T scale={0.65} font-family={mono} color={teal}>Text + LaTeX</T>
        <T>For any <Tex color={ink}>x</Tex>, define</T>
        <Latex color={ink}>{String.raw`f(x) = \frac{1}{1 + e^{-x}}`}</Latex>
        <T scale={0.7} color={muted}>Text sets the scale.</T>
      </TextCol>
    </Box>
    <Box aspect={1.4} rounded={12} padding={1} fill="#e5eeeb">
      <TextCol width={12} gap={0.8} align={['left', 'top']}>
        <T scale={0.65} font-family={mono} color={teal}>Shapes are math atoms, too</T>
        <MathText scale={2} align="center">
          <Frac color={ink}>
            <Circle fill={teal} stroke={none} />
            <Square fill="#e77654" stroke={none} />
          </Frac>
          <MathSymbol color={ink}>=</MathSymbol>
          <Latex color={ink}>{String.raw`\frac{\pi}{4}`}</Latex>
        </MathText>
      </TextCol>
    </Box>
  </HStack>
  <T scale={0.75} color={muted}>Fractions size themselves. Labels keep a common scale.</T>
</Page>
