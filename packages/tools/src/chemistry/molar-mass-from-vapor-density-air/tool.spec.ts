import { describe, expect, it } from "vitest";
import { runMolarMassFromVaporDensityAir } from "./tool.js";

describe("Molar Mass From Vapor Density Air Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMolarMassFromVaporDensityAir({ vaporDensityAir: 1.52 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molarMassGMol).toBeCloseTo(44.0192, 9);
  });

  it("rejects invalid input", () =>
    expect(runMolarMassFromVaporDensityAir(null).ok).toBe(false));
});
