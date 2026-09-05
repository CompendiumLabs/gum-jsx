// MathRow adapts ordinary shapes and spans to em layout. Reuse those children
// after cloning: colors keep the icon size, and new text gets fresh metrics.
const icon = (<MathRow><Square fill={blue} /></MathRow>).children[0]
const word = (<MathRow><Span>Hi</Span></MathRow>).children[0]
const placed = icon.clone({ rect: [0, 0, 1, 1] })

return <TextCol width={30} gap={0.8}>
  <Text scale={1.2}>Metrics survive cloning</Text>
  <TextRow gap={0.6} valign="anchor">
    {icon}<Text>Original</Text>
    {icon.clone({ fill: red })}<Text>Recolored</Text>
    {placed.clone({ fill: green })}<Text>Placed, then recolored</Text>
  </TextRow>
  <Text scale={0.8}>Each square stays one em tall.</Text>
  <Text>Changing an adapted span remeasures its width:</Text>
  <TextRow gap={0.6} valign="anchor">
    {word}
    {word.clone({ children: ['A longer greeting'], fill: blue })}
    {word.clone({ children: ['Monospace'], font_family: mono, fill: red })}
  </TextRow>
  <Text scale={0.8}>The gaps and type size stay consistent as the words grow.</Text>
</TextCol>
