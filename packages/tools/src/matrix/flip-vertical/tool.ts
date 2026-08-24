import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlipVerticalInput = {
  readonly matrix: readonly (readonly number[])[];
};

export type FlipVerticalOutput = {
  readonly flipped: readonly (readonly number[])[];
};

export const calculateFlipVertical = (
  input: FlipVerticalInput,
): FlipVerticalOutput => {
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
  return { flipped: [...matrix].reverse() };
};

export const flipVerticalExample = {
  input: {
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },
  output: {
    flipped: [
      [4, 5, 6],
      [1, 2, 3],
    ],
  },
} satisfies ToolExample<FlipVerticalInput, FlipVerticalOutput>;

export const flipVerticalTool = createSimpleTool({
  id: "matrix/flip-vertical",
  title: "Vertical Matrix Flip",
  description:
    "Mirror a matrix along its horizontal axis by reversing the order of its rows.",
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
      description: "Matrix with rows in reversed order.",
      id: "flipped",
      kind: "matrix",
      label: "Flipped matrix",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculateFlipVertical({
      matrix: input.matrix as readonly (readonly number[])[],
    }),
});

export const runFlipVertical = flipVerticalTool.execute;
export default flipVerticalTool;
