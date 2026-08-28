import { describe, expect, it } from "vitest";
import { runExtractionEfficiency } from "./tool.js";

describe("Extraction Efficiency Calculator", () => {
  it("calculates a valid result", () => {
    const result = runExtractionEfficiency({
      partitionCoefficient: 1,
      volumeRatioOrgToAq: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.extractionEfficiencyPercent).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runExtractionEfficiency(null).ok).toBe(false));
});
