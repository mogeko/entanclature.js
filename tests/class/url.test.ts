import { describe, it, expect } from "vitest";
import FileURL from "../../src/class/url";

describe("FileURL", () => {
  it("Generate FileURL with protocol and host", () => {
    const url = new FileURL("https://example.com");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.filedir).toBeUndefined();
    expect(url.extension).toBeUndefined();
    expect(url.file).toBeUndefined();
    expect(url.filename).toBeUndefined();
    expect(url.mime).toBeUndefined();
  });

  it("Generate FileURL that path without extension", () => {
    const url = new FileURL("https://example.com/path/without/extension");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.filedir).toEqual("/path/without/");
    expect(url.extension).toBeUndefined();
    expect(url.file).toEqual("extension");
    expect(url.filename).toEqual("extension");
    expect(url.mime).toBeUndefined();
  });

  it("Generate FileURL with a unwilling file format", () => {
    try {
      new FileURL("https://example.com/unwilling/file/format.txt");
    } catch (err) {
      expect(err.name).toEqual("URIError");
      expect(err.message).toEqual("We don't support txt files yet.");
    }
  });
});
