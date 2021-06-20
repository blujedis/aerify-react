
/**
 * Generates a simple unique Id.
 *
 * @param radix the base number of unique digits.
 */
export function generateUID(radix = 16) {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(radix);
}
