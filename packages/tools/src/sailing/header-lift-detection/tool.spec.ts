import { describe, expect, it } from "vitest";
import {
  calculateHeaderLiftDetection,
  headerLiftDetectionExample,
  runHeaderLiftDetection,
} from "./tool.js";

describe("Header Lift Detector", () => {
  it("publishes an executable example", () =>
    expect(runHeaderLiftDetection(headerLiftDetectionExample.input)).toEqual({
      ok: true,
      output: headerLiftDetectionExample.output,
    }));

  it.each([
    [50, 43, false, 7],
    [40, 47, true, -7],
    [45, 45, false, 0],
    [20, 90, true, -70],
    [90, 20, false, 70],
  ])(
    "classifies the shift from %s against %s degrees",
    (currentTwaDeg, baselineTwaDeg, isLifted, shiftDegrees) => {
      expect(
        calculateHeaderLiftDetection({ currentTwaDeg, baselineTwaDeg }),
      ).toEqual({
        isLifted,
        shiftDegrees,
      });
    },
  );

  it("reports fractional shifts", () =>
    expect(
      runHeaderLiftDetection({ baselineTwaDeg: 41.25, currentTwaDeg: 44.75 }),
    ).toEqual({
      ok: true,
      output: { isLifted: false, shiftDegrees: 3.5 },
    }));

  it("treats an unchanged wind angle as not lifted", () =>
    expect(
      runHeaderLiftDetection({ baselineTwaDeg: 38, currentTwaDeg: 38 }),
    ).toEqual({
      ok: true,
      output: { isLifted: false, shiftDegrees: 0 },
    }));

  it("accepts twa values at the twenty and ninety degree bounds", () => {
    expect(
      runHeaderLiftDetection({ baselineTwaDeg: 20, currentTwaDeg: 20 }).ok,
    ).toBe(true);
    expect(
      runHeaderLiftDetection({ baselineTwaDeg: 90, currentTwaDeg: 90 }).ok,
    ).toBe(true);
  });

  it("rejects twa values outside twenty to ninety", () => {
    for (const input of [
      { baselineTwaDeg: 19, currentTwaDeg: 40 },
      { baselineTwaDeg: 91, currentTwaDeg: 40 },
      { baselineTwaDeg: 45, currentTwaDeg: 19 },
      { baselineTwaDeg: 45, currentTwaDeg: 95 },
    ])
      expect(runHeaderLiftDetection(input).ok).toBe(false);
  });

  it("rejects non-finite input", () => {
    expect(
      runHeaderLiftDetection({ baselineTwaDeg: Number.NaN, currentTwaDeg: 45 })
        .ok,
    ).toBe(false);
    expect(
      runHeaderLiftDetection({
        baselineTwaDeg: 45,
        currentTwaDeg: Number.NEGATIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing and malformed input", () => {
    expect(runHeaderLiftDetection({ baselineTwaDeg: 45 }).ok).toBe(false);
    expect(
      runHeaderLiftDetection({ baselineTwaDeg: 45, currentTwaDeg: "50" }).ok,
    ).toBe(false);
  });
});
