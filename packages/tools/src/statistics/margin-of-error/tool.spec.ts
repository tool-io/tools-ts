import { describe, expect, it } from "vitest";
import {
  calculateMarginOfError,
  inverseNormalCdf,
  marginOfErrorExample,
} from "./tool.js";
describe("margin of error", () => {
  it("calculates a 95% margin", () => {
    expect(inverseNormalCdf(0.975)).toBeCloseTo(1.959964, 5);
    const result = calculateMarginOfError({
      standardDeviation: 10,
      sampleSize: 100,
    });
    expect(result.ok && result.output.marginOfError).toBeCloseTo(1.959964, 5);
  });
  it("rejects confidence one", () =>
    expect(
      calculateMarginOfError({
        standardDeviation: 1,
        sampleSize: 2,
        confidenceLevel: 1,
      }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(calculateMarginOfError(marginOfErrorExample.input).ok).toBe(true));
});
