import { describe, expect, it } from "vitest";
import {
  calculateCycleCountDailySampleSize,
  cycleCountDailySampleSizeExample,
  runCycleCountDailySampleSize,
} from "./tool.js";

describe("cycle-count-daily-sample-size", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCycleCountDailySampleSize(cycleCountDailySampleSizeExample.input),
    ).toEqual({
      ok: true,
      output: cycleCountDailySampleSizeExample.output,
    });
  });

  it("falls back to quarterly counts over 250 days", () => {
    expect(runCycleCountDailySampleSize({ skuCount: 500 })).toEqual({
      ok: true,
      output: { dailySampleSize: 8, daysBetweenCountsOfEachSku: 62.5 },
    });
  });

  it("rejects zero operating days", () => {
    expect(
      runCycleCountDailySampleSize({ skuCount: 100, operatingDaysPerYear: 0 })
        .ok,
    ).toBe(false);
  });

  it("rounds a fractional daily workload up to a whole SKU", () => {
    expect(
      calculateCycleCountDailySampleSize({
        countsPerSkuPerYear: 1,
        operatingDaysPerYear: 3,
        skuCount: 10,
      }),
    ).toEqual({ dailySampleSize: 4, daysBetweenCountsOfEachSku: 3 });
  });

  it("rejects fractional SKU counts", () => {
    expect(() =>
      calculateCycleCountDailySampleSize({
        skuCount: 10.5,
      }),
    ).toThrow("positive whole number");
  });
});
