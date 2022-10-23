import { GRAMMAR_META } from "./grammar";
import { isEmpty } from "../utils/is_empty";

import type { Ext, MIME } from "./grammar";

export class FileURL extends URL {
  private _fileExt?: Ext;
  private _fileType?: MIME;
  readonly fileDir: string;
  readonly fileName: string;

  constructor(url: string | FileURL, base?: string | FileURL) {
    super(url, base);

    const breakpoint = super.pathname.lastIndexOf("/") + 1;
    const [filename, ext] = super.pathname.slice(breakpoint).split(".");
    this.fileDir = super.pathname.slice(0, breakpoint);
    this.fileExt = ext as Ext;
    this.fileName = filename;
  }

  /** @readonly */
  get baseURL() {
    return `${this.protocol}//${this.host}`;
  }

  set fileExt(ext: Ext | undefined) {
    if (!ext) return;
    if (GRAMMAR_META.flatMap((m) => m.ext).includes(ext)) {
      this._fileExt = ext;
      this._fileType = GRAMMAR_META.find((m) => Array.from(m.ext).includes(ext))?.mime;
    } else throw URIError(`We don't support ${ext} files yet.`);
  }

  get fileExt() {
    return this._fileExt;
  }

  /** @readonly */
  get fullFileName() {
    if (!isEmpty(this.fileExt)) {
      return [this.fileName, this.fileExt].join(".");
    } else return this.fileName;
  }

  set fileType(mime: MIME | undefined) {
    if (!mime) return;
    if (GRAMMAR_META.map((m) => m.mime).includes(mime)) {
      this._fileType = mime;
      if (!isEmpty(this._fileExt)) {
        this._fileExt = GRAMMAR_META.find((m) => m.mime === mime)?.ext[0];
      }
    } else throw URIError(`We don't support ${mime} type yet.`);
  }

  get fileType() {
    return this._fileType;
  }

  /** @override @readonly */
  get pathname() {
    return [this.fileDir, this.fullFileName].join("");
  }

  /** @override */
  toString(): string {
    return this.baseURL + this.pathname;
  }

  /** @override */
  toJSON(): string {
    return this.toString();
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("FileURL", () => {
    const url = new FileURL("https://example.com/with/some/files.png");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.fileDir).toEqual("/with/some/");
    expect(url.fullFileName).toEqual("files.png");
    expect(url.fileName).toEqual("files");
    expect(url.fileExt).toEqual("png");
    expect(url.fileType).toEqual("image/png");
  });
}
