import { describe, expect, it } from "vitest";
import { expressionEvaluatorExample, runExpressionEvaluator } from "./tool.js";

describe("math/expression-evaluator", () => {
  it("supports scientific functions, constants, notation and both power spellings", () => {
    for (const [expression, expected] of [
      ["sqrt(25)", 5],
      ["2**5", 32],
      ["2**3**2", 512],
      ["2^-2", 0.25],
      ["-2**2", -4],
      ["4e+9", 4000000000],
      ["1.3e-4", 0.00013],
      ["sin(pi/2)", 1],
      ["cos(0)", 1],
      ["ln(e)", 1],
      ["log(100)", 2],
      ["log2(8)", 3],
      ["cbrt(-8)", -2],
      ["abs(-4)", 4],
      ["hypot(3,4)", 5],
      ["max(1,min(5,2),3)", 3],
      ["pow(2,5)", 32],
      ["sqrt(16)+2**3", 12],
      ["π", Math.PI],
      ["tau", Math.PI * 2],
    ] as const) {
      const result = runExpressionEvaluator({ expression });
      expect(result.ok, expression).toBe(true);
      if (result.ok)
        expect(result.output.value, expression).toBeCloseTo(expected, 12);
    }
  });

  it("rejects function/domain errors and arbitrary code with structured errors", () => {
    for (const expression of [
      "sqrt(-1)",
      "ln(0)",
      "sqrt()",
      "sqrt(1,2)",
      "pow(2)",
      "min()",
      "constructor(1)",
      "Math.sqrt(25)",
      "process.exit()",
      "1e309",
      "sqrt(4",
      "2***3",
      "unknown(1)",
      "---".repeat(200) + "1",
    ]) {
      const result = runExpressionEvaluator({ expression });
      expect(result.ok, expression).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code, expression).toBe(
          "malformed_expression",
        );
    }
  });
  it("reproduces its canonical example exactly", () => {
    expect(runExpressionEvaluator(expressionEvaluatorExample.input)).toEqual({
      ok: true,
      output: expressionEvaluatorExample.output,
    });
  });

  it("honours precedence, associativity and unary minus", () => {
    const grouped = runExpressionEvaluator({ expression: "(2 + 3) * 4" });
    expect(grouped.ok && grouped.output.value).toBe(20);
    const power = runExpressionEvaluator({ expression: "2 ^ 3 ^ 2" });
    expect(power.ok && power.output.value).toBe(512);
    const negated = runExpressionEvaluator({ expression: "-2 ^ 2" });
    expect(negated.ok && negated.output.value).toBe(-4);
    const modulo = runExpressionEvaluator({ expression: "10 % 3" });
    expect(modulo.ok && modulo.output.value).toBe(1);
    const negativeExponent = runExpressionEvaluator({ expression: "2 ^ -2" });
    expect(negativeExponent.ok && negativeExponent.output.value).toBe(0.25);
  });

  it("rejects malformed expressions with structured errors", () => {
    for (const expression of ["2 +", "(1 + 2", "abc", "1 2"]) {
      const result = runExpressionEvaluator({ expression });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("malformed_expression");
    }
  });

  it("rejects division and modulo by zero", () => {
    for (const expression of ["1 / 0", "5 % 0"]) {
      const result = runExpressionEvaluator({ expression });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("division_by_zero");
    }
  });

  it("rejects empty expressions", () => {
    const result = runExpressionEvaluator({ expression: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("malformed_expression");
  });
});
