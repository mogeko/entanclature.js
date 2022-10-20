import { ExURL } from "./url";
import isURL from "./utils/isURL";

export function entanglement(url: ExURL) {
  return {
    sources: [url],
  };
}

export function nomenclature(_hash: string, _meta: Meta, opts?: Opts) {
  if (opts?.baseURL && isURL(opts?.baseURL)) {
    return new ExURL(opts?.baseURL);
  } else {
    throw new URIError(`You can't create URL from ${opts?.baseURL}`);
  }
}

export type Meta = {};

export type Opts = {
  baseURL: string;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleTextURL = "https://example.com";
  const exampleURL = new ExURL(exampleTextURL);

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
