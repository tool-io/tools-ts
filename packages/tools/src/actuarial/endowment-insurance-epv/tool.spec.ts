import { describe, expect, it } from "vitest";
import {
  calculateEndowmentInsuranceEpv,
  endowmentInsuranceEpvExample,
  runEndowmentInsuranceEpv,
} from "./tool.js";

describe("endowment insurance EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEndowmentInsuranceEpv(endowmentInsuranceEpvExample.input),
    ).toEqual({
      ok: true,
      output: endowmentInsuranceEpvExample.output,
    });
  });

  it("combines discounted death benefits with the survival benefit", () => {
    expect(
      calculateEndowmentInsuranceEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: 0.25,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 6.800000000000002 });
  });

  it("pays the full benefit when nobody dies during the term", () => {
    expect(
      calculateEndowmentInsuranceEpv({
        annualDeathProbability: 0,
        benefitAmount: 1600,
        interestRate: 1,
        termYears: 4,
      }),
    ).toEqual({ presentValue: 100 });
  });

  it("accepts a negative interest rate above -100 percent", () => {
    expect(
      calculateEndowmentInsuranceEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: -0.5,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 35 });
  });

  it("rejects invalid inputs with field-specific issues", () => {
    expect(
      runEndowmentInsuranceEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: -1,
        termYears: 3,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_interest_rate", field: "interestRate" }],
      },
      ok: false,
    });
    expect(
      runEndowmentInsuranceEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: Number.NaN,
        termYears: 3,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "interestRate" }] },
      ok: false,
    });
    expect(
      runEndowmentInsuranceEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: 0.05,
        termYears: 1.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "termYears" }] },
      ok: false,
    });
  });
});
