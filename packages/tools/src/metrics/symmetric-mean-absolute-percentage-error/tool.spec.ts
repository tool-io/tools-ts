import { describe, expect, it } from "vitest";
import {
  runSymmetricMeanAbsolutePercentageError,
  symmetricMeanAbsolutePercentageErrorExample,
} from "./tool.js";
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
  it("publishes an executable example", () => {
    const result = runSymmetricMeanAbsolutePercentageError(
      symmetricMeanAbsolutePercentageErrorExample.input,
    );
    expect(result.ok && result.output.percent).toBeCloseTo(7.32967032967);
  });
});
