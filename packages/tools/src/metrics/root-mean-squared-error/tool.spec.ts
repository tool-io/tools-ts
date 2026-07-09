import { describe, expect, it } from "vitest";
import { runRootMeanSquaredError } from "./tool.js";
describe("Root Mean Squared Error Calculator", () => {
  it("calculates a valid result", () => {
    const result = runRootMeanSquaredError({
      actual: [1, 2, 3],
      predicted: [2, 2, 4],
    });
    expect(result.ok && result.output.rootMeanSquaredError).toBeCloseTo(
      Math.sqrt(2 / 3),
    );
  });
  it("rejects invalid input", () =>
    expect(runRootMeanSquaredError(null).ok).toBe(false));
});
