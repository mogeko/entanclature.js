/**
 * Functional wrapper for try…catch…
 *
 * @param tryer - The closure of try
 * @param catcher - The closure of catch
 *
 * @returns A closure that passes its parameter list to tryer or catcher
 *
 * @example
 * ```typescript
 * const result = tryCatch(
 *   (_) => {
 *     throw "this is not a valid value"
 *   },
 *   (err, value) => ({ error: err, value })
 * )("bar");
 *
 * console.log(result); // { error: "this is not a valid value", value: "bar" }
 * ```
 */
export function tryCatch<T extends any[], U>(
  tryer: (...args: T) => U,
  catcher: (err: any, ...args: T) => U
) {
  return (...args: T) => {
    try {
      return tryer(...args);
    } catch (err: any) {
      return catcher(err, ...args);
    }
  };
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("tryCatch", () => {
    const tc = tryCatch(
      (_) => {
        throw "this is not a valid value";
      },
      (err, value) => ({ error: err, value })
    );

    expect(tc("bar")).toEqual({
      error: "this is not a valid value",
      value: "bar",
    });
  });
}
