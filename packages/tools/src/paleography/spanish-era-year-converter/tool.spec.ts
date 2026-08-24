import { describe, expect, it } from "vitest";
import {
  spanishEraYearConverterExample,
  runSpanishEraYearConverter,
} from "./tool.js";

describe("spanish-era-year-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSpanishEraYearConverter(spanishEraYearConverterExample.input),
    ).toEqual({ ok: true, output: spanishEraYearConverterExample.output });
  });

  it("converts an Era charter date back to AD", () => {
    expect(
      runSpanishEraYearConverter({ year: 1124, direction: "era_to_ad" }),
    ).toEqual({ ok: true, output: { convertedYear: 1086 } });
  });

  it("rejects Era years before the epoch", () => {
    expect(
      runSpanishEraYearConverter({ year: 38, direction: "era_to_ad" }).ok,
    ).toBe(false);
  });
});
