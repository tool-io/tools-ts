import { describe, expect, it } from "vitest";
import {
  calculateTermInsuranceEpv,
  runTermInsuranceEpv,
  termInsuranceEpvExample,
} from "./tool.js";

describe("term insurance EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTermInsuranceEpv(termInsuranceEpvExample.input)).toEqual({
      ok: true,
      output: termInsuranceEpvExample.output,
    });
  });

  it("discounts deaths at a positive interest rate", () => {
    expect(
      calculateTermInsuranceEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: 0.25,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 3.2 });
  });

  it("pays once at the end of the year when death within the year is certain", () => {
    expect(
      calculateTermInsuranceEpv({
        annualDeathProbability: 1,
        benefitAmount: 10,
        interestRate: 0,
        termYears: 4,
      }),
    ).toEqual({ presentValue: 10 });
  });

  it("rejects invalid terms and probabilities", () => {
    expect(
      runTermInsuranceEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: 0.25,
        termYears: 0,
      }).ok,
    ).toBe(false);
    expect(
      runTermInsuranceEpv({
        annualDeathProbability: 1.5,
        benefitAmount: 10,
        interestRate: 0.25,
        termYears: 2,
      }).ok,
    ).toBe(false);
  });
});
