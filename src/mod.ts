import fs from "fs/promises";
import _path from "path";
import { entanglement, nomenclature } from "@/core";
import hash from "@/utils/hash";

import type { Meta, OptsType } from "@/core";

function entanclature(url: string | URL): Result;
function entanclature(path: string, meta: Meta, opts?: OptsType): Result;
function entanclature(source: string | URL, meta?: Meta, opts?: OptsType) {
  return entanclature(new URL(""));
}

function fromURL(url: string | URL) {
  const _url = typeof url == "string" ? new URL(url) : url;

  return entanglement(_url);
}

async function fromFile(path: string, meta: Meta, opts?: OptsType) {
  const filepath = _path.resolve(path);
  const file = await fs.readFile(filepath);

  if (!file) return void 0;
  return entanglement(nomenclature(hash(file), meta, opts));
}

const main = Object.assign(entanclature, { fromURL, fromFile });

type Result = ReturnType<typeof entanglement>;

export default main;
