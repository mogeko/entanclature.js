import { FileURL } from "../models/url";
import { isURL } from "../utils/is_url";

export function encode(_hash: string, _meta: Meta, opts?: Opts) {
  if (opts?.baseURL && isURL(opts?.baseURL)) {
    return new FileURL(opts?.baseURL);
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
  const exampleURL = new FileURL(exampleTextURL);

  it("encode", () => {
    const url = encode("C3499C2", {}, { baseURL: exampleTextURL });

    expect(url).toEqual(exampleURL);
  });
}
