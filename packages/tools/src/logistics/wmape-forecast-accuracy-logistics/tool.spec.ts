import { describe, expect, it } from "vitest";
import {
  calculateWmapeForecastAccuracyLogistics,
  wmapeForecastAccuracyLogisticsExample,
  runWmapeForecastAccuracyLogistics,
} from "./tool.js";

describe("logistics/wmape-forecast-accuracy-logistics", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWmapeForecastAccuracyLogistics(
        wmapeForecastAccuracyLogisticsExample.input,
      ),
    ).toEqual({
      ok: true,
      output: wmapeForecastAccuracyLogisticsExample.output,
    });
  });

  it("scores a perfect forecast as zero", () => {
    const result = runWmapeForecastAccuracyLogistics({
      actualUnits: [10, 20],
      forecastUnits: [10, 20],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.wmapePercent as number).toBe(0);
    expect(result.output.biasPercent as number).toBe(0);
  });

  it("rejects mismatched series lengths", () => {
    expect(
      runWmapeForecastAccuracyLogistics({
        actualUnits: [10],
        forecastUnits: [10, 20],
      }).ok,
    ).toBe(false);
  });

  it("rejects negative, non-finite, and overflowing series", () => {
    expect(() =>
      calculateWmapeForecastAccuracyLogistics({
        actualUnits: [10],
        forecastUnits: [-1],
      }),
    ).toThrow("non-negative");
    expect(() =>
      calculateWmapeForecastAccuracyLogistics({
        actualUnits: [Number.MAX_VALUE, Number.MAX_VALUE],
        forecastUnits: [1, 1],
      }),
    ).toThrow("outside the representable range");
  });
});
