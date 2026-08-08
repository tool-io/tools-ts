import { describe, expect, it } from "vitest";
import { calculateUKTakeHomePay } from "./tool.js";

describe("UK take-home pay", () => {
  it("calculates PAYE and National Insurance", () => {
    const result = calculateUKTakeHomePay({ grossPay: 50_000 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.taxYear).toBe("2026–27");
      expect(result.output.deductions.map(({ code }) => code)).toEqual(
        expect.arrayContaining(["paye_income_tax", "national_insurance"]),
      );
    }
  });

  it("preserves the advanced pension fixture", () => {
    const result = calculateUKTakeHomePay({
      grossPay: 80_000,
      pensionRate: 8,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.netAnnual).toBeCloseTo(53_117.4, 8);
    expect(result.output.ruleVersion).toBe("uk-2026-27.1");
  });
});
