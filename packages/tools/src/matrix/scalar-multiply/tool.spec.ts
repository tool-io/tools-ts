import { describe, expect, it } from "vitest";
import { runScalarMultiply } from "./tool.js";
describe("Matrix Scalar Multiplication Calculator", () => {
  it("calculates a valid result", () => {
    expect(runScalarMultiply({ matrix: [[1, 2]], scalar: 3 })).toEqual({
      ok: true,
      output: { matrix: [[3, 6]] },
    });
  });
  it("rejects invalid input", () =>
    expect(runScalarMultiply(null).ok).toBe(false));
});
