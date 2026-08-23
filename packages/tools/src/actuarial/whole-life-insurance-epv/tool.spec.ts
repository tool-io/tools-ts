import { describe, expect, it } from "vitest";
import {
  calculateWholeLifeInsuranceEpv,
  runWholeLifeInsuranceEpv,
  wholeLifeInsuranceEpvExample,
} from "./tool.js";

describe("whole life insurance EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWholeLifeInsuranceEpv(wholeLifeInsuranceEpvExample.input),
    ).toEqual({
      ok: true,
      output: wholeLifeInsuranceEpvExample.output,
    });
  });

  it("discounts later deaths more heavily", () => {
    expect(
      calculateWholeLifeInsuranceEpv({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: 0.25,
      }),
    ).toEqual({ presentValue: 5 });
  });

  it("returns zero when death never occurs", () => {
    expect(
      calculateWholeLifeInsuranceEpv({
        annualDeathProbability: 0,
        benefitAmount: 100,
        interestRate: 0.05,
      }),
    ).toEqual({ presentValue: 0 });
  });

  it("returns zero at zero mortality and rejects invalid inputs", () => {
    expect(
      runWholeLifeInsuranceEpv({
        annualDeathProbability: 0,
        benefitAmount: 100,
        interestRate: 0,
      }),
    ).toEqual({
      ok: true,
      output: { presentValue: 0 },
    });
    expect(
      runWholeLifeInsuranceEpv({
        annualDeathProbability: -0.2,
        benefitAmount: 100,
        interestRate: 0.05,
      }).ok,
    ).toBe(false);
  });
});
