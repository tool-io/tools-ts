import { describe, expect, it } from "vitest";
import {
  calculateIncreasingWholeLifeEpv,
  increasingWholeLifeEpvExample,
  runIncreasingWholeLifeEpv,
} from "./tool.js";

describe("increasing whole life EPV calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIncreasingWholeLifeEpv(increasingWholeLifeEpvExample.input),
    ).toEqual({
      ok: true,
      output: increasingWholeLifeEpvExample.output,
    });
  });

  it("pays more than the first-year benefit for surviving mortality", () => {
    const result = calculateIncreasingWholeLifeEpv({
      annualDeathProbability: 0.25,
      benefitUnit: 10,
      interestRate: 0,
    });
    expect(result.presentValue).toBeGreaterThan(10);
  });

  it("returns zero when death cannot occur and rejects invalid inputs", () => {
    expect(
      runIncreasingWholeLifeEpv({
        annualDeathProbability: 0,
        benefitUnit: 10,
        interestRate: 0,
      }),
    ).toEqual({
      ok: true,
      output: { presentValue: 0 },
    });
    expect(
      runIncreasingWholeLifeEpv({
        annualDeathProbability: -0.5,
        benefitUnit: 10,
        interestRate: 0.05,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "annualDeathProbability" }],
      },
      ok: false,
    });
  });

  it("guards direct-call domains and finite output", () => {
    expect(() =>
      calculateIncreasingWholeLifeEpv({
        annualDeathProbability: Number.NaN,
        benefitUnit: 10,
        interestRate: 0.05,
      }),
    ).toThrowError("Annual death probability must be between zero and one");
    expect(
      runIncreasingWholeLifeEpv({
        annualDeathProbability: 1,
        benefitUnit: Number.MAX_VALUE,
        interestRate: -0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "result_not_finite", field: "benefitUnit" }] },
      ok: false,
    });
  });
});
