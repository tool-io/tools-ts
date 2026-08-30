import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly overlapMatrix: readonly (readonly number[])[];
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly maxAsymmetry: number;
  readonly diagonalDeviations: readonly number[];
  readonly symmetric: boolean;
}>;

export const calculate = (input: Input): Output => {
  const m = input.overlapMatrix,
    n = m.length;
  if (n === 0 || m.some((r) => r.length !== n) || input.tolerance < 0)
    simpleError("overlapMatrix", "A nonempty square matrix is required.");
  let maxAsymmetry = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      maxAsymmetry = Math.max(maxAsymmetry, Math.abs(m[i][j] - m[j][i]));
  return {
    maxAsymmetry,
    diagonalDeviations: m.map((r, i) => Math.abs(r[i] - 1)),
    symmetric: maxAsymmetry <= input.tolerance,
  };
};

export const exampleInput = {
  overlapMatrix: [
    [1, 0.5],
    [0.4, 1],
  ],
  tolerance: 0.05,
} satisfies Input;
export const exampleOutput = {
  maxAsymmetry: 0.09999999999999998,
  diagonalDeviations: [0, 0],
  symmetric: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/tom-symmetry-audit",
  title: "TOM Symmetry Audit",
  description:
    "Audit topological-overlap matrix symmetry and diagonal entries.",
  inputs: [
    { id: "overlapMatrix", kind: "matrix", label: "Overlap matrix" },
    { id: "tolerance", kind: "number", label: "Tolerance" },
  ],
  outputs: [
    { id: "maxAsymmetry", kind: "number", label: "Max asymmetry" },
    {
      id: "diagonalDeviations",
      kind: "numberList",
      label: "Diagonal deviations",
    },
    { id: "symmetric", kind: "boolean", label: "Symmetric" },
  ],
  calculate: (value) =>
    calculate({
      overlapMatrix: value.overlapMatrix as readonly (readonly number[])[],
      tolerance: value.tolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
