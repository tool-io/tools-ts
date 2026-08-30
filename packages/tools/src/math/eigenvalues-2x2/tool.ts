import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape } from "../batch-shared.js";
export type Input = Readonly<{
  readonly matrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly eigenvalueRealParts: readonly number[];
  readonly eigenvalueImaginaryParts: readonly number[];
  readonly repeatedEigenvalue: boolean;
}>;
const inputFields = [
  { id: "matrix", label: "Matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (shape(input.matrix, "matrix") !== 2 || input.matrix.length !== 2)
    simpleError("matrix", "Exactly 2×2 matrix required.");
  const scale = Math.max(...input.matrix.flat().map(Math.abs));
  if (scale === 0)
    return {
      eigenvalueRealParts: [0, 0],
      eigenvalueImaginaryParts: [0, 0],
      repeatedEigenvalue: true,
    };
  const normalized = input.matrix.map((row) => row.map((v) => v / scale));
  if (
    normalized.some((row, i) =>
      row.some((v, j) => v === 0 && input.matrix[i][j] !== 0),
    )
  )
    simpleError(
      "matrix",
      "Matrix dynamic range exceeds floating normalization resolution.",
    );
  const [[a, b], [c, d]] = normalized,
    mid = (a + d) / 2,
    disc = ((a - d) / 2) ** 2 + b * c;
  if (disc >= 0) {
    const r = Math.sqrt(disc);
    const large = mid >= 0 ? mid + r : mid - r;
    const small = disc === 0 ? mid : large === 0 ? 0 : (a * d - b * c) / large;
    return {
      eigenvalueRealParts: (mid >= 0 ? [large, small] : [small, large]).map(
        (v) => v * scale,
      ),
      eigenvalueImaginaryParts: [0, 0],
      repeatedEigenvalue: disc === 0,
    };
  }
  const im = Math.sqrt(-disc);
  return {
    eigenvalueRealParts: [mid * scale, mid * scale],
    eigenvalueImaginaryParts: [im * scale, -im * scale],
    repeatedEigenvalue: false,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  matrix: [
    [0, -1],
    [1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  eigenvalueRealParts: [0, 0],
  eigenvalueImaginaryParts: [1, -1],
  repeatedEigenvalue: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/eigenvalues-2x2",
  title: "2x2 Eigenvalues Calculator",
  description:
    "Compute both algebraic eigenvalues of a real 2×2 matrix, preserving complex conjugate pairs and exact computed repeated-root flag; no false real-only truncation or eigenvector independence claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "eigenvalueRealParts",
      label: "Eigenvalue real parts",
      kind: "numberList",
    },
    {
      id: "eigenvalueImaginaryParts",
      label: "Eigenvalue imaginary parts",
      kind: "numberList",
    },
    { id: "repeatedEigenvalue", label: "Repeated eigenvalue", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({ matrix: value.matrix as readonly (readonly number[])[] }),
});
export const run = tool.execute;
export default tool;
