import fs from "fs/promises";
import sysPath from "path";
import { decode } from "./nomenclature";
import { mixer } from "./entanglement";
import { getTypeFromExt } from "./grammar";
import { hash } from "../utils/hash";
import { isURL } from "../utils/is_url";
import { isEmpty } from "../utils/is_empty";

import type { Opts, Result } from "./entanglement";
import type { Decoded } from "./nomenclature";
import type { Ext } from "./grammar";

/**
 * This is the main function of this project!
 *
 * @remarks
 * This is a wrapper around the functions {@link router},
 * {@link fromURL} and {@link fromFile}.
 *
 * You can pass in a string of file paths or URLs.
 * We will process them as appropriate and return information about
 * all files that pass through Entanglement Nomenclature.
 *
 * If the string of a file path is passed, `meta`, `baseURL` and `fileDir` will be a must.
 *
 * @returns The {@link Result | result} of the processing.
 *
 * @example
 * You can import and use it in your project like this:
 *
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * const url = "https://example.com/images/OTk0QTc5OVA4MEErVy04.png";
 * const result = await entanclature(url);
 *
 * console.log(result);
 * ```
 *
 * @example
 * We also support the local file path as a parameter (Node.js only),
 * but you need to manually define the `meta` information for processing
 * images, and specify the `baseURL` and `fileDir` of the URL:
 *
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * import type { Meta, Opts } from "entanclature";
 *
 * const filePath = "./path/for/an/image.png";
 * const meta = [
 *   { type: "image/png", quality: 80 },
 *   { type: "image/avif", quality: "+" },
 *   { type: "image/webp", quality: "-" },
 * ];
 * const opts: Opts = {
 *   baseURL: "https://example.com",
 *   fileDir: "/images/",
 * };
 * const result = await entanclature(filePath, meta, opts);
 *
 * console.log(result);
 * ```
 *
 * @example
 * If you don't like `await`, you can also use `entanclature.formURL` to handle URLs:
 *
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * const url = "https://example.com/images/OTk0QTc5OVA4MEErVy04.png";
 * const result = entanclature.fromURL(url);
 *
 * console.log(result);
 * ```
 *
 * However, `await` is required for the file path,
 * because we need to calculate the SHA-1 of the file:
 *
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * // Omit defining `filePath`, `meta` and `opts` here.
 *
 * const result = await entanclature.fromURL(filePath, meta, opts);
 *
 * console.log(result);
 * ```
 */
export const entanclature = Object.assign(router, { fromURL, fromFile });

/**
 * (internal) Route for different parameters.
 *
 *
 * @param url - The URL of the image.
 * @returns The {@link Result | result} of the processing.
 *
 * @remarks
 * You can't use this function directly. You need to use it through
 * {@link entanclature}.
 *
 * This function passes the parameter to the {@link fromURL} as the
 * parameter is URL.
 *
 * @example
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * const url = "https://example.com/images/OTk0QTc5OVA4MEErVy04.png";
 * const result = await entanclature(url);
 *
 * console.log(result);
 * ```
 */
export async function router(url: string | URL): Promise<Result>;
/**
 * (internal) Route for different parameters.
 *
 * @param path - The path of the image.
 * @param meta - The meta information of the image.
 * @param opts - The options for processing.
 * @returns The {@link Result | result} of the processing.
 *
 * @remarks
 * You can't use this function directly. You need to use it through
 * {@link entanclature}.
 *
 * This function passes the parameter to the {@link fromFile} as the
 * parameter is a file path.
 *
 * In this case, you should tell us how to handle the image (`meta`)
 * and manually specify the `baseURL` and `fileDir`.
 *
 * @example
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * import type { Meta, Opts } from "entanclature";
 *
 * const filePath = "./path/for/an/image.png";
 * const meta = [
 *   { type: "image/png", quality: 80 },
 *   { type: "image/avif", quality: "+" },
 *   { type: "image/webp", quality: "-" },
 * ];
 * const opts: Opts = {
 *   baseURL: "https://example.com",
 *   fileDir: "/images/",
 * };
 * const result = await entanclature(filePath, meta, opts);
 *
 * console.log(result);
 * ```
 */
export async function router(path: string, meta: Meta, opts: Opts): Promise<Result>;
export async function router(source: string | URL, meta?: Meta, opts?: Opts) {
  if (typeof source === "string" && !isURL(source)) {
    return meta && opts ? await fromFile(source, meta, opts) : void 0;
  } else {
    return fromURL(source);
  }
}

