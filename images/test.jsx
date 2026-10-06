// A first plot to make with the CLI.
<Box font-size={px(18)} padding={em(1.5)} border-width={px(1)} border-color={gray}>
  <VStack gap={em(1)}>
    <Text font-size={em(1.6)} font-weight={bold}>Welcome to Gum!</Text>
    <Text line-height={em(1.45)}>This is a basic example demonstrating a horizontal stack.</Text>
    <HStack height={em(8)} gap={em(1)}>
      <RoundedRect aspect={1} border-radius={em(1)} fill={blue} stroke={none} />
      <Circle fill={red} stroke={none} />
      <RoundedRect aspect={1} border-radius={em(1)} fill={green} stroke={none} />
    </HStack>
  </VStack>
</Box>
