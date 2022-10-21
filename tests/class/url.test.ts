import { describe, it, expect } from "vitest";
import ExURL from "../../src/class/url";

describe("ExURL", () => {
  it("Generate ExURL with protocol and host", () => {
    const url = new ExURL("https://example.com");

    expect(url.baseURL).toEqual("https://example.com/");
    expect(url.extension).toBeUndefined();
    expect(url.file).toBeUndefined();
    expect(url.filename).toBeUndefined();
    expect(url.mime).toBeUndefined();
  });

  it("Generate ExURL that path without extension", () => {
    const url = new ExURL("https://example.com/path/without/extension");

    expect(url.baseURL).toEqual("https://example.com/path/without/");
    expect(url.extension).toBeUndefined();
    expect(url.file).toEqual("extension");
    expect(url.filename).toEqual("extension");
    expect(url.mime).toBeUndefined();
  });

  it("Generate ExURL with a unwilling file format", () => {
    try {
      new ExURL("https://example.com/unwilling/file/format.txt");
    } catch (err) {
      expect(err.name).toEqual("URIError");
      expect(err.message).toEqual("We don't support txt files yet.");
    }
  });
});
