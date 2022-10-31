/**
 * This function returns a sequence of numbers.
 *
 * @param length - The length of the array to create.
 * @returns An array of numbers from 0 to `length` - 1.
 *
 * @example
 * ```typescript
 * range(0); // []
 * range(5); // [0, 1, 2, 3, 4]
 * ```
 */
export function range(length: number): number[];
/**
 *
 * This function returns a sequence of numbers.
 *
 * @param start - The start of the sequence (included).
 * @param stop - The end of the sequence (not included).
 * @returns an array of sequential numbers between `start` and `stop`.
 *
 * @example
 * ```typescript
 * range(1, 5); // [1, 2, 3, 4]
 * ```
 */
export function range(start: number, stop?: number): number[];
/**
 * This function returns a sequence of numbers.
 *
 * @param start - The start of the sequence (included).
 * @param stop - The end of the sequence (not included).
 * @param step - The step between each number.
 * @returns an array of sequential numbers between `start`
 * and `stop`, incremented by `step`.
 *
 * @example
 * ```typescript
 * range(1, 6, 2); // [1, 3, 5]
 * ```
 */
export function range(start: number, stop?: number, step?: number): number[];
export function range(start: number, stop?: number, step?: number) {
  const [_start, _stop, _step] = stop ? [start, stop, step ?? 1] : [0, start, 1];
  const length = Math.max(Math.ceil((_stop - _start) / _step), 0);

  return Array.from({ length }, (_, i) => _start + i * _step);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("range", () => {
    expect(range(0)).toEqual([]);
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(1, 6, 2)).toEqual([1, 3, 5]);
  });
}
