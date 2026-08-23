import { describe, expect, it } from "vitest";
import {
  calculateSecondMomentWholeLifeEpv,
  runSecondMomentWholeLifeEpv,
  secondMomentWholeLifeEpvExample,
} from "./tool.js";

describe("second moment whole life EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSecondMomentWholeLifeEpv(secondMomentWholeLifeEpvExample.input),
    ).toEqual({
      ok: true,
      output: secondMomentWholeLifeEpvExample.output,
    });
  });

  it("scales with the square of the benefit", () => {
    const base = calculateSecondMomentWholeLifeEpv({
      annualDeathProbability: 0.5,
      benefitAmount: 2,
      interestRate: 3,
    });
    expect(base.secondMoment).toBeCloseTo(0.8, 10);
  });

  it("returns zero at zero mortality and rejects invalid inputs", () => {
    expect(
      runSecondMomentWholeLifeEpv({
        annualDeathProbability: 0,
        benefitAmount: 100,
        interestRate: 0,
      }),
    ).toEqual({
      ok: true,
      output: { secondMoment: 0 },
    });
    expect(
      runSecondMomentWholeLifeEpv({
        annualDeathProbability: 0.5,
        benefitAmount: -1,
        interestRate: 3,
      }).ok,
    ).toBe(false);
  });
});
