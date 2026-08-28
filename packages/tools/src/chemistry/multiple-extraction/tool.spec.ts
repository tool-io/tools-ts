import { describe, expect, it } from "vitest";
import { runMultipleExtraction } from "./tool.js";

describe("Multiple Extraction Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMultipleExtraction({
      partitionCoefficient: 1,
      volumeRatioOrgToAq: 1,
      numExtractions: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.fractionRemaining).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runMultipleExtraction(null).ok).toBe(false));
});
