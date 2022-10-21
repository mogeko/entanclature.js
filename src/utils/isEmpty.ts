function isEmpty(input: any) {
  if (!input) return true;

  if (typeof input === "object") {
    return Object.keys(input).length === 0;
  }

  return false;
}

export default isEmpty;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("isEmpty", () => {
    expect(isEmpty({})).toBeTruthy();
    expect(isEmpty([])).toBeTruthy();
    expect(isEmpty("")).toBeTruthy();
    expect(isEmpty(void 0)).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty(false)).toBeTruthy();
    expect(isEmpty(true)).toBeFalsy();
    expect(isEmpty(() => {})).toBeFalsy();
  });
}
