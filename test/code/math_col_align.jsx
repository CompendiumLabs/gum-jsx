// The y in each row stays aligned by its layout box; overlapping letters retain their full size.
return <TextCol width={27} gap={0.8}>
  <Text scale={1.2}>Column alignment with overhang</Text>
  <TextRow gap={1}>
    {['left', 'center', 'right'].map(justify =>
      <TextCol gap={0.5}>
        <Text>{justify}</Text>
        <TextFigure height={8}>
          <MathCol justify={justify} spacing={0.5}>
            <Latex>abc</Latex>
            <Latex>y</Latex>
            <Latex color={blue}>{String.raw`\llap{x}y`}</Latex>
            <Latex color={red}>{String.raw`y\rlap{zzzz}`}</Latex>
            <Latex>abc</Latex>
          </MathCol>
        </TextFigure>
      </TextCol>
    )}
  </TextRow>
  <Text scale={0.7}>The blue x and red z's overhang without changing the y's placement or scale.</Text>
</TextCol>
