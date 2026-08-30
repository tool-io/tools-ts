import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, positive, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly firstAlleleFrequencies: readonly number[];
  readonly secondAlleleFrequencies: readonly number[];
  readonly homozygousFlags: readonly number[];
  readonly theta: number;
}>;
export type Output = Readonly<{
  readonly locusMatchProbabilities: readonly number[];
  readonly randomMatchProbability: number;
  readonly log10MatchProbability: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.firstAlleleFrequencies,
    input.secondAlleleFrequencies,
    "firstAlleleFrequencies",
  );
  aligned(
    input.firstAlleleFrequencies,
    input.homozygousFlags,
    "homozygousFlags",
  );
  fraction(input.theta, "theta");
  const locusMatchProbabilities = input.firstAlleleFrequencies.map((p, i) => {
    fraction(p, "firstAlleleFrequencies");
    positive(p, "firstAlleleFrequencies");
    const q = input.secondAlleleFrequencies[i];
    fraction(q, "secondAlleleFrequencies");
    positive(q, "secondAlleleFrequencies");
    const homo = input.homozygousFlags[i];
    if (
      (homo !== 0 && homo !== 1) ||
      (homo === 1 && p !== q) ||
      (homo === 0 && p + q > 1)
    )
      simpleError(
        "homozygousFlags",
        "Binary genotype flags and compatible allele frequencies required.",
      );
    return homo === 1
      ? p * (input.theta + (1 - input.theta) * p)
      : 2 * (1 - input.theta) * p * q;
  });
  const log10MatchProbability = locusMatchProbabilities.reduce(
    (sum, v) => sum + Math.log10(v),
    0,
  );
  if (!Number.isFinite(log10MatchProbability))
    simpleError("theta", "Parameters imply zero genotype probability.");
  return {
    locusMatchProbabilities,
    randomMatchProbability: 10 ** log10MatchProbability,
    log10MatchProbability,
  };
};
export const exampleInput = {
  firstAlleleFrequencies: [0.5, 0.2],
  secondAlleleFrequencies: [0.5, 0.3],
  homozygousFlags: [1, 0],
  theta: 0,
} satisfies Input;
export const exampleOutput = {
  locusMatchProbabilities: [0.25, 0.12],
  randomMatchProbability: 0.03,
  log10MatchProbability: -1.5228787452803376,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/multilocus-genotype-match",
  title: "Multilocus Genotype Match",
  description:
    "Calculate theta-adjusted genotype match probabilities and their independent-locus product and log score.",
  inputs: [
    {
      id: "firstAlleleFrequencies",
      label: "First allele frequencies",
      kind: "numberList",
    },
    {
      id: "secondAlleleFrequencies",
      label: "Second allele frequencies",
      kind: "numberList",
    },
    { id: "homozygousFlags", label: "Homozygous flags", kind: "numberList" },
    { id: "theta", label: "Theta", kind: "number" },
  ],
  outputs: [
    {
      id: "locusMatchProbabilities",
      label: "Locus match probabilities",
      kind: "numberList",
    },
    {
      id: "randomMatchProbability",
      label: "Random match probability",
      kind: "number",
    },
    {
      id: "log10MatchProbability",
      label: "Log 10 match probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstAlleleFrequencies: value.firstAlleleFrequencies as readonly number[],
      secondAlleleFrequencies:
        value.secondAlleleFrequencies as readonly number[],
      homozygousFlags: value.homozygousFlags as readonly number[],
      theta: value.theta as number,
    }),
});
export const run = tool.execute;
export default tool;
