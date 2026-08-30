import { describe, expect, it } from "vitest";
import {
  calculateIsochronismAmplitudeRateSlope,
  isochronismSlopeExample,
  runIsochronismSlope,
} from "./tool.js";

describe("isochronism amplitude-rate slope calculator", () => {
  it("reproduces the canonical six-second endpoint change", () => {
    expect(runIsochronismSlope(isochronismSlopeExample.input)).toEqual({
      ok: true,
      output: isochronismSlopeExample.output,
    });
  });

  it("calculates a negative slope", () => {
    expect(
      calculateIsochronismAmplitudeRateSlope({
        lowAmplitudeDegrees: 200,
        highAmplitudeDegrees: 300,
        lowRateSecondsPerDay: 5,
        highRateSecondsPerDay: 3,
        maximumAllowedAbsoluteRateChangeSecondsPerDay: 2,
      }).rateChangePerAmplitudeDegree,
    ).toBe(-0.02);
  });

  it("accepts equal endpoint rates", () => {
    expect(
      calculateIsochronismAmplitudeRateSlope({
        lowAmplitudeDegrees: 200,
        highAmplitudeDegrees: 300,
        lowRateSecondsPerDay: 0,
        highRateSecondsPerDay: 0,
        maximumAllowedAbsoluteRateChangeSecondsPerDay: 0,
      }).withinCallerRateChangeLimit,
    ).toBe(true);
  });

  it("rejects equal amplitudes", () => {
    expect(
      runIsochronismSlope({
        lowAmplitudeDegrees: 250,
        highAmplitudeDegrees: 250,
        lowRateSecondsPerDay: 0,
        highRateSecondsPerDay: 1,
        maximumAllowedAbsoluteRateChangeSecondsPerDay: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "high_amplitude_invalid", field: "highAmplitudeDegrees" },
        ],
      },
      ok: false,
    });
  });

  it("rejects a negative caller limit", () => {
    expect(
      runIsochronismSlope({
        lowAmplitudeDegrees: 200,
        highAmplitudeDegrees: 300,
        lowRateSecondsPerDay: 0,
        highRateSecondsPerDay: 1,
        maximumAllowedAbsoluteRateChangeSecondsPerDay: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "maximumAllowedAbsoluteRateChangeSecondsPerDay",
          },
        ],
      },
      ok: false,
    });
  });
});
