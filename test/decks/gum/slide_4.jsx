// Native text metrics set the formula scale; geometry can be a math atom too.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <T scale={0.65} color={teal} font-family={mono}>GUM.JSX / 04</T>
  <T scale={1.95} font-weight={bold}>Text and math, together.</T>
  <T scale={0.9} color={muted}>Measured in em. Aligned by shared anchors.</T>
  <HStack even spacing={0.06}>
    <Box aspect={1.4} rounded={12} padding={0.12} fill="#ffffff">
      <TextCol width={12} gap={0.8} align={['left', 'top']}>
        <T scale={0.65} font-family={mono} color={teal}>Text + LaTeX</T>
        <T>For any <Tex color={ink}>x</Tex>, define</T>
        <Latex color={ink}>{String.raw`f(x) = \frac{1}{1 + e^{-x}}`}</Latex>
        <T scale={0.7} color={muted}>Text sets the scale.</T>
      </TextCol>
    </Box>
    <Box aspect={1.4} rounded={12} padding={0.12} fill="#e5eeeb">
      <TextCol width={12} gap={0.8} align={['left', 'top']}>
        <T scale={0.65} font-family={mono} color={teal}>Shapes are math atoms, too</T>
        <MathText>
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
</Slide>
