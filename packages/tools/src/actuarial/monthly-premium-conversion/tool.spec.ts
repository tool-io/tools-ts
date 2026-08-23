import { describe, expect, it } from "vitest";
import {
  calculateMonthlyPremiumConversion,
  monthlyPremiumConversionExample,
  runMonthlyPremiumConversion,
} from "./tool.js";

describe("monthly premium conversion calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMonthlyPremiumConversion(monthlyPremiumConversionExample.input),
    ).toEqual({
      ok: true,
      output: monthlyPremiumConversionExample.output,
    });
  });

  it("keeps the premium unchanged at zero interest", () => {
    expect(
      calculateMonthlyPremiumConversion({
        annualPremium: 1200,
        interestRate: 0,
      }),
    ).toEqual({ monthlyPremium: 100 });
  });

  it("charges slightly more than a twelfth of the annual premium", () => {
    const result = calculateMonthlyPremiumConversion({
      annualPremium: 1200,
      interestRate: 0.21,
    });
    expect(result.monthlyPremium).toBeGreaterThan(100);
    expect(result.monthlyPremium).toBeLessThan(110);
  });

  it("rejects invalid inputs", () => {
    expect(
      runMonthlyPremiumConversion({ annualPremium: 50, interestRate: -0.5 }).ok,
    ).toBe(false);
  });
});
