import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InverseInput = {
  readonly matrix: readonly (readonly number[])[];
};

export type InverseOutput = {
  readonly inverse: readonly (readonly number[])[];
};

export const calculateInverse = (input: InverseInput): InverseOutput => {
  const size = input.matrix.length;
  if (size === 0 || input.matrix.some((row) => row.length !== size))
    return simpleError(
      "matrix",
      "Provide a non-empty square matrix.",
      "not_square_matrix",
    );
  const a = input.matrix.map((row) => [...row]);
  const inverse = input.matrix.map((row, i) =>
    row.map((_, j) => (i === j ? 1 : 0)),
  );
  for (let col = 0; col < size; col += 1) {
    let pivotRow = col;
    for (let row = col + 1; row < size; row += 1)
      if (Math.abs(a[row]![col]!) > Math.abs(a[pivotRow]![col]!))
        pivotRow = row;
    const pivot = a[pivotRow]![col]!;
    if (pivot === 0)
      simpleError(
        "matrix",
        "The matrix is singular and cannot be inverted.",
        "singular_matrix",
      );
    if (pivotRow !== col) {
      const moved = a[pivotRow]!;
      a[pivotRow] = a[col]!;
      a[col] = moved;
      const movedInverse = inverse[pivotRow]!;
      inverse[pivotRow] = inverse[col]!;
      inverse[col] = movedInverse;
    }
    for (let k = 0; k < size; k += 1) {
      a[col]![k] /= pivot;
      inverse[col]![k] /= pivot;
    }
    for (let row = 0; row < size; row += 1) {
      if (row === col) continue;
      const factor = a[row]![col]!;
      if (factor === 0) continue;
      for (let k = 0; k < size; k += 1) {
        a[row]![k] -= factor * a[col]![k]!;
        inverse[row]![k] -= factor * inverse[col]![k]!;
      }
    }
  }
  return {
    inverse: inverse.map((row) =>
      row.map((entry) => Number(entry.toPrecision(12))),
    ),
  };
};

export const inverseExample = {
  input: {
    matrix: [
      [4, 7],
      [2, 6],
    ],
  },
  output: {
    inverse: [
      [0.6, -0.7],
      [-0.2, 0.4],
    ],
  },
} satisfies ToolExample<InverseInput, InverseOutput>;

export const inverseTool = createSimpleTool({
  id: "matrix/inverse",
  title: "Matrix Inverse Calculator",
  description:
    "Invert a square matrix with Gauss-Jordan elimination under partial pivoting.",
  inputs: [
    {
      description: "A non-empty invertible square matrix.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
    },
  ],
  outputs: [
    {
      description:
        "The inverse matrix; entries rounded to twelve significant digits.",
      id: "inverse",
      kind: "matrix",
      label: "Inverse",
    },
  ],
  calculate: (input) =>
    calculateInverse({
      matrix: input.matrix as readonly (readonly number[])[],
    }),
});

export const runInverse = inverseTool.execute;
export default inverseTool;
