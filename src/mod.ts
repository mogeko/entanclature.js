import fs from "fs/promises";
import sysPath from "path";
import { encode } from "./core/nomenclature";
import { mixer } from "./core/entanglement";
import { FileURL } from "./class/url";
import { hash } from "./utils/hash";
import { isURL } from "./utils/is_url";

import type { Meta, Opts } from "./core/nomenclature";

async function main(url: string | FileURL): Promise<Result>;
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
  return mixer(encode(hash(file), meta, opts));
}

export const entanclature = Object.assign(main, { fromURL, fromFile });

type Result = ReturnType<typeof mixer>;
