import { describe, expect, it } from "vitest";
import { definiteIntegralExample, runDefiniteIntegral } from "./tool.js";

describe("calculus/definite-integral", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runDefiniteIntegral(definiteIntegralExample.input)).toEqual({
      ok: true,
      output: definiteIntegralExample.output,
    });
  });
  it("integrates a polynomial expression and respects reversed bounds", () => {
    for (const [lowerBound, upperBound, expected] of [
      [5, 12, 1603 / 3],
      [12, 5, -1603 / 3],
      [5, 5, 0],
    ]) {
      const result = runDefiniteIntegral({
        expression: "x^2",
        lowerBound,
        upperBound,
      });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.integral).toBeCloseTo(expected, 10);
    }
  });
  it("supports elementary functions and another variable", () => {
    const result = runDefiniteIntegral({
      expression: "sin(p)",
      variable: "p",
      lowerBound: 0,
      upperBound: Math.PI,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.integral).toBeCloseTo(2, 8);
      expect(result.output.estimatedError).toBeGreaterThan(0);
    }
  });
  it("rejects unbound symbols, sampled singularities, bad domains and nonfinite bounds", () => {
    for (const input of [
      { expression: "x+p", lowerBound: 0, upperBound: 1 },
      { expression: "1/x", lowerBound: -1, upperBound: 1 },
      { expression: "sqrt(x)", lowerBound: -1, upperBound: 1 },
      { expression: "x", lowerBound: 0, upperBound: Infinity },
      { expression: "x", variable: "pi", lowerBound: 0, upperBound: 1 },
    ])
      expect(runDefiniteIntegral(input).ok).toBe(false);
  });
});
