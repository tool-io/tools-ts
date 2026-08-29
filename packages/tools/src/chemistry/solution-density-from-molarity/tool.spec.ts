import { describe, expect, it } from "vitest";
import { runSolutionDensityFromMolarity } from "./tool.js";

describe("Solution Density From Molarity Calculator", () => {
  it("calculates a valid result", () => {
    const result = runSolutionDensityFromMolarity({
      molarityMolL: 0.9447866671705528,
      molalityMolKg: 1,
      soluteMolarMassGMol: 58.44,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.densityGML).toBeCloseTo(1, 12);
  });

  it("rejects invalid input", () =>
    expect(runSolutionDensityFromMolarity(null).ok).toBe(false));
});
