import GRAMMAR from "../core/grammar";
import isEmpty from "../utils/isEmpty";

import type { Ext, MIME } from "../core/grammar";

class FileURL extends URL {
  private _extension?: Ext;
  private _mime?: MIME;
  filedir?: string;
  filename?: string;

  constructor(url: string) {
    super(url);

    if (this.pathname.length !== 1) {
      const pathList = this.pathname.split("/").filter((s) => !isEmpty(s));
      this.file = pathList.pop();
      this.filedir = "/" + pathList.join("/") + "/";
    }
  }

  set baseURL(url: string) {
    [this.protocol, this.host] = url.split("//");
  }

  get baseURL() {
    return `${this.protocol}//${this.host}`;
  }

  set extension(ext: Ext | undefined) {
    const meta = Object.values(GRAMMAR);

    if (!ext) return;
    if (meta.flatMap((v) => v.ext).includes(ext)) {
      this._extension = ext;
      this.mime = meta.find((v) => Array.from(v.ext).includes(ext))?.mime;
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
    this._mime = mime;
  }

  get mime() {
    return this._mime;
  }
}

export default FileURL;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("FileURL", () => {
    const url = new FileURL("https://example.com/with/some/files.png");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.filedir).toEqual("/with/some/");
    expect(url.file).toEqual("files.png");
    expect(url.filename).toEqual("files");
    expect(url.extension).toEqual("png");
    expect(url.mime).toEqual("image/png");
  });
}