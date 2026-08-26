import { describe, expect, it } from "vitest";
import {
  calculateCohortSurvivalConsistencyChecker,
  runCohortSurvivalConsistencyChecker,
  cohortSurvivalConsistencyCheckerExample,
} from "./tool.js";

describe("demography/cohort-survival-consistency-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCohortSurvivalConsistencyChecker(
        cohortSurvivalConsistencyCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: cohortSurvivalConsistencyCheckerExample.output,
    });
  });

  it("marks a deficit beyond tolerance as inconsistent", () => {
    const result = calculateCohortSurvivalConsistencyChecker({
      cohortAtFirstCensus: 5000,
      observedAtSecondCensus: 3000,
      lifeTableLxAtStartAge: 400000,
      lifeTableLxAfterInterval: 380000,
    });
    expect(result.expectedSurvivors).toBe(4750);
    expect(Math.round(result.closureErrorPercent * 100) / 100).toBeCloseTo(
      -36.84,
      2,
    );
    expect(result.consistent).toBe(false);
  });

  it("rejects non-positive cohorts and life-table values", () => {
    expect(
      runCohortSurvivalConsistencyChecker({
        cohortAtFirstCensus: 0,
        observedAtSecondCensus: 1,
        lifeTableLxAtStartAge: 1,
        lifeTableLxAfterInterval: 1,
      }).ok,
    ).toBe(false);
    expect(
      runCohortSurvivalConsistencyChecker({
        cohortAtFirstCensus: 100,
        observedAtSecondCensus: 90,
        lifeTableLxAtStartAge: 10,
        lifeTableLxAfterInterval: 0,
      }).ok,
    ).toBe(false);
    expect(
      runCohortSurvivalConsistencyChecker({
        cohortAtFirstCensus: 100,
        observedAtSecondCensus: 90,
        lifeTableLxAtStartAge: 10,
        lifeTableLxAfterInterval: 11,
      }).ok,
    ).toBe(false);
  });
});
