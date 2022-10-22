import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { entanclature } from "../src/mod";
import mock from "mock-fs";

import type { ExMeta } from "../src/core/nomenclature";

describe("entanclature", () => {
  beforeAll(() => {
    mock({ "path/image.png": Buffer.from([8, 6, 7, 5, 3, 0, 9]) });
  });

  afterAll(() => {
    mock.restore();
  });

  it("Entanglement name with a file path", async () => {
    const meta: ExMeta = {
      baseURL: "https://example.com",
      filedir: "/path/",
      meta: [
        { mime: "image/png", quality: 80 },
        { mime: "image/avif", quality: "+" },
        { mime: "image/webp", quality: "-" },
      ],
      ext: true,
    };
    const result = await entanclature("path/image.png", meta);

    expect(result.baseURL).toEqual(meta.baseURL);
    expect(result.filedir).toEqual(meta.filedir);
    expect(result.files).toEqual([
      "OTk0QTc5OSNQODBBK1ct.png",
      "OTk0QTc5OSNBK1A4MFct.avif",
      "OTk0QTc5OSNXLUErUDgw.webp",
    ]);
  });

  it("Entanglement name with a URL", async () => {
    const result = await entanclature("https://example.com/path/OTk0QTc5OSNQODBBK1ct.png");

    expect(result.baseURL).toEqual("https://example.com");
    expect(result.filedir).toEqual("/path/");
    expect(result.files).toEqual([
      "OTk0QTc5OSNQODBBK1ct.png",
      "OTk0QTc5OSNBK1A4MFct.avif",
      "OTk0QTc5OSNXLUErUDgw.webp",
    ]);
  });

  it("Entanglement name with a URL but without await", () => {
    const result = entanclature.fromURL("https://example.com/path/OTk0QTc5OSNQODBBK1ct.png");

    expect(result.baseURL).toEqual("https://example.com");
    expect(result.filedir).toEqual("/path/");
    expect(result.files).toEqual([
      "OTk0QTc5OSNQODBBK1ct.png",
      "OTk0QTc5OSNBK1A4MFct.avif",
      "OTk0QTc5OSNXLUErUDgw.webp",
    ]);
  });
});
