import { getExtFromType } from "./grammar";
import { encode } from "./nomenclature";

import type { Decoded, Encoded } from "./nomenclature";

export function mixer(data: Decoded, opts: Opts): Result {
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

/* c8 ignore next 6 */
// a polyfill for structuredClone
if (typeof structuredClone === "undefined") {
  global.structuredClone = function (obj: any) {
    return JSON.parse(JSON.stringify(obj));
  };
}

function enumerator(data: Decoded) {
  return data.meta.map((_, i) => {
    const mirror = structuredClone(data);
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
  return (file: Encoded) => {
    if (hasExt !== false) {
      const ext = getExtFromType(file.type);
      const name = [file.name, ext ?? ""].join(".");
      return { name, type: file.type };
    } else {
      return file;
    }
  };
}

/**
 * the results
 *
 * @example
 *
 * Here is an example of a specific output result:
 *
 * ```typescript
 * const result: Result = {
 *   transform: true,
 *   baseURL: "https://example.com",
 *   fileDir: "/images/",
 *   files: [
 *     { name: "NDFCQTJCOVA4MEErVy0y.png", type: "image/png" },
 *     { name: "NDFCQTJCOVA4MEErVy0y.avif", type: "image/avif" },
 *     { name: "NDFCQTJCOVA4MEErVy0y.webp", type: "image/webp" },
 *   ],
 *   urls: [
 *     "https://example.com/images/NDFCQTJCOVA4MEErVy0y.png",
 *     "https://example.com/images/NDFCQTJCOVA4MEErVy0y.avif",
 *     "https://example.com/images/NDFCQTJCOVA4MEErVy0y.webp",
 *   ],
 * };
 * ```
 */
export type Result = {
  baseURL: string;
  filedir: string;
  files: Encoded[];
  urls: URL[];
};

/**
 * Set `baseURL`, `fileDir` and an optional `ext`.
 *
 * @remarks
 * If you use a URL, `baseURL` and `fileDir` will be automatically set.
 *
 * If you use the file path, you need to specify it manually.
 *
 * `ext` determines whether the {@link Encoded | generated filename}
 * has an extension.
 */
export type Opts = {
  baseURL: string;
  fileDir: string;
  ext?: boolean;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const baseURL = "https://example.com";
  const fileDir = "/";
  const meta: Decoded["meta"] = [
    { type: "image/png", quality: 80 },
    { type: "image/avif", quality: "+" },
    { type: "image/webp", quality: "-" },
  ];
  const data: Decoded = { hash: "41BA2B9", meta };

  it("mixer", () => {
    const result = mixer(data, { baseURL, fileDir });

    expect(result.baseURL).toEqual(baseURL);
    expect(result.filedir).toEqual("/");
    expect(result.files).toEqual([
      { name: "NDFCQTJCOVA4MEErVy0y.png", type: "image/png" },
      { name: "NDFCQTJCOUErUDgwVy03.avif", type: "image/avif" },
      { name: "NDFCQTJCOVctQStQODAz.webp", type: "image/webp" },
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
    const file: Encoded = {
      type: "image/png",
      name: "EXAMPLE_FILE",
    };

    expect(additionalExt(true)(file).name).toEqual("EXAMPLE_FILE.png");
    expect(additionalExt(false)(file).name).toEqual("EXAMPLE_FILE");
    expect(additionalExt()(file).name).toEqual("EXAMPLE_FILE.png");
  });
}
