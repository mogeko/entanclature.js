/** Calculate the verification code of `text`. */
export function check(text: string): Checksum;
/** Test whether the verification code of `text` is equal to `checksum`. */
export function check(text: string, checksum: string): boolean;
export function check(text: string, checksum?: string): Checksum | boolean {
  if (checksum) return check(text) === checksum;
  const ascii = getCharCodeFromStr(text);
  const coeff = coefficient(ascii.length);
  const sum = ascii.reduce((x, y, i) => x + y * coeff[i], 0) % 11;

  return (sum < 10 ? sum.toString() : "X") as Checksum;
}

/** `[2^(n-1)%11, 2^(n-2)%11, 2^(n-3)%11, ..., 2^2%11, 2^1%11]` */
function coefficient(length: number) {
  const set = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];

  return Array.from({ length }, (_, i) => set[(length - i) % 10]);
}

/** Get the ASCII code list corresponding to the string */
function getCharCodeFromStr(str: string) {
  return Array.from(str, (c) => c.charCodeAt(0));
}

/** Available verification codes. */
type Checksum = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "X";

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("check", () => {
    expect(check("")).toEqual("0");
    expect(check("41BA2B9P80A+W-")).toEqual("2");
    expect(check("41BA2B9P80A+W-", "2")).toEqual(true);
    expect(check("41BA2BA")).toEqual("X");
  });

  it("getCharCodeFromStr", () => {
    expect(getCharCodeFromStr("")).toEqual([]);
    expect(getCharCodeFromStr("abc")).toEqual([97, 98, 99]);
  });

  it("coefficient", () => {
    // prettier-ignore
    const iso7064 = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3,
                     7, 9, 10, 5, 8, 4, 2];

    expect(coefficient(0)).toEqual([]);
    expect(coefficient(17)).toEqual(iso7064);
  });
}
