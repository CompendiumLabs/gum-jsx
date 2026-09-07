// Even and explicit half shares use the same allocation and fitting.
const teal = '#137f89', coral = '#e77654'
const Labels = ({share}) => <>
  <Text stack-size={share} color={teal}>Short</Text>
  <Text stack-size={share} color={coral}>A longer label</Text>
</>
const Caption = ({children}) => <Text scale={0.7}>{children}</Text>

return <Box margin={0.6}><VStack width={24} gap={0.7} justify="left">
  <Text scale={1.3}>Equal shares, equal behavior</Text>
  <Caption>even</Caption>
  <Frame stretch padding={0.4} rounded>
    <HStack even height={3} gap={0.5}><Labels/></HStack>
  </Frame>
  <Caption>stack-size = 0.5 on each child</Caption>
  <Frame stretch padding={0.4} rounded>
    <HStack height={3} gap={0.5}><Labels share={0.5}/></HStack>
  </Frame>
  <Caption>sizes = [1, 1] keeps a shared text size</Caption>
  <Frame stretch padding={0.4} rounded>
    <HStack sizes={[1, 1]} height={3} gap={0.5}><Labels/></HStack>
  </Frame>
  <Caption>even with an explicit 20% share: 20 / 40 / 40</Caption>
  <HStack even width={24} height={2} gap={0.5}>
    <Rect stack-size={0.2} fill={teal}/>
    <Rect fill={coral}/>
    <Rect fill={teal}/>
  </HStack>
</VStack></Box>
