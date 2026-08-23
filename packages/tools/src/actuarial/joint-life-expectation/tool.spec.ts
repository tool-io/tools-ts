import { describe, expect, it } from "vitest";
import {
  calculateJointLifeExpectation,
  jointLifeExpectationExample,
  runJointLifeExpectation,
} from "./tool.js";

describe("joint life expectation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJointLifeExpectation(jointLifeExpectationExample.input)).toEqual({
      ok: true,
      output: jointLifeExpectationExample.output,
    });
  });

  it("does not exceed either single-life expectancy", () => {
    const result = calculateJointLifeExpectation({
      firstLifeDeathProbability: 0.5,
      secondLifeDeathProbability: 0.9,
    });
    expect(result.expectedYears).toBeGreaterThan(0);
    expect(result.expectedYears).toBeLessThan(1 / -Math.log(0.1));
  });

  it("rejects immortal lives and invalid inputs", () => {
    expect(
      runJointLifeExpectation({
        firstLifeDeathProbability: 0,
        secondLifeDeathProbability: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "series_diverges" }] },
      ok: false,
    });
    expect(
      runJointLifeExpectation({
        firstLifeDeathProbability: 2,
        secondLifeDeathProbability: 0,
      }).ok,
    ).toBe(false);
  });
});
