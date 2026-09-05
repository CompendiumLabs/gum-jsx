// Each original formula and its three-column wrapper should have the same size and drawing bounds.
const examples = [
  ['Vertical', String.raw`\smash{\frac{a}{b}}`],
  ['Left', String.raw`\llap{x}y`],
  ['Right', String.raw`x\rlap{yz}`],
  ['Zero advance', String.raw`\smash{\rlap{x}}`],
]

return <TextCol width={32} gap={0.8}>
  <Text scale={1.2}>Overhang through nested columns</Text>
  <TextRow gap={1}>
    {examples.map(([label, tex]) => {
      const formula = <Latex>{tex}</Latex>
      return <TextCol gap={0.5}>
        <Text>{label}</Text>
        <Text scale={0.7}>Original</Text>
        <TextFigure height={3}>{formula}</TextFigure>
        <Text scale={0.7}>Three nested columns</Text>
        <TextFigure height={3}>
          <MathCol><MathCol><MathCol>{formula}</MathCol></MathCol></MathCol>
        </TextFigure>
      </TextCol>
    })}
  </TextRow>
</TextCol>
