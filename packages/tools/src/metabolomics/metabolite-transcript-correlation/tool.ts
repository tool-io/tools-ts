import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly metaboliteProfiles: readonly (readonly number[])[];
  readonly transcriptProfiles: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly pearsonMatrix: readonly (readonly number[])[];
}>;
export const calculate = (input: Input): Output => {
  const a = input.metaboliteProfiles,
    b = input.transcriptProfiles,
    length = a[0]?.length;
  if (
    a.length === 0 ||
    b.length === 0 ||
    !length ||
    length < 2 ||
    [...a, ...b].some((v) => v.length !== length)
  )
    simpleError(
      "metaboliteProfiles",
      "Aligned profiles with at least two observations required.",
    );
  const centered = (x: readonly number[]) => {
      const m = x.reduce((s, v) => s + v, 0) / x.length;
      return x.map((v) => v - m);
    },
    x = a.map(centered),
    y = b.map(centered),
    norm = (v: readonly number[]) => Math.hypot(...v);
  if ([...x, ...y].some((v) => norm(v) === 0))
    simpleError("metaboliteProfiles", "All profiles must vary.");
  const pearsonMatrix = x.map((v) =>
    y.map((w) => {
      const correlation =
        v.reduce((s, z, i) => s + z * w[i], 0) / (norm(v) * norm(w));
      return Math.abs(1 - correlation) < 1e-12
        ? 1
        : Math.abs(-1 - correlation) < 1e-12
          ? -1
          : correlation;
    }),
  );
  return { pearsonMatrix };
};
export const exampleInput = {
  metaboliteProfiles: [
    [1, 2, 3],
    [3, 2, 1],
  ],
  transcriptProfiles: [
    [2, 4, 6],
    [3, 2, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  pearsonMatrix: [
    [1, -1],
    [-1, 1],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/metabolite-transcript-correlation",
  title: "Metabolite Transcript Correlation",
  description: "Build a metabolite-by-transcript Pearson correlation matrix.",
  inputs: [
    { id: "metaboliteProfiles", kind: "matrix", label: "Metabolite profiles" },
    { id: "transcriptProfiles", kind: "matrix", label: "Transcript profiles" },
  ],
  outputs: [{ id: "pearsonMatrix", kind: "matrix", label: "Pearson matrix" }],
  calculate: (value) =>
    calculate({
      metaboliteProfiles:
        value.metaboliteProfiles as readonly (readonly number[])[],
      transcriptProfiles:
        value.transcriptProfiles as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
