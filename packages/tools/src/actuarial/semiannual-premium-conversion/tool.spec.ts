import { describe, expect, it } from "vitest";
import {
  calculateSemiannualPremiumConversion,
  runSemiannualPremiumConversion,
  semiannualPremiumConversionExample,
} from "./tool.js";

describe("semiannual premium conversion calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSemiannualPremiumConversion(semiannualPremiumConversionExample.input),
    ).toEqual({
      ok: true,
      output: semiannualPremiumConversionExample.output,
    });
  });

  it("keeps the premium unchanged at zero interest", () => {
    expect(
      calculateSemiannualPremiumConversion({
        annualPremium: 600,
        interestRate: 0,
      }),
    ).toEqual({ semiannualPremium: 300 });
  });

  it("charges more per installment than half the annual premium", () => {
    expect(
      calculateSemiannualPremiumConversion({
        annualPremium: 1050,
        interestRate: 0.21,
      }).semiannualPremium,
    ).toBeGreaterThan(525);
  });

  it("rejects invalid inputs", () => {
    expect(
      runSemiannualPremiumConversion({
        annualPremium: -100,
        interestRate: 0.05,
      }).ok,
    ).toBe(false);
    expect(runSemiannualPremiumConversion({ interestRate: 0.05 }).ok).toBe(
      false,
    );
  });
});
