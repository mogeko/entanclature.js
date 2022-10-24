import { GRAMMAR, GRAMMAR_META } from "../models/grammar";
import { FileURL } from "../models/url";
import { isURL } from "../utils/is_url";
import { isEmpty } from "../utils/is_empty";
import { base64 } from "../utils/base64";

import type { MIME, Mark } from "../models/grammar";

export function encode({ hash, meta, ...rest }: Decoded): FileURL {
  if (rest.baseURL && isURL(rest.baseURL)) {
    const name = meta.reduce((acc, m) => {
      const mark = mimeToMark(m.mime);
      const quality = qualityToStr(m.quality);

      if (!mark || !quality) return acc;
      return acc.concat(mark, quality);
    }, hash + "#");
    const _base64 = base64.encode(name);
    const filePath = (rest.fileDir ?? "/") + _base64;
    const url = new FileURL(filePath, rest.baseURL);

    if (rest.ext !== false) {
      const ext = GRAMMAR_META.find((m) => {
        return m.mime === meta[0].mime;
      })?.ext[0];
      url.fileExt = ext;
    } else {
      url.fileType = meta[0].mime;
    }

    return url;
  } else {
    throw new URIError(`We can't create URL from ${rest.baseURL}`);
  }
}

export function decode(url: FileURL): Decoded {
  const str = base64.decode(url.fileName);
  const rest = {
    baseURL: url.baseURL,
    fileDir: url.fileDir,
    ext: !isEmpty(url.fileExt),
  };

  return { ...match(str), ...rest };
}

function mimeToMark(mime: MIME) {
  const grammar = Object.entries(GRAMMAR);
  const target = grammar.find(([_, m]) => m.mime === mime);

  return target?.[0] as Mark | undefined;
}

function qualityToStr(quality: Quality) {
  if (!quality) return "";
  if (typeof quality === "number") {
    if (quality >= 0 && quality <= 100) return String(quality);
  } else if (["+", "-"].includes(quality)) return quality;
  return void 0;
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
    const [hash, sentence] = str.split("#");
    const words = sentence.match(/([AGJPTW][\d\+\-]*)/g);
    if (words) {
      const meta: Meta = words.map((w) => ({
        mime: GRAMMAR[w.slice(0, 1) as Mark].mime,
        quality: strToQuality(w.slice(1)),
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
  fileDir?: string;
} & Opts;

type Opts = {
  ext?: boolean;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const baseURL = "https://example.com";
  const opts = { ext: true, fileDir: "/" };
  const meta: Meta = [
    { mime: "image/png", quality: 80 },
    { mime: "image/avif", quality: "+" },
    { mime: "image/webp", quality: "-" },
  ];
  const decoded = { hash: "41BA2B9", meta, baseURL, ...opts };
  const encodedURL = "https://example.com/NDFCQTJCOSNQODBBK1ct.png";

  it("encode", () => {
    const url = encode(decoded);

    expect(url.fileType).toEqual("image/png");
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

  it("qualityToStr", () => {
    expect(qualityToStr("+")).toEqual("+");
    expect(qualityToStr(90)).toEqual("90");
    expect(qualityToStr(void 0)).toEqual("");

    expect(qualityToStr("*" as Quality)).toBeUndefined();
    expect(qualityToStr(-10)).toBeUndefined();
    expect(qualityToStr(1000)).toBeUndefined();
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
