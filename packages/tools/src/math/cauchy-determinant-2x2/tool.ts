import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, cauchy } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualXNodes: readonly number[];
  readonly actualYNodes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualXNodes", label: "Actual x nodes", kind: "numberList" },
  { id: "actualYNodes", label: "Actual y nodes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { determinant: cauchy(input.actualXNodes, input.actualYNodes) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualXNodes: [1, 2], actualYNodes: [3, 4] },
  output: { result: { determinant: 0.0016666666666666668 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cauchy-determinant-2x2",
  title: "Cauchy Determinant 2x2 Calculator",
  description:
    "Cauchy2\u00d72matrixAij=1/(xi+yj) determinant closed form including singular repeated nodes, nonzero denominators. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
