import { encode } from "./nomenclature";
import { clone } from "../utils/clone";
import { GRAMMAR_META } from "../models/grammar";

import type { Data, FileInfo } from "./nomenclature";

export function mixer(data: Data, opts: Opts): Result {
  const files = enumerator(data).map(encode).map(additionalExt(opts.ext));

  return {
    baseURL: opts.baseURL,
    filedir: opts.fileDir ?? "/",
    urls: files.map((file) => {
      return new URL(opts.fileDir + file.name, opts.baseURL);
    }),
    files,
  };
}

function enumerator(data: Data) {
  return data.meta.map((_, i) => {
    const mirror = clone(data);
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

function additionalExt(hasExt?: boolean) {
  return (file: FileInfo) => {
    if (hasExt !== false) {
      const ext = GRAMMAR_META.find((m) => {
        return m.mime === file.type;
      })?.ext[0];
      const name = [file.name, ext ?? ""].join(".");
      return { name, type: file.type };
    } else {
      return file;
    }
  };
}

export type Result = {
  baseURL: string;
  filedir: string;
  files: FileInfo[];
  urls: URL[];
};
export type Opts = {
  baseURL: string;
  fileDir: string;
  ext?: boolean;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const baseURL = "https://example.com";
  const fileDir = "/";
  const meta: Data["meta"] = [
    { mime: "image/png", quality: 80 },
    { mime: "image/avif", quality: "+" },
    { mime: "image/webp", quality: "-" },
  ];
  const data: Data = { hash: "41BA2B9", meta };

  it("mixer", () => {
    const result = mixer(data, { baseURL, fileDir });

    expect(result.baseURL).toEqual(baseURL);
    expect(result.filedir).toEqual("/");
    expect(result.files).toEqual([
      { name: "NDFCQTJCOSNQODBBK1ct.png", type: "image/png" },
      { name: "NDFCQTJCOSNBK1A4MFct.avif", type: "image/avif" },
      { name: "NDFCQTJCOSNXLUErUDgw.webp", type: "image/webp" },
    ]);
    result.urls.map((url) => {
      expect(new URL(url).toString()).toBeTypeOf("string");
    });
  });

  it("enumerator", () => {
    expect(enumerator(data)).toEqual([
      {
        hash: "41BA2B9",
        meta: [
          { mime: "image/png", quality: 80 },
          { mime: "image/avif", quality: "+" },
          { mime: "image/webp", quality: "-" },
        ],
      },
      {
        hash: "41BA2B9",
        meta: [
          { mime: "image/avif", quality: "+" },
          { mime: "image/png", quality: 80 },
          { mime: "image/webp", quality: "-" },
        ],
      },
      {
        hash: "41BA2B9",
        meta: [
          { mime: "image/webp", quality: "-" },
          { mime: "image/avif", quality: "+" },
          { mime: "image/png", quality: 80 },
        ],
      },
    ]);
  });

  it.skip("additionalExt", () => {
    // TODO: Increase testing to additional Ext
  });
}
