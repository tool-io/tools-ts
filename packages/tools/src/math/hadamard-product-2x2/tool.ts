import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  shape,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualFirstMatrix: readonly (readonly number[])[];
  readonly actualSecondMatrix: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFirstMatrix", label: "Actual first matrix", kind: "matrix" },
  { id: "actualSecondMatrix", label: "Actual second matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [input.actualFirstMatrix, input.actualSecondMatrix].forEach((a) => {
    if (shape(a, "matrix") !== 2 || a.length !== 2)
      simpleError("matrix", "Twoactual2×2matrices.");
  });
  return {
    hadamardProduct: input.actualFirstMatrix.map((r, i) =>
      r.map((v, j) => v * input.actualSecondMatrix[i][j]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFirstMatrix: [
      [1, 2],
      [3, 4],
    ],
    actualSecondMatrix: [
      [2, 2],
      [2, 2],
    ],
  },
  output: {
    result: {
      hadamardProduct: [
        [2, 4],
        [6, 8],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/hadamard-product-2x2",
  title: "2x2 Hadamard Product Calculator",
  description:
    "Actual2\u00d72Hadamard element wise product AijBij, not linear algebra matrix multiplication or Kronecker product.",
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
