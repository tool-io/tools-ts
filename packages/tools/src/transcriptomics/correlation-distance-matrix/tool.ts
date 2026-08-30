import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expressionProfiles: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly correlationDistances: readonly (readonly number[])[];
}>;

export const calculate = (input: Input): Output => {
  const x = input.expressionProfiles,
    n = x.length,
    m = x[0]?.length;
  if (n < 2 || !m || m < 2 || x.some((r) => r.length !== m))
    simpleError(
      "expressionProfiles",
      "At least two aligned varying profiles are required.",
    );
  const centered = x.map((r) => {
      const avg = r.reduce((a, b) => a + b, 0) / m;
      return r.map((v) => v - avg);
    }),
    norm = centered.map((r) => Math.hypot(...r));
  if (norm.some((v) => v === 0))
    simpleError("expressionProfiles", "Profiles must vary.");
  const correlationDistances = centered.map((r, i) =>
    centered.map((other, j) => {
      if (i === j) return 0;
      const correlation =
        r.reduce((s, v, k) => s + v * other[k], 0) / (norm[i] * norm[j]);
      if (Math.abs(1 - correlation) < 1e-12) return 0;
      if (Math.abs(-1 - correlation) < 1e-12) return 2;
      return 1 - Math.max(-1, Math.min(1, correlation));
    }),
  );
  return { correlationDistances };
};

export const exampleInput = {
  expressionProfiles: [
    [1, 2, 3],
    [2, 4, 6],
    [3, 2, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  correlationDistances: [
    [0, 0, 2],
    [0, 0, 2],
    [2, 2, 0],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/correlation-distance-matrix",
  title: "Correlation Distance Matrix",
  description:
    "Build a Pearson correlation-distance matrix for hierarchical clustering.",
  inputs: [
    { id: "expressionProfiles", kind: "matrix", label: "Expression profiles" },
  ],
  outputs: [
    {
      id: "correlationDistances",
      kind: "matrix",
      label: "Correlation distances",
    },
  ],
  calculate: (value) =>
    calculate({
      expressionProfiles:
        value.expressionProfiles as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
