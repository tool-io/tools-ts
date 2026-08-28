import { describe, expect, it } from "vitest";
import { runMolarityFromMolalityDensity } from "./tool.js";

describe("Molarity From Molality and Density Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMolarityFromMolalityDensity({
      densityGML: 1,
      molalityMolKg: 1,
      soluteMolarMassGMol: 58.44,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molarityMolL).toBeCloseTo(0.9447866671705528, 12);
  });

  it("rejects invalid input", () =>
    expect(runMolarityFromMolalityDensity(null).ok).toBe(false));
});
