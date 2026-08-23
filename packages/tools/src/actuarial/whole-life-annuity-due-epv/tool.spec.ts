import { describe, expect, it } from "vitest";
import {
  calculateWholeLifeAnnuityDueEpv,
  runWholeLifeAnnuityDueEpv,
  wholeLifeAnnuityDueEpvExample,
} from "./tool.js";

describe("whole life annuity due EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWholeLifeAnnuityDueEpv(wholeLifeAnnuityDueEpvExample.input),
    ).toEqual({
      ok: true,
      output: wholeLifeAnnuityDueEpvExample.output,
    });
  });

  it("discounts the perpetuity at a positive interest rate", () => {
    expect(
      calculateWholeLifeAnnuityDueEpv({
        annualDeathProbability: 0,
        benefitAmount: 1,
        interestRate: 0.25,
      }),
    ).toEqual({ presentValue: 5 });
  });

  it("defaults the benefit amount to one", () => {
    expect(
      calculateWholeLifeAnnuityDueEpv({
        annualDeathProbability: 0.5,
        interestRate: 0,
      }),
    ).toEqual({ presentValue: 2 });
  });

  it("rejects a diverging payment series and invalid inputs", () => {
    expect(
      runWholeLifeAnnuityDueEpv({
        annualDeathProbability: 0,
        benefitAmount: 10,
        interestRate: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "series_diverges" }] },
      ok: false,
    });
    expect(
      runWholeLifeAnnuityDueEpv({
        annualDeathProbability: 1.5,
        benefitAmount: 10,
        interestRate: 0.05,
      }).ok,
    ).toBe(false);
  });
});
