import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QrDecompositionInput = {
  readonly matrix: readonly (readonly number[])[];
};

export type QrDecompositionOutput = {
  readonly q: readonly (readonly number[])[];
  readonly r: readonly (readonly number[])[];
};

/**
 * Householder QR decomposition: each step reflects one column below the
 * diagonal onto a multiple of e1 with H = I - 2vvᵀ/(vᵀv), applied left to
 * R and accumulated right into Q, so A = Q·R exactly up to floating
 * point. The sign of each diagonal of R follows alpha = -sign(x0)*||x||.
 */
export const calculateQrDecomposition = (
  input: QrDecompositionInput,
): QrDecompositionOutput => {
  const size = input.matrix.length;
  if (size === 0)
    simpleError(
      "matrix",
      "Provide a non-empty square matrix.",
      "invalid_matrix",
    );
  if (input.matrix.some((row) => row.length !== size))
    simpleError(
      "matrix",
      "The matrix must be square with consistent row lengths.",
      "invalid_matrix",
    );
  const r = input.matrix.map((row) => [...row]);
  const q = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => (row === column ? 1 : 0)),
  );
  for (let k = 0; k < size - 1; k += 1) {
    let normBelow = 0;
    for (let row = k; row < size; row += 1) normBelow += r[row]![k]! ** 2;
    normBelow = Math.sqrt(normBelow);
    if (normBelow === 0) continue;
    const alpha = -(r[k]![k]! >= 0 ? 1 : -1) * normBelow;
    const v = Array.from({ length: size }, (_, row) =>
      row < k ? 0 : r[row]![k]!,
    );
    v[k]! -= alpha;
    let vNormSquared = 0;
    for (let row = k; row < size; row += 1) vNormSquared += v[row]! ** 2;
    if (vNormSquared === 0) continue;
    for (let column = k; column < size; column += 1) {
      let projection = 0;
      for (let row = k; row < size; row += 1)
        projection += v[row]! * r[row]![column]!;
      const factor = (2 * projection) / vNormSquared;
      for (let row = k; row < size; row += 1)
        r[row]![column]! -= factor * v[row]!;
    }
    for (let row = 0; row < size; row += 1) {
      let projection = 0;
      for (let column = k; column < size; column += 1)
        projection += q[row]![column]! * v[column]!;
      const factor = (2 * projection) / vNormSquared;
      for (let column = k; column < size; column += 1)
        q[row]![column]! -= factor * v[column]!;
    }
  }
  return { q, r };
};

export const qrDecompositionExample = {
  input: {
    matrix: [
      [3, 4],
      [4, 3],
    ],
  },
  output: {
    q: [
      [-0.6000000000000001, -0.8],
      [-0.8, 0.6],
    ],
    r: [
      [-5, -4.800000000000001],
      [0, -1.4000000000000004],
    ],
  },
} satisfies ToolExample<QrDecompositionInput, QrDecompositionOutput>;

export const qrDecompositionTool = createSimpleTool({
  id: "matrix/qr-decomposition",
  title: "QR Decomposition Calculator",
  description:
    "Householder QR decomposition of a square matrix: orthogonal Q and upper-triangular R with A = Q·R.",
  inputs: [
    {
      description: "Square matrix given as rows of equal length.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
    },
  ],
  outputs: [
    {
      description: "Orthogonal factor Q (Q·R reproduces the input).",
      id: "q",
      kind: "matrix",
      label: "Q",
    },
    {
      description: "Upper-triangular factor R.",
      id: "r",
      kind: "matrix",
      label: "R",
    },
  ],
  calculate: (input) =>
    calculateQrDecomposition({
      matrix: input.matrix as readonly (readonly number[])[],
    }),
});

export const runQrDecomposition = qrDecompositionTool.execute;
export default qrDecompositionTool;
