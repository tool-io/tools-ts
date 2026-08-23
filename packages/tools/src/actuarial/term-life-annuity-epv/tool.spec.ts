import { describe, expect, it } from "vitest";
import {
  calculateTermLifeAnnuityEpv,
  runTermLifeAnnuityEpv,
  termLifeAnnuityEpvExample,
} from "./tool.js";

describe("term life annuity EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTermLifeAnnuityEpv(termLifeAnnuityEpvExample.input)).toEqual({
      ok: true,
      output: termLifeAnnuityEpvExample.output,
    });
  });

  it("sums only payments made while alive", () => {
    const immediate = calculateTermLifeAnnuityEpv({
      annualDeathProbability: 0.5,
      benefitAmount: 100,
      interestRate: 0,
      termYears: 3,
    });
    expect(immediate.presentValue).toBe(87.5);
  });

  it("returns zero when the life dies before the first payment", () => {
    expect(
      calculateTermLifeAnnuityEpv({
        annualDeathProbability: 1,
        benefitAmount: 100,
        interestRate: 0.05,
        termYears: 5,
      }),
    ).toEqual({ presentValue: 0 });
  });

  it("rejects invalid terms and probabilities", () => {
    expect(
      runTermLifeAnnuityEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: 0.05,
        termYears: -2,
      }).ok,
    ).toBe(false);
    expect(
      runTermLifeAnnuityEpv({
        annualDeathProbability: 2,
        benefitAmount: 100,
        interestRate: 0.05,
        termYears: 3,
      }).ok,
    ).toBe(false);
  });
});
