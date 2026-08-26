import { describe, expect, it } from "vitest";
import {
  calculateUnJointAgeSexScore,
  runUnJointAgeSexScore,
  unJointAgeSexScoreExample,
} from "./tool.js";

describe("demography/un-joint-age-sex-score", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUnJointAgeSexScore(unJointAgeSexScoreExample.input)).toEqual({
      ok: true,
      output: unJointAgeSexScoreExample.output,
    });
  });

  it("flags a distorted schedule as highly inaccurate", () => {
    const result = calculateUnJointAgeSexScore({
      malePopulation: [10, 11, 12],
      femalePopulation: [10, 10, 10],
    });
    expect(result.jointScore).toBe(60);
    expect(result.accuracyClass).toBe("highlyInaccurate");
  });

  it("rejects short or mismatched lists", () => {
    expect(
      runUnJointAgeSexScore({ malePopulation: [1], femalePopulation: [1] }).ok,
    ).toBe(false);
    expect(
      runUnJointAgeSexScore({
        malePopulation: [100, 100, 100],
        femalePopulation: [100, 100],
      }).ok,
    ).toBe(false);
    expect(
      runUnJointAgeSexScore({
        malePopulation: [100, 0, 100],
        femalePopulation: [100, 100, 100],
      }).ok,
    ).toBe(false);
  });
});
