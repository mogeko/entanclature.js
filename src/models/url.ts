import { GRAMMAR } from "./grammar";
import { isEmpty } from "../utils/is_empty";

import type { Ext, MIME } from "./grammar";

export class FileURL extends URL {
  private _extension?: Ext;
  private _mime?: MIME;
  filedir?: string;
  filename?: string;

  constructor(url: string | FileURL, base?: string | FileURL) {
    super(url, base);

    if (this.pathname.length !== 1) {
      const _pathname = this.pathname;
      const path = _pathname.endsWith("/") ? _pathname.slice(0, -1) : _pathname;
      const breakpoint = path.lastIndexOf("/") + 1;
      this.file = path.slice(breakpoint);
      this.filedir = path.slice(0, breakpoint);
    }
  }

  get baseURL() {
    return `${this.protocol}//${this.host}`;
  }

  set extension(ext: Ext | undefined) {
    const meta = Object.values(GRAMMAR);

    if (!ext) return;
    if (meta.flatMap((v) => v.ext).includes(ext)) {
      this._extension = ext;
      this._mime = meta.find((v) => Array.from(v.ext).includes(ext))?.mime;
    } else throw URIError(`We don't support ${ext} files yet.`);
  }

  get extension() {
    return this._extension;
  }

  set file(file: string | undefined) {
    const [filename, ext] = (file ?? "").split(".");
    this.filename = filename;
    this.extension = ext as Ext;
  }

  get file() {
    if (this.extension) {
      return [this.filename, this.extension].join(".");
    } else {
      return this.filename;
    }
  }

  set mime(mime: MIME | undefined) {
    const meta = Object.values(GRAMMAR);

    if (!mime) return;
    if (meta.map((v) => v.mime).includes(mime)) {
      this._mime = mime;
      if (!isEmpty(this._extension)) {
        this._extension = meta.find((v) => v.mime === mime)?.ext[0];
      }
    } else throw URIError(`We don't support ${mime} type yet.`);
  }

  get mime() {
    return this._mime;
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("FileURL", () => {
    const url = new FileURL("https://example.com/with/some/files.png/");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.filedir).toEqual("/with/some/");
    expect(url.file).toEqual("files.png");
    expect(url.filename).toEqual("files");
    expect(url.extension).toEqual("png");
    expect(url.mime).toEqual("image/png");
  });
}