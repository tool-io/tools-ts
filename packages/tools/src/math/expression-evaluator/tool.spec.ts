import { describe, expect, it } from "vitest";
import { expressionEvaluatorExample, runExpressionEvaluator } from "./tool.js";

describe("math/expression-evaluator", () => {
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
