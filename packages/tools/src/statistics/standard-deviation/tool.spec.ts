import { describe, expect, it } from "vitest";
import {
  calculateStandardDeviation,
  runStandardDeviation,
  standardDeviationExample,
} from "./tool.js";

describe("Standard Deviation Calculator", () => {
  it.each([
    [[1, 2, 3, 4, 5], Math.sqrt(2)],
    [[10, 20, 30], Math.sqrt(200 / 3)],
    [[5, 5, 5, 5], 0],
  ])("calculates population standard deviation", (values, expected) => {
    expect(calculateStandardDeviation(values)).toBeCloseTo(expected, 12);
  });

  it("rejects empty and overflowing input", () => {
    expect(calculateStandardDeviation([])).toBeNull();
    expect(calculateStandardDeviation([1e308, -1e308])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runStandardDeviation(standardDeviationExample.input)).toEqual({
      ok: true,
      output: standardDeviationExample.output,
    }));
});
