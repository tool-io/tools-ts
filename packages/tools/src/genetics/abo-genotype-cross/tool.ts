import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstParentGenotype: string;
  readonly secondParentGenotype: string;
}>;
export type Output = Readonly<{
  readonly phenotypes: readonly string[];
  readonly phenotypeProbabilities: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const allowed = ["AA", "AO", "BB", "BO", "AB", "OO"];
  if (
    !allowed.includes(input.firstParentGenotype) ||
    !allowed.includes(input.secondParentGenotype)
  )
    simpleError(
      "firstParentGenotype",
      "Use AA, AO, BB, BO, AB or OO ABO genotypes.",
    );
  const phenotypes = ["A", "B", "AB", "O"],
    phenotypeProbabilities = [0, 0, 0, 0];
  for (const a of input.firstParentGenotype)
    for (const b of input.secondParentGenotype) {
      const pair = [a, b],
        phenotype =
          pair.includes("A") && pair.includes("B")
            ? "AB"
            : pair.includes("A")
              ? "A"
              : pair.includes("B")
                ? "B"
                : "O";
      phenotypeProbabilities[phenotypes.indexOf(phenotype)] += 0.25;
    }
  return { phenotypes, phenotypeProbabilities };
};
export const exampleInput = {
  firstParentGenotype: "AO",
  secondParentGenotype: "BO",
} satisfies Input;
export const exampleOutput = {
  phenotypes: ["A", "B", "AB", "O"],
  phenotypeProbabilities: [0.25, 0.25, 0.25, 0.25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/abo-genotype-cross",
  title: "ABO Genotype Cross",
  description:
    "Resolve Mendelian ABO phenotype probabilities from the supplied parental allele pairs.",
  inputs: [
    {
      id: "firstParentGenotype",
      label: "First parent genotype",
      kind: "string",
    },
    {
      id: "secondParentGenotype",
      label: "Second parent genotype",
      kind: "string",
    },
  ],
  outputs: [
    { id: "phenotypes", label: "Phenotypes", kind: "stringList" },
    {
      id: "phenotypeProbabilities",
      label: "Phenotype probabilities",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      firstParentGenotype: value.firstParentGenotype as string,
      secondParentGenotype: value.secondParentGenotype as string,
    }),
});
export const run = tool.execute;
export default tool;
