import { describe, expect, it } from "vitest";
import {
  reconcileRolloverWorkpaper,
  rolloverWorkpaperExample,
  runRolloverWorkpaper,
} from "./tool.js";

describe("rollover forward workpaper procedure", () => {
  it("reproduces its canonical example", () => {
    expect(runRolloverWorkpaper(rolloverWorkpaperExample.input)).toEqual({
      ok: true,
      output: rolloverWorkpaperExample.output,
    });
  });

  it("detects an opening-balance difference", () => {
    expect(
      reconcileRolloverWorkpaper({
        currentYearActivity: 0,
        currentYearEndingBalance: 999_000,
        currentYearOpeningBalance: 999_000,
        priorYearAdjustments: 0,
        priorYearEndingBalance: 1_000_000,
        tolerance: 0,
      }),
    ).toMatchObject({ openingDifference: -1_000, reconciled: false });
  });

  it("includes prior-year adjustments in expected opening balance", () => {
    expect(
      reconcileRolloverWorkpaper({
        currentYearActivity: 0,
        currentYearEndingBalance: 1_100_000,
        currentYearOpeningBalance: 1_100_000,
        priorYearAdjustments: 100_000,
        priorYearEndingBalance: 1_000_000,
        tolerance: 0,
      }).openingDifference,
    ).toBe(0);
  });

  it("rejects a non-finite balance", () => {
    expect(
      runRolloverWorkpaper({
        currentYearActivity: 0,
        currentYearEndingBalance: Number.POSITIVE_INFINITY,
        currentYearOpeningBalance: 0,
        priorYearAdjustments: 0,
        priorYearEndingBalance: 0,
        tolerance: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "currentYearEndingBalance" }],
      },
      ok: false,
    });
  });
});
