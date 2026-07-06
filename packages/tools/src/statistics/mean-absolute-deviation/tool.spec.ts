import { describe, expect, it } from "vitest";
import { runMeanAbsoluteDeviation } from "./tool.js";
describe("Mean Absolute Deviation Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMeanAbsoluteDeviation({ values: [1, 2, 3] });
    expect(result.ok && result.output.meanAbsoluteDeviation).toBeCloseTo(2 / 3);
  });
  it("rejects invalid input", () =>
    expect(runMeanAbsoluteDeviation(null).ok).toBe(false));
});
