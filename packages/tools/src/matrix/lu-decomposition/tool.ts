import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LuDecompositionInput = {
  readonly matrix: readonly (readonly number[])[];
};

export type LuDecompositionOutput = {
  readonly lower: readonly (readonly number[])[];
  readonly upper: readonly (readonly number[])[];
  readonly permutation: readonly number[];
};

export const calculateLuDecomposition = (
  input: LuDecompositionInput,
): LuDecompositionOutput => {
  const size = input.matrix.length;
  if (size === 0 || input.matrix.some((row) => row.length !== size))
    return simpleError(
      "matrix",
      "Provide a non-empty square matrix.",
      "not_square_matrix",
    );
  const a = input.matrix.map((row) => [...row]);
  const permutation = Array.from({ length: size }, (_, i) => i);
  const multipliers = input.matrix.map(() => new Array(size).fill(0));
  for (let col = 0; col < size; col += 1) {
    let pivotRow = col;
    for (let row = col + 1; row < size; row += 1)
      if (Math.abs(a[row]![col]!) > Math.abs(a[pivotRow]![col]!))
        pivotRow = row;
    if (pivotRow !== col) {
      const moved = a[pivotRow]!;
      a[pivotRow] = a[col]!;
      a[col] = moved;
      const movedMultipliers = multipliers[pivotRow]!;
      multipliers[pivotRow] = multipliers[col]!;
      multipliers[col] = movedMultipliers;
      const movedIndex = permutation[pivotRow]!;
      permutation[pivotRow] = permutation[col]!;
      permutation[col] = movedIndex;
    }
    const pivot = a[col]![col]!;
    if (pivot === 0) continue;
    for (let row = col + 1; row < size; row += 1) {
      const factor = a[row]![col]! / pivot;
      multipliers[row]![col] = factor;
      a[row]![col] = 0;
      for (let k = col + 1; k < size; k += 1)
        a[row]![k] -= factor * a[col]![k]!;
    }
  }
  const round12 = (value: number): number => Number(value.toPrecision(12));
  return {
    lower: multipliers.map((row, i) =>
      row.map((value, j) => (i === j ? 1 : round12(value))),
    ),
    upper: a.map((row) => row.map(round12)),
    permutation,
  };
};

export const luDecompositionExample = {
  input: {
    matrix: [
      [2, 1, 1],
      [4, 3, 3],
      [8, 7, 9],
    ],
  },
  output: {
    lower: [
      [1, 0, 0],
      [0.25, 1, 0],
      [0.5, 0.666666666667, 1],
    ],
    upper: [
      [8, 7, 9],
      [0, -0.75, -1.25],
      [0, 0, -0.666666666667],
    ],
    permutation: [2, 0, 1],
  },
} satisfies ToolExample<LuDecompositionInput, LuDecompositionOutput>;

export const luDecompositionTool = createSimpleTool({
  id: "matrix/lu-decomposition",
  title: "LU Decomposition Calculator",
  description:
    "Factor a square matrix as P·A = L·U using Doolittle elimination with partial pivoting.",
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
      description: "Unit lower-triangular factor.",
      id: "lower",
      kind: "matrix",
      label: "L",
    },
    {
      description: "Upper-triangular factor.",
      id: "upper",
      kind: "matrix",
      label: "U",
    },
    {
      description:
        "Original row indices in pivoted order, so that P·A equals L·U.",
      id: "permutation",
      kind: "numberList",
      label: "Permutation",
    },
  ],
  calculate: (input) =>
    calculateLuDecomposition({
      matrix: input.matrix as readonly (readonly number[])[],
    }),
});

export const runLuDecomposition = luDecompositionTool.execute;
export default luDecompositionTool;
