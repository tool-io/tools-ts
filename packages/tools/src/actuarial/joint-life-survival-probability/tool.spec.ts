import { describe, expect, it } from "vitest";
import {
  calculateJointLifeSurvivalProbability,
  jointLifeSurvivalProbabilityExample,
  runJointLifeSurvivalProbability,
} from "./tool.js";

describe("joint life survival probability calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runJointLifeSurvivalProbability(
        jointLifeSurvivalProbabilityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: jointLifeSurvivalProbabilityExample.output,
    });
  });

  it("is never above either single-life survival probability", () => {
    const result = calculateJointLifeSurvivalProbability({
      firstLifeDeathProbability: 0.2,
      secondLifeDeathProbability: 0.5,
      years: 1,
    });
    expect(result.jointSurvivalProbability).toBe(0.4);
  });

  it("rejects invalid inputs", () => {
    expect(
      runJointLifeSurvivalProbability({
        firstLifeDeathProbability: -0.2,
        secondLifeDeathProbability: 0.5,
        years: 1,
      }).ok,
    ).toBe(false);
    expect(
      runJointLifeSurvivalProbability({
        firstLifeDeathProbability: 0.2,
        secondLifeDeathProbability: 0.5,
        years: 1.5,
      }).ok,
    ).toBe(false);
  });
});
