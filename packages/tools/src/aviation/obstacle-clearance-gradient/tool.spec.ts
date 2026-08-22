import { describe, expect, it } from "vitest";
import {
  calculateObstacleClearanceGradient,
  runObstacleClearanceGradient,
  obstacleClearanceGradientExample,
} from "./tool.js";

describe("obstacle clearance gradient calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runObstacleClearanceGradient(obstacleClearanceGradientExample.input),
    ).toEqual({
      ok: true,
      output: obstacleClearanceGradientExample.output,
    });
  });

  it("equals height over distance times one hundred", () => {
    expect(
      calculateObstacleClearanceGradient({
        horizontalDistanceFt: 2000,
        obstacleHeightFt: 500,
      }),
    ).toEqual({ gradientPercent: 25 });
    expect(
      calculateObstacleClearanceGradient({
        horizontalDistanceFt: 7000,
        obstacleHeightFt: 250,
      }),
    ).toEqual({ gradientPercent: (250 / 7000) * 100 });
  });

  it("keeps raw results without rounding", () => {
    expect(
      calculateObstacleClearanceGradient({
        horizontalDistanceFt: 1000,
        obstacleHeightFt: 0.001,
      }),
    ).toEqual({ gradientPercent: (0.001 / 1000) * 100 });
  });

  it("returns zero gradient for a ground-level obstacle", () => {
    expect(
      calculateObstacleClearanceGradient({
        horizontalDistanceFt: 1000,
        obstacleHeightFt: 0,
      }),
    ).toEqual({ gradientPercent: 0 });
  });

  it("accepts the zero-height lower bound through execution", () => {
    expect(
      runObstacleClearanceGradient({
        horizontalDistanceFt: 5000,
        obstacleHeightFt: 0,
      }).ok,
    ).toBe(true);
  });

  it("rejects negative obstacle heights through execution", () => {
    expect(
      runObstacleClearanceGradient({
        horizontalDistanceFt: 5000,
        obstacleHeightFt: -1,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero and negative distances through execution", () => {
    for (const bad of [-6000, 0])
      expect(
        runObstacleClearanceGradient({
          horizontalDistanceFt: bad,
          obstacleHeightFt: 300,
        }).ok,
      ).toBe(false);
  });

  it("reports stable error codes for invalid inputs", () => {
    const result = runObstacleClearanceGradient({
      horizontalDistanceFt: 0,
      obstacleHeightFt: 300,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_distance");
  });

  it("handles very long distances with small obstacles", () => {
    expect(
      calculateObstacleClearanceGradient({
        horizontalDistanceFt: 50000,
        obstacleHeightFt: 100,
      }),
    ).toEqual({ gradientPercent: 0.2 });
  });
});
