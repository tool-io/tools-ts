import { describe, expect, it } from "vitest";
import {
  calculateNYearTemporaryAnnuity,
  nYearTemporaryAnnuityExample,
  runNYearTemporaryAnnuity,
} from "./tool.js";

describe("n-year temporary annuity calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNYearTemporaryAnnuity(nYearTemporaryAnnuityExample.input),
    ).toEqual({
      ok: true,
      output: nYearTemporaryAnnuityExample.output,
    });
  });

  it("discounts each survived payment at the interest rate", () => {
    expect(
      calculateNYearTemporaryAnnuity({
        annualDeathProbability: 0,
        benefitAmount: 100,
        interestRate: 0.1,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 190.909090909 });
  });

  it("pays every installment when nobody dies", () => {
    expect(
      calculateNYearTemporaryAnnuity({
        annualDeathProbability: 0,
        benefitAmount: 5,
        interestRate: 0,
        termYears: 4,
      }).presentValue,
    ).toBe(20);
  });

  it("rejects invalid probabilities, rates, and terms", () => {
    expect(
      runNYearTemporaryAnnuity({
        annualDeathProbability: -0.1,
        benefitAmount: 100,
        interestRate: 0,
        termYears: 3,
      }).ok,
    ).toBe(false);
    expect(
      runNYearTemporaryAnnuity({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: 0,
        termYears: 0,
      }).ok,
    ).toBe(false);
    expect(
      runNYearTemporaryAnnuity({
        annualDeathProbability: 0.2,
        interestRate: 0,
      }).ok,
    ).toBe(false);
  });
});
