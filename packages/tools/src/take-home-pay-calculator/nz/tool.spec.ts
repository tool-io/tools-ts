import { describe, expect, it } from "vitest";
import { calculateNewZealandTakeHomePay } from "./tool.js";

describe("New Zealand take-home pay", () => {
  it("calculates PAYE and the ACC earners levy", () => {
    const result = calculateNewZealandTakeHomePay({ grossPay: 80_000 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.deductions.map(({ code }) => code)).toEqual(
        expect.arrayContaining(["paye_income_tax", "acc_earners_levy"]),
      );
  });

  it("preserves the advanced KiwiSaver and student-loan fixture", () => {
    const result = calculateNewZealandTakeHomePay({
      grossPay: 100_000,
      kiwiSaverRate: 6,
      studentLoan: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.netAnnual).toBeCloseTo(60_267.86, 8);
    expect(result.output.ruleVersion).toBe("nz-2026-27.1");
  });
});
