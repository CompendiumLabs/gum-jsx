// These TeX operations patch a parsed element's metrics. Clone the adapted
// item itself so reconstruction has to preserve the patch, including zeros.
const examples = [
  ['Overlap', String.raw`\llap{xy}`],
  ['Smash', String.raw`\smash{\frac{a}{b}}`],
  ['Script scale', String.raw`\scriptstyle{x}`],
]

return <TextCol width={27} gap={0.8}>
  <Text scale={1.2}>Math adaptations survive cloning</Text>
  <Text scale={0.8}>Original and faded copies share the same size and anchor.</Text>
  <TextRow gap={1}>
    {examples.map(([label, tex]) => {
      const item = (<Latex>{tex}</Latex>).items[0]
      return <TextCol gap={0.8}>
        <Text>{label}</Text>
        <TextFigure height={4}>
          <MathRow>
            <MathSpacer width={2} />
            {item}
            <MathSpacer width={2} />
            {item.clone({ opacity: 0.4 })}
            <MathSpacer width={1} />
          </MathRow>
        </TextFigure>
      </TextCol>
    })}
  </TextRow>
</TextCol>
