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
