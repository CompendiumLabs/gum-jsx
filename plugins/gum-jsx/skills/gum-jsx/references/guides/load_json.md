# loadJSON

`loadJSON(path)` synchronously reads a UTF-8 JSON file and returns its parsed
value. Objects, arrays, strings, numbers, booleans, and `null` are all supported.
The example uses a title, axis label, and nested site records to build a bar chart.

## Sample input

The example reads `survey.json`:

```json
{
  "title": "Forest survey",
  "unit": "Trees counted",
  "sites": [
    { "name": "North", "count": 24 },
    { "name": "East", "count": 36 },
    { "name": "South", "count": 18 },
    { "name": "West", "count": 29 }
  ]
}
```

## Paths and hosts

The CLI resolves relative paths from the JSX file's directory, or from the
working directory for stdin. Absolute paths also work. Missing files and invalid
JSON throw an error containing the resolved filename.

This is a CLI helper. The docs preview supplies a shim for the bundled sample
files; it does not read your computer's filesystem. For CLI use, place the sample
file beside your JSX script. The fixtures are checked in to the
[sample data directory](https://github.com/CompendiumLabs/gum-jsx-docs/tree/master/docs/guides/data).
Paths refer to local files, not remote URLs.

See [loadCSV](load_csv.md) for tables and [loadPNG](load_png.md) for images.

## Example

```jsx
// Read a title, axis label, and nested records from an external JSON file.
const survey = loadJSON('survey.json')
const values = survey.sites.map(site => site.count)
const labels = survey.sites.map((site, index) => [index, site.name])

return (
  <Box width={px(600)} font-size={px(18)} padding={em(1)} fit>
    <BarPlot
      height={em(16)}
      title={survey.title}
      ylabel={survey.unit}
      values={values}
      xticks={labels}
      ylim={[0, 40]}
      fill={green}
      stroke={none}
      border-radius={{ t: em(0.3) }}
      xgrid={false}
    />
  </Box>
)
```
