import { describe, expect, it } from "vitest";
import {
  calculateQuarterlyPremiumConversion,
  quarterlyPremiumConversionExample,
  runQuarterlyPremiumConversion,
} from "./tool.js";

describe("quarterly premium conversion calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runQuarterlyPremiumConversion(quarterlyPremiumConversionExample.input),
    ).toEqual({
      ok: true,
      output: quarterlyPremiumConversionExample.output,
    });
  });

  it("keeps the premium unchanged at zero interest", () => {
    expect(
      calculateQuarterlyPremiumConversion({
        annualPremium: 400,
        interestRate: 0,
      }),
    ).toEqual({ quarterlyPremium: 100 });
  });

  it("charges slightly more than a quarter of the annual premium", () => {
    const result = calculateQuarterlyPremiumConversion({
      annualPremium: 400,
      interestRate: 0.21,
    });
    expect(result.quarterlyPremium).toBeGreaterThan(100);
    expect(result.quarterlyPremium).toBeLessThan(110);
  });

  it("rejects invalid inputs", () => {
    expect(
      runQuarterlyPremiumConversion({ annualPremium: -10, interestRate: 1 }).ok,
    ).toBe(false);
    expect(runQuarterlyPremiumConversion({ interestRate: 1 }).ok).toBe(false);
  });
});
