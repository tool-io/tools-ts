import { describe, expect, it } from "vitest";
import {
  calculateSurfaceArea,
  runSurfaceArea,
  surfaceAreaExample,
} from "./tool.js";

describe("3D Shape Surface Area Calculator", () => {
  it.each([
    ["sphere", 1, undefined, undefined, 4 * Math.PI],
    ["cube", 4, undefined, undefined, 96],
    ["cylinder", 3.5, 5.5, undefined, 2 * Math.PI * 3.5 * 9],
    ["rectangular-prism", 3, 4, 5, 94],
  ] as const)("calculates %s", (shape, a, b, c, expected) =>
    expect(calculateSurfaceArea(shape, a, b, c)).toBeCloseTo(expected, 12),
  );
  it("uses the Knud Thomsen approximation for an ellipsoid", () =>
    expect(calculateSurfaceArea("ellipsoid", 2, 2, 2)).toBeCloseTo(
      16 * Math.PI,
      12,
    ));
  it("rejects missing, extra, and invalid dimensions", () => {
    expect(calculateSurfaceArea("sphere", 1, 2)).toBeNull();
    expect(calculateSurfaceArea("cone", 1)).toBeNull();
    expect(calculateSurfaceArea("spherical-cap", 1, 2.1)).toBeNull();
    expect(calculateSurfaceArea("conical-frustum", 1, 2, 3)).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runSurfaceArea(surfaceAreaExample.input)).toEqual({
      ok: true,
      output: surfaceAreaExample.output,
    }));
});
