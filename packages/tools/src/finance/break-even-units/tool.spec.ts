import { describe, expect, it } from "vitest";
import { runBreakEvenUnits } from "./tool.js";
describe("Break-Even Units Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runBreakEvenUnits({
        fixedCosts: 1000,
        pricePerUnit: 25,
        variableCostPerUnit: 15,
      }),
    ).toEqual({
      ok: true,
      output: { breakEvenUnits: 100, contributionPerUnit: 10 },
    });
  });
  it("rejects invalid input", () =>
    expect(runBreakEvenUnits(null).ok).toBe(false));
});
