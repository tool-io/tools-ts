import { describe, expect, it } from "vitest";
import {
  positionalRateVariationExample,
  runPositionalRateVariation,
  screenPositionalRateVariation,
} from "./tool.js";

describe("positional rate-variation threshold screen", () => {
  it("reproduces the canonical four-position example", () => {
    expect(
      runPositionalRateVariation(positionalRateVariationExample.input),
    ).toEqual({
      ok: true,
      output: positionalRateVariationExample.output,
    });
  });

  it("accepts a range exactly at the caller limit", () => {
    expect(
      screenPositionalRateVariation({
        positionRatesSecondsPerDay: [0, 5],
        maximumAllowedRangeSecondsPerDay: 5,
      }).withinCallerRangeLimit,
    ).toBe(true);
  });

  it("rejects a wider range at the same limit", () => {
    expect(
      screenPositionalRateVariation({
        positionRatesSecondsPerDay: [0, 5.1],
        maximumAllowedRangeSecondsPerDay: 5,
      }).withinCallerRangeLimit,
    ).toBe(false);
  });

  it("handles all-negative position rates", () => {
    expect(
      screenPositionalRateVariation({
        positionRatesSecondsPerDay: [-8, -3],
        maximumAllowedRangeSecondsPerDay: 5,
      }),
    ).toMatchObject({
      minimumRateSecondsPerDay: -8,
      maximumRateSecondsPerDay: -3,
    });
  });

  it("rejects a one-position sample", () => {
    expect(
      runPositionalRateVariation({
        positionRatesSecondsPerDay: [2],
        maximumAllowedRangeSecondsPerDay: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "insufficient_position_rates",
            field: "positionRatesSecondsPerDay",
          },
        ],
      },
      ok: false,
    });
  });
});
