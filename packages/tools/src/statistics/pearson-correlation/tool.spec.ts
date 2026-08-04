import { describe, expect, it } from "vitest";
import {
  calculatePearsonCorrelation,
  pearsonCorrelationExample,
  runPearsonCorrelation,
} from "./tool.js";

describe("Pearson Correlation Calculator", () => {
  it("calculates positive and inverse correlation", () => {
    expect(calculatePearsonCorrelation([1, 2, 3], [2, 4, 6])).toBe(1);
    expect(calculatePearsonCorrelation([1, 2, 3], [6, 4, 2])).toBe(-1);
  });

  it("rejects insufficient, unequal, and constant series", () => {
    expect(calculatePearsonCorrelation([1], [2])).toBeNull();
    expect(calculatePearsonCorrelation([1, 2], [1])).toBeNull();
    expect(calculatePearsonCorrelation([1, 1], [2, 3])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runPearsonCorrelation(pearsonCorrelationExample.input)).toEqual({
      ok: true,
      output: pearsonCorrelationExample.output,
    }));
});
