import { describe, expect, it } from "vitest";
import { runSimpleInterest } from "./tool.js";
describe("Simple Interest Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runSimpleInterest({ principal: 1000, annualRatePercent: 5, years: 3 }),
    ).toEqual({ ok: true, output: { interest: 150, balance: 1150 } });
  });
  it("rejects invalid input", () =>
    expect(runSimpleInterest(null).ok).toBe(false));
});
