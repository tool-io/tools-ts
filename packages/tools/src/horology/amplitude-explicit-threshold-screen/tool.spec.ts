import { describe, expect, it } from "vitest";
import {
  amplitudeThresholdExample,
  runAmplitudeThreshold,
  screenAmplitudeAgainstThresholds,
} from "./tool.js";

describe("amplitude explicit-threshold screen", () => {
  it("reproduces the canonical 280-degree example", () => {
    expect(runAmplitudeThreshold(amplitudeThresholdExample.input)).toEqual({
      ok: true,
      output: amplitudeThresholdExample.output,
    });
  });

  it("accepts a measurement at the caller minimum", () => {
    expect(
      screenAmplitudeAgainstThresholds({
        measuredAmplitudeDegrees: 250,
        minimumHealthyAmplitudeDegrees: 250,
        maximumExpectedAmplitudeDegrees: 320,
      }).withinCallerRange,
    ).toBe(true);
  });

  it("reports the amount below the caller minimum", () => {
    expect(
      screenAmplitudeAgainstThresholds({
        measuredAmplitudeDegrees: 200,
        minimumHealthyAmplitudeDegrees: 250,
        maximumExpectedAmplitudeDegrees: 320,
      }),
    ).toMatchObject({ amplitudeBelowMinimum: 50, withinCallerRange: false });
  });

  it("reports a measurement above the caller maximum", () => {
    expect(
      screenAmplitudeAgainstThresholds({
        measuredAmplitudeDegrees: 350,
        minimumHealthyAmplitudeDegrees: 250,
        maximumExpectedAmplitudeDegrees: 320,
      }).amplitudeAboveMaximum,
    ).toBe(30);
  });

  it("rejects a reversed threshold window", () => {
    expect(
      runAmplitudeThreshold({
        measuredAmplitudeDegrees: 280,
        minimumHealthyAmplitudeDegrees: 320,
        maximumExpectedAmplitudeDegrees: 250,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "maximum_amplitude_invalid",
            field: "maximumExpectedAmplitudeDegrees",
          },
        ],
      },
      ok: false,
    });
  });
});
