import { describe, it, expect } from "vitest";
import { encode } from "../src/core/nomenclature";
import { base64 } from "../src/utils/base64";

describe("encode", () => {
  it("Encode if check === false", () => {
    const file = encode({
      hash: "24BC668",
      meta: [
        { type: "image/png", quality: 80 },
        { type: "image/avif", quality: "+" },
        { type: "image/webp", quality: "-" },
      ],
      check: false,
    });

    expect(file.name).toEqual("MjRCQzY2OCNQODBBK1ct");
    expect(file.type).toEqual("image/png");
    expect(base64.decode(file.name)).toEqual("24BC668#P80A+W-");
  });
});
