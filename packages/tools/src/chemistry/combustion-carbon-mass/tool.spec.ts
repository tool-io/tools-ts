import { describe, expect, it } from "vitest";
import { runCombustionCarbonMass } from "./tool.js";

describe("Combustion Carbon Mass Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCombustionCarbonMass({ co2MassG: 44.0095 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.carbonMassG).toBeCloseTo(12.011, 9);
  });

  it("rejects invalid input", () =>
    expect(runCombustionCarbonMass(null).ok).toBe(false));
});
