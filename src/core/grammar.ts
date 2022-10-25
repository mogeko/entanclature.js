const GRAMMAR = {
  A: { type: "image/avif", ext: ["avif"] },
  G: { type: "image/gif", ext: ["gif"] },
  J: { type: "image/jpeg", ext: ["jpeg", "jpg"] },
  P: { type: "image/png", ext: ["png"] },
  T: { type: "image/tiff", ext: ["tiff", "tif"] },
  W: { type: "image/webp", ext: ["webp"] },
} as const;

const GRAMMAR_META = Object.values(GRAMMAR);

export function getMarksFromType(type: Type) {
  const grammar = Object.entries(GRAMMAR);
  const target = grammar.find(([_, m]) => m.type === type);

  return target?.[0] as Mark | undefined;
}

export function getTypeFromMark(mark: Mark) {
  return GRAMMAR[mark].type;
}

export function getTypeFromExt(ext: Ext) {
  return GRAMMAR_META.find((m) => Array.from(m.ext).includes(ext))?.type;
}

export function getExtFromType(type: Type) {
  return GRAMMAR_META.find((m) => {
    return m.type === type;
  })?.ext[0];
}

type ValueOf<T> = T[keyof T];

export type Mark = keyof typeof GRAMMAR;
export type Type = ValueOf<typeof GRAMMAR>["type"];
export type Ext = ValueOf<typeof GRAMMAR>["ext"][number];
