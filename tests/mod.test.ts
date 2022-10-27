import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { entanclature } from "../src/mod";
import mock from "mock-fs";

import type { Data } from "../src/core/nomenclature";

describe("entanclature", () => {
  beforeAll(() => {
    mock({ "./path/image.png": Buffer.from([8, 6, 7, 5, 3, 0, 9]) });
  });

  afterAll(() => {
    mock.restore();
  });

  it("Entanglement name with a file path", async () => {
    const meta: Data["meta"] = [
      { type: "image/png", quality: 80 },
      { type: "image/avif", quality: "+" },
      { type: "image/webp", quality: "-" },
    ];
    const opts = {
      baseURL: "https://example.com",
      fileDir: "/path/",
    };
    const result = await entanclature("./path/image.png", meta, opts);

    expect(result.baseURL).toEqual(opts.baseURL);
    expect(result.filedir).toEqual(opts.fileDir);
    expect(result.files).toEqual([
      { name: "OTk0QTc5OVA4MEErVy04.png", type: "image/png" },
      { name: "OTk0QTc5OUErUDgwVy0y.avif", type: "image/avif" },
      { name: "OTk0QTc5OVctQStQODA5.webp", type: "image/webp" },
    ]);
  });

  it("Entanglement name with a URL", async () => {
    const result = await entanclature("https://example.com/path/OTk0QTc5OVA4MEErVy04.png");

    expect(result.baseURL).toEqual("https://example.com");
    expect(result.filedir).toEqual("/path/");
    expect(result.files).toEqual([
      { name: "OTk0QTc5OVA4MEErVy04.png", type: "image/png" },
      { name: "OTk0QTc5OUErUDgwVy0y.avif", type: "image/avif" },
      { name: "OTk0QTc5OVctQStQODA5.webp", type: "image/webp" },
    ]);
  });

  it("Entanglement name with a URL but without await", () => {
    const result = entanclature.fromURL("https://example.com/path/OTk0QTc5OVA4MEErVy04.png");

    expect(result.baseURL).toEqual("https://example.com");
    expect(result.filedir).toEqual("/path/");
    expect(result.files).toEqual([
      { name: "OTk0QTc5OVA4MEErVy04.png", type: "image/png" },
      { name: "OTk0QTc5OUErUDgwVy0y.avif", type: "image/avif" },
      { name: "OTk0QTc5OVctQStQODA5.webp", type: "image/webp" },
    ]);
  });
});
