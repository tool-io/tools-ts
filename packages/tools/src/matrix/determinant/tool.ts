import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeterminantInput = {
  readonly matrix: readonly (readonly number[])[];
};

export type DeterminantOutput = {
  readonly determinant: number;
};

export const calculateDeterminant = (
  input: DeterminantInput,
): DeterminantOutput => {
  const size = input.matrix.length;
  if (size === 0 || input.matrix.some((row) => row.length !== size))
    return simpleError(
      "matrix",
      "Provide a non-empty square matrix.",
      "not_square_matrix",
    );
  const a = input.matrix.map((row) => [...row]);
  let determinant = 1;
  for (let col = 0; col < size; col += 1) {
    let pivotRow = col;
    for (let row = col + 1; row < size; row += 1)
      if (Math.abs(a[row]![col]!) > Math.abs(a[pivotRow]![col]!))
        pivotRow = row;
    const pivot = a[pivotRow]![col]!;
    if (pivot === 0) return { determinant: 0 };
    if (pivotRow !== col) {
      const moved = a[pivotRow]!;
      a[pivotRow] = a[col]!;
      a[col] = moved;
      determinant = -determinant;
    }
    determinant *= pivot;
    for (let row = col + 1; row < size; row += 1) {
      const factor = a[row]![col]! / pivot;
      for (let k = col + 1; k < size; k += 1)
        a[row]![k] -= factor * a[col]![k]!;
      a[row]![col] = 0;
    }
  }
  return { determinant: Number(determinant.toPrecision(12)) };
};

export const determinantExample = {
  input: {
    matrix: [
      [6, 1, 1],
      [4, -2, 5],
      [2, 8, 7],
    ],
  },
  output: {
    determinant: -306,
  },
} satisfies ToolExample<DeterminantInput, DeterminantOutput>;

export const determinantTool = createSimpleTool({
  id: "matrix/determinant",
  title: "Matrix Determinant Calculator",
  description:
    "Compute the determinant of a square matrix by Gaussian elimination with partial pivoting.",
  inputs: [
    {
      description: "A non-empty square matrix.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
    },
  ],
  outputs: [
    {
      description:
        "Product of the pivots with the row-swap sign; zero for singular matrices.",
      id: "determinant",
      kind: "number",
      label: "Determinant",
    },
  ],
  calculate: (input) =>
    calculateDeterminant({
      matrix: input.matrix as readonly (readonly number[])[],
    }),
});

export const runDeterminant = determinantTool.execute;
export default determinantTool;
