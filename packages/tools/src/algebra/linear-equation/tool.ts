import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LinearEquationInput = {
  readonly a1: number;
  readonly b1: number;
  readonly c1: number;
  readonly a2: number;
  readonly b2: number;
  readonly c2: number;
};

export type LinearEquationOutput = {
  readonly x: number;
  readonly y: number;
  readonly determinant: number;
};

export const calculateLinearEquation = (
  input: LinearEquationInput,
): LinearEquationOutput => {
  const determinant = input.a1 * input.b2 - input.a2 * input.b1;
  if (determinant === 0)
    return simpleError(
      "a1",
      "The system is singular (zero determinant) and has no unique solution.",
      "singular_system",
    );
  if (!Number.isFinite(determinant))
    return simpleError(
      "determinant",
      "The determinant is outside the finite numeric range.",
      "result_not_finite",
    );
  const x = (input.c1 * input.b2 - input.c2 * input.b1) / determinant;
  const y = (input.a1 * input.c2 - input.a2 * input.c1) / determinant;
  if (!Number.isFinite(x) || !Number.isFinite(y))
    return simpleError(
      !Number.isFinite(x) ? "x" : "y",
      "The solution is outside the finite numeric range.",
      "result_not_finite",
    );
  return { determinant, x, y };
};

export const linearEquationExample = {
  input: {
    a1: 1,
    a2: 1,
    b1: 1,
    b2: -1,
    c1: 3,
    c2: 1,
  },
  output: {
    determinant: -2,
    x: 2,
    y: 1,
  },
} satisfies ToolExample<LinearEquationInput, LinearEquationOutput>;

export const linearEquationTool = createSimpleTool({
  id: "algebra/linear-equation",
  title: "Linear Equation System Solver",
  description:
    "Solve a system of two linear equations in two unknowns with Cramer's rule.",
  inputs: [
    {
      description: "Coefficient of x in the first equation.",
      id: "a1",
      kind: "number",
      label: "a1",
    },
    {
      description: "Coefficient of y in the first equation.",
      id: "b1",
      kind: "number",
      label: "b1",
    },
    {
      description: "Right-hand side of the first equation.",
      id: "c1",
      kind: "number",
      label: "c1",
    },
    {
      description: "Coefficient of x in the second equation.",
      id: "a2",
      kind: "number",
      label: "a2",
    },
    {
      description: "Coefficient of y in the second equation.",
      id: "b2",
      kind: "number",
      label: "b2",
    },
    {
      description: "Right-hand side of the second equation.",
      id: "c2",
      kind: "number",
      label: "c2",
    },
  ],
  outputs: [
    { description: "Solution for x.", id: "x", kind: "number", label: "x" },
    { description: "Solution for y.", id: "y", kind: "number", label: "y" },
    {
      description: "Determinant a1*b2 - a2*b1 of the coefficient matrix.",
      id: "determinant",
      kind: "number",
      label: "Determinant",
    },
  ],
  calculate: (input) => calculateLinearEquation(input as LinearEquationInput),
});

export const runLinearEquation = linearEquationTool.execute;
export default linearEquationTool;
