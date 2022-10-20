export const AVAILABLE_MIME = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  tif: "image/tiff",
  tiff: "image/tiff",
  webp: "image/webp",
} as const;

type ValueOf<T> = T[keyof T];
export type Ext = keyof typeof AVAILABLE_MIME;
export type MIME = ValueOf<typeof AVAILABLE_MIME>;
