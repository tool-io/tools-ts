import { describe, expect, it } from "vitest";
import { runSymbolicDerivative, symbolicDerivativeExample } from "./tool.js";
import {
  evaluateMathExpression,
  parseMathExpression,
} from "../../math/expression-evaluator/parser.js";

describe("calculus/symbolic-derivative", () => {
  it("reproduces its canonical example and respects the chosen variable", () => {
    expect(runSymbolicDerivative(symbolicDerivativeExample.input)).toEqual({
      ok: true,
      output: symbolicDerivativeExample.output,
    });
    for (const [expression, variable, derivative] of [
      ["x+p", "x", "1"],
      ["x^2", "p", "0"],
      ["p^0", "p", "0"],
      ["0^0", "x", "0"],
    ])
      expect(runSymbolicDerivative({ expression, variable })).toEqual({
        ok: true,
        output: { derivative },
      });
  });
  it("implements power, product, quotient and elementary chain rules", () => {
    for (const [expression, x, expected] of [
      ["x^2", 3, 6],
      ["x*x", 3, 6],
      ["sin(x^2)", 0.5, Math.cos(0.25)],
      ["exp(x)", 1, Math.E],
      ["sqrt(x)", 4, 0.25],
      ["ln(x)", 2, 0.5],
      ["x/(1+x)", 2, 1 / 9],
      ["2^x", 3, 8 * Math.LN2],
      ["pow(x,3)", 2, 12],
      ["atan2(x,2)", 1, 0.4],
      ["hypot(x,4)", 3, 0.6],
    ] as const) {
      const result = runSymbolicDerivative({ expression });
      expect(result.ok, expression).toBe(true);
      if (result.ok)
        expect(
          evaluateMathExpression(
            parseMathExpression(result.output.derivative, true),
            { x },
          ),
          expression,
        ).toBeCloseTo(expected, 10);
    }
  });
  it("rejects unsupported expressions, invalid variables and undefined constants", () => {
    for (const input of [
      { expression: "abs(x)" },
      { expression: "x%2" },
      { expression: "1/0" },
      { expression: "sqrt(-1)" },
      { expression: "x+" },
      { expression: "eval(x)" },
      { expression: "x^2", variable: "pi" },
      { expression: "x^2", variable: "x.y" },
    ])
      expect(runSymbolicDerivative(input).ok, JSON.stringify(input)).toBe(
        false,
      );
  });
});
