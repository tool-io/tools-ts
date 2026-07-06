import { describe, expect, it } from "vitest";
import { runSymmetryChecker } from "./tool.js";
describe("Matrix Symmetry Checker", () => {
  it("calculates a valid result", () => {
    expect(
      runSymmetryChecker({
        matrix: [
          [1, 2],
          [2, 3],
        ],
      }),
    ).toEqual({ ok: true, output: { symmetric: true } });
  });
  it("rejects invalid input", () =>
    expect(runSymmetryChecker(null).ok).toBe(false));
});
