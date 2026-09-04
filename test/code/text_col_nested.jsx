// nested columns: an inner column takes the outer width and hands its own
// scale down, so its children size relative to it; a figure is sized in em
// with its caption at the text size
<TextCol width={20} gap={0.4}>
  <Text scale={1.5}>Outer heading</Text>
  <Text>Outer body text that wraps to a second line at twenty ems.</Text>
  <TextCol scale={0.75} gap={0.4}>
    <Text scale={1.5}>Inner heading</Text>
    <Text>Inner body text at three quarters of the outer size, wrapping as it goes.</Text>
    <Bullets>
      <Text>an inner list item</Text>
      <Text>another one</Text>
    </Bullets>
  </TextCol>
  <TextFigure height={4} caption="a figure four ems tall, with a caption at the text size" caption-scale={0.8}>
    <Frame padding rounded aspect={2}>
      <Circle fill={blue} />
    </Frame>
  </TextFigure>
  <Text>Outer body text again, after the nested column.</Text>
</TextCol>
