import { describe, expect, it } from "vitest";
import { runTitrationPhAfterEquivalence } from "./tool.js";

describe("Titration pH After Equivalence Calculator", () => {
  it("calculates a valid result", () => {
    const result = runTitrationPhAfterEquivalence({
      excessMolesOh: 0.01,
      totalVolumeL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ph).toBeCloseTo(12, 9);
  });

  it("rejects invalid input", () =>
    expect(runTitrationPhAfterEquivalence(null).ok).toBe(false));
});
