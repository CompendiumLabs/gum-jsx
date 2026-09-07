// Frames hug by default. Stretch fills the allocation without scaling text;
// fit deliberately scales the whole figure.
const teal = '#137f89', coral = '#e77654'
const Caption = ({children}) => <Text scale={0.7}>{children}</Text>

return <Box margin={0.8}><VStack width={24} gap={0.7} justify="left">
  <Text scale={1.4}>Frames follow their content</Text>
  <Caption>Equal borders. A shared math size.</Caption>
  <Frame stretch padding={0.4} rounded border-stroke={teal}>
    <Latex>{String.raw`\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}`}</Latex>
  </Frame>
  <Frame stretch padding={0.4} rounded border-stroke={teal}>
    <Latex>{String.raw`\sin^2\theta + \cos^2\theta = 1`}</Latex>
  </Frame>
  <Frame width={16} padding={0.5} justify="left" rounded>
    <Text>
      Text wraps inside the frame. <Bold>Math</Bold> stays at the surrounding size:
      <Tex>{String.raw`a^2+b^2=c^2`}</Tex>.
    </Text>
  </Frame>
  <Caption>Compact by default. Stretch when needed.</Caption>
  <TextFrame padding={[0.5, 0.2]} rounded border-stroke={coral}>A compact badge</TextFrame>
  <Frame stretch padding={0.5} rounded>
    <Verbatim scale={0.8}>{'const square = x => {\n  return x * x\n}'}</Verbatim>
  </Frame>
  <Caption>Opt into fitting a complete figure.</Caption>
  <Frame fit width={8} aspect={3} padding rounded border-stroke={teal}>
    <HStack gap={0.5} valign="anchor">
      <Circle height={1} fill={teal} stroke={none}/>
      <Text>Scaled together</Text>
    </HStack>
  </Frame>
  <Frame width={0} height={0} clip><Text>Zero-sized frames draw nothing.</Text></Frame>
</VStack></Box>
