import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import {
  assertConstantMathDomains,
  parseMathExpression,
  validateMathVariable,
} from "../../math/expression-evaluator/parser.js";
import {
  differentiateMathExpression,
  renderMathExpression,
} from "../../math/expression-evaluator/symbolic.js";

export type SymbolicDerivativeInput = {
  readonly expression: string;
  readonly variable?: string;
};
export type SymbolicDerivativeOutput = { readonly derivative: string };
export const calculateSymbolicDerivative = (
  input: SymbolicDerivativeInput,
): SymbolicDerivativeOutput => {
  const tree = parseMathExpression(input.expression, true);
  assertConstantMathDomains(tree);
  return {
    derivative: renderMathExpression(
      differentiateMathExpression(
        tree,
        validateMathVariable(input.variable ?? "x"),
      ),
    ),
  };
};
export const symbolicDerivativeExample = {
  input: { expression: "x+p", variable: "p" },
  output: { derivative: "1" },
} satisfies ToolExample<SymbolicDerivativeInput, SymbolicDerivativeOutput>;
export const symbolicDerivativeTool = createSimpleTool({
  id: "calculus/symbolic-derivative",
  title: "Symbolic Derivative",
  description:
    "Differentiate real arithmetic and supported elementary functions with product, quotient, power and chain rules where differentiable; other symbols are held constant.",
  inputs: [
    {
      id: "expression",
      kind: "string",
      label: "Expression",
      description:
        "Expression with explicit multiplication, e.g. x+p or sin(x^2). Piecewise functions and remainder are unsupported.",
    },
    {
      id: "variable",
      kind: "string",
      label: "Variable",
      default: "x",
      description:
        "Case-sensitive differentiation variable; pi, e and tau are reserved constants.",
    },
  ],
  outputs: [
    {
      id: "derivative",
      kind: "string",
      label: "Derivative",
      description:
        "Equivalent derivative expression where defined; general variable powers assume a positive real base.",
    },
  ],
  calculate: (input) =>
    calculateSymbolicDerivative({
      expression: input.expression as string,
      variable: input.variable as string,
    }),
});
export const runSymbolicDerivative = symbolicDerivativeTool.execute;
export default symbolicDerivativeTool;
