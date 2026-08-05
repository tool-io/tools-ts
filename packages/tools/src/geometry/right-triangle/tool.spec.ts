import { describe, expect, it } from "vitest";
import {
  calculateRightTriangle,
  rightTriangleExample,
  runRightTriangle,
} from "./tool.js";

describe("Right Triangle Calculator", () => {
  it("calculates a 3-4-5 triangle", () =>
    expect(calculateRightTriangle(3, 4)).toEqual({
      area: 6,
      hypotenuse: 5,
      perimeter: 12,
    }));
  it("supports decimal side lengths", () =>
    expect(calculateRightTriangle(1.5, 2.5)?.area).toBe(1.875));
  it("rejects nonpositive and non-finite side lengths", () => {
    expect(calculateRightTriangle(0, 4)).toBeNull();
    expect(calculateRightTriangle(-3, 4)).toBeNull();
    expect(calculateRightTriangle(Number.NaN, 4)).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runRightTriangle(rightTriangleExample.input)).toEqual({
      ok: true,
      output: rightTriangleExample.output,
    }));
});
