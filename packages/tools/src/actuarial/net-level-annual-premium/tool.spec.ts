import { describe, expect, it } from "vitest";
import {
  calculateNetLevelAnnualPremium,
  netLevelAnnualPremiumExample,
  runNetLevelAnnualPremium,
} from "./tool.js";

describe("net level annual premium calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNetLevelAnnualPremium(netLevelAnnualPremiumExample.input),
    ).toEqual({
      ok: true,
      output: netLevelAnnualPremiumExample.output,
    });
  });

  it("charges more when mortality or benefits rise", () => {
    expect(
      calculateNetLevelAnnualPremium({
        annualDeathProbability: 0.5,
        benefitAmount: 10,
        interestRate: 0.25,
      }).annualPremium,
    ).toBe(4);
    expect(
      calculateNetLevelAnnualPremium({
        annualDeathProbability: 0.25,
        benefitAmount: 20,
        interestRate: 0.25,
      }).annualPremium,
    ).toBe(4);
  });

  it("rejects invalid inputs", () => {
    expect(
      runNetLevelAnnualPremium({
        annualDeathProbability: 0.25,
        benefitAmount: -5,
        interestRate: 0.05,
      }).ok,
    ).toBe(false);
    expect(runNetLevelAnnualPremium({ annualDeathProbability: 0.25 }).ok).toBe(
      false,
    );
  });
});
