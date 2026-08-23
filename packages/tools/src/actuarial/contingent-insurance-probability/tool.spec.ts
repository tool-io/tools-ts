import { describe, expect, it } from "vitest";
import {
  calculateContingentInsuranceProbability,
  contingentInsuranceProbabilityExample,
  runContingentInsuranceProbability,
} from "./tool.js";

describe("Contingent Insurance Probability Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runContingentInsuranceProbability(
        contingentInsuranceProbabilityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: contingentInsuranceProbabilityExample.output,
    });
  });

  it("returns zero or one when only one mortality force is positive", () => {
    expect(
      calculateContingentInsuranceProbability({
        firstLifeDeathProbability: 0,
        secondLifeDeathProbability: 0.2,
      }),
    ).toEqual({ firstToDieProbability: 0 });
    expect(
      calculateContingentInsuranceProbability({
        firstLifeDeathProbability: 0.2,
        secondLifeDeathProbability: 0,
      }),
    ).toEqual({ firstToDieProbability: 1 });
  });

  it("favors the life with the greater constant mortality force", () => {
    expect(
      calculateContingentInsuranceProbability({
        firstLifeDeathProbability: 0.8,
        secondLifeDeathProbability: 0.1,
      }).firstToDieProbability,
    ).toBeGreaterThan(0.5);
  });

  it("rejects an absent event and nonfinite constant-force endpoints", () => {
    expect(
      runContingentInsuranceProbability({
        firstLifeDeathProbability: 0,
        secondLifeDeathProbability: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "undefined_probability" }] },
      ok: false,
    });
    expect(
      runContingentInsuranceProbability({
        firstLifeDeathProbability: 1,
        secondLifeDeathProbability: 0.2,
      }).ok,
    ).toBe(false);
    expect(runContingentInsuranceProbability(null).ok).toBe(false);
  });
});
