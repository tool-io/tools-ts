import { describe, expect, it } from "vitest";
import { runSymmetricMeanAbsolutePercentageError } from "./tool.js";
describe("Symmetric Mean Absolute Percentage Error Calculator", () => {
  it("calculates a valid result", () => {
    const result = runSymmetricMeanAbsolutePercentageError({
      actual: [100, 200],
      predicted: [110, 190],
    });
    expect(result.ok && result.output.percent).toBeCloseTo(7.32967032967);
  });
  it("rejects invalid input", () =>
    expect(runSymmetricMeanAbsolutePercentageError(null).ok).toBe(false));
});
