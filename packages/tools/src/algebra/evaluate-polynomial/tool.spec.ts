import { describe, expect, it } from "vitest";
import { evaluatePolynomialExample, runEvaluatePolynomial } from "./tool.js";

describe("algebra/evaluate-polynomial", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEvaluatePolynomial(evaluatePolynomialExample.input)).toEqual({
      ok: true,
      output: evaluatePolynomialExample.output,
    });
  });

  it("evaluates a cubic with a negative point", () => {
    expect(
      runEvaluatePolynomial({ coefficients: [3, 0, -2, 5], x: -2 }),
    ).toEqual({ ok: true, output: { value: -15 } });
  });

  it("evaluates a constant polynomial independently of x", () => {
    expect(runEvaluatePolynomial({ coefficients: [7], x: 123 })).toEqual({
      ok: true,
      output: { value: 7 },
    });
  });

  it("rejects an empty coefficient list with a stable code", () => {
    const result = runEvaluatePolynomial({ coefficients: [], x: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_polynomial",
        field: "coefficients",
      });
  });

  it("rejects non-finite input and overflow", () => {
    expect(runEvaluatePolynomial({ coefficients: [1], x: Number.NaN }).ok).toBe(
      false,
    );
    const overflow = runEvaluatePolynomial({
      coefficients: [Number.MAX_VALUE, Number.MAX_VALUE],
      x: 2,
    });
    expect(overflow.ok).toBe(false);
    if (!overflow.ok)
      expect(overflow.error.issues[0].code).toBe("result_not_finite");
  });
});
