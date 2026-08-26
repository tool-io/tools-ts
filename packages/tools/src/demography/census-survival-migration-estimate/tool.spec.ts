import { describe, expect, it } from "vitest";
import {
  calculateCensusSurvivalMigrationEstimate,
  runCensusSurvivalMigrationEstimate,
  censusSurvivalMigrationEstimateExample,
} from "./tool.js";

describe("demography/census-survival-migration-estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCensusSurvivalMigrationEstimate(
        censusSurvivalMigrationEstimateExample.input,
      ),
    ).toEqual({
      ok: true,
      output: censusSurvivalMigrationEstimateExample.output,
    });
  });

  it("reports negative net migrants when the cohort shrinks faster than mortality implies", () => {
    const result = calculateCensusSurvivalMigrationEstimate({
      populationFirstCensus: 100000,
      populationSecondCensus: 80000,
      censusSurvivalRatio: 0.99,
    });
    expect(result.expectedSurvivors).toBe(99000);
    expect(result.netMigrants).toBe(-19000);
  });

  it("rejects survival ratios outside zero to one", () => {
    expect(
      runCensusSurvivalMigrationEstimate({
        populationFirstCensus: 100,
        populationSecondCensus: 100,
        censusSurvivalRatio: 1.5,
      }).ok,
    ).toBe(false);
    expect(
      runCensusSurvivalMigrationEstimate({
        populationFirstCensus: -100,
        populationSecondCensus: 100,
        censusSurvivalRatio: 0.5,
      }).ok,
    ).toBe(false);
  });
});
