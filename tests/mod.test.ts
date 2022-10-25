import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { entanclature } from "../src/mod";
import mock from "mock-fs";

import type { Meta } from "../src/core/nomenclature";

describe("entanclature", () => {
  beforeAll(() => {
    mock({ "path/image.png": Buffer.from([8, 6, 7, 5, 3, 0, 9]) });
  });

  afterAll(() => {
    mock.restore();
  });

  it("Entanglement name with a file path", async () => {
    const meta: Meta = [
      { mime: "image/png", quality: 80 },
      { mime: "image/avif", quality: "+" },
      { mime: "image/webp", quality: "-" },
    ];
    const opts = {
      baseURL: "https://example.com",
      fileDir: "/path/",
    };
    const result = await entanclature("path/image.png", meta, opts);

    expect(result.baseURL).toEqual(opts.baseURL);
    expect(result.filedir).toEqual(opts.fileDir);
    expect(result.files).toEqual([
      { name: "OTk0QTc5OSNQODBBK1ct.png", type: "image/png" },
      { name: "OTk0QTc5OSNBK1A4MFct.avif", type: "image/avif" },
      { name: "OTk0QTc5OSNXLUErUDgw.webp", type: "image/webp" },
    ]);
  });

  it("Entanglement name with a URL", async () => {
    const result = await entanclature("https://example.com/path/OTk0QTc5OSNQODBBK1ct.png");

    expect(result.baseURL).toEqual("https://example.com");
    expect(result.filedir).toEqual("/path/");
    expect(result.files).toEqual([
      { name: "OTk0QTc5OSNQODBBK1ct.png", type: "image/png" },
      { name: "OTk0QTc5OSNBK1A4MFct.avif", type: "image/avif" },
      { name: "OTk0QTc5OSNXLUErUDgw.webp", type: "image/webp" },
    ]);
  });

  it("Entanglement name with a URL but without await", () => {
    const result = entanclature.fromURL("https://example.com/path/OTk0QTc5OSNQODBBK1ct.png");

    expect(result.baseURL).toEqual("https://example.com");
    expect(result.filedir).toEqual("/path/");
    expect(result.files).toEqual([
      { name: "OTk0QTc5OSNQODBBK1ct.png", type: "image/png" },
      { name: "OTk0QTc5OSNBK1A4MFct.avif", type: "image/avif" },
      { name: "OTk0QTc5OSNXLUErUDgw.webp", type: "image/webp" },
    ]);
  });
});
