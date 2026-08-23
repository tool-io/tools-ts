import { describe, expect, it } from "vitest";
import {
  calculateUddFractionalSurvival,
  runUddFractionalSurvival,
  uddFractionalSurvivalExample,
} from "./tool.js";

describe("udd fractional survival calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runUddFractionalSurvival(uddFractionalSurvivalExample.input),
    ).toEqual({
      ok: true,
      output: uddFractionalSurvivalExample.output,
    });
  });

  it("decreases linearly through the year", () => {
    const first = calculateUddFractionalSurvival({
      annualDeathProbability: 0.8,
      fractionOfYears: 0.25,
    });
    const second = calculateUddFractionalSurvival({
      annualDeathProbability: 0.8,
      fractionOfYears: 0.75,
    });
    expect(1 - first.fractionalSurvivalProbability).toBeCloseTo(
      second.fractionalSurvivalProbability - (1 - 0.8),
      12,
    );
    expect(first.fractionalSurvivalProbability).toBe(0.8);
  });

  it("rejects invalid probabilities and fractions", () => {
    expect(
      runUddFractionalSurvival({
        annualDeathProbability: 3,
        fractionOfYears: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runUddFractionalSurvival({
        annualDeathProbability: 0.5,
        fractionOfYears: -1,
      }).ok,
    ).toBe(false);
  });
});
