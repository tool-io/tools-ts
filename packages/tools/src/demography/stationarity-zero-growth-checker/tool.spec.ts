import { describe, expect, it } from "vitest";
import {
  calculateStationarityZeroGrowthChecker,
  runStationarityZeroGrowthChecker,
  stationarityZeroGrowthCheckerExample,
} from "./tool.js";

describe("demography/stationarity-zero-growth-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStationarityZeroGrowthChecker(
        stationarityZeroGrowthCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: stationarityZeroGrowthCheckerExample.output,
    });
  });

  it("classifies rates against the tolerance band", () => {
    expect(
      calculateStationarityZeroGrowthChecker({ growthRateR: 5e-7 }),
    ).toEqual({ annualGrowthRate: 5e-7, status: "stationary" });
    expect(
      calculateStationarityZeroGrowthChecker({ growthRateR: -0.01 }).status,
    ).toBe("shrinking");
  });

  it("rejects non-positive counts or intervals", () => {
    expect(
      runStationarityZeroGrowthChecker({
        source: "counts",
        populationStart: 0,
        populationEnd: 10,
        years: 1,
      }).ok,
    ).toBe(false);
    expect(
      runStationarityZeroGrowthChecker({
        source: "counts",
        populationStart: 10,
        populationEnd: 12,
        years: 0,
      }).ok,
    ).toBe(false);
    expect(
      runStationarityZeroGrowthChecker({ growthRateR: Number.NaN }).ok,
    ).toBe(false);
  });
});
