export function check(text: string) {
  const ascii = getCharCodeFromStr(text);
  const coeff = coefficient(ascii.length);

  return ascii.reduce((x, y, i) => x + y * coeff[i], 0) % 11;
}

/** [2^(n-1)%11, 2^(n-2)%11, ..., 2^1%11] */
function coefficient(length: number) {
  const set = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];

  return Array.from({ length }, (_, i) => set[(length - i) % 10]);
}

function getCharCodeFromStr(str: string) {
  return Array.from(str, (c) => c.charCodeAt(0));
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("check", () => {
    expect(check("")).toEqual(0);
    expect(check("41BA2B9P80A+W-")).toEqual(2);
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
