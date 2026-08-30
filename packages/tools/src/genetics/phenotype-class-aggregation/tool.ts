import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly genotypeClasses: readonly string[];
  readonly genotypeProbabilities: readonly number[];
  readonly phenotypeLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly phenotypes: readonly string[];
  readonly phenotypePercentages: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.genotypeClasses,
    input.genotypeProbabilities,
    "genotypeClasses",
  );
  aligned(input.genotypeClasses, input.phenotypeLabels, "phenotypeLabels");
  input.genotypeProbabilities.forEach((v) =>
    fraction(v, "genotypeProbabilities"),
  );
  if (
    new Set(input.genotypeClasses).size !== input.genotypeClasses.length ||
    Math.abs(input.genotypeProbabilities.reduce((a, b) => a + b, 0) - 1) > 1e-10
  )
    simpleError(
      "genotypeProbabilities",
      "Distinct classes and genotype probabilities summing to one required.",
    );
  const totals = new Map<string, number>();
  input.phenotypeLabels.forEach((label, i) =>
    totals.set(
      label,
      (totals.get(label) ?? 0) + input.genotypeProbabilities[i],
    ),
  );
  const phenotypes = [...new Set(input.phenotypeLabels)];
  return {
    phenotypes,
    phenotypePercentages: phenotypes.map((label) => 100 * totals.get(label)!),
  };
};
export const exampleInput = {
  genotypeClasses: ["AA", "Aa", "aa"],
  genotypeProbabilities: [0.25, 0.5, 0.25],
  phenotypeLabels: ["dominant", "dominant", "recessive"],
} satisfies Input;
export const exampleOutput = {
  phenotypes: ["dominant", "recessive"],
  phenotypePercentages: [75, 25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/phenotype-class-aggregation",
  title: "Phenotype Class Aggregation",
  description:
    "Aggregate genotype-class probabilities into caller-defined phenotype percentages.",
  inputs: [
    { id: "genotypeClasses", label: "Genotype classes", kind: "stringList" },
    {
      id: "genotypeProbabilities",
      label: "Genotype probabilities",
      kind: "numberList",
    },
    { id: "phenotypeLabels", label: "Phenotype labels", kind: "stringList" },
  ],
  outputs: [
    { id: "phenotypes", label: "Phenotypes", kind: "stringList" },
    {
      id: "phenotypePercentages",
      label: "Phenotype percentages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      genotypeClasses: value.genotypeClasses as readonly string[],
      genotypeProbabilities: value.genotypeProbabilities as readonly number[],
      phenotypeLabels: value.phenotypeLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
