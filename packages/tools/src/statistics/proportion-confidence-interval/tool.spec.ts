import { describe, expect, it } from "vitest";
import {
  calculateProportionConfidenceInterval,
  proportionConfidenceIntervalExample,
  runProportionConfidenceInterval,
} from "./tool.js";

describe("Proportion Confidence Interval Calculator", () => {
  it("calculates the canonical interval", () => {
    const result = calculateProportionConfidenceInterval(60, 100, 95);
    expect(result?.[0]).toBeCloseTo(0.5039817664728937, 12);
    expect(result?.[1]).toBeCloseTo(0.6960182335271062, 12);
  });

  it("clamps boundary proportions", () => {
    expect(calculateProportionConfidenceInterval(0, 100, 95)).toEqual([0, 0]);
    expect(calculateProportionConfidenceInterval(100, 100, 99)).toEqual([1, 1]);
  });

  it("rejects invalid inputs", () => {
    expect(calculateProportionConfidenceInterval(-1, 100, 95)).toBeNull();
    expect(calculateProportionConfidenceInterval(101, 100, 95)).toBeNull();
    expect(calculateProportionConfidenceInterval(10, 100, 80 as 95)).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(
      runProportionConfidenceInterval(
        proportionConfidenceIntervalExample.input,
      ),
    ).toEqual({
      ok: true,
      output: proportionConfidenceIntervalExample.output,
    }));
});
