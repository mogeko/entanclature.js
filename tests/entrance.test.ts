import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { entanclature } from "../src/core/entanclature";
import mock from "mock-fs";

import type { Meta } from "../src/core/entanclature";
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

    expect(result.transform).toBeTruthy();
    expect(result.baseURL).toEqual(opts.baseURL);
    expect(result.fileDir).toEqual(opts.fileDir);
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

    expect(result.transform).toBeTruthy();
    expect(result.baseURL).toEqual(opts.baseURL);
    expect(result.fileDir).toEqual(opts.fileDir);
    expect(result.files).toEqual([
      { name: "OTk0QTc5OVA4MEErVy04.png", type: "image/png" },
      { name: "OTk0QTc5OUErUDgwVy0y.avif", type: "image/avif" },
      { name: "OTk0QTc5OVctQStQODA5.webp", type: "image/webp" },
    ]);
  });

  it("Entanglement an error name", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual("The checksum code is not correct!");
    });
    const result = await entanclature("https://example.com/NDFCQTJCOVA4MEErVy0x");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.transform).toBeFalsy();
    expect(result.baseURL).toEqual("https://example.com");
    expect(result.fileDir).toEqual("/");
    expect(result.files).toEqual([{ name: "NDFCQTJCOVA4MEErVy0x" }]);
  });
});
