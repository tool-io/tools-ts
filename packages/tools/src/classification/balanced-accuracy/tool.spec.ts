import { describe, expect, it } from "vitest";
import { runBalancedAccuracy } from "./tool.js";
describe("Balanced Accuracy Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBalancedAccuracy({
      truePositive: 8,
      trueNegative: 9,
      falsePositive: 1,
      falseNegative: 2,
    });
    expect(result.ok && result.output.balancedAccuracy).toBeCloseTo(0.85);
  });
  it("rejects invalid input", () =>
    expect(runBalancedAccuracy(null).ok).toBe(false));
});
