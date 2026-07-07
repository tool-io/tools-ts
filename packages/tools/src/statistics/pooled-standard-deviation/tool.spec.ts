import { describe, expect, it } from "vitest";
import { runPooledStandardDeviation } from "./tool.js";
describe("Pooled Standard Deviation Calculator", () => {
  it("calculates a valid result", () => {
    const result = runPooledStandardDeviation({
      firstVariance: 4,
      firstSize: 5,
      secondVariance: 9,
      secondSize: 5,
    });
    expect(result.ok && result.output.pooledStandardDeviation).toBeCloseTo(
      Math.sqrt(6.5),
    );
  });
  it("rejects invalid input", () =>
    expect(runPooledStandardDeviation(null).ok).toBe(false));
});
