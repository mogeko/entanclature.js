const GRAMMAR = {
  A: { mime: "image/avif", ext: ["avif"] },
  G: { mime: "image/gif", ext: ["gif"] },
  J: { mime: "image/jpeg", ext: ["jpeg", "jpg"] },
  P: { mime: "image/png", ext: ["png"] },
  T: { mime: "image/tiff", ext: ["tif", "tiff"] },
  W: { mime: "image/webp", ext: ["webp"] },
} as const;

type ValueOf<T> = T[keyof T];
export type MIME = ValueOf<typeof GRAMMAR>["mime"];
export type Ext = ValueOf<typeof GRAMMAR>["ext"][number];

export default GRAMMAR;
