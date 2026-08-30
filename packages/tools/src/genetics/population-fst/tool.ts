import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction, positive, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly alleleFrequencies: readonly number[];
  readonly populationWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalHeterozygosity: number;
  readonly withinHeterozygosity: number;
  readonly fst: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.alleleFrequencies,
    input.populationWeights,
    "alleleFrequencies",
  );
  input.alleleFrequencies.forEach((v) => fraction(v, "alleleFrequencies"));
  input.populationWeights.forEach((v) => nonnegative(v, "populationWeights"));
  const weight = input.populationWeights.reduce((a, b) => a + b, 0);
  positive(weight, "populationWeights");
  const p =
      input.alleleFrequencies.reduce(
        (sum, v, i) => sum + v * input.populationWeights[i],
        0,
      ) / weight,
    totalHeterozygosity = 2 * p * (1 - p),
    withinHeterozygosity =
      input.alleleFrequencies.reduce(
        (sum, v, i) => sum + 2 * v * (1 - v) * input.populationWeights[i],
        0,
      ) / weight;
  positive(totalHeterozygosity, "alleleFrequencies");
  return {
    totalHeterozygosity,
    withinHeterozygosity,
    fst: Math.max(
      0,
      (totalHeterozygosity - withinHeterozygosity) / totalHeterozygosity,
    ),
  };
};
export const exampleInput = {
  alleleFrequencies: [0.2, 0.8],
  populationWeights: [1, 1],
} satisfies Input;
export const exampleOutput = {
  totalHeterozygosity: 0.5,
  withinHeterozygosity: 0.32,
  fst: 0.36,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/population-fst",
  title: "Population FST",
  description:
    "Compute heterozygosity-based FST from population allele frequencies and explicit weights.",
  inputs: [
    {
      id: "alleleFrequencies",
      label: "Allele frequencies",
      kind: "numberList",
    },
    {
      id: "populationWeights",
      label: "Population weights",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "totalHeterozygosity",
      label: "Total heterozygosity",
      kind: "number",
    },
    {
      id: "withinHeterozygosity",
      label: "Within heterozygosity",
      kind: "number",
    },
    { id: "fst", label: "Fst", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      alleleFrequencies: value.alleleFrequencies as readonly number[],
      populationWeights: value.populationWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
