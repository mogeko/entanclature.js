export function isURL(url: string) {
  const re =
    /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi;

  return re.test(url);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("isURL", () => {
    expect(isURL("https://example.com")).toBeTruthy();
  });
}
