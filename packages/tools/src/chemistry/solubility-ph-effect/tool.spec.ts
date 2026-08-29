import { describe, expect, it } from "vitest";
import { runSolubilityPhEffect } from "./tool.js";
describe("Solubility vs pH Ratio", () => {
  it("calculates a valid result", () =>
    expect(runSolubilityPhEffect({ hPlusM: 0.001, ka: 1.8e-5 })).toEqual({
      ok: true,
      output: { solubilityRatio: 56.55555555555556 },
    }));
  it("rejects invalid input", () =>
    expect(runSolubilityPhEffect({ hPlusM: 0.001, ka: 0 }).ok).toBe(false));
});
