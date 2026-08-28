import { describe, expect, it } from "vitest";
import { runMolecularWeightFromVaporDensity } from "./tool.js";

describe("Molecular Weight From Vapor Density Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMolecularWeightFromVaporDensity({
      densityGL: 1.964,
      pressureAtm: 1,
      temperatureK: 273.15,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molarMassGMol).toBeCloseTo(44.01, 1);
  });

  it("rejects invalid input", () =>
    expect(runMolecularWeightFromVaporDensity(null).ok).toBe(false));
});
