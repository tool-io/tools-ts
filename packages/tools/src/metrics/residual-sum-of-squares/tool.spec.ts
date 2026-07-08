import { describe, expect, it } from "vitest";
import { runResidualSumOfSquares } from "./tool.js";
describe("Residual Sum of Squares Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runResidualSumOfSquares({ actual: [1, 2, 3], predicted: [2, 2, 4] }),
    ).toEqual({ ok: true, output: { residualSumOfSquares: 2 } });
  });
  it("rejects invalid input", () =>
    expect(runResidualSumOfSquares(null).ok).toBe(false));
});
