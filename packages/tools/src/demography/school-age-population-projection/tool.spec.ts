import { describe, expect, it } from "vitest";
import {
  calculateSchoolAgePopulationProjection,
  runSchoolAgePopulationProjection,
  schoolAgePopulationProjectionExample,
} from "./tool.js";

describe("demography/school-age-population-projection", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSchoolAgePopulationProjection(
        schoolAgePopulationProjectionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: schoolAgePopulationProjectionExample.output,
    });
  });

  it("keeps the cohort unchanged with a unit ratio and no migration", () => {
    expect(
      calculateSchoolAgePopulationProjection({
        currentSchoolAgePopulation: 12345,
        survivalRatio: 1,
      }),
    ).toEqual({
      projectedSchoolAgePopulation: 12345,
      expectedSurvivors: 12345,
    });
  });

  it("rejects survival ratios outside zero to one", () => {
    expect(
      runSchoolAgePopulationProjection({
        currentSchoolAgePopulation: 1000,
        survivalRatio: 1.2,
      }).ok,
    ).toBe(false);
    expect(
      runSchoolAgePopulationProjection({
        currentSchoolAgePopulation: -5,
        survivalRatio: 0.9,
      }).ok,
    ).toBe(false);
    expect(
      runSchoolAgePopulationProjection({
        currentSchoolAgePopulation: 100,
        survivalRatio: 0.9,
        netMigrantSchoolAgeChildren: -100,
      }).ok,
    ).toBe(false);
  });
});
