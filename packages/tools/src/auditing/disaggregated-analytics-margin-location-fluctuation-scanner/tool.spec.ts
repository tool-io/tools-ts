import { describe, expect, it } from "vitest";
import {
  disaggregatedAnalyticsExample,
  runDisaggregatedAnalytics,
  scanDisaggregatedAnalytics,
} from "./tool.js";

describe("disaggregated analytics fluctuation scanner", () => {
  it("reproduces its canonical example", () => {
    expect(
      runDisaggregatedAnalytics(disaggregatedAnalyticsExample.input),
    ).toEqual({
      ok: true,
      output: disaggregatedAnalyticsExample.output,
    });
  });

  it("flags an exact absolute threshold", () => {
    expect(
      scanDisaggregatedAnalytics({
        absoluteThresholdPercent: 10,
        metrics: [[100, 90]],
      }).flaggedIndices,
    ).toEqual([0]);
  });

  it("tracks the largest absolute change", () => {
    expect(
      scanDisaggregatedAnalytics({
        absoluteThresholdPercent: 5,
        metrics: [
          [100, 130],
          [100, 80],
        ],
      }).maximumAbsoluteChangePercent,
    ).toBe(30);
  });

  it("rejects a zero metric baseline", () => {
    expect(
      runDisaggregatedAnalytics({
        absoluteThresholdPercent: 5,
        metrics: [[0, 10]],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "zero_metric_baseline", field: "metrics.0.0" }],
      },
      ok: false,
    });
  });
});
