import fs from "fs/promises";
import sysPath from "path";
import { decode } from "./core/nomenclature";
import { mixer } from "./core/entanglement";
import { FileURL } from "./models/url";
import { hash } from "./utils/hash";
import { isURL } from "./utils/is_url";
import { isEmpty } from "./utils/is_empty";

import type { ExMeta as Meta } from "./core/nomenclature";
import type { Result } from "./core/entanglement";

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
 * */
async function main(path: string, meta: Meta): Promise<Result>;
async function main(source: string | FileURL, meta?: Meta) {
  if (typeof source === "string" && !isURL(source)) {
    return meta ? await fromFile(source, meta) : void 0;
  } else {
    return fromURL(source);
  }
}

function fromURL(url: string | FileURL) {
  const _url = typeof url === "string" ? new FileURL(url) : url;

  return mixer(decode(_url));
}

async function fromFile(path: string, meta: Meta) {
  const filepath = sysPath.resolve(path);
  const file = await fs.readFile(filepath);

  if (isEmpty(file)) throw Error(`It seems that ${filepath} is not a good file.`);
  return mixer({ hash: hash(file), ...meta });
}

export const entanclature = Object.assign(main, { fromURL, fromFile });
