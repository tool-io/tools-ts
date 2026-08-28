import { describe, expect, it } from "vitest";
import { runCatalystEffectChecker } from "./tool.js";

describe("Catalyst Effect Check", () => {
  it("calculates a valid result", () => {
    const result = runCatalystEffectChecker({
      activationEnergyCatalyzedJPerMol: 1,
      activationEnergyUncatalyzedJPerMol: 1,
      temperatureK: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rateEnhancementFactor).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCatalystEffectChecker(null).ok).toBe(false));
});