/**
 * (internal) Process the image from the URL.
 *
 * @param url - The URL of the image.
 * @returns The {@link Result | result} of the processing.
 *
 * @remarks
 * You can't use this function directly. You need to use it through
 * {@link entanclature}.
 *
 * This function is usually used as `entanclature.fromURL` to avoid
 * using `await` in the code.
 *
 * @example
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * const url = "https://example.com/images/OTk0QTc5OVA4MEErVy04.png";
 * const result = entanclature.fromURL(url);
 *
 * console.log(result);
 * ```
 */
export function fromURL(url: string | URL): Result {
  const _url = new URL(url);
  const breakpoint = _url.pathname.lastIndexOf("/") + 1;
  const [name, ext] = _url.pathname.slice(breakpoint).split(".");
  const type = getTypeFromExt(ext as Ext);
  const opts: Opts = {
    baseURL: `${_url.protocol}//${_url.host}`,
    fileDir: _url.pathname.slice(0, breakpoint),
    ext: !isEmpty(ext),
  };

  try {
    return mixer(decode({ name, type }), opts);
  } catch (err: any) {
    console.error(err);

    return {
      transform: false,
      baseURL: opts.baseURL,
      fileDir: opts.fileDir,
      files: [{ name }],
      urls: [_url],
    };
  }
}

/**
 * (internal) Process the image from the file path.
 *
 * @param path - The path of the image.
 * @param meta - The meta information of the image.
 * @param opts - The options for processing.
 * @returns The {@link Result | result} of the processing.
 *
 * @remarks
 * You can't use this function directly. You need to use it through
 * {@link entanclature}.
 *
 * `await` is required for this function, because we need to calculate
 * the SHA-1 of the file.
 *
 * @example
 * ```typescript
 * import { entanclature } from "entanclature";
 *
 * import type { Meta, Opts } from "entanclature";
 *
 * const filePath = "./path/for/an/image.png";
 * const meta = [
 *   { type: "image/png", quality: 80 },
 *   { type: "image/avif", quality: "+" },
 *   { type: "image/webp", quality: "-" },
 * ];
 * const opts: Opts = {
 *   baseURL: "https://example.com",
 *   fileDir: "/images/",
 * };
 *
 * const result = await entanclature.fromURL(filePath, meta, opts);
 *
 * console.log(result);
 * ```
 */
export async function fromFile(path: string, meta: Meta, opts: Opts): Promise<Result> {
  const filepath = sysPath.resolve(path);
  const file = await fs.readFile(filepath);

  if (isEmpty(file)) throw Error(`It seems that ${filepath} is not a good file.`);
  return mixer({ hash: hash(file), meta }, opts);
}

/**
 * An array, describe how to transform the images.
 *
 * @remarks
 * Each element of the array corresponds to a picture.
 * At the same time, the first element of the array
 * is the original image.
 *
 * `type` is the MIME type of the image. `quality` is
 * the quality of the image (allowed to be empty).
 */
export type Meta = Decoded["meta"];

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("entanclature", async () => {
    const result = await entanclature("https://example.com/path/OTk0QTc5OVA4MEErVy04.png");

    expect(result.baseURL).toEqual("https://example.com");
    expect(result.fileDir).toEqual("/path/");
    expect(result.files).toEqual([
      { name: "OTk0QTc5OVA4MEErVy04.png", type: "image/png" },
      { name: "OTk0QTc5OUErUDgwVy0y.avif", type: "image/avif" },
      { name: "OTk0QTc5OVctQStQODA5.webp", type: "image/webp" },
    ]);
  });

  it("fromURL", () => {
    const result = fromURL("https://example.com/path/OTk0QTc5OVA4MEErVy04.png");

    expect(result.transform).toBeTruthy();
    expect(result.baseURL).toEqual("https://example.com");
    expect(result.fileDir).toEqual("/path/");
    expect(result.files).toEqual([
      { name: "OTk0QTc5OVA4MEErVy04.png", type: "image/png" },
      { name: "OTk0QTc5OUErUDgwVy0y.avif", type: "image/avif" },
      { name: "OTk0QTc5OVctQStQODA5.webp", type: "image/webp" },
    ]);
  });
}
