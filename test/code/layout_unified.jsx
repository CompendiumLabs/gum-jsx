// The same stacks compose geometry, text, and math. All dimensions and gaps
// below use one shared layout unit; no TextFigure adapters are needed.
const teal = '#137f89', coral = '#e77654'
const Label = ({children}) => <Text scale={0.8} font-family={mono}>{children}</Text>
return <Box padding={1} fill="#f5f3ee">
  <VStack width={24} gap={1.2} justify="left">
    <Text scale={1.4} font-weight={bold}>One layout vocabulary</Text>
    <Label>Natural packing, shared anchors</Label>
    <HStack gap={0.7} valign="anchor" justify="left">
      <Text>Hello</Text>
      <Circle height={1} fill={teal} stroke={none}/>
      <MathText scale={1.4}>x = y + 1</MathText>
    </HStack>
    <Label>Proportional geometry: aspects 2 and 0.5</Label>
    <HStack width={10} justify="left">
      <Rect aspect={2} fill={teal} stroke={none}/>
      <Rect aspect={0.5} fill={coral} stroke={none}/>
    </HStack>
    <Label>An 8 by 2 slot, containing a square</Label>
    <HStack gap={0.7} justify="left">
      <Box width={8} height={2} fill="#dce8e5">
        <Circle fill={teal} stroke={none}/>
      </Box>
      <Text>Slot stays eight units wide.</Text>
    </HStack>
    <Label>Paragraphs reflow; formulas keep their em</Label>
    <HStack width={24} gap={1} valign="top" sizes={[1, 1]}>
      <Text>The stack assigns a width. Text wraps itself and returns its measured height.</Text>
      <VStack gap={0.5} justify="left">
        <Text>Math shares the same units.</Text>
        <Latex>{String.raw`f(x)=\frac{1}{1+e^{-x}}`}</Latex>
      </VStack>
    </HStack>
  </VStack>
</Box>
