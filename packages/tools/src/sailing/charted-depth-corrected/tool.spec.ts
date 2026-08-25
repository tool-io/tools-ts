import { describe, expect, it } from "vitest";
import {
  calculateChartedDepthCorrected,
  chartedDepthCorrectedExample,
  runChartedDepthCorrected,
} from "./tool.js";

describe("Corrected Depth Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runChartedDepthCorrected(chartedDepthCorrectedExample.input),
    ).toEqual({
      ok: true,
      output: chartedDepthCorrectedExample.output,
    }));

  it.each([
    [7, 2.5, 9.5],
    [5.2, -2, 3.2],
    [0.8, 4.4, 5.2],
    [12, 0, 12],
  ])(
    "adds the height of tide to the charted depth",
    (chartedDepthMeters, heightOfTideMeters, expected) => {
      expect(
        calculateChartedDepthCorrected({
          chartedDepthMeters,
          heightOfTideMeters,
        }),
      ).toEqual({
        depthInMeters: expected,
      });
    },
  );

  it("allows the corrected depth to fall below chart datum", () =>
    expect(
      runChartedDepthCorrected({
        chartedDepthMeters: 1,
        heightOfTideMeters: -3,
      }),
    ).toEqual({
      ok: true,
      output: { depthInMeters: -2 },
    }));

  it("keeps the depth unchanged for slack water at datum", () =>
    expect(
      runChartedDepthCorrected({
        chartedDepthMeters: 6,
        heightOfTideMeters: 0,
      }),
    ).toEqual({
      ok: true,
      output: { depthInMeters: 6 },
    }));

  it("accepts a drying charted depth of zero", () =>
    expect(
      runChartedDepthCorrected({
        chartedDepthMeters: 0,
        heightOfTideMeters: 1.3,
      }),
    ).toEqual({
      ok: true,
      output: { depthInMeters: 1.3 },
    }));

  it("rejects negative charted depths", () =>
    expect(
      runChartedDepthCorrected({
        chartedDepthMeters: -1,
        heightOfTideMeters: 2,
      }).ok,
    ).toBe(false));

  it("rejects non-finite and malformed input", () => {
    expect(
      runChartedDepthCorrected({
        chartedDepthMeters: Number.NaN,
        heightOfTideMeters: 2,
      }).ok,
    ).toBe(false);
    expect(
      runChartedDepthCorrected({
        chartedDepthMeters: 7,
        heightOfTideMeters: Number.NEGATIVE_INFINITY,
      }).ok,
    ).toBe(false);
    expect(runChartedDepthCorrected({ chartedDepthMeters: 7 }).ok).toBe(false);
  });

  it("rejects unknown input fields", () =>
    expect(
      runChartedDepthCorrected({
        chartedDepthMeters: 7,
        extra: 0,
        heightOfTideMeters: 2,
      }).ok,
    ).toBe(false));
});
