import { describe, expect, it } from "vitest";
import {
  calculateDeterminant2x2,
  determinant2x2Example,
  runDeterminant2x2,
} from "./tool.js";

describe("matrix 2x2 determinant calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDeterminant2x2(determinant2x2Example.input)).toEqual({
      ok: true,
      output: determinant2x2Example.output,
    });
  });

  it("detects singular matrices and identity scaling", () => {
    expect(
      calculateDeterminant2x2({ matrix: [[1, 2], [2, 4]] }).determinant,
    ).toBe(0);
    expect(
      calculateDeterminant2x2({ matrix: [[5, 0], [0, 5]] }).determinant,
    ).toBe(25);
  });

  it("rejects non-2x2 matrices through execution", () => {
    for (const matrix of [
      [[1]],
      [[1, 2, 3], [4, 5, 6]],
      [[1, 2], [3, 4], [5, 6]],
    ])
      expect(runDeterminant2x2({ matrix })).toMatchObject({
        error: { issues: [{ code: "not_2x2_matrix" }] },
        ok: false,
      });
  });
});
