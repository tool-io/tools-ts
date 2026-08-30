import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geneIds: readonly string[];
  readonly expressionReplicates: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly cvPercents: readonly number[];
  readonly rankedGeneIds: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.geneIds.length;
  if (
    n === 0 ||
    n !== input.expressionReplicates.length ||
    input.expressionReplicates.some((r) => r.length < 2)
  )
    simpleError(
      "expressionReplicates",
      "Aligned genes need at least two replicates.",
    );
  const cvPercents = input.expressionReplicates.map((r) => {
    const mean = r.reduce((a, b) => a + b, 0) / r.length;
    if (mean <= 0)
      simpleError("expressionReplicates", "Mean expression must be positive.");
    return (
      (Math.sqrt(r.reduce((s, v) => s + (v - mean) ** 2, 0) / r.length) /
        mean) *
      100
    );
  });
  const rankedGeneIds = input.geneIds
    .map((_, i) => i)
    .sort((a, b) => cvPercents[a] - cvPercents[b] || a - b)
    .map((i) => input.geneIds[i]);
  return { cvPercents, rankedGeneIds };
};

export const exampleInput = {
  geneIds: ["a", "b"],
  expressionReplicates: [
    [10, 10],
    [10, 20],
  ],
} satisfies Input;
export const exampleOutput = {
  cvPercents: [0, 33.33333333333333],
  rankedGeneIds: ["a", "b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/housekeeping-cv-rank",
  title: "Housekeeping Cv Rank",
  description: "Rank housekeeping genes by replicate coefficient of variation.",
  inputs: [
    { id: "geneIds", kind: "stringList", label: "Gene ids" },
    {
      id: "expressionReplicates",
      kind: "matrix",
      label: "Expression replicates",
    },
  ],
  outputs: [
    { id: "cvPercents", kind: "numberList", label: "Cv percents" },
    { id: "rankedGeneIds", kind: "stringList", label: "Ranked gene ids" },
  ],
  calculate: (value) =>
    calculate({
      geneIds: value.geneIds as readonly string[],
      expressionReplicates:
        value.expressionReplicates as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
