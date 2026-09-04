// `scale` is the other spelling of a narrower width: in a stack, a child laid
// out at half the width and one at scale 2 come out the same size, and a
// heading at scale 1.5 sits between them
<TextStack width={20} spacing={0.05}>
  <Text width={10}>Width ten</Text>
  <Text scale={2}>Scale two</Text>
  <Text scale={1.5}>Scale one and a half</Text>
  <Text>The body text runs at the stack's own width of twenty ems and wraps onto a second line.</Text>
  <Bullets>
    <Text>a list item at the body size</Text>
    <Text scale={0.75}>a smaller one at three quarters</Text>
  </Bullets>
</TextStack>
