import FileURL from "../class/url";

function entanglement(url: FileURL) {
  return {
    sources: [url],
  };
}

export default entanglement;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const exampleTextURL = "https://example.com";
  const exampleURL = new FileURL(exampleTextURL);

  it("entanglement", () => {
    expect(entanglement(exampleURL)).toEqual({
      sources: [exampleURL],
    });
  });
}
