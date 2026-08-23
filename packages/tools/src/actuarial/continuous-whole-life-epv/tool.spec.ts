import { describe, expect, it } from "vitest";
import {
  calculateContinuousWholeLifeEpv,
  continuousWholeLifeEpvExample,
  runContinuousWholeLifeEpv,
} from "./tool.js";

describe("Continuous Whole Life EPV Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runContinuousWholeLifeEpv(continuousWholeLifeEpvExample.input),
    ).toEqual({
      ok: true,
      output: continuousWholeLifeEpvExample.output,
    });
  });

  it("equals the benefit when interest is zero and mortality is positive", () => {
    expect(
      calculateContinuousWholeLifeEpv({
        annualDeathProbability: 0.3,
        benefitAmount: 250,
        interestRate: 0,
      }),
    ).toEqual({ presentValue: 250 });
  });

  it("returns zero when death cannot occur or the benefit is zero", () => {
    expect(
      calculateContinuousWholeLifeEpv({
        annualDeathProbability: 0,
        benefitAmount: 250,
        interestRate: 0,
      }),
    ).toEqual({ presentValue: 0 });
    expect(
      calculateContinuousWholeLifeEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 0,
        interestRate: -0.1,
      }),
    ).toEqual({ presentValue: 0 });
  });

  it("accepts a negative rate when the expected-value integral converges", () => {
    expect(
      runContinuousWholeLifeEpv({
        annualDeathProbability: 0.2,
        benefitAmount: 100,
        interestRate: -0.1,
      }).ok,
    ).toBe(true);
  });

  it("rejects undefined mortality forces and divergent integrals", () => {
    expect(
      runContinuousWholeLifeEpv({
        annualDeathProbability: 1,
        benefitAmount: 100,
        interestRate: 0.05,
      }).ok,
    ).toBe(false);
    expect(
      runContinuousWholeLifeEpv({
        annualDeathProbability: 0.01,
        benefitAmount: 100,
        interestRate: -0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "series_diverges" }] },
      ok: false,
    });
    expect(runContinuousWholeLifeEpv(null).ok).toBe(false);
  });

  it("rejects a negative benefit in the direct calculation API", () => {
    expect(() =>
      calculateContinuousWholeLifeEpv({
        annualDeathProbability: 0.2,
        benefitAmount: -1,
        interestRate: 0.03,
      }),
    ).toThrow();
  });
});
