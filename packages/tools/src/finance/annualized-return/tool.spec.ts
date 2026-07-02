import { describe, expect, it } from "vitest";
import { runAnnualizedReturn } from "./tool.js";
describe("Annualized Return Calculator", () => {
  it("calculates a valid result", () => {
    const result = runAnnualizedReturn({
      startingValue: 100,
      endingValue: 121,
      years: 2,
    });
    expect(result.ok && result.output.annualizedReturn).toBeCloseTo(0.1);
  });
  it("rejects invalid input", () =>
    expect(runAnnualizedReturn(null).ok).toBe(false));
});
