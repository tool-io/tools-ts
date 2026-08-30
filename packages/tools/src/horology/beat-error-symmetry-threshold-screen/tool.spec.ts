import { describe, expect, it } from "vitest";
import {
  beatErrorSymmetryExample,
  runBeatErrorSymmetry,
  screenBeatErrorSymmetry,
} from "./tool.js";

describe("beat-error symmetry threshold screen", () => {
  it("reproduces the canonical failing example", () => {
    expect(runBeatErrorSymmetry(beatErrorSymmetryExample.input)).toEqual({
      ok: true,
      output: beatErrorSymmetryExample.output,
    });
  });

  it("passes two observations at the supplied relative limit", () => {
    expect(
      screenBeatErrorSymmetry({
        firstBeatErrorMilliseconds: 0.4,
        secondBeatErrorMilliseconds: 0.5,
        maximumAllowedBeatErrorMilliseconds: 0.8,
        maximumAllowedRelativeDifferencePercent: 20,
      }).withinCallerThresholds,
    ).toBe(true);
  });

  it("treats two zero observations as identical", () => {
    expect(
      screenBeatErrorSymmetry({
        firstBeatErrorMilliseconds: 0,
        secondBeatErrorMilliseconds: 0,
        maximumAllowedBeatErrorMilliseconds: 0.8,
        maximumAllowedRelativeDifferencePercent: 20,
      }),
    ).toMatchObject({
      relativeDifferencePercent: 0,
      withinCallerThresholds: true,
    });
  });

  it("fails when the magnitude limit is exceeded", () => {
    expect(
      screenBeatErrorSymmetry({
        firstBeatErrorMilliseconds: 0.8,
        secondBeatErrorMilliseconds: 0.8,
        maximumAllowedBeatErrorMilliseconds: 0.5,
        maximumAllowedRelativeDifferencePercent: 20,
      }).withinCallerThresholds,
    ).toBe(false);
  });

  it("rejects a nonpositive beat-error limit", () => {
    expect(
      runBeatErrorSymmetry({
        firstBeatErrorMilliseconds: 0.4,
        secondBeatErrorMilliseconds: 0.5,
        maximumAllowedBeatErrorMilliseconds: 0,
        maximumAllowedRelativeDifferencePercent: 20,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "beat_error_limit_invalid",
            field: "maximumAllowedBeatErrorMilliseconds",
          },
        ],
      },
      ok: false,
    });
  });
});
