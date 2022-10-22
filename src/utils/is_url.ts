export function isURL(url: string) {
  return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("isURL", () => {
    expect(isURL("https://example.com")).toBeTruthy();
    expect(isURL("/path/image.png")).toBeFalsy();
  });
}
