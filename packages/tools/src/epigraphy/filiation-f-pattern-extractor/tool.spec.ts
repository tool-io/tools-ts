import { describe, expect, it } from "vitest";
import {
  calculateFiliationFPatternExtractor,
  filiationFPatternExtractorExample,
  runFiliationFPatternExtractor,
} from "./tool.js";

describe("epigraphy/filiation-f-pattern-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFiliationFPatternExtractor(filiationFPatternExtractorExample.input),
    ).toEqual({ ok: true, output: filiationFPatternExtractorExample.output });
  });

  it("counts multiple filiations and reads long-form markers", () => {
    const result = calculateFiliationFPatternExtractor({
      text: "L. Caecilius L. f. Q. filius Metellus",
    });
    expect(result.count).toBe(2);
    expect(result.fatherPraenomen).toBe("L.");
    expect(result.marker).toBe("f.");
  });

  it("reports an empty result for text without filiation", () => {
    const result = calculateFiliationFPatternExtractor({
      text: "SPQR senatus consultum",
    });
    expect(result).toEqual({ count: 0, fatherPraenomen: "", marker: "" });
  });

  it("rejects blank text and missing input", () => {
    expect(runFiliationFPatternExtractor({ text: "   " }).ok).toBe(false);
    expect(runFiliationFPatternExtractor({}).ok).toBe(false);
  });
});
