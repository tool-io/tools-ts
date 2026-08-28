import { describe, expect, it } from "vitest";
import { runMolalityFromMolarityDensity } from "./tool.js";

describe("Molality From Molarity and Density Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMolalityFromMolarityDensity({
      densityGML: 1.05,
      molarityMolL: 1,
      soluteMolarMassGMol: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molalityMolKg).toBeCloseTo(0.9900990099009901, 12);
  });

  it("rejects invalid input", () =>
    expect(runMolalityFromMolarityDensity(null).ok).toBe(false));
});
