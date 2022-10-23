import { describe, it, expect } from "vitest";
import { FileURL } from "../src/models/url";

import type { MIME } from "../src/models/grammar";

describe("FileURL", () => {
  it("Generate FileURL with protocol and host", () => {
    const url = new FileURL("https://example.com");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.fileDir).toEqual("/");
    expect(url.fileName).toEqual("");
    expect(url.fullFileName).toEqual("");
    expect(url.fileExt).toBeUndefined();
    expect(url.fileType).toBeUndefined();
  });

  it("Generate FileURL that path without extension", () => {
    const url = new FileURL("https://example.com/path/without/extension");

    expect(url.baseURL).toEqual("https://example.com");
    expect(url.fileDir).toEqual("/path/without/");
    expect(url.fileExt).toBeUndefined();
    expect(url.fullFileName).toEqual("extension");
    expect(url.fileName).toEqual("extension");
    expect(url.fileType).toBeUndefined();
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
    url.fileType = "image/avif";

    expect(url.fileExt).toBeUndefined();
    expect(url.fileType).toEqual("image/avif");
    expect(url.fullFileName).toEqual("extension");
  });

  it("Generate FileURL by change MIME manually", () => {
    const url = new FileURL("https://example.com/some/file.png");
    url.fileType = "image/avif";

    expect(url.fileExt).toEqual("avif");
    expect(url.fileType).toEqual("image/avif");
    expect(url.fullFileName).toEqual("file.avif");
  });

  it("Generate FileURL with an illegal MIME type", () => {
    try {
      const url = new FileURL("https://example.com/some/file.png");
      url.fileType = "text/plain" as MIME;
    } catch (err) {
      expect(err.name).toEqual("URIError");
      expect(err.message).toEqual("We don't support text/plain type yet.");
    }
  });

  it("Generate FileURL with a FileURL", () => {
    const base = new FileURL("https://example.com/some/file.png");
    const url = new FileURL("/other/file.avif", base);

    expect(url.baseURL).toEqual(base.baseURL);
    expect(base.fileType).toEqual("image/png");
    expect(url.fileType).toEqual("image/avif");
    expect(url.fileDir).toEqual("/other/");
    expect(url.fullFileName).toEqual("file.avif");
  });
});
