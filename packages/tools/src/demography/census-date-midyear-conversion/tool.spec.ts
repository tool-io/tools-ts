import { describe, expect, it } from "vitest";
import {
  calculateCensusDateMidyearConversion,
  runCensusDateMidyearConversion,
  censusDateMidyearConversionExample,
} from "./tool.js";

describe("demography/census-date-midyear-conversion", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCensusDateMidyearConversion(censusDateMidyearConversionExample.input),
    ).toEqual({ ok: true, output: censusDateMidyearConversionExample.output });
  });

  it("returns the count unchanged for a zero growth rate", () => {
    const result = calculateCensusDateMidyearConversion({
      censusCount: 250000,
      censusDate: "2010-05-10",
      midyearDate: "2010-07-01",
      annualGrowthRatePercent: 0,
    });
    expect(result.midyearEquivalentPopulation).toBe(250000);
    expect(result.elapsedDays).toBe(52);
  });

  it("rejects malformed or impossible dates", () => {
    expect(
      runCensusDateMidyearConversion({
        censusCount: 1000,
        censusDate: "01/02/2000",
        midyearDate: "2000-07-01",
        annualGrowthRatePercent: 1,
      }).ok,
    ).toBe(false);
    expect(
      runCensusDateMidyearConversion({
        censusCount: 1000,
        censusDate: "2000-02-30",
        midyearDate: "2000-07-01",
        annualGrowthRatePercent: 1,
      }).ok,
    ).toBe(false);
    expect(
      runCensusDateMidyearConversion({
        censusCount: 1000,
        censusDate: "2000-01-01",
        midyearDate: "2000-07-01",
        annualGrowthRatePercent: -150,
      }).ok,
    ).toBe(false);
  });
});
