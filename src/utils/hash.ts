import crypto from "crypto";

function hash(msg: Buffer) {
  const sha256 = crypto.createHash("sha256").update(msg).digest("hex");

  return sha256.substring(0, 7).toUpperCase();
}

export default hash;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleText = "example";
  const exampleHash = "50D858E";

  it("hash", () => {
    const _hash = hash(Buffer.from(exampleText, "utf-8"));

    expect(_hash).toEqual(exampleHash);
    expect(_hash).toMatchSnapshot();
  });
}
