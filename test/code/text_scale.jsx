// `scale` sizes a block relative to the column's em: a heading at scale 2, a
// subheading at one and a half, a smaller list item. a block with a width of
// its own keeps its size and that width, so it no longer spans the column
<TextCol width={20} gap={0.3}>
  <Text scale={2}>Scale two</Text>
  <Text scale={1.5}>Scale one and a half</Text>
  <Text>The body text runs at the column's own width of twenty ems and wraps onto a second line.</Text>
  <Text width={10}>Width ten keeps the body size and wraps at ten ems, half the column.</Text>
  <Bullets>
    <Text>a list item at the body size</Text>
    <Text scale={0.75}>a smaller one at three quarters</Text>
  </Bullets>
</TextCol>
