import GRAMMAR from "../core/grammar";
import isEmpty from "../utils/isEmpty";

import type { Ext, MIME } from "../core/grammar";

class ExURL extends URL {
  private _extension?: Ext;
  private _filedir?: string;
  private _filename?: string;
  private _mime?: MIME;

  constructor(url: string) {
    super(url);

    if (this.pathname.length !== 1) {
      const pathList = this.pathname.split("/").filter((s) => !isEmpty(s));
      this.file = pathList.pop();
      this.filedir = "/" + pathList.join("/") + "/";
    }
  }

  public set baseURL(url: string) {
    [this.protocol, this.host] = url.split("//");
  }

  public get baseURL() {
    return `${this.protocol}//${this.host}`;
  }

  public set extension(ext: Ext | undefined) {
    const meta = Object.values(GRAMMAR);

    if (!ext) return;
    if (meta.flatMap((v) => v.ext).includes(ext)) {
      this._extension = ext;
      this.mime = meta.find((v) => Array.from(v.ext).includes(ext))?.mime;
    } else throw URIError(`We don't support ${ext} files yet.`);
  }

  public get extension() {
    return this._extension;
  }

  public set file(file: string | undefined) {
    const [filename, ext] = (file ?? "").split(".");
    this.filename = filename;
    this.extension = ext as Ext;
  }

  public get file() {
    if (this.extension) {
      return [this.filename, this.extension].join(".");
    } else {
      return this.filename;
    }
  }

  public set filedir(dir: string | undefined) {
    this._filedir = dir;
  }

  public get filedir() {
    return this._filedir;
  }

  public set filename(name: string | undefined) {
    this._filename = name;
  }

  public get filename() {
    return this._filename;
  }

  public set mime(mime: MIME | undefined) {
    this._mime = mime;
  }

  public get mime() {
    return this._mime;
  }
}

export default ExURL;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("ExURL", () => {
    const url = new ExURL("https://example.com/with/some/files.png");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.filedir).toEqual("/with/some/");
    expect(url.file).toEqual("files.png");
    expect(url.filename).toEqual("files");
    expect(url.extension).toEqual("png");
    expect(url.mime).toEqual("image/png");
  });
}
