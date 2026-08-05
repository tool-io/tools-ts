import { describe, expect, it } from "vitest";
import {
  calculateMissingRightTriangleSide,
  pythagoreanTheoremExample,
  runPythagoreanTheorem,
} from "./tool.js";

describe("Pythagorean Theorem Calculator", () => {
  it.each([
    [{ sideA: 3, sideB: 4 }, 5],
    [{ hypotenuse: 5, sideA: 3 }, 4],
    [{ hypotenuse: 5, sideB: 4 }, 3],
  ])("calculates the missing side", (input, expected) =>
    expect(calculateMissingRightTriangleSide(input)).toBeCloseTo(expected, 12),
  );
  it("rejects ambiguous and impossible triangles", () => {
    expect(calculateMissingRightTriangleSide({ sideA: 3 })).toBeNull();
    expect(
      calculateMissingRightTriangleSide({ sideA: 3, sideB: 4, hypotenuse: 5 }),
    ).toBeNull();
    expect(
      calculateMissingRightTriangleSide({ sideA: 5, hypotenuse: 5 }),
    ).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runPythagoreanTheorem(pythagoreanTheoremExample.input)).toEqual({
      ok: true,
      output: pythagoreanTheoremExample.output,
    }));
});
