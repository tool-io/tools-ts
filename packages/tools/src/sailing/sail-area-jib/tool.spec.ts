import { describe, expect, it } from "vitest";
import { calculateJibArea, jibAreaExample, runJibArea } from "./tool.js";

describe("Jib Area Calculator", () => {
  it("publishes an executable example", () =>
    expect(runJibArea(jibAreaExample.input)).toEqual({
      ok: true,
      output: jibAreaExample.output,
    }));

  it.each([
    [10, 6, 30],
    [12.5, 3.8, 23.75],
    [8, 8, 32],
    [1, 2, 1],
    [0.5, 0.4, 0.1],
  ])("calculates the triangular jib area", (i, j, expected) => {
    expect(calculateJibArea(i, j)).toBe(expected);
  });

  it.each([
    [0, 6],
    [10, 0],
    [-2, 6],
    [10, -1],
  ])("rejects non-positive I and J measurements", (i, j) => {
    expect(calculateJibArea(i, j)).toBeNull();
    const result = runJibArea({
      iMeasurementMeters: i,
      jMeasurementMeters: j,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects non-finite measurements", () => {
    const result = runJibArea({
      iMeasurementMeters: Number.NaN,
      jMeasurementMeters: 6,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runJibArea({
      iMeasurementMeters: 10,
      jMeasurementMeters: 6,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
