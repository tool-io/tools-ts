import { describe, expect, it } from "vitest";
import { runReturnOnInvestment } from "./tool.js";
describe("Return on Investment Calculator", () => {
  it("calculates a valid result", () => {
    expect(runReturnOnInvestment({ gain: 150, cost: 100 })).toEqual({
      ok: true,
      output: { netReturn: 50, returnPercent: 50 },
    });
  });
  it("rejects invalid input", () =>
    expect(runReturnOnInvestment(null).ok).toBe(false));
});
