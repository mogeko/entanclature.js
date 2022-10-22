import fs from "fs/promises";
import sysPath from "path";
import { encode } from "./core/nomenclature";
import { mixer } from "./core/entanglement";
import { FileURL } from "./models/url";
import { hash } from "./utils/hash";
import { isURL } from "./utils/is_url";

import type { Meta, Opts } from "./core/nomenclature";

/**
 * This may be the only function you need to follow!
 *
 * You can pass in a string of **file paths** or **URLs**.
 * We will process them as appropriate and return information about
 * all files that pass through [Entanglement Nomenclature](/guide/what-is-entanclature).
 *
 * @param url - a string of URL
 *
 * @example
 *
 * Promises are required because we will calculate the SHA-1 of the file.
 *
 * ```ts
 * const resultFromURL = await entanclature("https://example.com/IDQxQKEyQjkjUEFKVyM6.png");
 *
 * const opt = { baseURL: "https://example.com" };
 * const meta = {};
 * const resultFromFile = await entanclature("/path/of/the/file.png", meta, opt)
 * ```
 *
 * If you don't like `await`, you can use `entanclature.formURL(url)`.
 *
 * ```ts
 * const resultFromURL = entanclature.fromURL("https://example.com/IDQxQKEyQjkjUEFKVyM6.png");
 * ```
 *
 * Promise is required for `entanclature.formFile(path, meta, opt)`
 *
 * ```ts
 * const opt = { baseURL: "https://example.com" };
 * const meta = {};
 * const resultFromFile = await entanclature.fromFile("/path/of/the/file.png", meta, opt)
 * ```
 */
async function main(url: string | FileURL): Promise<Result>;
/**
 * If the string of a **file path** is passed, `meta` will be a must
 *
 * @param path - a string of file paths
 * @param meta - How should we handle this file?
 * @param opts - Additional options
 * */
async function main(path: string, meta: Meta, opts?: Opts): Promise<Result>;
async function main(source: string | FileURL, meta?: Meta, opts?: Opts) {
  if (typeof source === "string" && !isURL(source)) {
    return meta ? await fromFile(source, meta, opts) : void 0;
  } else {
    return fromURL(source);
  }
}

function fromURL(url: string | FileURL) {
  const _url = typeof url === "string" ? new FileURL(url) : url;

  return mixer(_url);
}

async function fromFile(path: string, meta: Meta, opts?: Opts) {
  const filepath = sysPath.resolve(path);
  const file = await fs.readFile(filepath);

  if (!file) return void 0;
  return mixer(encode({ hash: hash(file), meta, ...opts }));
}

export const entanclature = Object.assign(main, { fromURL, fromFile });

type Result = ReturnType<typeof mixer>;
