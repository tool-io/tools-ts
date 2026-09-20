import type { GeneratorRandom } from "./generator-random.js";
import { simpleError } from "../core/simple.js";
import { calculateDeterminant } from "../matrix/determinant/tool.js";
import { runScalarMultiply } from "../matrix/scalar-multiply/tool.js";
import { core, safe, finite } from "./m500b-charts-math-graphs-support.js";
export type RowOperationKind = "swap" | "scale" | "add";
export type RowOperation = {
  readonly kind: RowOperationKind;
  readonly row: number;
  readonly other: number;
  readonly factor: number;
};
export const validateSmallSquare = (
  matrix: readonly (readonly number[])[],
): void => {
  if (matrix.some((row) => row.length !== matrix.length))
    simpleError("matrix", "The matrix must be square.", "shape_mismatch");
};
export const determinant = (matrix: readonly (readonly number[])[]): number =>
  finite(calculateDeterminant({ matrix }).determinant, "matrix");
/** Exact safe-integer elementary operations, with legacy determinant rounding only. */
export const rowTransition = (
  matrix: readonly (readonly number[])[],
  kinds: readonly RowOperationKind[],
  random: GeneratorRandom,
): { operation: RowOperation; matrix: number[][]; multiplier: number } => {
  const kind = random.pick(kinds),
    row = random.integer(0, matrix.length - 1),
    other = (row + 1 + random.integer(0, matrix.length - 2)) % matrix.length,
    factor = kind === "swap" ? -1 : random.pick([-2, -1, 1, 2]);
  const next = matrix.map((r) => [...r]);
  if (kind === "swap") {
    const held = next[row];
    next[row] = next[other];
    next[other] = held;
  } else if (kind === "scale") {
    for (const value of next[row]) safe(value * factor, "matrix");
    next[row] = core(
      runScalarMultiply({ matrix: [next[row]], scalar: factor }),
    ).matrix[0].map((v) => safe(v, "matrix"));
  } else
    next[row] = next[row].map((v, j) =>
      safe(v + safe(factor * next[other][j], "matrix"), "matrix"),
    );
  return {
    operation: { kind, row, other, factor },
    matrix: next,
    multiplier: kind === "add" ? 1 : factor,
  };
};
