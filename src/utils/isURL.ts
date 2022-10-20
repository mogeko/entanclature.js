function isURL(url: string) {
  const re =
    /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi;

  return re.test(url);
}

export default isURL;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("entanglement", () => {
    expect(isURL("https://example.com")).toBeTruthy();
  });
}
