import { describe, expect, it } from "vitest";
import { runCommonIonEffectFactor } from "./tool.js";

describe("Common Ion Effect Factor Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCommonIonEffectFactor({ ksp: 1, commonIonConcMolL: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.solubilityReductionFactor).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCommonIonEffectFactor(null).ok).toBe(false));
});
