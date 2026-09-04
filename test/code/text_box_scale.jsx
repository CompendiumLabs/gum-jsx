// boxes in a column: a TextFrame's box includes its em padding, so a scaled
// badge, a boxed heading and a plain paragraph all size from the same em; a
// hugging box tightens to its one line instead of spanning the column
<TextCol width={20} gap={0.4}>
  <TextFrame scale={1.5} padding rounded fill={lightgray}>A boxed heading</TextFrame>
  <Text>Body text at the column's width, wrapping onto a second line to show its size.</Text>
  <TextFrame hug scale={0.7} padding={[0.5, 0.2]} rounded border-stroke={blue}>a small badge</TextFrame>
  <TextBox width={10} fill="#eef">a box at half width keeps its size</TextBox>
</TextCol>
