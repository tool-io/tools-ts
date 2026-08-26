import { describe, expect, it } from "vitest";
import {
  dalyDisabilityAdjustedLifeYearsExample,
  runDalyDisabilityAdjustedLifeYears,
} from "./tool.js";

describe("daly-disability-adjusted-life-years", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDalyDisabilityAdjustedLifeYears(
        dalyDisabilityAdjustedLifeYearsExample.input,
      ),
    ).toEqual({
      ok: true,
      output: dalyDisabilityAdjustedLifeYearsExample.output,
    });
  });

  it("reduces to pure mortality burden with no morbidity", () => {
    const r = runDalyDisabilityAdjustedLifeYears({
      numberOfDeaths: 10,
      lifeExpectancyAtDeathYears: 30,
      incidentCases: 0,
      disabilityWeight: 0.5,
      averageDurationYears: 5,
    });
    expect(r.ok && r.output.dalyYears).toBe(300);
  });

  it("rejects a disability weight above one", () => {
    expect(
      runDalyDisabilityAdjustedLifeYears({
        numberOfDeaths: 0,
        lifeExpectancyAtDeathYears: 30,
        incidentCases: 5,
        disabilityWeight: 1.5,
        averageDurationYears: 2,
      }).ok,
    ).toBe(false);
  });
});
