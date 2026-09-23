import { unsupportedKeyedPngs, rgbaPixel, keyedRgb } from '../gum-jsx-pdf/test/png-fixtures'

// Insert the same image checks into the isolated Bun consumer and browser page.
// PngImage, render_element, and render_pdf come from their installed packages.
export const pdfImageChecks = `
function pngToPdf(encoded) {
  const result = render_element(new PngImage({ data: 'data:image/png;base64,' + encoded }));
  if (result.kind !== 'svg') throw Error('Expected an image fragment');
  return render_pdf(result.fragment);
}
for (const encoded of ${JSON.stringify([rgbaPixel, keyedRgb])}) {
  const pdf = new TextDecoder().decode(pngToPdf(encoded));
  if (!pdf.startsWith('%PDF-') || !pdf.includes('/SMask')) throw Error('PNG transparency mask missing');
}
for (const fixture of ${JSON.stringify(unsupportedKeyedPngs)}) {
  let error;
  try { pngToPdf(fixture.encoded); } catch (caught) { error = String(caught); }
  if (!error?.includes('tRNS chunk contains more alpha values than there are pixels')) {
    throw Error('Expected documented fast-png limitation for ' + fixture.name + ', got ' + error);
  }
}
`
