// boxes in a stack: a TextFrame's box includes its padding, so a scaled
// badge, a boxed heading and a plain paragraph all size from the same em
<TextStack width={20} spacing={0.05}>
  <TextFrame scale={1.5} padding rounded fill={lightgray}>A boxed heading</TextFrame>
  <Text>Body text at the stack's width, wrapping onto a second line to show its size.</Text>
  <TextFrame scale={0.7} padding={[0.5, 0.2]} rounded border-stroke={blue}>a small badge</TextFrame>
  <TextBox width={10} fill="#eef">a box at half width is twice the size</TextBox>
</TextStack>
