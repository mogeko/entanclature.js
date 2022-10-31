/**
 * This function checks if the given value is empty.
 *
 * @param input - Any data structure that may be empty.
 * @returns if the `input` is empty.
 *
 * @example
 * ```typescript
 * isEmpty(""); // true
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty(undefined); // true
 * isEmpty(null); // true
 * isEmpty(fasle); // true
 * isEmpty(true); // false
 * isEmpty("foo"); // false
 * isEmpty(() => {}); // false
 * ```
 */
export function isEmpty(input: any) {
  if (!input) return true;

  if (typeof input === "object") {
    return Object.keys(input).length === 0;
  }

  return false;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("isEmpty", () => {
    expect(isEmpty({})).toBeTruthy();
    expect(isEmpty([])).toBeTruthy();
    expect(isEmpty("")).toBeTruthy();
    expect(isEmpty(void 0)).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty(false)).toBeTruthy();
    expect(isEmpty(true)).toBeFalsy();
    expect(isEmpty(() => {})).toBeFalsy();
  });
}
