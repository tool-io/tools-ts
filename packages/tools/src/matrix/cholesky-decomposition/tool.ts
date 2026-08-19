import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CholeskyDecompositionInput = {
  readonly matrix: readonly (readonly number[])[];
  readonly tolerance?: number;
};

export type CholeskyDecompositionOutput = {
  readonly lower: number[][];
};

export const choleskyDecompositionExample = {
  input: {
    matrix: [
      [4, 12, -16],
      [12, 37, -43],
      [-16, -43, 98],
    ],
  },
  output: {
    lower: [
      [2, 0, 0],
      [6, 1, 0],
      [-8, 5, 3],
    ],
  },
} satisfies ToolExample<
  CholeskyDecompositionInput,
  CholeskyDecompositionOutput
>;

export const calculateCholeskyDecomposition = (
  input: CholeskyDecompositionInput,
): CholeskyDecompositionOutput => {
  const matrix = input.matrix as readonly (readonly number[])[];
  const size = matrix.length;
  if (
    size === 0 ||
    matrix.some((row) => row.length !== size)
  )
    simpleError(
      "matrix",
      "The matrix must be a non-empty square matrix.",
      "not_square",
    );
  const tolerance = input.tolerance ?? 1e-12;
  for (let row = 0; row < size; row += 1)
    for (let column = row + 1; column < size; column += 1)
      if (
        Math.abs(matrix[row]![column]! - matrix[column]![row]!) > tolerance
      )
        simpleError(
          "matrix",
          "The matrix must be symmetric within the tolerance.",
          "not_symmetric",
        );
  const lower: number[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0),
  );
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      let sum = 0;
      for (let k = 0; k < column; k += 1)
        sum += lower[row]![k]! * lower[column]![k]!;
      if (row === column) {
        const diagonal = matrix[row]![row]! - sum;
        if (!(diagonal > 0))
          simpleError(
            "matrix",
            "The matrix must be positive definite.",
            "not_positive_definite",
          );
        lower[row]![column] = Math.sqrt(diagonal);
      } else {
        lower[row]![column] =
          (matrix[row]![column]! - sum) / lower[column]![column]!;
      }
    }
  }
  return { lower };
};

export const choleskyDecompositionTool = createSimpleTool({
  calculate: (input) =>
    calculateCholeskyDecomposition(
      input as unknown as CholeskyDecompositionInput,
    ),
  description:
    "Factor a symmetric positive-definite matrix into a lower-triangular L where L times its transpose equals the input.",
  id: "matrix/cholesky-decomposition",
  inputs: [
    {
      description: "Symmetric positive-definite square matrix.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
    },
    {
      default: 1e-12,
      description:
        "Maximum allowed absolute asymmetry between mirrored entries.",
      id: "tolerance",
      kind: "number",
      label: "Symmetry tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Lower-triangular factor satisfying L times L transpose.",
      id: "lower",
      kind: "matrix",
      label: "Lower-triangular matrix",
    },
  ],
  title: "Cholesky Decomposition Calculator",
});
export const runCholeskyDecomposition = choleskyDecompositionTool.execute;
export default choleskyDecompositionTool;
