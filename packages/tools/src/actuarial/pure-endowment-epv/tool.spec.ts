import { describe, expect, it } from "vitest";
import {
  calculatePureEndowmentEpv,
  pureEndowmentEpvExample,
  runPureEndowmentEpv,
} from "./tool.js";

describe("pure endowment EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPureEndowmentEpv(pureEndowmentEpvExample.input)).toEqual({
      ok: true,
      output: pureEndowmentEpvExample.output,
    });
  });

  it("discounts survival over multiple years", () => {
    expect(
      calculatePureEndowmentEpv({
        annualDeathProbability: 0.1,
        benefitAmount: 1000,
        interestRate: 0,
        termYears: 2,
      }),
    ).toEqual({ presentValue: 810 });
  });

  it("returns zero when death is certain", () => {
    expect(
      calculatePureEndowmentEpv({
        annualDeathProbability: 1,
        benefitAmount: 1000,
        interestRate: 0.05,
        termYears: 10,
      }),
    ).toEqual({ presentValue: 0 });
  });

  it("rejects invalid inputs", () => {
    expect(
      runPureEndowmentEpv({
        annualDeathProbability: 0.5,
        benefitAmount: -1,
        interestRate: 0,
        termYears: 2,
      }).ok,
    ).toBe(false);
    expect(
      runPureEndowmentEpv({
        annualDeathProbability: 0.5,
        interestRate: -0.5,
        termYears: 2,
      }).ok,
    ).toBe(false);
  });
});
