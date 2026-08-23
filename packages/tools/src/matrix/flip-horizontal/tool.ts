import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlipHorizontalInput = {
  readonly matrix: (readonly number[])[];
};

export type FlipHorizontalOutput = {
  readonly flipped: (readonly number[])[];
};

export const calculateFlipHorizontal = (
  input: FlipHorizontalInput,
): FlipHorizontalOutput => {
  const matrix = input.matrix;
  if (
    !matrix.length ||
    !matrix[0].length ||
    matrix.some((row) => row.length !== matrix[0].length)
  )
    return simpleError(
      "matrix",
      "Matrix must be non-empty and rectangular.",
      "invalid_matrix",
    );
  return { flipped: matrix.map((row) => [...row].reverse()) };
};

export const flipHorizontalExample = {
  input: {
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },
  output: {
    flipped: [
      [3, 2, 1],
      [6, 5, 4],
    ],
  },
} satisfies ToolExample<FlipHorizontalInput, FlipHorizontalOutput>;

export const flipHorizontalTool = createSimpleTool({
  id: "matrix/flip-horizontal",
  title: "Horizontal Matrix Flip",
  description:
    "Mirror a matrix along its vertical axis by reversing the elements of every row.",
  inputs: [
    {
      description: "Non-empty rectangular matrix.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
      format: "matrix",
    },
  ],
  outputs: [
    {
      description: "Matrix with each row reversed.",
      id: "flipped",
      kind: "matrix",
      label: "Flipped matrix",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculateFlipHorizontal({
      matrix: input.matrix as readonly (readonly number[])[],
    }),
});

export const runFlipHorizontal = flipHorizontalTool.execute;
export default flipHorizontalTool;
