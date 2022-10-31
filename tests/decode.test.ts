import { describe, it, expect } from "vitest";
import { decode } from "../src/core/nomenclature";

import type { Encoded } from "../src/core/nomenclature";

describe("decode", () => {
  it("Decode with a empty file name", () => {
    try {
      decode({ name: "", type: "image/avif" });
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual("We can't process  (base64: )!");
    }
  });

  it("Decode with a wrong file name", () => {
    const file: Encoded = {
      name: "aXRfaXNfYV93cm9uZ190ZXh0NA",
      type: "image/avif",
    };

    try {
      expect(decode(file)).toEqual("");
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual(
        "We can't process it_is_a_wrong_text4 (base64: aXRfaXNfYV93cm9uZ190ZXh0NA)!"
      );
    }
  });

  it("Decode with a wrong check code", () => {
    try {
      decode({ name: "NDFCQTJCOVA4MEErVy0x", type: "image/avif" });
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual("The checksum code is not correct!");
    }
  });
});
