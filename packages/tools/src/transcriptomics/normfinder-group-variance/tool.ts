import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geneIds: readonly string[];
  readonly groupMeans: readonly (readonly number[])[];
  readonly maximumBetweenGroupVariance: number;
}>;
export type Output = Readonly<{
  readonly betweenGroupVariances: readonly number[];
  readonly stableGeneIds: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.geneIds.length;
  if (
    n === 0 ||
    input.groupMeans.length !== n ||
    input.groupMeans.some((r) => r.length < 2)
  )
    simpleError("groupMeans", "Each gene needs at least two group means.");
  const betweenGroupVariances = input.groupMeans.map((r) => {
    const mean = r.reduce((a, b) => a + b, 0) / r.length;
    return r.reduce((s, v) => s + (v - mean) ** 2, 0) / r.length;
  });
  return {
    betweenGroupVariances,
    stableGeneIds: input.geneIds.filter(
      (_, i) => betweenGroupVariances[i] <= input.maximumBetweenGroupVariance,
    ),
  };
};

export const exampleInput = {
  geneIds: ["a", "b"],
  groupMeans: [
    [10, 11],
    [10, 14],
  ],
  maximumBetweenGroupVariance: 1,
} satisfies Input;
export const exampleOutput = {
  betweenGroupVariances: [0.25, 4],
  stableGeneIds: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/normfinder-group-variance",
  title: "Normfinder Group Variance",
  description:
    "Estimate reference-gene between-group variance for stability screening.",
  inputs: [
    { id: "geneIds", kind: "stringList", label: "Gene ids" },
    { id: "groupMeans", kind: "matrix", label: "Group means" },
    {
      id: "maximumBetweenGroupVariance",
      kind: "number",
      label: "Maximum between group variance",
    },
  ],
  outputs: [
    {
      id: "betweenGroupVariances",
      kind: "numberList",
      label: "Between group variances",
    },
    { id: "stableGeneIds", kind: "stringList", label: "Stable gene ids" },
  ],
  calculate: (value) =>
    calculate({
      geneIds: value.geneIds as readonly string[],
      groupMeans: value.groupMeans as readonly (readonly number[])[],
      maximumBetweenGroupVariance: value.maximumBetweenGroupVariance as number,
    }),
});
export const run = tool.execute;
export default tool;
