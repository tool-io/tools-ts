import { describe, expect, it } from "vitest";
import {
  calculateTribuniciaPotestasExtractor,
  tribuniciaPotestasExtractorExample,
  runTribuniciaPotestasExtractor,
} from "./tool.js";

describe("epigraphy/tribunicia-potestas-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTribuniciaPotestasExtractor(tribuniciaPotestasExtractorExample.input),
    ).toEqual({ ok: true, output: tribuniciaPotestasExtractorExample.output });
  });

  it("reads interpunct and lowercase markers with arabic numerals", () => {
    const result = calculateTribuniciaPotestasExtractor({
      text: "DIVI·F·AVGVSTVS·TR·POT·XVIII",
    });
    expect(result.marker).toBe("TR·POT·XVIII");
    expect(result.countValue).toBe(18);
    expect(
      calculateTribuniciaPotestasExtractor({ text: "tr p vii" }).countValue,
    ).toBe(7);
  });

  it("switches the majority year under a January renewal", () => {
    const result = calculateTribuniciaPotestasExtractor({
      text: "TR POT XVIII",
      renewal: "january1",
    });
    expect(result.majorityYearSigned).toBe(-5);
    expect(result.startYearSigned).toBe(-5);
  });

  it("rejects texts without a TR POT numeral", () => {
    expect(
      runTribuniciaPotestasExtractor({ text: "COS XI PATER PATRIAE" }).ok,
    ).toBe(false);
    expect(runTribuniciaPotestasExtractor({ text: "" }).ok).toBe(false);
  });
});
