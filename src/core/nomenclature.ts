import { ExURL } from "../class/url";
import isURL from "../utils/isURL";

function nomenclature(_hash: string, _meta: Meta, opts?: Opts) {
  if (opts?.baseURL && isURL(opts?.baseURL)) {
    return new ExURL(opts?.baseURL);
  } else {
    throw new URIError(`You can't create URL from ${opts?.baseURL}`);
  }
}

export default nomenclature;

export type Meta = {};

export type Opts = {
  baseURL: string;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleTextURL = "https://example.com";
  const exampleURL = new ExURL(exampleTextURL);

  it("nomenclature", () => {
    const url = nomenclature("C3499C2", {}, { baseURL: exampleTextURL });

    expect(url).toEqual(exampleURL);
  });
}
