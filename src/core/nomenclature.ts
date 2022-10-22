import { GRAMMAR } from "../models/grammar";
import { FileURL } from "../models/url";
import { isURL } from "../utils/is_url";

import type { MIME, Mark } from "../models/grammar";
import { isEmpty } from "../utils/is_empty";

export function encode({ hash, meta, ...rest }: Decoded): FileURL {
  if (rest.baseURL && isURL(rest.baseURL)) {
    const _meta = meta.reduce((acc, m) => {
      const mark = mimeToMark(m.mime);

      if (!isQualityLegal(m.quality)) return acc;
      if (!mark) return acc;

      return acc.concat(mark, String(m.quality));
    }, "");
    const name = [hash, _meta].join("#");
    const base64 = Buffer.from(name).toString("base64");
    const base = new FileURL(rest.filedir ?? "/", rest.baseURL);
    const url = new FileURL(base.filedir + base64, base);

    if (rest.ext) {
      const ext = Object.values(GRAMMAR).find((m) => {
        return m.mime === meta[0].mime;
      })?.ext[0];
      url.extension = ext;
    } else {
      url.mime = meta[0].mime;
    }

    return url;
  } else {
    throw new URIError(`We can't create URL from ${rest.baseURL}`);
  }
}

export function decode(url: FileURL): Decoded {
  if (url.filename) {
    const str = Buffer.from(url.filename, "base64").toString();
    const opts = { baseURL: url.baseURL, filedir: url.filedir, ext: !isEmpty(url.extension) };

    return { ...match(str), ...opts };
  } else throw TypeError(); // TODO: Error Message
}

function mimeToMark(mime: MIME) {
  const grammar = Object.entries(GRAMMAR);
  const target = grammar.find(([_, m]) => m.mime === mime);

  return target?.[0] as Mark | undefined;
}

function markToMIME(mark: Mark) {
  const grammar = Object.entries(GRAMMAR);
  const target = grammar.find(([m, _]) => m === mark);

  if (target) {
    return target[1].mime;
  } else throw TypeError(); // TODO: Error Message
}

function isQualityLegal(quality: Quality) {
  if (!quality) return true;
  if (typeof quality === "number") {
    return quality >= 0 && quality <= 100;
  }
  if (["+", "-"].includes(quality)) return true;

  return false;
}

function strToQuality(str: string): Quality {
  if (isEmpty(str)) return void 0;
  if (["+", "-"].includes(str)) {
    return str as "+" | "-";
  } else {
    const num = parseInt(str);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      return num;
    } else throw TypeError(); // TODO: Error Message
  }
}

function match(str: string) {
  if (str.includes("#")) {
    const [hash, _meta] = str.split("#");
    const words = _meta.match(/([AGJPTW][\d\+\-]*)/g);
    if (words) {
      const meta: Meta = words.map((m) => ({
        mime: markToMIME(m.slice(0, 1) as Mark),
        quality: strToQuality(m.slice(1)),
      }));
      return { hash, meta };
    }
  }

  throw TypeError(); // TODO: Error Message
}

type Quality = number | "+" | "-" | undefined;

export type Decoded = {
  hash: string;
} & ExMeta;

type Meta = {
  mime: MIME;
  quality?: Quality;
}[];

export type ExMeta = {
  meta: Meta;
  baseURL: string;
  filedir?: string;
  ext?: boolean;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const baseURL = "https://example.com";
  const opts = { ext: true, filedir: "/" };
  const meta: Meta = [
    { mime: "image/png", quality: 80 },
    { mime: "image/avif", quality: "+" },
    { mime: "image/webp", quality: "-" },
  ];
  const decoded = { hash: "41BA2B9", meta, baseURL, ...opts };
  const encodedURL = "https://example.com/NDFCQTJCOSNQODBBK1ct.png";

  it("encode", () => {
    const url = encode(decoded);

    expect(url.mime).toEqual("image/png");
    expect(url.toString()).toEqual(encodedURL);
  });

  it("decode", () => {
    const url = new FileURL(encodedURL);

    expect(decode(url)).toEqual(decoded);
  });

  it("mimeToMark", () => {
    expect(mimeToMark("image/avif")).toEqual("A");
    expect(mimeToMark("text/plain" as MIME)).toBeUndefined();
  });

  it("markToMIME", () => {
    try {
      expect(markToMIME("A")).toEqual("image/avif");
      markToMIME("X" as Mark);
    } catch (err: any) {
      expect(err.name).toEqual("TypeError");
    }
  });

  it("isQualityLegal", () => {
    expect(isQualityLegal("+")).toBeTruthy();
    expect(isQualityLegal(90)).toBeTruthy();
    expect(isQualityLegal(void 0)).toBeTruthy();

    expect(isQualityLegal("*" as Quality)).toBeFalsy();
    expect(isQualityLegal(-10)).toBeFalsy();
    expect(isQualityLegal(1000)).toBeFalsy();
  });

  it("strToQuality", () => {
    try {
      expect(strToQuality("80")).toEqual(80);
      expect(strToQuality("+")).toEqual("+");
      expect(strToQuality("")).toBeUndefined();
      strToQuality("X");
    } catch (err: any) {
      expect(err.name).toEqual("TypeError");
    }
  });
}
