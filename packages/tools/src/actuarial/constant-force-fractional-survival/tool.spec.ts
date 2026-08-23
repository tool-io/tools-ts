import { describe, expect, it } from "vitest";
import {
  calculateConstantForceFractionalSurvival,
  constantForceFractionalSurvivalExample,
  runConstantForceFractionalSurvival,
} from "./tool.js";

describe("Constant Force Fractional Survival Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runConstantForceFractionalSurvival(
        constantForceFractionalSurvivalExample.input,
      ),
    ).toEqual({
      ok: true,
      output: constantForceFractionalSurvivalExample.output,
    });
  });

  it("raises annual survival to the elapsed fraction", () => {
    expect(
      calculateConstantForceFractionalSurvival({
        annualDeathProbability: 0.36,
        fractionOfYears: 0.5,
      }),
    ).toEqual({ fractionalSurvivalProbability: 0.8 });
  });

  it("returns the correct endpoints", () => {
    expect(
      calculateConstantForceFractionalSurvival({
        annualDeathProbability: 1,
        fractionOfYears: 0,
      }),
    ).toEqual({ fractionalSurvivalProbability: 1 });
    expect(
      calculateConstantForceFractionalSurvival({
        annualDeathProbability: 1,
        fractionOfYears: 0.25,
      }),
    ).toEqual({ fractionalSurvivalProbability: 0 });
    expect(
      calculateConstantForceFractionalSurvival({
        annualDeathProbability: 0.4,
        fractionOfYears: 1,
      }),
    ).toEqual({ fractionalSurvivalProbability: 0.6 });
  });

  it("rejects probabilities and fractions outside their domains", () => {
    expect(
      runConstantForceFractionalSurvival({
        annualDeathProbability: 1.1,
        fractionOfYears: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runConstantForceFractionalSurvival({
        annualDeathProbability: 0.4,
        fractionOfYears: -0.1,
      }).ok,
    ).toBe(false);
    expect(runConstantForceFractionalSurvival(null).ok).toBe(false);
  });
});
