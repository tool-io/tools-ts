import { describe, expect, it } from "vitest";
import { calculateBonferroniCorrection } from "./tool.js";

describe("Bonferroni correction", () => {
  it("multiplies and caps a p-value", () => {
    expect(
      calculateBonferroniCorrection({ comparisons: 5, pValue: 0.01 }),
    ).toEqual({
      ok: true,
      output: { adjustedPValue: 0.05, multiplier: 5 },
    });
    expect(
      calculateBonferroniCorrection({ comparisons: 10, pValue: 0.2 }),
    ).toMatchObject({
      ok: true,
      output: { adjustedPValue: 1 },
    });
  });

  it("rejects invalid probabilities", () => {
    expect(
      calculateBonferroniCorrection({ comparisons: 2, pValue: 2 }),
    ).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });
});
