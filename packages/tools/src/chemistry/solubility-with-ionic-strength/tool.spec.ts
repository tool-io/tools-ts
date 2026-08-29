import { describe, expect, it } from "vitest";
import { runSolubilityWithIonicStrength } from "./tool.js";
describe("Solubility With Ionic Strength Calculator", () => {
  it("adjustment increases solubility above intrinsic", () => {
    const r = runSolubilityWithIonicStrength({
      intrinsicSolubilityMolL: 0.1,
      ionChargeMagnitude: 1,
      ionicStrengthMolL: 0.01,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.adjustedSolubilityMolL).toBeGreaterThan(0.1);
  });
  it("rejects invalid input", () =>
    expect(runSolubilityWithIonicStrength(null).ok).toBe(false));
});
