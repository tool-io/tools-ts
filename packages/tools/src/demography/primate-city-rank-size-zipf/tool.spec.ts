import { describe, expect, it } from "vitest";
import {
  calculatePrimateCityRankSizeZipf,
  runPrimateCityRankSizeZipf,
  primateCityRankSizeZipfExample,
} from "./tool.js";

describe("demography/primate-city-rank-size-zipf", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPrimateCityRankSizeZipf(primateCityRankSizeZipfExample.input),
    ).toEqual({
      ok: true,
      output: primateCityRankSizeZipfExample.output,
    });
  });

  it("halves the primate city for rank two at unit exponent", () => {
    expect(
      calculatePrimateCityRankSizeZipf({
        largestCityPopulation: 8000000,
        cityRank: 2,
      }),
    ).toEqual({
      predictedPopulation: 4000000,
      deviationPercent: 0,
    });
  });

  it("rejects non-positive cities and bad ranks or exponents", () => {
    expect(
      runPrimateCityRankSizeZipf({ largestCityPopulation: 0, cityRank: 1 }).ok,
    ).toBe(false);
    expect(
      runPrimateCityRankSizeZipf({ largestCityPopulation: 100, cityRank: 0 })
        .ok,
    ).toBe(false);
    expect(
      runPrimateCityRankSizeZipf({
        largestCityPopulation: 100,
        cityRank: 2,
        exponent: -1,
      }).ok,
    ).toBe(false);
    expect(
      runPrimateCityRankSizeZipf({
        largestCityPopulation: 100,
        cityRank: 2,
        actualCityPopulation: -1,
      }).ok,
    ).toBe(false);
  });
});
