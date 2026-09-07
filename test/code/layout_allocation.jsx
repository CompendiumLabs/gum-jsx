// Packing, explicit growth, and overflow are policies of the same stack.
const teal = '#137f89', coral = '#e77654'
const Label = ({children}) => <Text scale={0.65} font-family={mono}>{children}</Text>
const Content = () => <>
  <MathText>x + y + z = 0</MathText>
  <Text>Keep their relative scale.</Text>
</>
return <VStack width={24} gap={1} justify="left">
  <Text scale={1.3}>Predictable allocation</Text>
  <Label>Pack: the circle follows the label's height</Label>
  <HStack width={10} justify="left">
    <Text width={4}>Label</Text>
    <Circle fill={teal} stroke={none}/>
  </HStack>
  <Label>Grow: the circle receives the remaining width</Label>
  <HStack width={10} justify="left">
    <Text width={4}>Label</Text>
    <Circle grow={1} fill={teal} stroke={none}/>
  </HStack>
  <Label>Frames: grow allocates space; stretch fills it</Label>
  <HStack width={14} gap={1}>
    <Frame grow={1} padding={0.3} border-stroke={teal}><Text>Hug</Text></Frame>
    <Frame grow={1} stretch padding={0.3} border-stroke={coral}><Text>Stretch</Text></Frame>
  </HStack>
  <Label>Exact slots preserve the room around content</Label>
  <HStack gap={1} justify="left">
    <Circle width={8} height={2} fill={teal} stroke={none}/>
    <Rect width={2} height={2} fill={coral} stroke={none}/>
  </HStack>
  <Label>Overflow: fit the whole group, or clip it</Label>
  <HStack gap={1} justify="left" valign="top">
    <VStack width={4} height={2} overflow="shrink" justify="left"><Content/></VStack>
    <VStack width={4} height={2} overflow="clip" justify="left"><Content/></VStack>
  </HStack>
  <Label>Zero sizes stay zero; transparent groups preserve metrics</Label>
  <HStack gap={0.5} valign="anchor" justify="left">
    <Circle width={0} height={0}/>
    <Group><Text>Wrapped label</Text></Group>
    <MathText>x=1</MathText>
  </HStack>
</VStack>
