import { describe, expect, it } from "vitest";
import {
  balducciFractionalSurvivalExample,
  calculateBalducciFractionalSurvival,
  runBalducciFractionalSurvival,
} from "./tool.js";

describe("Balducci Fractional Survival Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runBalducciFractionalSurvival(balducciFractionalSurvivalExample.input),
    ).toEqual({
      ok: true,
      output: balducciFractionalSurvivalExample.output,
    });
  });

  it("matches the Balducci interpolation at a quarter year", () => {
    expect(
      calculateBalducciFractionalSurvival({
        annualDeathProbability: 0.2,
        fractionOfYears: 0.25,
      }),
    ).toEqual({ fractionalSurvivalProbability: 0.9411764705882354 });
  });

  it("returns the correct endpoints, including certain annual death", () => {
    expect(
      calculateBalducciFractionalSurvival({
        annualDeathProbability: 1,
        fractionOfYears: 0,
      }),
    ).toEqual({ fractionalSurvivalProbability: 1 });
    expect(
      calculateBalducciFractionalSurvival({
        annualDeathProbability: 1,
        fractionOfYears: 0.5,
      }),
    ).toEqual({ fractionalSurvivalProbability: 0 });
    expect(
      calculateBalducciFractionalSurvival({
        annualDeathProbability: 0.2,
        fractionOfYears: 1,
      }),
    ).toEqual({ fractionalSurvivalProbability: 0.8 });
  });

  it("rejects probabilities and elapsed fractions outside their domains", () => {
    expect(
      runBalducciFractionalSurvival({
        annualDeathProbability: -0.1,
        fractionOfYears: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runBalducciFractionalSurvival({
        annualDeathProbability: 0.2,
        fractionOfYears: 1.1,
      }).ok,
    ).toBe(false);
    expect(runBalducciFractionalSurvival({ fractionOfYears: 0.5 }).ok).toBe(
      false,
    );
  });
});
