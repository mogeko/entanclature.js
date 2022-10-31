import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { entanclature } from "../src/core/entrance";
import mock from "mock-fs";

import type { Meta } from "../src/core/entrance";
import type { Opts } from "../src/core/entanglement";

describe("entanclature", () => {
  beforeAll(() => {
    mock({ "./path/image.png": Buffer.from([8, 6, 7, 5, 3, 0, 9]) });
  });

  afterAll(() => {
    mock.restore();
  });

  it("Entanglement name with a file path", async () => {
    const meta: Meta = [
      { type: "image/png", quality: 80 },
      { type: "image/avif", quality: "+" },
      { type: "image/webp", quality: "-" },
    ];
    const opts: Opts = {
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

  it("Entanglement name by entanclature.fromFile", async () => {
    const meta: Meta = [
      { type: "image/png", quality: 80 },
      { type: "image/avif", quality: "+" },
      { type: "image/webp", quality: "-" },
    ];
    const opts: Opts = {
      baseURL: "https://example.com",
      fileDir: "/path/",
    };
    const result = await entanclature.fromFile("./path/image.png", meta, opts);

    expect(result.baseURL).toEqual(opts.baseURL);
    expect(result.filedir).toEqual(opts.fileDir);
    expect(result.files).toEqual([
      { name: "OTk0QTc5OVA4MEErVy04.png", type: "image/png" },
      { name: "OTk0QTc5OUErUDgwVy0y.avif", type: "image/avif" },
      { name: "OTk0QTc5OVctQStQODA5.webp", type: "image/webp" },
    ]);
  });
});
