import { getTypeFromMark, getMarksFromType } from "./grammar";
import { isEmpty } from "../utils/is_empty";
import { base64 } from "../utils/base64";
import { check } from "./calibration";

import type { Type, Mark } from "./grammar";

export function encode({ hash, meta }: Data): FileInfo {
  const init = { text: hash, type: null as unknown as Type };
  const { text, type } = meta.reduce((acc, m) => {
    const mark = getMarksFromType(m.type);
    const quality = getStrFromQuality(m.quality);

    if (!mark || !quality) return acc;
    return {
      text: acc.text.concat(mark, quality),
      type: acc.type ?? m.type,
    };
  }, init);

  return { name: base64.encode(text + check(text)), type };
}

export function decode(file: FileInfo): Data {
  const text = base64.decode(file.name);
  const [hash, sentence, checksum] = splitText(text);

  if (!check(hash + sentence, checksum)) {
    throw new Error("The checksum code is not correct!");
  }

  const words = sentence.match(/([AGJPTW][\d\+\-]*)/g);

  if (words) {
    const meta: Data["meta"] = words.map((w) => ({
      type: getTypeFromMark(w.slice(0, 1) as Mark),
      quality: getQualityFromStr(w.slice(1)),
    }));
    return { hash, meta, check: checksum };
  } else throw Error(`We can't process ${text} (base64: ${file.name})!`);
}

function splitText(text: string) {
  return [text.slice(0, 7), text.slice(7, -1), text.slice(-1)];
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
  check?: string;
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

    expect(file.name).toEqual("NDFCQTJCOVA4MEErVy0y");
    expect(file.type).toEqual("image/png");
  });

  it("decode", () => {
    const result = decode({
      name: "NDFCQTJCOVA4MEErVy0y",
      type: "image/png",
    });

    expect(result.hash).toEqual(data.hash);
    expect(result.meta).toEqual(data.meta);
    expect(result.check).toEqual("2");
  });

  it("splitText", () => {
    const text = "41BA2B9P80A+W-2";
    const result = ["41BA2B9", "P80A+W-", "2"];

    expect(splitText(text)).toEqual(result);
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
