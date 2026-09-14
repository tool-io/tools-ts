import { describe, expect, it } from "vitest";
import { indefiniteIntegralExample, runIndefiniteIntegral } from "./tool.js";
import {
  evaluateMathExpression,
  parseMathExpression,
} from "../../math/expression-evaluator/parser.js";

describe("calculus/indefinite-integral", () => {
  it("reproduces the canonical example and includes the integration constant", () => {
    expect(runIndefiniteIntegral(indefiniteIntegralExample.input)).toEqual({
      ok: true,
      output: indefiniteIntegralExample.output,
    });
    expect(runIndefiniteIntegral({ expression: "0" })).toEqual({
      ok: true,
      output: { antiderivative: "0", integral: "0 + C" },
    });
  });
  it("returns primitives whose numerical derivatives match the original expressions", () => {
    for (const [expression, x] of [
      ["x^2 + 3*x - 7", 2],
      ["x*x", -2],
      ["x^2/x", 3],
      ["(2*x)^3", -2],
      ["1/x", -2],
      ["x^-1", 2],
      ["1/(2*x+3)", -3],
      ["(2*x+1)^3", 2],
      ["(2*x+1)^-1", -2],
      ["x^0.5", 3],
      ["sin(2*x+1)", 0.4],
      ["cos(x)", 0.4],
      ["tan(x)", 0.4],
      ["exp(-2*x)", 0.3],
      ["2^x", 0.2],
      ["ln(x)", 2],
      ["log10(x)", 2],
      ["log2(x)", 2],
      ["sqrt(2*x+1)", 2],
      ["cbrt(x)", -2],
      ["sinh(x)", 0.3],
      ["cosh(x)", 0.3],
      ["tanh(x)", 0.3],
      ["atan(x)", 0.3],
      ["asin(x)", 0.3],
      ["acos(x)", 0.3],
      ["pow(x,3)", 2],
    ] as const) {
      const result = runIndefiniteIntegral({ expression });
      expect(result.ok, expression).toBe(true);
      if (!result.ok) continue;
      const primitive = parseMathExpression(result.output.antiderivative, true);
      const h = 1e-5;
      const numericDerivative =
        (evaluateMathExpression(primitive, { x: x + h }) -
          evaluateMathExpression(primitive, { x: x - h })) /
        (2 * h);
      expect(numericDerivative, expression).toBeCloseTo(
        evaluateMathExpression(parseMathExpression(expression, true), { x }),
        6,
      );
      expect(result.output.integral).toBe(
        result.output.antiderivative + " + C",
      );
    }
  });
  it("holds other variables constant and preserves a chosen integration variable", () => {
    const result = runIndefiniteIntegral({
      expression: "p^2+x*p",
      variable: "p",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const tree = parseMathExpression(result.output.antiderivative, true);
      const h = 1e-5;
      expect(
        (evaluateMathExpression(tree, { p: 2 + h, x: 3 }) -
          evaluateMathExpression(tree, { p: 2 - h, x: 3 })) /
          (2 * h),
      ).toBeCloseTo(10, 6);
    }
  });
  it("rejects unknown rules, invalid domains and unsafe input rather than guessing", () => {
    for (const input of [
      { expression: "sin(x^2)" },
      { expression: "exp(-x^2)" },
      { expression: "x*sin(x)" },
      { expression: "abs(x)" },
      { expression: "x^p" },
      { expression: "x%2" },
      { expression: "1/0" },
      { expression: "sqrt(-1)" },
      { expression: "x+" },
      { expression: "eval(x)" },
      { expression: "x^2", variable: "pi" },
    ])
      expect(runIndefiniteIntegral(input).ok, JSON.stringify(input)).toBe(
        false,
      );
  });
});
