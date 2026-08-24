import { describe, expect, it } from "vitest";
import {
  laidLineDensityEstimatorExample,
  runLaidLineDensityEstimator,
} from "./tool.js";

describe("laid-line-density-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLaidLineDensityEstimator(laidLineDensityEstimatorExample.input),
    ).toEqual({ ok: true, output: laidLineDensityEstimatorExample.output });
  });

  it("returns zero density for wove-like leaves without laid lines", () => {
    const result = runLaidLineDensityEstimator({
      laidLinesCounted: 0,
      measuredSpanMm: 30,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.laidLinesPerCentimetre as number).toBe(0);
  });

  it("rejects non-positive spans", () => {
    expect(
      runLaidLineDensityEstimator({ laidLinesCounted: 10, measuredSpanMm: 0 })
        .ok,
    ).toBe(false);
  });

  it("rejects a span that makes the density overflow", () => {
    expect(
      runLaidLineDensityEstimator({
        laidLinesCounted: Number.MAX_SAFE_INTEGER,
        measuredSpanMm: Number.MIN_VALUE,
      }).ok,
    ).toBe(false);
  });
});
