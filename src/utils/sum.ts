/**
 * This function sums the given numbers.
 *
 * @param xs - The array to be calculated.
 * @returns The sum of all elements in the number array.
 *
 * @example
 * ```typescript
 * sum(); // 0
 * sum([1, 2, 3]); // 6
 * ```
 */
export function sum(...xs: number[]) {
  return xs.reduce((a, b) => a + b, 0);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("sum", () => {
    expect(sum()).toEqual(0);
    expect(sum(1, 2, 3)).toEqual(6);
  });
}
