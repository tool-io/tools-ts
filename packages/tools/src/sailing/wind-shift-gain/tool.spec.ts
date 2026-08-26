import { describe, expect, it } from "vitest";
import {
  calculateWindShiftGain,
  runWindShiftGain,
  windShiftGainExample,
} from "./tool.js";

describe("Wind Shift Gain Calculator", () => {
  it("publishes an executable example", () =>
    expect(runWindShiftGain(windShiftGainExample.input)).toEqual({
      ok: true,
      output: windShiftGainExample.output,
    }));

  it.each([
    [20, 100, 36.39702342662024],
    [10, 400, 70.53079228338599],
    [45, 1000, 999.9999999999999],
    [0, 500, 0],
    [5, 0, 0],
  ])("calculates the lateral gain", (lift, distance, expected) => {
    expect(calculateWindShiftGain(lift, distance)).toBe(expected);
  });

  it.each([
    [-15, 400, -107.17967697244907],
    [-45, 100, -99.99999999999999],
    [-10, 200, -35.265396141692996],
  ])("returns negative gain for headers", (lift, distance, expected) => {
    expect(calculateWindShiftGain(lift, distance)).toBe(expected);
  });

  it("scales linearly with distance for a fixed lift", () => {
    expect(calculateWindShiftGain(20, 200)!).toBe(
      calculateWindShiftGain(20, 100)! * 2,
    );
  });

  it("accepts the negative and positive lift limits", () => {
    expect(calculateWindShiftGain(-45, 100)).not.toBeNull();
    expect(calculateWindShiftGain(45, 100)).not.toBeNull();
  });

  it.each([
    [-45.5, 100],
    [45.5, 100],
    [-60, 100],
    [90, 100],
  ])(
    "rejects lifts outside negative forty-five to forty-five",
    (lift, distance) => {
      expect(calculateWindShiftGain(lift, distance)).toBeNull();
      const result = runWindShiftGain({
        liftDegrees: lift,
        distanceSailedMeters: distance,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_shift");
    },
  );

  it("rejects a negative distance", () => {
    expect(calculateWindShiftGain(20, -1)).toBeNull();
    const result = runWindShiftGain({
      liftDegrees: 20,
      distanceSailedMeters: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_distance");
  });

  it("rejects non-finite inputs", () => {
    const result = runWindShiftGain({
      liftDegrees: Number.NaN,
      distanceSailedMeters: 100,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runWindShiftGain({
      liftDegrees: 20,
      distanceSailedMeters: 100,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
