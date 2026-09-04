// scale in lists: an item's scale sizes that item, a sub-list's scale sizes
// the whole sub-list, and the markers stay level with each item's first line
<Bullets width={24}>
  <Text>A first item at the body size, long enough to wrap onto a second line of text.</Text>
  <Text scale={1.5}>A larger item</Text>
  <Bullets scale={0.8}>
    <Text>a smaller sub-list</Text>
    <Text scale={1.25}>with an item back at body size</Text>
    <Bullets scale={0.8}>
      <Text>and a sub-sub-list smaller still, wrapping too when it runs long enough</Text>
    </Bullets>
  </Bullets>
  <Latex>{"e^{i\\pi} + 1 = 0"}</Latex>
  <Text>A last item</Text>
</Bullets>
