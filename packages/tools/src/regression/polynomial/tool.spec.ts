import { describe, expect, it } from "vitest";
import {
  calculatePolynomialRegression,
  polynomialRegressionExample,
  runPolynomialRegression,
} from "./tool.js";

describe("regression/polynomial", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPolynomialRegression(polynomialRegressionExample.input)).toEqual({
      ok: true,
      output: polynomialRegressionExample.output,
    });
  });

  it("rejects mismatched lengths and insufficient points with structured errors", () => {
    const mismatch = runPolynomialRegression({ degree: 1, x: [1, 2], y: [1] });
    expect(mismatch.ok).toBe(false);
    if (!mismatch.ok)
      expect(mismatch.error.issues[0]?.code).toBe("length_mismatch");
    const short = runPolynomialRegression({
      degree: 3,
      x: [1, 2, 3],
      y: [1, 2, 3],
    });
    expect(short.ok).toBe(false);
    if (!short.ok)
      expect(short.error.issues[0]?.code).toBe("insufficient_points");
  });

  it("rejects degrees outside the guard of 1..6 and singular systems", () => {
    expect(runPolynomialRegression({ degree: 7, x: [1], y: [1] }).ok).toBe(
      false,
    );
    const singular = runPolynomialRegression({
      degree: 2,
      x: [1, 1, 1],
      y: [1, 2, 3],
    });
    expect(singular.ok).toBe(false);
    if (!singular.ok)
      expect(singular.error.issues[0]?.code).toBe("singular_matrix");
  });

  it("recovers an exact quadratic on well-scaled data", () => {
    const result = calculatePolynomialRegression({
      degree: 2,
      x: [0, 1, 2],
      y: [1, 3, 7],
    });
    for (const coefficient of result.coefficients)
      expect(coefficient).toBeCloseTo(1, 9);
    expect(result.rSquared).toBeCloseTo(1, 12);
  });
});
