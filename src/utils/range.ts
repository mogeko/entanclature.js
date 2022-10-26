export function range(length: number) {
  return Array.from({ length }, (_, i) => i + 1);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("range", () => {
    expect(range(0)).toEqual([]);
    expect(range(5)).toEqual([1, 2, 3, 4, 5]);
  });
}
