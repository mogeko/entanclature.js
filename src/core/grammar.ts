/**
 * The relationship between {@link Type | MIME Type},
 * {@link Mark} and {@link Ext}.
 *
 * @readonly
 */
export const GRAMMAR = {
  A: { type: "image/avif", ext: ["avif"] },
  G: { type: "image/gif", ext: ["gif"] },
  J: { type: "image/jpeg", ext: ["jpeg", "jpg"] },
  P: { type: "image/png", ext: ["png"] },
  T: { type: "image/tiff", ext: ["tiff", "tif"] },
  W: { type: "image/webp", ext: ["webp"] },
} as const;

/** @readonly */
const GRAMMAR_META = Object.values(GRAMMAR);

export function getMarksFromType(type: Type) {
  const grammar = Object.entries(GRAMMAR);
  const target = grammar.find(([_, m]) => m.type === type);

  return target?.[0] as Mark | undefined;
}

export function getTypeFromMark(mark: Mark) {
  if (Object.keys(GRAMMAR).includes(mark)) {
    return GRAMMAR[mark].type;
  } else throw TypeError(`${mark} looks not a good type mark!`);
}

export function getTypeFromExt(ext: Ext) {
  return GRAMMAR_META.find((m) => Array.from(m.ext).includes(ext))?.type;
}

export function getExtFromType(type: Type | undefined) {
  return GRAMMAR_META.find((m) => {
    return m.type === type;
  })?.ext[0];
}

/**
 * Get all possible values of T.
 *
 * @typeParam T - The target structure that has the Type we may need.
 */
export type ValueOf<T> = T[keyof T];
/** Available type identifiers. */
export type Mark = keyof typeof GRAMMAR;
/** Available MIME types. */
export type Type = ValueOf<typeof GRAMMAR>["type"];
/** Available file extensions. */
export type Ext = ValueOf<typeof GRAMMAR>["ext"][number];

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("getMarksFromType", () => {
    expect(getMarksFromType("image/gif")).toEqual("G");
    expect(getMarksFromType("text/plain" as Type)).toBeUndefined();
  });

  it("getTypeFromMark", () => {
    expect(getTypeFromMark("A")).toEqual("image/avif");
    try {
      getTypeFromMark("X" as Mark);
    } catch (err: any) {
      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toEqual("X looks not a good type mark!");
    }
  });

  it("getTypeFromExt", () => {
    expect(getTypeFromExt("jpg")).toEqual("image/jpeg");
    expect(getTypeFromExt("txt" as Ext)).toBeUndefined();
  });

  it("getExtFromType", () => {
    expect(getExtFromType("image/tiff")).toEqual("tiff");
    expect(getExtFromType("text/plain" as Type)).toBeUndefined();
  });
}
