import { describe, expect, it } from "vitest";
import {
  calculateLastSurvivorProbability,
  lastSurvivorProbabilityExample,
  runLastSurvivorProbability,
} from "./tool.js";

describe("last survivor probability calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLastSurvivorProbability(lastSurvivorProbabilityExample.input),
    ).toEqual({
      ok: true,
      output: lastSurvivorProbabilityExample.output,
    });
  });

  it("is at least each single-life survival probability", () => {
    const result = calculateLastSurvivorProbability({
      firstLifeDeathProbability: 0.5,
      secondLifeDeathProbability: 0.5,
      years: 2,
    });
    expect(result.lastSurvivorProbability).toBe(0.4375);
  });

  it("rejects invalid inputs", () => {
    expect(
      runLastSurvivorProbability({
        firstLifeDeathProbability: 0.5,
        secondLifeDeathProbability: 1.5,
        years: 2,
      }).ok,
    ).toBe(false);
    expect(
      runLastSurvivorProbability({
        firstLifeDeathProbability: 0.5,
        secondLifeDeathProbability: 0.5,
        years: -1,
      }).ok,
    ).toBe(false);
  });
});
