import { describe, expect, it } from "vitest";
import {
  calculateSwingCircleArea,
  runSwingCircleArea,
  swingCircleAreaExample,
} from "./tool.js";

describe("Swing Circle Area Calculator", () => {
  it("publishes an executable example", () =>
    expect(runSwingCircleArea(swingCircleAreaExample.input)).toEqual({
      ok: true,
      output: swingCircleAreaExample.output,
    }));

  it.each([
    [10, Math.PI * 100],
    [1, Math.PI],
    [2.5, Math.PI * 6.25],
    [50, Math.PI * 2500],
    [0.1, Math.PI * 0.010000000000000002],
  ])("calculates the swing circle area", (radius, expected) => {
    expect(calculateSwingCircleArea(radius)).toBe(expected);
  });

  it("returns zero area for a zero radius", () => {
    expect(calculateSwingCircleArea(0)).toBe(0);
    const result = runSwingCircleArea({ anchorCircleRadiusMeters: 0 });
    expect(result).toEqual({ ok: true, output: { swingCircleAreaM2: 0 } });
  });

  it("quadruples the area when the radius doubles", () => {
    expect(calculateSwingCircleArea(20)).toBe(
      calculateSwingCircleArea(10)! * 4,
    );
  });

  it.each([[-1], [-0.5], [-100]])("rejects negative radii", (radius) => {
    expect(calculateSwingCircleArea(radius)).toBeNull();
    const result = runSwingCircleArea({ anchorCircleRadiusMeters: radius });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_radius");
  });

  it("rejects non-finite radii", () => {
    expect(calculateSwingCircleArea(Number.NaN)).toBeNull();
    const result = runSwingCircleArea({
      anchorCircleRadiusMeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runSwingCircleArea({
      anchorCircleRadiusMeters: 10,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
