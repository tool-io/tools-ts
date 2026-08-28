import { describe, expect, it } from "vitest";
import { runCombustionHydrogenMass } from "./tool.js";

describe("Combustion Hydrogen Mass Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCombustionHydrogenMass({ h2oMassG: 18.01528 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.hydrogenMassG).toBeCloseTo(2.01588, 9);
  });

  it("rejects invalid input", () =>
    expect(runCombustionHydrogenMass(null).ok).toBe(false));
});
