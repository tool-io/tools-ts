import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MultiplyInput = {
  readonly first: readonly (readonly number[])[];
  readonly second: readonly (readonly number[])[];
};

export type MultiplyOutput = {
  readonly product: readonly (readonly number[])[];
};

export const calculateMultiply = (input: MultiplyInput): MultiplyOutput => {
  const first = input.first;
  const second = input.second;
  if (!first.length || !first[0].length || !second.length || !second[0].length)
    return simpleError(
      "first",
      "Matrices must be non-empty.",
      "invalid_matrix",
    );
  const columns = first[0].length;
  if (
    first.some((row) => row.length !== columns) ||
    second.some((row) => row.length !== second[0].length)
  )
    return simpleError(
      "second",
      "Matrices must be rectangular.",
      "invalid_matrix",
    );
  if (columns !== second.length)
    return simpleError(
      "second",
      "first.columns must equal second.rows.",
      "shape_mismatch",
    );
  return {
    product: first.map((row) =>
      second[0].map((_, column) =>
        row.reduce((sum, value, k) => sum + value * second[k][column], 0),
      ),
    ),
  };
};

export const multiplyExample = {
  input: {
    first: [
      [1, 2],
      [3, 4],
    ],
    second: [
      [5, 6],
      [7, 8],
    ],
  },
  output: {
    product: [
      [19, 22],
      [43, 50],
    ],
  },
} satisfies ToolExample<MultiplyInput, MultiplyOutput>;

export const multiplyTool = createSimpleTool({
  id: "matrix/multiply",
  title: "Matrix Multiplication",
  description:
    "Multiply two compatible matrices using the standard row-by-column dot products.",
  inputs: [
    {
      description: "Left factor with shape m x k.",
      id: "first",
      kind: "matrix",
      label: "First matrix",
      format: "matrix",
    },
    {
      description: "Right factor with shape k x n.",
      id: "second",
      kind: "matrix",
      label: "Second matrix",
      format: "matrix",
    },
  ],
  outputs: [
    {
      description: "Matrix product with shape m x n.",
      id: "product",
      kind: "matrix",
      label: "Product",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculateMultiply({
      first: input.first as readonly (readonly number[])[],
      second: input.second as readonly (readonly number[])[],
    }),
});

export const runMultiply = multiplyTool.execute;
export default multiplyTool;
