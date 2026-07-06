import { describe, expect, it } from "vitest";
import { runMeanAbsoluteError } from "./tool.js";
describe("Mean Absolute Error Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMeanAbsoluteError({
      actual: [1, 2, 3],
      predicted: [2, 2, 4],
    });
    expect(result.ok && result.output.meanAbsoluteError).toBeCloseTo(2 / 3);
  });
  it("rejects invalid input", () =>
    expect(runMeanAbsoluteError(null).ok).toBe(false));
});
