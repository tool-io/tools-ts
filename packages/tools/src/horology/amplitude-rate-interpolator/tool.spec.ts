import { describe, expect, it } from "vitest";
import {
  amplitudeDependentRateExample,
  calculateAmplitudeDependentRate,
  runAmplitudeDependentRate,
} from "./tool.js";

describe("amplitude-dependent rate variation calculator", () => {
  it("reproduces the canonical interpolation example", () => {
    expect(
      runAmplitudeDependentRate(amplitudeDependentRateExample.input),
    ).toEqual({ ok: true, output: amplitudeDependentRateExample.output });
  });

  it("interpolates a descending rate curve", () => {
    expect(
      calculateAmplitudeDependentRate({
        observations: [
          [220, 8],
          [280, -4],
        ],
        targetAmplitudeDegrees: 250,
      }).targetRateSecondsPerDay,
    ).toBe(2);
  });

  it("accepts a target equal to an observed amplitude", () => {
    expect(
      calculateAmplitudeDependentRate({
        observations: [
          [200, 0],
          [300, 10],
        ],
        targetAmplitudeDegrees: 200,
      }),
    ).toMatchObject({
      bracketingAmplitudesDegrees: [200, 300],
      targetRateSecondsPerDay: 0,
    });
  });

  it("rejects extrapolation beyond observations", () => {
    expect(
      runAmplitudeDependentRate({
        observations: [
          [200, 0],
          [300, 10],
        ],
        targetAmplitudeDegrees: 301,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "target_outside_observations",
            field: "targetAmplitudeDegrees",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects duplicate amplitudes", () => {
    expect(
      runAmplitudeDependentRate({
        observations: [
          [200, 0],
          [200, 2],
        ],
        targetAmplitudeDegrees: 200,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "duplicate_amplitude", field: "observations" }],
      },
      ok: false,
    });
  });
});
