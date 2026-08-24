import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RankInput = {
  readonly matrix: readonly (readonly number[])[];
};

export type RankOutput = {
  readonly rank: number;
};

export const calculateRank = (input: RankInput): RankOutput => {
  if (
    input.matrix.length === 0 ||
    input.matrix.some(
      (row) => row.length === 0 || row.length !== input.matrix[0]!.length,
    )
  )
    return simpleError(
      "matrix",
      "Provide a non-empty matrix with consistent row lengths.",
      "invalid_matrix",
    );
  const rowCount = input.matrix.length;
  const columnCount = input.matrix[0]!.length;
  const a = input.matrix.map((row) => [...row]);
  let rowCursor = 0;
  let rank = 0;
  for (let col = 0; col < columnCount && rowCursor < rowCount; col += 1) {
    let best = rowCursor;
    for (let row = rowCursor + 1; row < rowCount; row += 1)
      if (Math.abs(a[row]![col]!) > Math.abs(a[best]![col]!)) best = row;
    if (Math.abs(a[best]![col]!) <= 1e-10) continue;
    if (best !== rowCursor) {
      const moved = a[best]!;
      a[best] = a[rowCursor]!;
      a[rowCursor] = moved;
    }
    for (let row = rowCursor + 1; row < rowCount; row += 1) {
      const factor = a[row]![col]! / a[rowCursor]![col]!;
      for (let k = col; k < columnCount; k += 1)
        a[row]![k] -= factor * a[rowCursor]![k]!;
    }
    rowCursor += 1;
    rank += 1;
  }
  return { rank };
};

export const rankExample = {
  input: {
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  },
  output: {
    rank: 2,
  },
} satisfies ToolExample<RankInput, RankOutput>;

export const rankTool = createSimpleTool({
  id: "matrix/rank",
  title: "Matrix Rank Calculator",
  description:
    "Count the pivots surviving Gaussian elimination with partial pivoting and a 1e-10 tolerance.",
  inputs: [
    {
      description:
        "A non-empty rectangular matrix with consistent row lengths.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
    },
  ],
  outputs: [
    {
      description: "Number of linearly independent rows.",
      id: "rank",
      kind: "integer",
      label: "Rank",
    },
  ],
  calculate: (input) =>
    calculateRank({ matrix: input.matrix as readonly (readonly number[])[] }),
});

export const runRank = rankTool.execute;
export default rankTool;
