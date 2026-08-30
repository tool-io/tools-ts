import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geneIds: readonly string[];
  readonly meanExpressions: readonly number[];
  readonly variances: readonly number[];
  readonly topCount: number;
}>;
export type Output = Readonly<{
  readonly selectedGenes: readonly string[];
  readonly dispersions: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.geneIds.length;
  if (
    n === 0 ||
    n !== input.meanExpressions.length ||
    n !== input.variances.length ||
    input.topCount < 1 ||
    input.topCount > n ||
    input.meanExpressions.some((v) => v <= 0) ||
    input.variances.some((v) => v < 0)
  )
    simpleError(
      "geneIds",
      "Aligned positive means, variances and top count are required.",
    );
  const dispersion = input.variances.map(
      (v, i) => v / input.meanExpressions[i],
    ),
    order = dispersion
      .map((_, i) => i)
      .sort((a, b) => dispersion[b] - dispersion[a] || a - b)
      .slice(0, input.topCount);
  return {
    selectedGenes: order.map((i) => input.geneIds[i]),
    dispersions: order.map((i) => dispersion[i]),
  };
};

export const exampleInput = {
  geneIds: ["g1", "g2", "g3"],
  meanExpressions: [10, 20, 10],
  variances: [5, 80, 20],
  topCount: 2,
} satisfies Input;
export const exampleOutput = {
  selectedGenes: ["g2", "g3"],
  dispersions: [4, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/hvg-dispersion-selector",
  title: "HVG Dispersion Selector",
  description: "Select highly variable genes by variance-to-mean dispersion.",
  inputs: [
    { id: "geneIds", kind: "stringList", label: "Gene ids" },
    { id: "meanExpressions", kind: "numberList", label: "Mean expressions" },
    { id: "variances", kind: "numberList", label: "Variances" },
    { id: "topCount", kind: "number", label: "Top count" },
  ],
  outputs: [
    { id: "selectedGenes", kind: "stringList", label: "Selected genes" },
    { id: "dispersions", kind: "numberList", label: "Dispersions" },
  ],
  calculate: (value) =>
    calculate({
      geneIds: value.geneIds as readonly string[],
      meanExpressions: value.meanExpressions as readonly number[],
      variances: value.variances as readonly number[],
      topCount: value.topCount as number,
    }),
});
export const run = tool.execute;
export default tool;
