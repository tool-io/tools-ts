import { describe, expect, it } from "vitest";
import { calculateGermanyTakeHomePay } from "./tool.js";

describe("Germany take-home pay", () => {
  it("preserves the annual and monthly calculation", () => {
    const yearly = calculateGermanyTakeHomePay({
      grossPay: 60_000,
      payPeriod: "yearly",
    });
    const monthly = calculateGermanyTakeHomePay({
      grossPay: 5_000,
      payPeriod: "monthly",
    });
    expect(yearly.ok).toBe(true);
    expect(monthly.ok).toBe(true);
    if (yearly.ok && monthly.ok)
      expect(monthly.output.netAnnual).toBeCloseTo(yearly.output.netAnnual, 8);
  });

  it("rejects invalid pay", () => {
    expect(calculateGermanyTakeHomePay({ grossPay: -1 }).ok).toBe(false);
  });

  it("preserves the advanced tax-class fixture", () => {
    const result = calculateGermanyTakeHomePay({
      children: 2,
      churchTax: true,
      grossPay: 60_000,
      taxClass: "3",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.netAnnual).toBeCloseTo(42_221.78340224018, 8);
    expect(result.output.ruleVersion).toBe("de-2026.1");
  });
});
