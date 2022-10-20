export function entanglement(url: URL) {
  return {
    sources: [url],
  };
}

export function nomenclature(_hash: string, _meta: Meta, opts?: Opts) {
  return new URL(opts?.baseURL!);
}

export type Meta = {};

export type Opts = {
  baseURL: string;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleTextURL = "https://example.com";
  const exampleURL = new URL(exampleTextURL);

  it("entanglement", () => {
    expect(entanglement(exampleURL)).toEqual({
      sources: [exampleURL],
    });
  });

  it("nomenclature", () => {
    const url = nomenclature("C3499C2", {}, { baseURL: exampleTextURL });

    expect(url).toEqual(exampleURL);
  });
}
