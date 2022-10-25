import { describe, it, expect } from "vitest";
import { decode } from "../src/core/nomenclature";

import type { FileInfo } from "../src/core/nomenclature";

describe("decode", () => {
  it("Decode with a empty name", () => {
    try {
      decode({ name: "", type: "image/avif" });
    } catch (err: any) {
      expect(err.name).toEqual("TypeError");
      expect(err.message).toEqual("We can't process  (base64: )!");
    }
  });

  it("Decode with a empty name", () => {
    const file: FileInfo = {
      name: "SVRfSVNfQV9XUk9OR19URVhU",
      type: "image/avif",
    };

    try {
      decode(file);
    } catch (err: any) {
      expect(err.name).toEqual("TypeError");
      expect(err.message).toEqual(
        "We can't process IT_IS_A_WRONG_TEXT (base64: SVRfSVNfQV9XUk9OR19URVhU)!"
      );
    }
  });
});
