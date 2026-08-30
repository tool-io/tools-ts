import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedEnrichment: number;
  readonly nullScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly nullMagnitudeMean: number;
  readonly normalizedScore: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.nullScores.length === 0)
    simpleError("nullScores", "At least one null score is required.");
  const aligned = input.nullScores.filter(
    (v) => Math.sign(v) === Math.sign(input.observedEnrichment),
  );
  if (aligned.length === 0)
    simpleError("nullScores", "A sign-matched null score is required.");
  const nullMagnitudeMean =
    aligned.reduce((s, v) => s + Math.abs(v), 0) / aligned.length;
  if (nullMagnitudeMean === 0)
    simpleError("nullScores", "Null magnitude must be positive.");
  return {
    nullMagnitudeMean,
    normalizedScore: input.observedEnrichment / nullMagnitudeMean,
  };
};

export const exampleInput = {
  observedEnrichment: 0.6,
  nullScores: [0.2, -0.4, 0.6],
} satisfies Input;
export const exampleOutput = {
  nullMagnitudeMean: 0.4,
  normalizedScore: 1.4999999999999998,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/normalized-enrichment-score",
  title: "Normalized Enrichment Score",
  description:
    "Normalize enrichment against mean same-sign permutation magnitudes.",
  inputs: [
    { id: "observedEnrichment", kind: "number", label: "Observed enrichment" },
    { id: "nullScores", kind: "numberList", label: "Null scores" },
  ],
  outputs: [
    { id: "nullMagnitudeMean", kind: "number", label: "Null magnitude mean" },
    { id: "normalizedScore", kind: "number", label: "Normalized score" },
  ],
  calculate: (value) =>
    calculate({
      observedEnrichment: value.observedEnrichment as number,
      nullScores: value.nullScores as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
