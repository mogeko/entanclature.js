import { FileURL } from "../class/url";

export function mixer(url: FileURL) {
  return {
    sources: [url],
  };
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleTextURL = "https://example.com";
  const exampleURL = new FileURL(exampleTextURL);

  it("mixer", () => {
    expect(mixer(exampleURL)).toEqual({
      sources: [exampleURL],
    });
  });
}
