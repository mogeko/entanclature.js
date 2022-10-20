import fs from "fs/promises";
import _path from "path";
import { entanglement, nomenclature } from "./core";
import hash from "./utils/hash";
import isURL from "./utils/isURL";

import type { Meta, Opts } from "./core";

async function main(url: string | URL): Promise<Result>;
async function main(path: string, meta: Meta, opts?: Opts): Promise<Result>;
async function main(source: string | URL, meta?: Meta, opts?: Opts) {
  if (typeof source == "string" && !isURL(source)) {
    return meta ? await fromFile(source, meta, opts) : void 0;
  } else {
    return fromURL(source);
  }
}

function fromURL(url: string | URL) {
  const _url = typeof url == "string" ? new URL(url) : url;

  return entanglement(_url);
}

async function fromFile(path: string, meta: Meta, opts?: Opts) {
  const filepath = _path.resolve(path);
  const file = await fs.readFile(filepath);

  if (!file) return void 0;
  return entanglement(nomenclature(hash(file), meta, opts));
}

const entanclature = Object.assign(main, { fromURL, fromFile });

type Result = ReturnType<typeof entanglement>;

export default entanclature;
