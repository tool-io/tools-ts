import { describe, expect, it } from "vitest";
import {
  milesPerDayAverageLonghaulExample,
  runMilesPerDayAverageLonghaul,
} from "./tool.js";

describe("miles-per-day-average-longhaul", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMilesPerDayAverageLonghaul(milesPerDayAverageLonghaulExample.input),
    ).toEqual({
      ok: true,
      output: milesPerDayAverageLonghaulExample.output,
    });
  });

  it("handles fractional day counts", () => {
    expect(
      runMilesPerDayAverageLonghaul({ daysOnRoute: 2.5, milesCovered: 1375 }),
    ).toEqual({ ok: true, output: { averageMilesPerDay: 550 } });
  });

  it("rejects zero days", () => {
    expect(
      runMilesPerDayAverageLonghaul({ daysOnRoute: 0, milesCovered: 500 }).ok,
    ).toBe(false);
  });
});
