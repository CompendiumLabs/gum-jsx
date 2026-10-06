# loadCSV

`loadCSV(path, options?)` synchronously reads a UTF-8 CSV file and returns an
array of row objects. The first row supplies the property names, and empty lines
are skipped. Quoted fields can contain commas, escaped quotes, and line breaks.

| Option | Default | Meaning |
|---|---|---|
| `delimiter` | `','` | Field separator; use `';'` or `'\t'` for other table formats |
| `dynamicTyping` | `true` | Papa Parse type conversion; use `false` for strings, or an object/function to select columns |

Automatic typing converts numeric and boolean fields, ISO-formatted dates, and
empty fields. Set `dynamicTyping: false` to retain all text, including leading
zeros in identifiers. The example uses `column => column !== 'station'` to keep
the station ID as a string while turning hours and temperatures into numbers.

## Sample input

The example reads `temperatures.csv`:

```csv
station,hour,temperature
001,8,12.5
001,10,16
001,12,20.5
001,14,23
001,16,21
001,18,17.5
```

## Paths and hosts

The CLI resolves relative paths from the JSX file's directory, or from the
working directory for stdin. Absolute paths also work. Missing files, malformed
quotes, and rows with a different field count throw an error containing the
resolved filename. CSV options control parsing; loading remains synchronous.

The docs preview supplies a shim backed by the checked-in
[sample data](https://github.com/CompendiumLabs/gum-jsx-docs/tree/master/docs/guides/data).
It exposes those fixtures rather than arbitrary filesystem paths or URLs. The
same example uses real files in the CLI; place the CSV beside your JSX script.

See [loadJSON](load_json.md) for structured data and [loadPNG](load_png.md)
for images.

## Example

```jsx
// Parse numeric measurements while preserving a station ID's leading zeros.
const rows = loadCSV('temperatures.csv', {
  dynamicTyping: column => column !== 'station',
})
const points = rows.map(row => [row.hour, row.temperature])

return (
  <Box width={px(600)} font-size={px(18)} padding={em(1)} fit>
    <VStack gap={em(0.75)}>
      <Text font-size={em(1.3)} font-weight={bold}>
        Station {rows[0].station}: {rows.length} readings
      </Text>
      <Plot
        height={em(14)}
        xlabel="Hour"
        ylabel="Temperature (°C)"
        xlim={[7, 19]}
        ylim={[10, 25]}
        xticks={rows.map(row => row.hour)}
      >
        <Polyline points={points} stroke={blue} stroke-width={em(0.15)} />
        <Points points={points} point-size={em(0.5)} fill={blue} stroke={none} />
      </Plot>
    </VStack>
  </Box>
)
```
