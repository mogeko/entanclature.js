import { getExtFromType } from "./grammar";
import { encode } from "./nomenclature";
import { clone } from "../utils/clone";

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
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    });
    mirror.meta.unshift(focus);
    return mirror;
  });
}

function additionalExt(hasExt?: boolean) {
  return (file: FileInfo) => {
    if (hasExt !== false) {
      const ext = getExtFromType(file.type);
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
    { type: "image/png", quality: 80 },
    { type: "image/avif", quality: "+" },
    { type: "image/webp", quality: "-" },
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
    result.urls.map((url, i) => {
      const _url = new URL(url);
      expect(_url.pathname).toEqual(`${result.filedir}${result.files[i].name}`);
    });
  });

  it("enumerator", () => {
    expect(enumerator(data)).toEqual([
      {
        hash: "41BA2B9",
        meta: [
          { type: "image/png", quality: 80 },
          { type: "image/avif", quality: "+" },
          { type: "image/webp", quality: "-" },
        ],
      },
      {
        hash: "41BA2B9",
        meta: [
          { type: "image/avif", quality: "+" },
          { type: "image/png", quality: 80 },
          { type: "image/webp", quality: "-" },
        ],
      },
      {
        hash: "41BA2B9",
        meta: [
          { type: "image/webp", quality: "-" },
          { type: "image/avif", quality: "+" },
          { type: "image/png", quality: 80 },
        ],
      },
    ]);
  });

  it("additionalExt", () => {
    const file: FileInfo = {
      type: "image/png",
      name: "EXAMPLE_FILE",
    };

    expect(additionalExt(true)(file).name).toEqual("EXAMPLE_FILE.png");
    expect(additionalExt(false)(file).name).toEqual("EXAMPLE_FILE");
    expect(additionalExt()(file).name).toEqual("EXAMPLE_FILE.png");
  });
}
