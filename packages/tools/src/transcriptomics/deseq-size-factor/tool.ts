import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geneCountsBySample: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly sizeFactors: readonly number[];
  readonly usedGenes: number;
}>;

export const calculate = (input: Input): Output => {
  const rows = input.geneCountsBySample,
    n = rows[0]?.length;
  if (
    rows.length === 0 ||
    !n ||
    rows.some((r) => r.length !== n || r.some((v) => v < 0))
  )
    simpleError(
      "geneCountsBySample",
      "Nonempty rectangular nonnegative gene-count matrix required.",
    );
  const eligible = rows.filter((r) => r.every((v) => v > 0));
  if (eligible.length === 0)
    simpleError(
      "geneCountsBySample",
      "At least one gene must be positive in all samples.",
    );
  const ratios = Array.from({ length: n }, () => [] as number[]);
  for (const row of eligible) {
    const gm = Math.exp(row.reduce((s, v) => s + Math.log(v), 0) / n);
    row.forEach((v, i) => ratios[i].push(v / gm));
  }
  const median = (v: number[]) => {
    const sorted = [...v].sort((a, b) => a - b),
      mid = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  return { sizeFactors: ratios.map(median), usedGenes: eligible.length };
};

export const exampleInput = {
  geneCountsBySample: [
    [10, 20],
    [20, 40],
    [30, 60],
  ],
} satisfies Input;
export const exampleOutput = {
  sizeFactors: [0.7071067811865476, 1.4142135623730951],
  usedGenes: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/deseq-size-factor",
  title: "Deseq Size Factor",
  description:
    "Estimate DESeq-style sample size factors by median ratios to per-gene geometric means.",
  inputs: [
    {
      id: "geneCountsBySample",
      kind: "matrix",
      label: "Gene counts by sample",
    },
  ],
  outputs: [
    { id: "sizeFactors", kind: "numberList", label: "Size factors" },
    { id: "usedGenes", kind: "number", label: "Used genes" },
  ],
  calculate: (value) =>
    calculate({
      geneCountsBySample:
        value.geneCountsBySample as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
