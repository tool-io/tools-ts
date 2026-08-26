import { describe, expect, it } from "vitest";
import {
  calculateAgeStandardizedPrevalenceWeighted,
  runAgeStandardizedPrevalenceWeighted,
  ageStandardizedPrevalenceWeightedExample,
} from "./tool.js";

describe("demography/age-standardized-prevalence-weighted", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAgeStandardizedPrevalenceWeighted(
        ageStandardizedPrevalenceWeightedExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ageStandardizedPrevalenceWeightedExample.output,
    });
  });

  it("keeps prevalence unchanged when weights equalize ages", () => {
    const result = calculateAgeStandardizedPrevalenceWeighted({
      prevalenceByAge: [0.1, 0.3],
      standardWeights: [50, 50],
    });
    expect(result.weightedPrevalence).toBe(0.2);
    expect(result.weightedPrevalencePercent).toBe(20);
  });

  it("rejects out-of-range prevalences and degenerate weights", () => {
    expect(
      runAgeStandardizedPrevalenceWeighted({
        prevalenceByAge: [1.5, 0.2],
        standardWeights: [1, 1],
      }).ok,
    ).toBe(false);
    expect(
      runAgeStandardizedPrevalenceWeighted({
        prevalenceByAge: [0.2],
        standardWeights: [0],
      }).ok,
    ).toBe(false);
  });
});
