import { describe, expect, it } from "vitest";
import {
  calculateLegionNumberExtractor,
  legionNumberExtractorExample,
  runLegionNumberExtractor,
} from "./tool.js";

describe("epigraphy/legion-number-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLegionNumberExtractor(legionNumberExtractorExample.input),
    ).toEqual({
      ok: true,
      output: legionNumberExtractorExample.output,
    });
  });

  it("counts multiple legions and reports the first", () => {
    const result = calculateLegionNumberExtractor({
      text: "LEG V Macedonica et LEG X Fretensis",
    });
    expect(result.legionNumber).toBe(5);
    expect(result.designation).toBe("LEG V");
    expect(result.totalLegions).toBe(2);
  });

  it("reports absence for auxiliary-only texts", () => {
    expect(
      calculateLegionNumberExtractor({ text: "numerus auxiliariorum" }),
    ).toEqual({ legionNumber: 0, designation: "", totalLegions: 0 });
  });

  it("rejects blank text", () => {
    expect(runLegionNumberExtractor({ text: "" }).ok).toBe(false);
  });
});
