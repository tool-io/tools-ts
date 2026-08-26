import { describe, expect, it } from "vitest";
import {
  calculatePolarPerformancePercentage,
  polarPerformancePercentageExample,
  runPolarPerformancePercentage,
} from "./tool.js";

describe("Polar Performance Percentage Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runPolarPerformancePercentage(polarPerformancePercentageExample.input),
    ).toEqual({
      ok: true,
      output: polarPerformancePercentageExample.output,
    }));

  it.each([
    [6, 8, 75],
    [5, 5, 100],
    [3, 12, 25],
    [8.4, 7, 120],
    [5.5, 7, 78.57142857142857],
    [4.2, 6, 70],
  ])(
    "calculates the polar performance percentage",
    (achieved, target, expected) => {
      expect(calculatePolarPerformancePercentage(achieved, target)).toBe(
        expected,
      );
    },
  );

  it("returns zero percent for a stopped boat", () => {
    expect(calculatePolarPerformancePercentage(0, 7)).toBe(0);
    const result = runPolarPerformancePercentage({
      achievedSpeedKt: 0,
      targetSpeedKt: 7,
    });
    expect(result).toEqual({
      ok: true,
      output: { performancePercentage: 0 },
    });
  });

  it("exceeds one hundred percent when beating the target", () => {
    expect(calculatePolarPerformancePercentage(9, 8)).toBeGreaterThan(100);
  });

  it.each([
    [-1, 8],
    [6, 0],
    [6, -2],
  ])(
    "rejects negative achieved or non-positive target speeds",
    (achieved, target) => {
      expect(calculatePolarPerformancePercentage(achieved, target)).toBeNull();
      const result = runPolarPerformancePercentage({
        achievedSpeedKt: achieved,
        targetSpeedKt: target,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_speed");
    },
  );

  it("rejects non-finite speeds", () => {
    expect(calculatePolarPerformancePercentage(Number.NaN, 8)).toBeNull();
    const result = runPolarPerformancePercentage({
      achievedSpeedKt: Number.NaN,
      targetSpeedKt: 8,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runPolarPerformancePercentage({
      achievedSpeedKt: 6,
      targetSpeedKt: 8,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
