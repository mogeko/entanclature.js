import { describe, it, expect } from "vitest";
import { FileURL } from "../../src/models/url";

import type { MIME } from "../../src/models/grammar";

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

  it("Generate FileURL by set MIME manually", () => {
    const url = new FileURL("https://example.com/path/without/extension");
    url.mime = "image/avif";

    expect(url.extension).toBeUndefined();
    expect(url.mime).toEqual("image/avif");
    expect(url.file).toEqual("extension");
  });

  it("Generate FileURL by change MIME manually", () => {
    const url = new FileURL("https://example.com/some/file.png");
    url.mime = "image/avif";

    expect(url.extension).toEqual("avif");
    expect(url.mime).toEqual("image/avif");
    expect(url.file).toEqual("file.avif");
  });

  it("Generate FileURL with an illegal MIME type", () => {
    try {
      const url = new FileURL("https://example.com/some/file.png");
      url.mime = "text/plain" as MIME;
    } catch (err) {
      expect(err.name).toEqual("URIError");
      expect(err.message).toEqual("We don't support text/plain type yet.");
    }
  });

  it("Generate FileURL with a FileURL", () => {
    const base = new FileURL("https://example.com/some/file.png");
    const url = new FileURL("/other/file.avif", base);

    expect(url.baseURL).toEqual(base.baseURL);
    expect(base.mime).toEqual("image/png");
    expect(url.mime).toEqual("image/avif");
    expect(url.filedir).toEqual("/other/");
    expect(url.file).toEqual("file.avif");
  });
});
