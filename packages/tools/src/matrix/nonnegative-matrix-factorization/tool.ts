import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NmfResult = {
  readonly approximation: readonly (readonly number[])[];
  readonly basis: readonly (readonly number[])[];
  readonly coefficients: readonly (readonly number[])[];
  readonly error: number;
};
const multiply = (
  left: readonly (readonly number[])[],
  right: readonly (readonly number[])[],
) =>
  left.map((row) =>
    right[0]!.map((_, column) =>
      row.reduce(
        (sum, value, index) => sum + value * right[index]![column]!,
        0,
      ),
    ),
  );
const transpose = (matrix: readonly (readonly number[])[]) =>
  matrix[0]!.map((_, column) => matrix.map((row) => row[column]!));
const roundMatrix = (matrix: readonly (readonly number[])[]) =>
  matrix.map((row) => row.map((value) => Number(value.toPrecision(10))));
export const factorNonnegativeMatrix = (
  matrix: readonly (readonly number[])[],
  rank: number,
  iterations: number,
): NmfResult | null => {
  const rows = matrix.length,
    columns = matrix[0]?.length ?? 0;
  if (
    !rows ||
    !columns ||
    rank > Math.min(rows, columns) ||
    matrix.some(
      (row) => row.length !== columns || row.some((value) => value < 0),
    )
  )
    return null;
  let basis = Array.from({ length: rows }, (_, row) =>
    Array.from(
      { length: rank },
      (_, component) => 0.5 + ((row + component + 1) % 5) / 10,
    ),
  );
  let coefficients = Array.from({ length: rank }, (_, component) =>
    Array.from(
      { length: columns },
      (_, column) => 0.5 + ((component * 2 + column + 1) % 5) / 10,
    ),
  );
  const epsilon = 1e-12;
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const numeratorH = multiply(transpose(basis), matrix),
      denominatorH = multiply(multiply(transpose(basis), basis), coefficients);
    coefficients = coefficients.map((row, i) =>
      row.map(
        (value, j) =>
          (value * numeratorH[i]![j]!) /
          Math.max(denominatorH[i]![j]!, epsilon),
      ),
    );
    const numeratorW = multiply(matrix, transpose(coefficients)),
      denominatorW = multiply(
        multiply(basis, coefficients),
        transpose(coefficients),
      );
    basis = basis.map((row, i) =>
      row.map(
        (value, j) =>
          (value * numeratorW[i]![j]!) /
          Math.max(denominatorW[i]![j]!, epsilon),
      ),
    );
  }
  const approximation = multiply(basis, coefficients),
    error = Math.sqrt(
      matrix.reduce(
        (sum, row, i) =>
          sum +
          row.reduce(
            (inner, value, j) => inner + (value - approximation[i]![j]!) ** 2,
            0,
          ),
        0,
      ),
    );
  return {
    approximation: roundMatrix(approximation),
    basis: roundMatrix(basis),
    coefficients: roundMatrix(coefficients),
    error: Number(error.toPrecision(10)),
  };
};
export const nonnegativeMatrixFactorizationExample = {
  input: {
    iterations: 2,
    matrix: [
      [1, 2],
      [3, 4],
    ],
    rank: 1,
  },
  output: {
    result: {
      approximation: [
        [1.273427899, 1.807347066],
        [2.878602551, 4.085534705],
      ],
      basis: [[0.3893300581], [0.8800863397]],
      coefficients: [[3.270818352, 4.642197613]],
      error: 0.3659665219,
    },
  },
} satisfies ToolExample<
  {
    readonly iterations: number;
    readonly matrix: readonly (readonly number[])[];
    readonly rank: number;
  },
  { readonly result: NmfResult }
>;
export const nonnegativeMatrixFactorizationTool = createSimpleTool({
  id: "matrix/nonnegative-matrix-factorization",
  title: "Nonnegative Matrix Factorization Demonstrator",
  description:
    "Approximate a nonnegative matrix with lower-rank nonnegative factors using multiplicative updates.",
  inputs: [
    {
      format: "matrix/nonnegative",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
    },
    { id: "rank", kind: "integer", label: "Rank", maximum: 100, minimum: 1 },
    {
      id: "iterations",
      kind: "integer",
      label: "Iterations",
      maximum: 10_000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "matrix/factorization",
      id: "result",
      kind: "object",
      label: "Factorization",
    },
  ],
  calculate: (input) => {
    const result = factorNonnegativeMatrix(
      input.matrix as number[][],
      input.rank as number,
      input.iterations as number,
    );
    if (!result)
      return simpleError(
        "matrix",
        "Enter a rectangular nonnegative matrix and a feasible rank.",
      );
    return { result };
  },
});
export const runNonnegativeMatrixFactorization =
  nonnegativeMatrixFactorizationTool.execute;
export default nonnegativeMatrixFactorizationTool;
