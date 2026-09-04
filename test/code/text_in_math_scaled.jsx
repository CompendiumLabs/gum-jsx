// text blocks at script sizes: a Frac sets its numerator and denominator one
// style down, a SupSub sets a script, and a Bracket fits the block's height;
// a block's own scale multiplies on top
<VStack spacing={0.1}>
  <MathText>
    <MathSymbol>f</MathSymbol>
    <MathSymbol>=</MathSymbol>
    <Frac>
      <Text width={6}>a short paragraph on top</Text>
      <Text width={6}>and one underneath it</Text>
    </Frac>
    <MathSymbol>+</MathSymbol>
    <SupSub sup={<Text width={5}>a text superscript</Text>}>
      <MathSymbol>x</MathSymbol>
    </SupSub>
  </MathText>
  <MathText>
    <MathSymbol>g</MathSymbol>
    <MathSymbol>=</MathSymbol>
    <Bracket delim="square">
      <Text width={7}>a bracket grows to fit the whole block</Text>
    </Bracket>
    <MathSymbol>+</MathSymbol>
    <Text scale={1.5} width={5}>scaled up text</Text>
  </MathText>
</VStack>
