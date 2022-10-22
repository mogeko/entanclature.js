import { GRAMMAR } from "../models/grammar";
import { FileURL } from "../models/url";
import { isURL } from "../utils/is_url";

import type { MIME, Mark } from "../models/grammar";

export function encode(hash: string, meta: Meta, opts?: Opts) {
  if (opts?.baseURL && isURL(opts?.baseURL)) {
    const _meta = meta.reduce((acc, m) => {
      const mark = mimeToMark(m.mime);

      if (isQualityLegal(m.quality)) return acc;
      if (!mark) return acc;

      return acc.concat(mark, String(m.quality));
    }, "");
    const name = [hash, _meta].join("#");
    const base64 = Buffer.from(name).toString("base64");
    const base = new FileURL(opts.filedir ?? "/", opts.baseURL);
    const url = new FileURL(base.filedir + base64, base);

    if (opts.ext) {
      const ext = Object.values(GRAMMAR).find((m) => {
        return m.mime === meta[0].mime;
      })?.ext[0];
      url.extension = ext;
    } else {
      url.mime = meta[0].mime;
    }

    return url;
  } else {
    throw new URIError(`We can't create URL from ${opts?.baseURL}`);
  }
}

function mimeToMark(mime: MIME) {
  const grammar = Object.entries(GRAMMAR);
  const target = grammar.find(([_, m]) => m.mime === mime);

  return target?.shift() as Mark | undefined;
}

function isQualityLegal(quality: Quality) {
  if (!quality) return true;
  if (typeof quality === "number") {
    return quality >= 0 && quality <= 100;
  }
  if (["+", "-"].includes(quality)) return true;

  return false;
}

export type Meta = {
  mime: MIME;
  quality?: Quality;
}[];

export type Quality = number | "+" | "-" | undefined;

export type Opts = {
  baseURL: string;
  filedir?: `/${string}/`;
  ext?: boolean;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("encode", () => {
    const opt: Opts = { baseURL: "https://example.com", ext: true };
    const meta: Meta = [
      { mime: "image/png" },
      { mime: "image/avif", quality: "+" },
      { mime: "image/webp", quality: 80 },
    ];
    const url = encode("C3499C2", meta, opt);

    expect(url.mime).toEqual("image/png");

    expect(url.toString()).toEqual("https://example.com/QzM0OTlDMiM=.png");
  });

  it("mimeToMark", () => {
    expect(mimeToMark("image/avif")).toEqual("A");
    expect(mimeToMark("text/plain" as MIME)).toBeUndefined();
  });

  it("isQualityLegal", () => {
    expect(isQualityLegal("+")).toBeTruthy();
    expect(isQualityLegal(90)).toBeTruthy();
    expect(isQualityLegal(void 0)).toBeTruthy();

    expect(isQualityLegal("*" as Quality)).toBeFalsy();
    expect(isQualityLegal(-10)).toBeFalsy();
    expect(isQualityLegal(1000)).toBeFalsy();
  });
}
