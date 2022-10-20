export function entanglement(url: URL) {
  return {
    sources: [url],
  };
}

export function nomenclature(hash: string, meta: Meta, opts?: Opts) {
  return new URL("");
}

export type Meta = {};

export type Opts = {
  baseURL: string;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleURL = new URL("https://example.com");

  it("entanglement", () => {
    expect(entanglement(exampleURL)).toEqual({
      sources: [exampleURL],
    });
  });
}
