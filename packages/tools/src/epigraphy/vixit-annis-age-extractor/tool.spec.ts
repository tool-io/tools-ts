import { describe, expect, it } from "vitest";
import {
  calculateVixitAnnisAgeExtractor,
  runVixitAnnisAgeExtractor,
  vixitAnnisAgeExtractorExample,
} from "./tool.js";

describe("epigraphy/vixit-annis-age-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVixitAnnisAgeExtractor(vixitAnnisAgeExtractorExample.input),
    ).toEqual({ ok: true, output: vixitAnnisAgeExtractorExample.output });
  });

  it("parses decimal ages and plural annos formulas", () => {
    const result = calculateVixitAnnisAgeExtractor({
      text: "vixit annos 45 dies XII",
    });
    expect(result.found).toBe(true);
    expect(result.years).toBe(45);
    expect(result.phrase).toBe("vixit annos 45");
  });

  it("reports not-found without a formula", () => {
    expect(
      calculateVixitAnnisAgeExtractor({ text: "annorum XX sine vixit" }),
    ).toEqual({ found: false, years: 0, phrase: "" });
  });

  it("rejects blank text", () => {
    expect(runVixitAnnisAgeExtractor({ text: "" }).ok).toBe(false);
  });
});
