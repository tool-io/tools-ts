import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { evaluateMathExpression, parseMathExpression } from "./parser.js";

export type ExpressionEvaluatorInput = { readonly expression: string };
export type ExpressionEvaluatorOutput = { readonly value: number };

/** Scientific calculator; trig uses radians, log/log10 use base 10,
 * ln is natural log, % is remainder, and powers associate to the right.
 */
export const calculateExpressionEvaluator = (
  input: ExpressionEvaluatorInput,
): ExpressionEvaluatorOutput => ({
  value: evaluateMathExpression(parseMathExpression(input.expression)),
});

export const expressionEvaluatorExample = {
  input: { expression: "2 + 3 * 4 ^ 2" },
  output: { value: 50 },
} satisfies ToolExample<ExpressionEvaluatorInput, ExpressionEvaluatorOutput>;

export const expressionEvaluatorTool = createSimpleTool({
  id: "math/expression-evaluator",
  title: "Arithmetic Expression Evaluator",
  description:
    "Evaluate arithmetic and scientific functions, constants and scientific notation with standard precedence and ^ or ** powers.",
  inputs: [
    {
      description:
        "Expression, e.g. sqrt(25) + 2**5 + 1.3e-4; trig uses radians, log is base 10, ln is natural log, and % is remainder.",
      id: "expression",
      kind: "string",
      label: "Expression",
    },
  ],
  outputs: [
    {
      description: "Numeric result of the expression.",
      id: "value",
      kind: "number",
      label: "Value",
    },
  ],
  calculate: (input) =>
    calculateExpressionEvaluator({ expression: input.expression as string }),
});
export const runExpressionEvaluator = expressionEvaluatorTool.execute;
export default expressionEvaluatorTool;
