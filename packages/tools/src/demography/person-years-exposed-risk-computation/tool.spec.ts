import { describe, expect, it } from "vitest";
import {
  calculatePersonYearsExposedRiskComputation,
  runPersonYearsExposedRiskComputation,
  personYearsExposedRiskComputationExample,
} from "./tool.js";

describe("demography/person-years-exposed-risk-computation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPersonYearsExposedRiskComputation(
        personYearsExposedRiskComputationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: personYearsExposedRiskComputationExample.output,
    });
  });

  it("handles censored spells with zero events", () => {
    const result = calculatePersonYearsExposedRiskComputation({
      entryTimes: [1990.5, 1991],
      exitTimes: [1995.5, 1996],
    });
    expect(result.totalPersonYears).toBe(10);
    expect(result.meanPersonYearsPerPerson).toBe(5);
    expect(result.incidenceRatePerThousandPersonYears).toBe(0);
  });

  it("rejects inverted spells, empty lists and negative events", () => {
    expect(
      runPersonYearsExposedRiskComputation({
        entryTimes: [5],
        exitTimes: [4],
        eventsCount: 0,
      }).ok,
    ).toBe(false);
    expect(
      runPersonYearsExposedRiskComputation({
        entryTimes: [],
        exitTimes: [],
        eventsCount: 0,
      }).ok,
    ).toBe(false);
    expect(
      runPersonYearsExposedRiskComputation({
        entryTimes: [0],
        exitTimes: [1],
        eventsCount: -1,
      }).ok,
    ).toBe(false);
  });
});
