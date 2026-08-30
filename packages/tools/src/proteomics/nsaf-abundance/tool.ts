import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly spectralCounts: readonly number[];
  readonly proteinLengths: readonly number[];
}>;
export type Output = Readonly<{
  readonly nsaf: readonly number[];
  readonly totalLengthAdjustedCounts: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.spectralCounts.length;
  if (
    n === 0 ||
    n !== input.proteinLengths.length ||
    input.spectralCounts.some((v) => v < 0) ||
    input.proteinLengths.some((v) => v <= 0)
  )
    simpleError(
      "proteinLengths",
      "Aligned counts and positive lengths required.",
    );
  const adjusted = input.spectralCounts.map(
      (v, i) => v / input.proteinLengths[i],
    ),
    totalLengthAdjustedCounts = adjusted.reduce((a, b) => a + b, 0);
  if (totalLengthAdjustedCounts <= 0)
    simpleError("spectralCounts", "At least one spectrum count required.");
  return {
    nsaf: adjusted.map((v) => v / totalLengthAdjustedCounts),
    totalLengthAdjustedCounts,
  };
};
export const exampleInput = {
  spectralCounts: [10, 20],
  proteinLengths: [100, 200],
} satisfies Input;
export const exampleOutput = {
  nsaf: [0.5, 0.5],
  totalLengthAdjustedCounts: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/nsaf-abundance",
  title: "NSAF Abundance",
  description:
    "Normalize spectral abundance factors by protein length and cohort total.",
  inputs: [
    { id: "spectralCounts", label: "Spectral counts", kind: "numberList" },
    { id: "proteinLengths", label: "Protein lengths", kind: "numberList" },
  ],
  outputs: [
    { id: "nsaf", label: "Nsaf", kind: "numberList" },
    {
      id: "totalLengthAdjustedCounts",
      label: "Total length adjusted counts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spectralCounts: value.spectralCounts as readonly number[],
      proteinLengths: value.proteinLengths as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
