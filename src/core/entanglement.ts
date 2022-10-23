import { encode } from "./nomenclature";

import type { Decoded } from "./nomenclature";

export function mixer(data: Decoded) {
  const urls = enumerator(data).map(encode);

  return {
    baseURL: data.baseURL,
    filedir: data.filedir ?? "/",
    files: urls.map((url) => url.fullFileName),
    urls,
  };
}

function enumerator(data: Decoded) {
  return data.meta.map((_, i) => {
    const mirror = structuredClone(data);
    const [focus] = mirror.meta.splice(i, 1);
    mirror.meta.sort((a, b) => {
      if (a.mime < b.mime) return -1;
      if (a.mime > b.mime) return 1;
      return 0;
    });
    mirror.meta.unshift(focus);
    return mirror;
  });
}

export type Result = ReturnType<typeof mixer>;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const { FileURL } = await import("../models/url");
  const baseURL = "https://example.com";
  const meta: Decoded["meta"] = [
    { mime: "image/png", quality: 80 },
    { mime: "image/avif", quality: "+" },
    { mime: "image/webp", quality: "-" },
  ];
  const decoded: Decoded = { hash: "41BA2B9", meta, baseURL };

  it("mixer", () => {
    const data = mixer(decoded);

    expect(data.baseURL).toEqual(baseURL);
    expect(data.filedir).toEqual("/");
    expect(data.files).toEqual([
      "NDFCQTJCOSNQODBBK1ct.png",
      "NDFCQTJCOSNBK1A4MFct.avif",
      "NDFCQTJCOSNXLUErUDgw.webp",
    ]);
    data.urls.map((url) => {
      expect(new FileURL(url).toString()).toBeTypeOf("string");
    });
  });

  it("enumerator", () => {
    expect(enumerator(decoded)).toEqual([
      {
        hash: "41BA2B9",
        baseURL: "https://example.com",
        meta: [
          { mime: "image/png", quality: 80 },
          { mime: "image/avif", quality: "+" },
          { mime: "image/webp", quality: "-" },
        ],
      },
      {
        hash: "41BA2B9",
        baseURL: "https://example.com",
        meta: [
          { mime: "image/avif", quality: "+" },
          { mime: "image/png", quality: 80 },
          { mime: "image/webp", quality: "-" },
        ],
      },
      {
        hash: "41BA2B9",
        baseURL: "https://example.com",
        meta: [
          { mime: "image/webp", quality: "-" },
          { mime: "image/avif", quality: "+" },
          { mime: "image/png", quality: 80 },
        ],
      },
    ]);
  });
}
