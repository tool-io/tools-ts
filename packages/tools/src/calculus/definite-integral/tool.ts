import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import {
  evaluateMathExpression,
  finiteMathValue,
  parseMathExpression,
  validateMathVariable,
} from "../../math/expression-evaluator/parser.js";
import { calculateSimpsonIntegration } from "../simpson-integration/tool.js";

export type DefiniteIntegralInput = {
  readonly expression: string;
  readonly variable?: string;
  readonly lowerBound: number;
  readonly upperBound: number;
};
export type DefiniteIntegralOutput = {
  readonly integral: number;
  readonly estimatedError: number;
  readonly method: string;
};

export const calculateDefiniteIntegral = (
  input: DefiniteIntegralInput,
): DefiniteIntegralOutput => {
  const tree = parseMathExpression(input.expression, true);
  const variable = validateMathVariable(input.variable ?? "x");
  finiteMathValue(input.lowerBound);
  finiteMathValue(input.upperBound);
  // Validate symbols/domain even for equal bounds.
  evaluateMathExpression(tree, { [variable]: input.lowerBound });
  if (input.lowerBound === input.upperBound)
    return { integral: 0, estimatedError: 0, method: "composite-simpson-256" };
  const xMin = Math.min(input.lowerBound, input.upperBound);
  const xMax = Math.max(input.lowerBound, input.upperBound);
  const span = finiteMathValue(xMax - xMin);
  const values = Array.from({ length: 257 }, (_, index) =>
    evaluateMathExpression(tree, {
      [variable]: index === 256 ? xMax : xMin + span * (index / 256),
    }),
  );
  const fine = calculateSimpsonIntegration({ values, xMin, xMax }).integral;
  const coarse = calculateSimpsonIntegration({
    values: values.filter((_, index) => index % 2 === 0),
    xMin,
    xMax,
  }).integral;
  return {
    integral: input.upperBound < input.lowerBound ? -fine : fine,
    estimatedError: finiteMathValue(Math.abs(fine - coarse) / 15),
    method: "composite-simpson-256",
  };
};
export const definiteIntegralExample = {
  input: { expression: "x^2", variable: "x", lowerBound: 0, upperBound: 3 },
  output: { integral: 9, estimatedError: 0, method: "composite-simpson-256" },
} satisfies ToolExample<DefiniteIntegralInput, DefiniteIntegralOutput>;
export const definiteIntegralTool = createSimpleTool({
  id: "calculus/definite-integral",
  title: "Definite Integral Calculator",
  description:
    "Approximate a finite real expression integral with 256-panel composite Simpson quadrature; the refinement error estimate assumes a smooth integrand and is not a certified bound or improper integral solver.",
  inputs: [
    {
      id: "expression",
      kind: "string",
      label: "Expression",
      description:
        "Real expression with explicit multiplication and one free variable, e.g. x^2 or sin(x).",
    },
    {
      id: "variable",
      kind: "string",
      label: "Variable",
      default: "x",
      description:
        "Case-sensitive integration variable; other unbound symbols are rejected.",
    },
    { id: "lowerBound", kind: "number", label: "Lower bound" },
    { id: "upperBound", kind: "number", label: "Upper bound" },
  ],
  outputs: [
    { id: "integral", kind: "number", label: "Approximate integral" },
    {
      id: "estimatedError",
      kind: "number",
      label: "Refinement error estimate",
      description:
        "Absolute difference of 256- and 128-panel results divided by 15; heuristic under smoothness assumptions, not a guaranteed bound.",
    },
    { id: "method", kind: "string", label: "Quadrature method" },
  ],
  calculate: (input) =>
    calculateDefiniteIntegral({
      expression: input.expression as string,
      variable: input.variable as string,
      lowerBound: input.lowerBound as number,
      upperBound: input.upperBound as number,
    }),
});
export const runDefiniteIntegral = definiteIntegralTool.execute;
export default definiteIntegralTool;
