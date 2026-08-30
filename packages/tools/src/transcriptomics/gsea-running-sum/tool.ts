import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rankedGeneIds: readonly string[];
  readonly geneSetIds: readonly string[];
  readonly weights: readonly number[];
}>;
export type Output = Readonly<{
  readonly runningScores: readonly number[];
  readonly peakIndex: number;
  readonly enrichmentScore: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.rankedGeneIds.length;
  if (
    n === 0 ||
    input.weights.length !== n ||
    input.geneSetIds.length === 0 ||
    input.weights.some((v) => v < 0)
  )
    simpleError(
      "rankedGeneIds",
      "Aligned nonnegative weights and a nonempty gene set are required.",
    );
  const hits = new Set(input.geneSetIds),
    hitWeight = input.rankedGeneIds.reduce(
      (s, v, i) => s + (hits.has(v) ? input.weights[i] : 0),
      0,
    ),
    missCount = input.rankedGeneIds.filter((v) => !hits.has(v)).length;
  if (hitWeight <= 0 || missCount <= 0)
    simpleError("geneSetIds", "Both weighted hits and misses are required.");
  let score = 0;
  const runningScores = input.rankedGeneIds.map((v, i) => {
    score += hits.has(v) ? input.weights[i] / hitWeight : -1 / missCount;
    return score;
  });
  const peakIndex = runningScores.reduce(
    (best, v, i) => (Math.abs(v) > Math.abs(runningScores[best]) ? i : best),
    0,
  );
  return {
    runningScores,
    peakIndex,
    enrichmentScore: runningScores[peakIndex],
  };
};

export const exampleInput = {
  rankedGeneIds: ["a", "b", "c", "d"],
  geneSetIds: ["a", "c"],
  weights: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  runningScores: [0.5, 0, 0.5, 0],
  peakIndex: 0,
  enrichmentScore: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/gsea-running-sum",
  title: "GSEA Running Sum",
  description:
    "Compute a weighted GSEA running sum and its strongest excursion.",
  inputs: [
    { id: "rankedGeneIds", kind: "stringList", label: "Ranked gene ids" },
    { id: "geneSetIds", kind: "stringList", label: "Gene set ids" },
    { id: "weights", kind: "numberList", label: "Weights" },
  ],
  outputs: [
    { id: "runningScores", kind: "numberList", label: "Running scores" },
    { id: "peakIndex", kind: "number", label: "Peak index" },
    { id: "enrichmentScore", kind: "number", label: "Enrichment score" },
  ],
  calculate: (value) =>
    calculate({
      rankedGeneIds: value.rankedGeneIds as readonly string[],
      geneSetIds: value.geneSetIds as readonly string[],
      weights: value.weights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
