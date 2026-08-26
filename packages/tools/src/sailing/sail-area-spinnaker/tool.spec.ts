import { describe, expect, it } from "vitest";
import {
  calculateSpinnakerArea,
  runSpinnakerArea,
  spinnakerAreaExample,
} from "./tool.js";

describe("Spinnaker Area Calculator", () => {
  it("publishes an executable example", () =>
    expect(runSpinnakerArea(spinnakerAreaExample.input)).toEqual({
      ok: true,
      output: spinnakerAreaExample.output,
    }));

  it.each([
    [9, 4, 27],
    [10.2, 5.6, 42.839999999999996],
    [8, 8, 48],
    [1, 1, 0.75],
    [0.5, 2, 0.75],
  ])("estimates the spinnaker area", (sl, smw, expected) => {
    expect(calculateSpinnakerArea(sl, smw)).toBe(expected);
  });

  it.each([
    [0, 4],
    [9, 0],
    [-3, 4],
    [9, -2],
  ])("rejects non-positive SL and SMW measurements", (sl, smw) => {
    expect(calculateSpinnakerArea(sl, smw)).toBeNull();
    const result = runSpinnakerArea({
      slLengthMeters: sl,
      smwWidthMeters: smw,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects non-finite measurements", () => {
    const result = runSpinnakerArea({
      slLengthMeters: Number.POSITIVE_INFINITY,
      smwWidthMeters: 4,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runSpinnakerArea({
      slLengthMeters: 9,
      smwWidthMeters: 4,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
