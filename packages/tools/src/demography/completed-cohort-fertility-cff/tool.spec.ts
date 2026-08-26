import { describe, expect, it } from "vitest";
import {
  calculateCompletedCohortFertilityCff,
  runCompletedCohortFertilityCff,
  completedCohortFertilityCffExample,
} from "./tool.js";

describe("demography/completed-cohort-fertility-cff", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCompletedCohortFertilityCff(completedCohortFertilityCffExample.input),
    ).toEqual({
      ok: true,
      output: completedCohortFertilityCffExample.output,
    });
  });

  it("scales five-year class rates by the width", () => {
    expect(
      calculateCompletedCohortFertilityCff({
        asfrByAge: [0.05, 0.1],
        classWidth: 5,
      }).completedFertilityPerWoman,
    ).toBe(0.75);
  });

  it("rejects an empty schedule or non-positive width", () => {
    expect(runCompletedCohortFertilityCff({ asfrByAge: [] }).ok).toBe(false);
    expect(
      runCompletedCohortFertilityCff({ asfrByAge: [0.1], classWidth: 0 }).ok,
    ).toBe(false);
  });
});
