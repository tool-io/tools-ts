import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const transpose = (matrix: number[][]): number[][] =>
  matrix[0]!.map((_, column) => matrix.map((row) => row[column]!));
const dotColumn = (matrix: number[][], p: number, q: number): number =>
  matrix.reduce((sum, row) => sum + row[p]! * row[q]!, 0);
const thinTallSvd = (source: number[][]) => {
  const rows = source.length,
    columns = source[0]!.length;
  const work = source.map((row) => [...row]);
  const vectors = Array.from({ length: columns }, (_, i) =>
    Array.from({ length: columns }, (_, j) => Number(i === j)),
  );
  for (let sweep = 0; sweep < 100; sweep++) {
    let changed = false;
    for (let p = 0; p < columns; p++)
      for (let q = p + 1; q < columns; q++) {
        const a = dotColumn(work, p, p),
          b = dotColumn(work, q, q),
          cross = dotColumn(work, p, q);
        if (Math.abs(cross) <= 1e-14 * Math.sqrt(a * b) || cross === 0)
          continue;
        const zeta = (b - a) / (2 * cross);
        const t =
          (zeta >= 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
        const c = 1 / Math.sqrt(1 + t * t),
          s = c * t;
        for (const matrix of [work, vectors])
          for (const row of matrix) {
            const left = row[p]!,
              right = row[q]!;
            row[p] = c * left - s * right;
            row[q] = s * left + c * right;
          }
        changed = true;
      }
    if (!changed) break;
    if (sweep === 99)
      simpleError("matrix", "Jacobi SVD did not converge within 100 sweeps.");
  }
  const order = Array.from({ length: columns }, (_, i) => i).sort(
    (a, b) => dotColumn(work, b, b) - dotColumn(work, a, a),
  );
  const singularValues = order.map((i) => Math.sqrt(dotColumn(work, i, i)));
  const largest = singularValues[0] ?? 0;
  const uColumns: number[][] = [];
  for (let k = 0; k < columns; k++) {
    const index = order[k]!,
      sigma = singularValues[k]!;
    let column =
      sigma > Math.max(1e-14 * largest, Number.MIN_VALUE)
        ? work.map((row) => row[index]! / sigma)
        : [];
    if (!column.length) {
      for (let candidate = 0; candidate < rows; candidate++) {
        let basis = Array.from({ length: rows }, (_, r) =>
          Number(r === candidate),
        );
        for (const previous of uColumns) {
          const projection = basis.reduce(
            (sum, value, i) => sum + value * previous[i]!,
            0,
          );
          basis = basis.map((value, i) => value - projection * previous[i]!);
        }
        const norm = Math.hypot(...basis);
        if (norm > 1e-10) {
          column = basis.map((value) => value / norm);
          break;
        }
      }
      if (!column.length)
        simpleError("matrix", "Could not complete a singular-vector basis.");
    }
    uColumns.push(column);
  }
  const u = Array.from({ length: rows }, (_, i) =>
    uColumns.map((column) => column[i]!),
  );
  const vt = order.map((index) => vectors.map((row) => row[index]!));
  return { u, singularValues, vt };
};

export const singularValueDecomposition = (matrix: number[][]) => {
  if (
    !matrix.length ||
    !matrix[0]?.length ||
    matrix.length > 20 ||
    matrix[0].length > 20 ||
    matrix.some((row) => row.length !== matrix[0]!.length)
  )
    simpleError(
      "matrix",
      "Use a nonempty rectangular matrix of at most 20×20.",
    );
  if (matrix.length >= matrix[0]!.length) return thinTallSvd(matrix);
  const transposed = thinTallSvd(transpose(matrix));
  return {
    u: transpose(transposed.vt),
    singularValues: transposed.singularValues,
    vt: transpose(transposed.u),
  };
};

export const example = {
  input: {
    matrix: [
      [3, 0],
      [0, 4],
    ],
  },
  output: {
    u: [
      [0, 1],
      [1, 0],
    ],
    singularValues: [4, 3],
    vt: [
      [0, 1],
      [1, 0],
    ],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "matrix/singular-value-decomposition",
  title: "Singular Value Decomposition Calculator",
  description:
    "Compute a thin SVD A = UΣVᵀ for a real matrix up to 20×20 with one-sided Jacobi rotations. Singular values are sorted descending; numerical precision depends on matrix conditioning.",
  inputs: [{ id: "matrix", kind: "matrix", label: "Matrix" }],
  outputs: [
    { id: "u", kind: "matrix", label: "Left singular vectors" },
    { id: "singularValues", kind: "numberList", label: "Singular values" },
    { id: "vt", kind: "matrix", label: "Transposed right singular vectors" },
  ],
  calculate: (input) => singularValueDecomposition(input.matrix as number[][]),
});
export type SingularValueDecompositionInput = Readonly<typeof example.input>;
export type SingularValueDecompositionOutput = Readonly<typeof example.output>;
export const singularValueDecompositionTool = tool;
export const runSingularValueDecomposition = tool.execute;
export default tool;
