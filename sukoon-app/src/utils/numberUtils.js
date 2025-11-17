// utils/numberUtils.js
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toHindiDigits(input) {
  return String(input).replace(/\d/g, d => DEVANAGARI_DIGITS[Number(d)]);
}
