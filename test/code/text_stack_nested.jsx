// nested stacks: an inner stack takes the outer width and hands its own
// scale down, so its children size relative to it; bare elements span the
// stack width at their aspect
<TextStack width={20} spacing={0.05}>
  <Text scale={1.5}>Outer heading</Text>
  <Text>Outer body text that wraps to a second line at twenty ems.</Text>
  <TextStack scale={0.75} spacing={0.05}>
    <Text scale={1.5}>Inner heading</Text>
    <Text>Inner body text at three quarters of the outer size, wrapping as it goes.</Text>
    <Bullets>
      <Text>an inner list item</Text>
      <Text>another one</Text>
    </Bullets>
  </TextStack>
  <Frame padding rounded aspect={4}>
    <Text scale={0.6}>a frame with a caption inside</Text>
  </Frame>
  <Text>Outer body text again, after the nested stack.</Text>
</TextStack>
