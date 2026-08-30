import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expressionByGene: readonly (readonly number[])[];
  readonly iterations: number;
}>;
export type Output = Readonly<{
  readonly eigengene: readonly number[];
  readonly explainedVarianceFraction: number;
}>;

export const calculate = (input: Input): Output => {
  const rows = input.expressionByGene,
    n = rows[0]?.length;
  if (
    rows.length === 0 ||
    !n ||
    n < 2 ||
    rows.some((r) => r.length !== n) ||
    input.iterations < 1
  )
    simpleError(
      "expressionByGene",
      "Aligned gene profiles and at least one iteration are required.",
    );
  const centered = rows.map((row) => {
      const mean = row.reduce((a, b) => a + b, 0) / n;
      return row.map((v) => v - mean);
    }),
    cov = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) =>
        centered.reduce((s, row) => s + row[i] * row[j], 0),
      ),
    ),
    trace = cov.reduce((s, row, i) => s + row[i], 0);
  if (trace <= 0)
    simpleError("expressionByGene", "Expression matrix has no variation.");
  let vector = Array(n).fill(1);
  vector[0] = 2;
  for (let t = 0; t < input.iterations; t++) {
    const next = cov.map((row) =>
        row.reduce((s, v, j) => s + v * vector[j], 0),
      ),
      norm = Math.hypot(...next);
    if (norm === 0) break;
    vector = next.map((v) => v / norm);
  }
  const pivot = vector.find((v) => Math.abs(v) > 1e-10) ?? 1;
  if (pivot < 0) vector = vector.map((v) => -v);
  const eigenvalue = vector.reduce(
    (s, v, i) => s + v * cov[i].reduce((a, b, j) => a + b * vector[j], 0),
    0,
  );
  return {
    eigengene: vector.map((v) => v * Math.sqrt(eigenvalue)),
    explainedVarianceFraction: eigenvalue / trace,
  };
};

export const exampleInput = {
  expressionByGene: [
    [1, 2, 3],
    [2, 4, 6],
  ],
  iterations: 20,
} satisfies Input;
export const exampleOutput = {
  eigengene: [2.2360679774997894, 0, -2.2360679774997894],
  explainedVarianceFraction: 0.9999999999999998,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/module-eigengene",
  title: "Module Eigengene",
  description:
    "Extract the leading principal component of a gene-by-sample module.",
  inputs: [
    { id: "expressionByGene", kind: "matrix", label: "Expression by gene" },
    { id: "iterations", kind: "number", label: "Iterations" },
  ],
  outputs: [
    { id: "eigengene", kind: "numberList", label: "Eigengene" },
    {
      id: "explainedVarianceFraction",
      kind: "number",
      label: "Explained variance fraction",
    },
  ],
  calculate: (value) =>
    calculate({
      expressionByGene:
        value.expressionByGene as readonly (readonly number[])[],
      iterations: value.iterations as number,
    }),
});
export const run = tool.execute;
export default tool;
