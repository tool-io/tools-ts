import { describe, expect, it } from "vitest";
import {
  calculateDeferredTermEpv,
  deferredTermEpvExample,
  runDeferredTermEpv,
} from "./tool.js";

describe("deferred term insurance EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDeferredTermEpv(deferredTermEpvExample.input)).toEqual({
      ok: true,
      output: deferredTermEpvExample.output,
    });
  });

  it("matches the immediate term when deferment is zero", () => {
    expect(
      calculateDeferredTermEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        deferYears: 0,
        interestRate: 0.25,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 3.2000000000000006 });
  });

  it("returns zero when the life cannot reach the deferment horizon", () => {
    expect(
      calculateDeferredTermEpv({
        annualDeathProbability: 1,
        benefitAmount: 100,
        deferYears: 2,
        interestRate: 0.05,
        termYears: 5,
      }),
    ).toEqual({ presentValue: 0 });
  });

  it("accepts a negative interest rate above -100 percent", () => {
    expect(
      calculateDeferredTermEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        deferYears: 0,
        interestRate: -0.5,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 12.5 });
  });

  it("rejects invalid deferment and terms with field-specific issues", () => {
    expect(
      runDeferredTermEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        deferYears: -2,
        interestRate: 0.05,
        termYears: 3,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "deferYears" }] },
      ok: false,
    });
    expect(
      runDeferredTermEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        deferYears: 1,
        interestRate: 0.05,
        termYears: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "termYears" }] },
      ok: false,
    });
  });

  it("rejects interest rates at or below -100 percent at runtime", () => {
    expect(
      runDeferredTermEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        deferYears: 1,
        interestRate: -1,
        termYears: 3,
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
      runDeferredTermEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        deferYears: 1,
        interestRate: Number.NaN,
        termYears: 3,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "interestRate" }] },
      ok: false,
    });
  });
});
