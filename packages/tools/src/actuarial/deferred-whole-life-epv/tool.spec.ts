import { describe, expect, it } from "vitest";
import {
  calculateDeferredWholeLifeEpv,
  deferredWholeLifeEpvExample,
  runDeferredWholeLifeEpv,
} from "./tool.js";

describe("deferred whole life EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDeferredWholeLifeEpv(deferredWholeLifeEpvExample.input)).toEqual({
      ok: true,
      output: deferredWholeLifeEpvExample.output,
    });
  });

  it("reduces to the whole life insurance when deferment is zero", () => {
    expect(
      calculateDeferredWholeLifeEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        deferYears: 0,
        interestRate: 0.25,
      }),
    ).toEqual({ presentValue: 5.000000000000001 });
  });

  it("returns zero when the life cannot reach the deferment horizon", () => {
    expect(
      calculateDeferredWholeLifeEpv({
        annualDeathProbability: 1,
        benefitAmount: 100,
        deferYears: 3,
        interestRate: 0.05,
      }),
    ).toEqual({ presentValue: 0 });
  });

  it("accepts a negative interest rate above -100 percent while the series converges", () => {
    expect(
      calculateDeferredWholeLifeEpv({
        annualDeathProbability: 0.75,
        benefitAmount: 10,
        deferYears: 1,
        interestRate: -0.5,
      }),
    ).toEqual({ presentValue: 15 });
  });

  it("returns zero when death cannot occur", () => {
    expect(
      runDeferredWholeLifeEpv({
        annualDeathProbability: 0,
        benefitAmount: 100,
        deferYears: 2,
        interestRate: 0,
      }),
    ).toEqual({
      ok: true,
      output: { presentValue: 0 },
    });
  });

  it("rejects invalid deferment and rates with field-specific issues", () => {
    expect(
      runDeferredWholeLifeEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        deferYears: -1,
        interestRate: 0.05,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "deferYears" }] },
      ok: false,
    });
    expect(
      runDeferredWholeLifeEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        deferYears: 1,
        interestRate: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_interest_rate", field: "interestRate" }],
      },
      ok: false,
    });
    expect(
      runDeferredWholeLifeEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        deferYears: 1,
        interestRate: Number.NaN,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "interestRate" }] },
      ok: false,
    });
  });
});
