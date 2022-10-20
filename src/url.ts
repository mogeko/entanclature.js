import isEmpty from "./utils/isEmpty";

const AVAILABLE_EXT = ["avif", "gif", "jpeg", "jpg", "png", "tiff", "webp"] as const;

export class ExURL extends URL {
  private _baseURL: string;
  private _extension?: Ext;
  private _filename?: string;

  constructor(url: string) {
    super(url);

    this._baseURL = `${this.protocol}//${this.host}`;

    if (this.pathname.length !== 1) {
      const pathList = this.pathname.split("/").filter((s) => !isEmpty(s));
      this.file = pathList.pop();
      this.baseURL += pathList.join("/");
    }
  }

  public set baseURL(url: string) {
    this._baseURL = url;
  }

  public get baseURL() {
    return this._baseURL.endsWith("/") ? this._baseURL : this._baseURL + "/";
  }

  public set extension(ext: Ext | undefined) {
    if (!ext) return;
    if (AVAILABLE_EXT.includes(ext)) {
      this._extension = ext;
    } else throw URIError(`We don't support .${ext} files yet.`);
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
    return [this.filename, this.extension].filter((s) => !isEmpty(s)).join(".");
  }

  public set filename(name: string | undefined) {
    this._filename = name;
  }

  public get filename() {
    return this._filename;
  }
}

type Ext = typeof AVAILABLE_EXT[number];

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("ExURL", () => {
    const url = new ExURL("https://example.com/with/some/files");

    expect(url.baseURL).toEqual("https://example.com/with/some/");
    expect(url.file).toEqual("files");
    expect(url.filename).toEqual("files");
    expect(url.extension).toEqual(undefined);
  });
}
