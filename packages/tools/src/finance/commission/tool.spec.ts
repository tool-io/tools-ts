import { describe, expect, it } from "vitest";
import { runCommission } from "./tool.js";
describe("Commission Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runCommission({ sales: 10000, commissionRatePercent: 5, basePay: 500 }),
    ).toEqual({
      ok: true,
      output: { commission: 500, totalCompensation: 1000 },
    });
  });
  it("rejects invalid input", () => expect(runCommission(null).ok).toBe(false));
});
