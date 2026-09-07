// Fractions fit selected children; natural em sizing and growth coexist.
const teal = '#137f89', coral = '#e77654'
const Caption = ({children}) => <Text scale={0.7}>{children}</Text>

return <Box margin={0.7}><VStack width={24} gap={0.8} justify="left">
  <Text scale={1.3}>Shares when you want them</Text>
  <Caption>A fitted label, natural math, and a growing frame:</Caption>
  <HStack width={24} height={3} gap={0.5} valign="anchor">
    <Text stack-size={0.15}>Fit me</Text>
    <MathText>x = 1</MathText>
    <Frame grow={1} stretch padding={0.4} rounded border-stroke={teal}>
      <Text>Keep my em</Text>
    </Frame>
  </HStack>
  <Caption>A fractional formula; the paragraph keeps its text size:</Caption>
  <VStack width={24} gap={0.5} justify="left">
    <Latex stack-size={0.3}>{String.raw`\frac{a+b}{c+d}`}</Latex>
    <Text width={14}>Natural children determine the remaining space. Only the explicit share changes scale.</Text>
  </VStack>
  <Caption>All shares: a quarter and three quarters, with a gap:</Caption>
  <HStack gap={0.5}>
    <Frame stack-size={0.25} padding={0.2} border-stroke={teal}><Circle fill={teal}/></Frame>
    <Frame stack-size={0.75} padding={0.2} border-stroke={coral}><Circle fill={coral}/></Frame>
  </HStack>
  <Caption>Flexible rectangles fill the allotted space:</Caption>
  <HStack width={24} gap={0.5}>
    <Rect height={1.5} stack-size={0.25} fill={teal}/>
    <Rect grow={1} fill={coral}/>
  </HStack>
  <Caption>A zero share reserves no space and draws nothing:</Caption>
  <HStack gap={0} justify="left">
    <Text stack-size={0}>Hidden</Text>
    <Text>Still here</Text>
  </HStack>
</VStack></Box>
