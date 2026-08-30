import { describe, expect, it } from "vitest";
import {
  beatErrorOrientationExample,
  runBeatErrorOrientation,
  screenBeatErrorOrientationDifference,
} from "./tool.js";

describe("beat-error orientation difference screen", () => {
  it("reproduces the canonical 0.3-millisecond difference", () => {
    expect(runBeatErrorOrientation(beatErrorOrientationExample.input)).toEqual({
      ok: true,
      output: beatErrorOrientationExample.output,
    });
  });

  it("accepts a difference exactly at the caller limit", () => {
    expect(
      screenBeatErrorOrientationDifference({
        horizontalBeatErrorMilliseconds: 0.2,
        verticalBeatErrorMilliseconds: 0.5,
        maximumAllowedOrientationDifferenceMilliseconds: 0.3,
      }).withinCallerDifferenceLimit,
    ).toBe(true);
  });

  it("rejects a larger orientation difference", () => {
    expect(
      screenBeatErrorOrientationDifference({
        horizontalBeatErrorMilliseconds: 0.2,
        verticalBeatErrorMilliseconds: 0.6,
        maximumAllowedOrientationDifferenceMilliseconds: 0.3,
      }).withinCallerDifferenceLimit,
    ).toBe(false);
  });

  it("handles equal horizontal and vertical errors", () => {
    expect(
      screenBeatErrorOrientationDifference({
        horizontalBeatErrorMilliseconds: 0.4,
        verticalBeatErrorMilliseconds: 0.4,
        maximumAllowedOrientationDifferenceMilliseconds: 0,
      }).absoluteDifferenceMilliseconds,
    ).toBe(0);
  });

  it("rejects a negative difference limit", () => {
    expect(
      runBeatErrorOrientation({
        horizontalBeatErrorMilliseconds: 0.2,
        verticalBeatErrorMilliseconds: 0.5,
        maximumAllowedOrientationDifferenceMilliseconds: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "maximumAllowedOrientationDifferenceMilliseconds",
          },
        ],
      },
      ok: false,
    });
  });
});
