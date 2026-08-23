import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EvaluatePolynomialInput = {
  readonly coefficients?: readonly number[];
  readonly x?: number;
};

export type EvaluatePolynomialOutput = {
  readonly value: number;
};

export const calculateEvaluatePolynomial = (
  input: EvaluatePolynomialInput,
): EvaluatePolynomialOutput => {
  const coefficients = input.coefficients ?? [1, 0, -2];
  const x = input.x ?? 2;
  if (coefficients.length === 0)
    return simpleError(
      "coefficients",
      "At least one coefficient is required (highest degree first).",
      "invalid_polynomial",
    );
  const value = coefficients.reduce(
    (accumulator, coefficient) => accumulator * x + coefficient,
    0,
  );
  if (!Number.isFinite(value))
    return simpleError(
      "value",
      "The polynomial value is outside the finite numeric range.",
      "result_not_finite",
    );
  return { value };
};

export const evaluatePolynomialExample = {
  input: {
    coefficients: [2, -6, 4],
    x: 3,
  },
  output: {
    value: 4,
  },
} satisfies ToolExample<EvaluatePolynomialInput, EvaluatePolynomialOutput>;

export const evaluatePolynomialTool = createSimpleTool({
  id: "algebra/evaluate-polynomial",
  title: "Polynomial Evaluator",
  description:
    "Evaluate a polynomial at a point using Horner's method with highest-degree-first coefficients.",
  inputs: [
    {
      default: [1, 0, -2],
      description:
        "Polynomial coefficients from highest degree to constant term.",
      id: "coefficients",
      kind: "numberList",
      label: "Coefficients",
    },
    {
      default: 2,
      description: "Where to evaluate the polynomial.",
      id: "x",
      kind: "number",
      label: "Point",
    },
  ],
  outputs: [
    {
      description: "Polynomial value at x.",
      id: "value",
      kind: "number",
      label: "Value",
    },
  ],
  calculate: (input) =>
    calculateEvaluatePolynomial(input as EvaluatePolynomialInput),
});

export const runEvaluatePolynomial = evaluatePolynomialTool.execute;
export default evaluatePolynomialTool;
