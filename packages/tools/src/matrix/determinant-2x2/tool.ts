import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Determinant2x2Input = {
  readonly matrix: readonly (readonly number[])[];
};

export type Determinant2x2Output = {
  readonly determinant: number;
};

export const determinant2x2Example = {
  input: { matrix: [[3, 8], [4, 6]] },
  output: { determinant: -14 },
} satisfies ToolExample<Determinant2x2Input, Determinant2x2Output>;

export const calculateDeterminant2x2 = (
  input: Determinant2x2Input,
): Determinant2x2Output => {
  const matrix = input.matrix as readonly (readonly number[])[];
  if (
    matrix.length !== 2 ||
    matrix[0]!.length !== 2 ||
    matrix[1]!.length !== 2
  )
    simpleError(
      "matrix",
      "Provide exactly a 2x2 matrix.",
      "not_2x2_matrix",
    );
  return {
    determinant:
      matrix[0]![0]! * matrix[1]![1]! - matrix[0]![1]! * matrix[1]![0]!,
  };
};

export const determinant2x2Tool = createSimpleTool({
  calculate: (input) =>
    calculateDeterminant2x2(input as unknown as Determinant2x2Input),
  description: "Compute the determinant of a 2x2 matrix.",
  id: "matrix/determinant-2x2",
  inputs: [
    {
      description: "A two-row, two-column matrix.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
    },
  ],
  outputs: [
    {
      description: "Determinant, ad minus bc.",
      id: "determinant",
      kind: "number",
      label: "Determinant",
    },
  ],
  title: "Matrix 2×2 Determinant Calculator",
});
export const runDeterminant2x2 = determinant2x2Tool.execute;
export default determinant2x2Tool;
