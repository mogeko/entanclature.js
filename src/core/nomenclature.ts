import { getTypeFromMark, getMarksFromType } from "./grammar";
import { isEmpty } from "../utils/is_empty";
import { base64 } from "../utils/base64";

import type { Type, Mark } from "./grammar";

export function encode({ hash, meta }: Data): FileInfo {
  const init = { text: hash + "#", type: null as unknown as Type };
  const { text, type } = meta.reduce((acc, m) => {
    const mark = getMarksFromType(m.type);
    const quality = getStrFromQuality(m.quality);

    if (!mark || !quality) return acc;
    return {
      text: acc.text.concat(mark, quality),
      type: acc.type ?? m.type,
    };
  }, init);

  return { name: base64.encode(text), type };
}

export function decode(file: FileInfo): Data {
  const text = base64.decode(file.name);
  if (text.includes("#")) {
    const [hash, sentence] = text.split("#");
    const words = sentence.match(/([AGJPTW][\d\+\-]*)/g);
    if (words) {
      const meta: Data["meta"] = words.map((w) => ({
        type: getTypeFromMark(w.slice(0, 1) as Mark),
        quality: getQualityFromStr(w.slice(1)),
      }));
      return { hash, meta };
    }
  }

  throw TypeError(`We can't process ${text} (base64: ${file.name})!`);
}

function getStrFromQuality(quality: Quality) {
  if (!quality) return "";
  if (typeof quality === "number") {
    if (quality >= 0 && quality <= 100) return String(quality);
  } else if (["+", "-"].includes(quality)) return quality;
  return void 0;
}

function getQualityFromStr(str: string): Quality {
  if (isEmpty(str)) return void 0;
  if (["+", "-"].includes(str)) {
    return str as "+" | "-";
  } else {
    const num = parseInt(str);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      return num;
    } else throw TypeError(`${str} looks not a good quality mark!`);
  }
}

type Quality = number | "+" | "-" | undefined;

export type FileInfo = {
  name: string;
  type: Type;
};

export type Data = {
  hash: string;
  meta: {
    type: Type;
    quality?: Quality;
  }[];
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const meta: Data["meta"] = [
    { type: "image/png", quality: 80 },
    { type: "image/avif", quality: "+" },
    { type: "image/webp", quality: "-" },
  ];
  const data = { hash: "41BA2B9", meta };

  it("encode", () => {
    const file = encode(data);

    expect(file.name).toEqual("NDFCQTJCOSNQODBBK1ct");
    expect(file.type).toEqual("image/png");
  });

  it("decode", () => {
    const file: FileInfo = {
      name: "NDFCQTJCOSNQODBBK1ct",
      type: "image/png",
    };

    expect(decode(file)).toEqual(data);
  });

  it("getStrFromQuality", () => {
    expect(getStrFromQuality("+")).toEqual("+");
    expect(getStrFromQuality(90)).toEqual("90");
    expect(getStrFromQuality(void 0)).toEqual("");

    expect(getStrFromQuality("*" as Quality)).toBeUndefined();
    expect(getStrFromQuality(-10)).toBeUndefined();
    expect(getStrFromQuality(1000)).toBeUndefined();
  });

  it("getQualityFromStr", () => {
    try {
      expect(getQualityFromStr("80")).toEqual(80);
      expect(getQualityFromStr("+")).toEqual("+");
      expect(getQualityFromStr("")).toBeUndefined();
      getQualityFromStr("X");
    } catch (err: any) {
      expect(err.name).toEqual("TypeError");
      expect(err.message).toEqual("X looks not a good quality mark!");
    }
  });
}
