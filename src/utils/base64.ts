function encode(str: string): Base64 {
  return Buffer.from(str).toString("base64url");
}

function decode(base64: Base64): string {
  return Buffer.from(base64, "base64url").toString();
}

export const base64 = { decode, encode };

type Base64 = string;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("encode", () => {
    expect(encode("example")).toEqual("ZXhhbXBsZQ");
  });
  it("decode", () => {
    expect(decode("ZXhhbXBsZQ")).toEqual("example");
  });
}
