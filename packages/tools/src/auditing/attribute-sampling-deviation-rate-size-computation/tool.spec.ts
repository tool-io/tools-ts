import { describe, expect, it } from "vitest";
import {
  attributeSamplingExample,
  computeAttributeSamplingDeviationRate,
  runAttributeSampling,
} from "./tool.js";

describe("attribute sampling deviation rate", () => {
  it("reproduces its canonical example", () => {
    expect(runAttributeSampling(attributeSamplingExample.input)).toEqual({
      ok: true,
      output: attributeSamplingExample.output,
    });
  });

  it("accepts a deviation rate exactly at tolerance", () => {
    expect(
      computeAttributeSamplingDeviationRate({
        deviations: 1,
        sampleSize: 20,
        tolerableDeviationRatePercent: 5,
      }),
    ).toEqual({
      deviationRatePercent: 5,
      sampleSize: 20,
      withinTolerableRate: true,
    });
  });

  it("returns a zero rate for no deviations", () => {
    expect(
      computeAttributeSamplingDeviationRate({
        deviations: 0,
        sampleSize: 25,
        tolerableDeviationRatePercent: 0,
      }).deviationRatePercent,
    ).toBe(0);
  });

  it("rejects more deviations than sampled items", () => {
    expect(
      runAttributeSampling({
        deviations: 11,
        sampleSize: 10,
        tolerableDeviationRatePercent: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_deviation_count", field: "deviations" }],
      },
      ok: false,
    });
  });
});
