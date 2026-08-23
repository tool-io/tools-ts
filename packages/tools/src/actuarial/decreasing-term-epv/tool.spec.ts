import { describe, expect, it } from "vitest";
import {
  calculateDecreasingTermEpv,
  decreasingTermEpvExample,
  runDecreasingTermEpv,
} from "./tool.js";

describe("decreasing term insurance EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDecreasingTermEpv(decreasingTermEpvExample.input)).toEqual({
      ok: true,
      output: decreasingTermEpvExample.output,
    });
  });

  it("pays only the first-year benefit when death within the year is certain", () => {
    expect(
      calculateDecreasingTermEpv({
        annualDeathProbability: 1,
        benefitAmount: 10,
        interestRate: 0,
        termYears: 4,
      }),
    ).toEqual({ presentValue: 40 });
  });

  it("discounts at a positive interest rate", () => {
    expect(
      calculateDecreasingTermEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: 0.25,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 5.2 });
  });

  it("accepts a negative interest rate above -100 percent", () => {
    expect(
      calculateDecreasingTermEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: -0.5,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 17.5 });
  });

  it("rejects invalid terms and probabilities with field-specific issues", () => {
    expect(
      runDecreasingTermEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: 0.25,
        termYears: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "termYears" }] },
      ok: false,
    });
    expect(
      runDecreasingTermEpv({
        annualDeathProbability: -0.25,
        benefitAmount: 10,
        interestRate: 0.25,
        termYears: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "annualDeathProbability" }],
      },
      ok: false,
    });
  });

  it("rejects interest rates at or below -100 percent at runtime", () => {
    expect(
      runDecreasingTermEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: -1,
        termYears: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_interest_rate", field: "interestRate" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite rates through the generic input validation", () => {
    expect(
      runDecreasingTermEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: Number.NaN,
        termYears: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "interestRate" }] },
      ok: false,
    });
  });
});
