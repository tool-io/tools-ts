import { describe, expect, it } from "vitest";
import { runGasSolubilityAltitude } from "./tool.js";

describe("Gas Solubility at Altitude Calculator", () => {
  it("calculates a valid result", () => {
    const result = runGasSolubilityAltitude({
      altitudePressureAtm: 0.7,
      seaLevelSolubilityMolL: 0.01,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.adjustedSolubilityMolL).toBeCloseTo(0.007, 12);
  });

  it("rejects invalid input", () =>
    expect(runGasSolubilityAltitude(null).ok).toBe(false));
});
