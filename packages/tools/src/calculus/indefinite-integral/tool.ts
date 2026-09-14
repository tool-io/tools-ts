import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import {
  assertConstantMathDomains,
  parseMathExpression,
  validateMathVariable,
} from "../../math/expression-evaluator/parser.js";
import { renderMathExpression } from "../../math/expression-evaluator/symbolic.js";
import { integrateMathExpression } from "./integrate.js";

export type IndefiniteIntegralInput = {
  readonly expression: string;
  readonly variable?: string;
};
export type IndefiniteIntegralOutput = {
  readonly antiderivative: string;
  readonly integral: string;
};
export const calculateIndefiniteIntegral = (
  input: IndefiniteIntegralInput,
): IndefiniteIntegralOutput => {
  const tree = parseMathExpression(input.expression, true);
  assertConstantMathDomains(tree);
  const antiderivative = renderMathExpression(
    integrateMathExpression(tree, validateMathVariable(input.variable ?? "x")),
  );
  return { antiderivative, integral: `${antiderivative} + C` };
};
export const indefiniteIntegralExample = {
  input: { expression: "x^2", variable: "x" },
  output: { antiderivative: "(x ^ 3) / 3", integral: "(x ^ 3) / 3 + C" },
} satisfies ToolExample<IndefiniteIntegralInput, IndefiniteIntegralOutput>;
export const indefiniteIntegralTool = createSimpleTool({
  id: "calculus/indefinite-integral",
  title: "Indefinite Integral Calculator",
  description:
    "Find a symbolic antiderivative for sums, monomials, constant factors and supported elementary functions of linear expressions, with a constant of integration.",
  inputs: [
    {
      id: "expression",
      kind: "string",
      label: "Expression",
      description:
        "Explicit multiplication, e.g. x^2, 1/x or sin(2*x+1); unmatched integration rules return a structured error.",
    },
    {
      id: "variable",
      kind: "string",
      label: "Variable",
      default: "x",
      description:
        "Case-sensitive integration variable; other symbols are constant parameters.",
    },
  ],
  outputs: [
    {
      id: "antiderivative",
      kind: "string",
      label: "Antiderivative",
      description:
        "One elementary primitive, valid on connected real domains where the original expression is defined; no arbitrary constant included.",
    },
    {
      id: "integral",
      kind: "string",
      label: "Indefinite integral",
      description:
        "Antiderivative with + C; C denotes an arbitrary constant independently of input symbol names.",
    },
  ],
  calculate: (input) =>
    calculateIndefiniteIntegral({
      expression: input.expression as string,
      variable: input.variable as string,
    }),
});
export const runIndefiniteIntegral = indefiniteIntegralTool.execute;
export default indefiniteIntegralTool;
