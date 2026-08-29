import { describe, expect, it } from "vitest";
import { runVaporDensityAir } from "./tool.js";

describe("Vapor Density Relative to Air Calculator", () => {
  it("identifies methane as lighter than air", () => {
    const result = runVaporDensityAir({ gasMolarMassGMol: 16.043 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.vaporDensityAir).toBeCloseTo(0.554, 3);
  });

  it("identifies CO2 as heavier than air", () => {
    const result = runVaporDensityAir({ gasMolarMassGMol: 44.0095 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.vaporDensityAir).toBeCloseTo(1.52, 3);
  });

  it("rejects invalid input", () =>
    expect(runVaporDensityAir(null).ok).toBe(false));
});
