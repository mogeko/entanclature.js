import isEmpty from "./utils/isEmpty";

export class ExURL extends URL {
  baseURL: string;
  extension?: string;
  file?: string;
  filename?: string;

  constructor(url: string | ExURL) {
    super(url);

    this.baseURL = `${this.protocol}//${this.host}/`;

    if (this.pathname.length !== 1) {
      const pathList = this.pathname.split("/").filter((s) => !isEmpty(s));
      this.file = pathList.splice(-1, 1, "").shift();
      this.baseURL += pathList.join("/");
      if (this.file) {
        const [filename, ext] = this.file.split(".");
        this.filename = filename;
        this.extension = ext;
      }
    }
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("ExURL", () => {
    const url = new ExURL("https://example.com/with/some/files.png/");

    expect(url.baseURL).toEqual("https://example.com/with/some/");
    expect(url.file).toEqual("files.png");
    expect(url.filename).toEqual("files");
    expect(url.extension).toEqual("png");
  });
}
