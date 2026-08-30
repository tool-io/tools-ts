import { describe, expect, it } from "vitest";
import {
  calculateDailyRateMeans,
  dailyRateMeanExample,
  runDailyRateMean,
} from "./tool.js";

describe("daily-rate arithmetic versus duration-weighted mean", () => {
  it("reproduces the canonical unequal-duration example", () => {
    expect(runDailyRateMean(dailyRateMeanExample.input)).toEqual({
      ok: true,
      output: dailyRateMeanExample.output,
    });
  });

  it("makes both means equal for equal-duration observations", () => {
    expect(
      calculateDailyRateMeans({
        intervals: [
          [24, -2],
          [24, 2],
        ],
      }),
    ).toMatchObject({
      arithmeticMeanSecondsPerDay: 0,
      durationWeightedMeanSecondsPerDay: 0,
      meanDifferenceSecondsPerDay: 0,
    });
  });

  it("weights a longer interval more strongly", () => {
    expect(
      calculateDailyRateMeans({
        intervals: [
          [1, 10],
          [9, 0],
        ],
      }).durationWeightedMeanSecondsPerDay,
    ).toBe(1);
  });

  it("rejects a zero-duration interval", () => {
    expect(runDailyRateMean({ intervals: [[0, 2]] })).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_interval_duration",
            field: "intervals",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects malformed rows", () => {
    expect(runDailyRateMean({ intervals: [[24]] })).toMatchObject({
      error: {
        issues: [{ code: "invalid_interval_shape", field: "intervals" }],
      },
      ok: false,
    });
  });
});
