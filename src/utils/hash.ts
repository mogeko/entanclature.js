import crypto from "crypto";

export function hash(msg: Buffer) {
  const sha256 = crypto.createHash("sha1").update(msg).digest("hex");

  return sha256.substring(0, 7).toUpperCase();
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleText = "example";
  const exampleHash = "C3499C2";

  it("hash", () => {
    const _hash = hash(Buffer.from(exampleText, "utf-8"));

    expect(_hash).toEqual(exampleHash);
  });
}
