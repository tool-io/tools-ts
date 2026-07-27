import { describe, expect, it } from "vitest";
import { meanSquaredErrorExample, runMeanSquaredError } from "./tool.js";
describe("Mean Squared Error Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMeanSquaredError({
      actual: [1, 2, 3],
      predicted: [2, 2, 4],
    });
    expect(result.ok && result.output.meanSquaredError).toBeCloseTo(2 / 3);
  });
  it("rejects invalid input", () =>
    expect(runMeanSquaredError(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMeanSquaredError(meanSquaredErrorExample.input)).toMatchObject({
      ok: true,
      output: { meanSquaredError: 2 / 3 },
    }));
});
