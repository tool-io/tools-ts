import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly dipeptideKeys: readonly string[];
  readonly dipeptideWeights: readonly number[];
  readonly scaleFactor: number;
}>;
export type Output = Readonly<{
  readonly weightedMean: number;
  readonly instabilityProxy: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    n = input.dipeptideKeys.length;
  if (
    s.length < 2 ||
    n !== input.dipeptideWeights.length ||
    new Set(input.dipeptideKeys).size !== n
  )
    simpleError(
      "dipeptideKeys",
      "Unique aligned dipeptide weights and sequence required.",
    );
  const weights = new Map(
    input.dipeptideKeys.map((key, i) => [key, input.dipeptideWeights[i]]),
  );
  let sum = 0;
  for (let i = 0; i < s.length - 1; i++) {
    sum +=
      weights.get(s.slice(i, i + 2)) ??
      simpleError("dipeptideKeys", "Missing dipeptide weight for sequence.");
  }
  const weightedMean = sum / (s.length - 1);
  return { weightedMean, instabilityProxy: weightedMean * input.scaleFactor };
};
export const exampleInput = {
  sequence: "ACD",
  dipeptideKeys: ["AC", "CD"],
  dipeptideWeights: [2, 4],
  scaleFactor: 10,
} satisfies Input;
export const exampleOutput = {
  weightedMean: 3,
  instabilityProxy: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-instability-score",
  title: "Protein Instability Score",
  description:
    "Score protein dipeptide instability with caller-provided empirical weights.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "dipeptideKeys", label: "Dipeptide keys", kind: "stringList" },
    { id: "dipeptideWeights", label: "Dipeptide weights", kind: "numberList" },
    { id: "scaleFactor", label: "Scale factor", kind: "number" },
  ],
  outputs: [
    { id: "weightedMean", label: "Weighted mean", kind: "number" },
    { id: "instabilityProxy", label: "Instability proxy", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      dipeptideKeys: value.dipeptideKeys as readonly string[],
      dipeptideWeights: value.dipeptideWeights as readonly number[],
      scaleFactor: value.scaleFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
