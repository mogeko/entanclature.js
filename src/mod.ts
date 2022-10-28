import fs from "fs/promises";
import sysPath from "path";
import { decode } from "./core/nomenclature";
import { mixer } from "./core/entanglement";
import { getTypeFromExt } from "./core/grammar";
import { hash } from "./utils/hash";
import { isURL } from "./utils/is_url";
import { isEmpty } from "./utils/is_empty";

import type { Opts, Result } from "./core/entanglement";
import type { Data } from "./core/nomenclature";
import type { Ext } from "./core/grammar";

/**
 * @public
 *
 * This may be the only function you need to follow!
 *
 * You can pass in a string of file paths or URLs.
 * We will process them as appropriate and return information about
 * all files that pass through Entanglement Nomenclature.
 *
 * If the string of a file path is passed, `meta` will be a must
 *
 * @example
 *
 * Promises are required because we will calculate the SHA-1 of the file.
 *
 * You can import and use it in your project like this:
 *
 * ```ts
 * import { entanclature } from "entanclature";
 *
 * const url = "https://example.com/images/OTk0QTc5OVA4MEErVy04.png";
 * const result = await entanclature(url);
 *
 * console.log(result);
 * ```
 *
 * We also support the local file path as a parameter (Node.js only),
 * but you need to manually define the `meta` information for processing
 * images, and specify the `baseURL` and `fileDir` of the URL:
 *
 * ```ts
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
 * If you don't like `await`, you can also use `entanclature.form URL` to handle URLs:
 *
 * ```ts
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
 * ```ts
 * import { entanclature } from "entanclature";
 *
 * // Omit defining `filePath`, `meta` and `opts` here.
 *
 * const result = await entanclature.fromURL(filePath, meta, opts);
 *
 * console.log(result);
 * ```
 *
 */
export const entanclature = Object.assign(main, { fromURL, fromFile });

/** @public */
async function main(url: string | URL): Promise<Result>;
async function main(path: string, meta: Meta, opts: Opts): Promise<Result>;
async function main(source: string | URL, meta?: Meta, opts?: Opts) {
  if (typeof source === "string" && !isURL(source)) {
    return meta && opts ? await fromFile(source, meta, opts) : void 0;
  } else {
    return fromURL(source);
  }
}

/** @public */
function fromURL(url: string | URL) {
  const _url = new URL(url);
  const breakpoint = _url.pathname.lastIndexOf("/") + 1;
  const [name, ext] = _url.pathname.slice(breakpoint).split(".");
  const type = getTypeFromExt(ext as Ext);
  const opts: Opts = {
    baseURL: `${_url.protocol}//${_url.host}`,
    fileDir: _url.pathname.slice(0, breakpoint),
    ext: !isEmpty(ext),
  };

  if (type && opts.ext) {
    return mixer(decode({ name, type }), opts);
  } else if (!opts.ext) {
    throw Error("The URL should end with a suffix.");
  } else throw Error(`We cannot convert this URL (${url})`);
}

/** @public */
async function fromFile(path: string, meta: Meta, opts: Opts) {
  const filepath = sysPath.resolve(path);
  const file = await fs.readFile(filepath);

  if (isEmpty(file)) throw Error(`It seems that ${filepath} is not a good file.`);
  return mixer({ hash: hash(file), meta }, opts);
}

export type { Opts, Result } from "./core/entanglement";
export type Meta = Data["meta"];
