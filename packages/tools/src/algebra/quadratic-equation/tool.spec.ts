import { describe, expect, it } from "vitest";
import { quadraticEquationExample, runQuadraticEquation } from "./tool.js";

describe("algebra/quadratic-equation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQuadraticEquation(quadraticEquationExample.input)).toEqual({
      ok: true,
      output: quadraticEquationExample.output,
    });
  });

  it("reports double roots at zero discriminant", () => {
    const result = runQuadraticEquation({ a: 1, b: -2, c: 1 });
    expect(result).toEqual({
      ok: true,
      output: {
        case: "double_root",
        discriminant: 0,
        imaginaryPart: 0,
        realPart: 0,
        roots: [1],
      },
    });
  });

  it("reports complex pairs for negative discriminants", () => {
    const result = runQuadraticEquation({ a: 1, b: 0, c: 1 });
    expect(result).toEqual({
      ok: true,
      output: {
        case: "complex_roots",
        discriminant: -4,
        imaginaryPart: 1,
        realPart: 0,
        roots: [],
      },
    });
  });

  it("reports a nonnegative imaginary magnitude for a negative leading coefficient", () => {
    expect(runQuadraticEquation({ a: -1, b: 0, c: -1 })).toEqual({
      ok: true,
      output: {
        case: "complex_roots",
        discriminant: -4,
        imaginaryPart: 1,
        realPart: 0,
        roots: [],
      },
    });
  });

  it("sorts two real roots ascending regardless of leading sign", () => {
    const result = runQuadraticEquation({ a: -2, b: 2, c: 4 });
    expect(
      result.ok &&
        result.output.case === "two_real_roots" &&
        JSON.stringify(result.output.roots) === "[-1,2]",
    ).toBe(true);
  });

  it("handles degenerate linear, no-solution and all-solution cases", () => {
    const linear = runQuadraticEquation({ a: 0, b: 2, c: -4 });
    const none = runQuadraticEquation({ a: 0, b: 0, c: 5 });
    const all = runQuadraticEquation({ a: 0, b: 0, c: 0 });
    expect(linear.ok && none.ok && all.ok).toBe(true);
    if (linear.ok && none.ok && all.ok) {
      expect(linear.output.case).toBe("linear");
      expect(linear.output.roots).toEqual([2]);
      expect(none.output.case).toBe("no_solution");
      expect(none.output.roots).toEqual([]);
      expect(all.output.case).toBe("all_real_numbers");
      expect(all.output.roots).toEqual([]);
    }
  });

  it("retains the small root when coefficients are poorly scaled", () => {
    const result = runQuadraticEquation({ a: 1, b: 100_000_000, c: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.roots[0]).toBeCloseTo(-100_000_000, 6);
      expect(result.output.roots[1]).toBeCloseTo(-1e-8, 15);
    }
  });

  it("rejects non-finite input and discriminant overflow", () => {
    expect(runQuadraticEquation({ a: 1, b: Number.NaN, c: 1 }).ok).toBe(false);
    const overflow = runQuadraticEquation({
      a: Number.MAX_VALUE,
      b: 1,
      c: Number.MAX_VALUE,
    });
    expect(overflow.ok).toBe(false);
    if (!overflow.ok)
      expect(overflow.error.issues[0].code).toBe("result_not_finite");
  });

  it("rejects non-finite roots in linear and complex branches", () => {
    const linear = runQuadraticEquation({ a: 0, b: Number.MIN_VALUE, c: 1 });
    const complex = runQuadraticEquation({
      a: Number.MIN_VALUE,
      b: 0,
      c: 1e308,
    });
    expect(linear.ok).toBe(false);
    expect(complex.ok).toBe(false);
    if (!linear.ok)
      expect(linear.error.issues[0].code).toBe("result_not_finite");
    if (!complex.ok)
      expect(complex.error.issues[0].code).toBe("result_not_finite");
  });
});
