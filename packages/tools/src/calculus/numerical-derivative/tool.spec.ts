import { describe, expect, it } from "vitest";
import {
  numericalDerivativeExample,
  calculateNumericalDerivative,
  runNumericalDerivative,
} from "./tool.js";

describe("calculus/numerical-derivative", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNumericalDerivative(numericalDerivativeExample.input)).toEqual({
      ok: true,
      output: numericalDerivativeExample.output,
    });
  });
  it("rejects invalid input (invalid_h)", () => {
    expect(
      runNumericalDerivative({ coefficients: [1, 2], x: 0, h: 0 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_h)", () => {
    expect(
      runNumericalDerivative({ coefficients: [1, 2], x: 0, h: -0.001 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runNumericalDerivative({ coefficients: [], x: 1 }).ok).toBe(false);
  });
  it("matches the analytic slope of a parabola", () => {
    const result = runNumericalDerivative({ coefficients: [0, 0, 1], x: 3 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.derivative).toBeCloseTo(6, 4);
      expect(result.output.secondDerivative).toBeCloseTo(2, 4);
    }
  });
});
