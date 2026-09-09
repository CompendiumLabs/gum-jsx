// stretch is asked for: a column's justify="stretch" makes every box take its
// width, a child's own align keeps it tight, and a row's valign="stretch"
// makes frames of different text the same height, their content centered
<TextCol width={20} gap={0.5} justify="stretch">
  <TextFrame padding={0.25} fill={lightgray}>a box spanning the column</TextFrame>
  <TextFrame padding={0.25} align="left">a badge kept tight</TextFrame>
  <TextRow gap={0.5} valign="stretch">
    <TextFrame padding={0.5}>short</TextFrame>
    <TextFrame padding={0.5}>a paragraph that wraps onto a few lines and sets the height of the row</TextFrame>
  </TextRow>
  <Frame padding={0.5} width={12} justify="stretch">
    <TextCol justify="stretch">
      <TextFrame padding={0.25}>in a frame</TextFrame>
      <TextFrame padding={0.25}>spanning it</TextFrame>
    </TextCol>
  </Frame>
</TextCol>
