import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, eigenvectors2 } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMatrix: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMatrix", label: "Actual matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return eigenvectors2(input.actualMatrix);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMatrix: [
      [2, 0],
      [0, 1],
    ],
  },
  output: {
    result: {
      realEigenvalues: [1, 2],
      unitEigenvectors: [
        [0, 1],
        [1, 0],
      ],
      repeatedEigenvalue: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/eigenvectors-2x2",
  title: "2x2 Eigenvectors Calculator",
  description:
    "Actual real2\u00d72real-eigenvalue branch, sorted eigenvalues, unit vectors with first nonzero entry positive; repeated eigenvalue flag and one representative eigenspace vector, not claim diagonalizability or complex vectors.",
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
