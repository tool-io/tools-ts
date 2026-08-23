import { describe, expect, it } from "vitest";
import {
  calculateFacklerReserveStep,
  facklerReserveStepExample,
  runFacklerReserveStep,
} from "./tool.js";

describe("fackler reserve step calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFacklerReserveStep(facklerReserveStepExample.input)).toEqual({
      ok: true,
      output: facklerReserveStepExample.output,
    });
  });

  it("carries a positive beginning reserve forward", () => {
    expect(
      calculateFacklerReserveStep({
        annualDeathProbability: 0.2,
        beginningReserve: 10,
        benefitAmount: 100,
        interestRate: 0,
        netAnnualPremium: 25,
      }),
    ).toEqual({ nextReserve: 18.75 });
  });

  it("accepts a negative interest rate above -100 percent", () => {
    expect(
      calculateFacklerReserveStep({
        annualDeathProbability: 0.2,
        beginningReserve: 0,
        benefitAmount: 100,
        interestRate: -0.5,
        netAnnualPremium: 25,
      }),
    ).toEqual({ nextReserve: -9.375 });
  });

  it("rejects certain first-year death with a stable code", () => {
    expect(
      runFacklerReserveStep({
        annualDeathProbability: 1,
        beginningReserve: 0,
        benefitAmount: 100,
        interestRate: 0.05,
        netAnnualPremium: 25,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "no_survivors", field: "annualDeathProbability" }],
      },
      ok: false,
    });
  });

  it("rejects invalid inputs with field-specific issues", () => {
    expect(
      runFacklerReserveStep({
        annualDeathProbability: 2,
        benefitAmount: 100,
        interestRate: 0,
        netAnnualPremium: 25,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "annualDeathProbability" }],
      },
      ok: false,
    });
    expect(
      runFacklerReserveStep({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: -1,
        netAnnualPremium: 25,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_interest_rate", field: "interestRate" }],
      },
      ok: false,
    });
    expect(
      runFacklerReserveStep({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: 0,
        netAnnualPremium: -25,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "netAnnualPremium" }] },
      ok: false,
    });
  });

  it("guards direct calculation calls and finite output", () => {
    expect(() =>
      calculateFacklerReserveStep({
        annualDeathProbability: -0.1,
        interestRate: 0,
        netAnnualPremium: 25,
      }),
    ).toThrowError("Annual death probability must be between zero and one");
    expect(() =>
      calculateFacklerReserveStep({
        annualDeathProbability: 0.2,
        beginningReserve: Number.NaN,
        interestRate: 0,
        netAnnualPremium: 25,
      }),
    ).toThrowError("The beginning reserve must be finite");
    expect(
      runFacklerReserveStep({
        annualDeathProbability: 0.5,
        beginningReserve: Number.MAX_VALUE,
        benefitAmount: 0,
        interestRate: 1,
        netAnnualPremium: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "result_not_finite", field: "beginningReserve" }],
      },
      ok: false,
    });
  });
});
