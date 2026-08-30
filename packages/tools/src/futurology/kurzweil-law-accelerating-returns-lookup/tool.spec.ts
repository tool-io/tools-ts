import { describe, expect, it } from "vitest";
import {
  classifyKurzweilAcceleratingReturns,
  kurzweilAccelerationExample,
  runKurzweilAcceleration,
} from "./tool.js";

describe("Kurzweil accelerating returns lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runKurzweilAcceleration(kurzweilAccelerationExample.input)).toEqual({
      ok: true,
      output: kurzweilAccelerationExample.output,
    });
  });

  it("reports decelerating returns", () => {
    expect(
      classifyKurzweilAcceleratingReturns({
        milestoneValues: [10, 100, 120, 125],
        milestoneYears: [2000, 2005, 2010, 2015],
      }).accelerating,
    ).toBe(false);
  });

  it("reports constant annualized growth as not accelerating", () => {
    expect(
      classifyKurzweilAcceleratingReturns({
        milestoneValues: [1, 2, 4],
        milestoneYears: [2000, 2005, 2010],
      }).annualizedGrowthDifferencePercent,
    ).toBeCloseTo(0);
  });

  it("rejects nonincreasing milestone years", () => {
    expect(
      runKurzweilAcceleration({
        milestoneValues: [1, 2],
        milestoneYears: [2010, 2000],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_milestone_year", field: "milestoneYears.1" }],
      },
      ok: false,
    });
  });
});
