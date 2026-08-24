import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NumericalDerivativeInput = {
  readonly coefficients: readonly number[];
  readonly x: number;
  readonly h?: number;
};

export type NumericalDerivativeOutput = {
  readonly derivative: number;
  readonly secondDerivative: number;
};

export const calculateNumericalDerivative = (
  input: NumericalDerivativeInput,
): NumericalDerivativeOutput => {
  const coefficients = input.coefficients;
  if (!coefficients.length)
    return simpleError(
      "coefficients",
      "coefficients must not be empty.",
      "empty_list",
    );
  const step = input.h ?? 1e-5;
  if (!(step > 0))
    return simpleError("h", "Step size h must be positive.", "invalid_h");
  const evaluate = (t: number): number => {
    let acc = 0;
    for (let i = coefficients.length - 1; i >= 0; i -= 1)
      acc = acc * t + coefficients[i];
    return acc;
  };
  const forward = evaluate(input.x + step);
  const backward = evaluate(input.x - step);
  const derivative = (forward - backward) / (2 * step);
  const secondDerivative =
    (forward - 2 * evaluate(input.x) + backward) / (step * step);
  if (![derivative, secondDerivative].every(Number.isFinite))
    simpleError(
      "coefficients",
      "The derivative estimate exceeds the numeric range.",
    );
  return { derivative, secondDerivative };
};

export const numericalDerivativeExample = {
  input: {
    coefficients: [1, 3, 1],
    x: 2,
    h: 0.0078125,
  },
  output: {
    derivative: 7,
    secondDerivative: 2,
  },
} satisfies ToolExample<NumericalDerivativeInput, NumericalDerivativeOutput>;

export const numericalDerivativeTool = createSimpleTool({
  id: "calculus/numerical-derivative",
  title: "Numerical Derivative",
  description:
    "Approximate first and second derivatives of a polynomial via central finite differences.",
  inputs: [
    {
      description:
        "Polynomial coefficients where index i holds the coefficient of x^i.",
      id: "coefficients",
      kind: "numberList",
      label: "Coefficients",
    },
    {
      description: "Evaluation point of the derivatives.",
      id: "x",
      kind: "number",
      label: "Point",
    },
    {
      description:
        "Finite-difference step; positive powers of two (e.g. 0.0078125) avoid representation error.",
      default: 0.00001,
      id: "h",
      kind: "number",
      label: "Step size",
    },
  ],
  outputs: [
    {
      description: "Central-difference estimate of f'(x).",
      id: "derivative",
      kind: "number",
      label: "derivative",
    },
    {
      description: "Central second-difference estimate of f''(x).",
      id: "secondDerivative",
      kind: "number",
      label: "secondDerivative",
    },
  ],
  calculate: (input) =>
    calculateNumericalDerivative({
      coefficients: input.coefficients as readonly number[],
      h: input.h as number,
      x: input.x as number,
    }),
});

export const runNumericalDerivative = numericalDerivativeTool.execute;
export default numericalDerivativeTool;
