import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geneNames: readonly string[];
  readonly parentalHaplotypes: readonly string[];
  readonly doubleCrossoverHaplotypes: readonly string[];
}>;
export type Output = Readonly<{
  readonly middleGene: string;
  readonly middleIndex: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.geneNames.length !== 3 ||
    input.parentalHaplotypes.length !== 2 ||
    !input.doubleCrossoverHaplotypes.length ||
    input.parentalHaplotypes.some((v) => v.length !== 3) ||
    input.doubleCrossoverHaplotypes.some((v) => v.length !== 3)
  )
    simpleError(
      "parentalHaplotypes",
      "Three genes and explicit three-character parental and DCO haplotypes required.",
    );
  const indexes = input.doubleCrossoverHaplotypes.map((dco) => {
    const choices = input.parentalHaplotypes
      .map((parent) => [...parent].flatMap((v, i) => (v !== dco[i] ? [i] : [])))
      .filter((diff) => diff.length === 1);
    if (choices.length !== 1)
      simpleError(
        "doubleCrossoverHaplotypes",
        "Each DCO must differ from exactly one parental haplotype at one locus.",
      );
    return choices[0][0];
  });
  if (new Set(indexes).size !== 1)
    simpleError(
      "doubleCrossoverHaplotypes",
      "DCO haplotypes disagree on the middle gene.",
    );
  return { middleGene: input.geneNames[indexes[0]], middleIndex: indexes[0] };
};
export const exampleInput = {
  geneNames: ["A", "B", "C"],
  parentalHaplotypes: ["ABC", "abc"],
  doubleCrossoverHaplotypes: ["AbC", "aBc"],
} satisfies Input;
export const exampleOutput = {
  middleGene: "B",
  middleIndex: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/three-point-middle-gene",
  title: "Three Point Middle Gene",
  description:
    "Resolve the middle gene from one-locus differences between parental and double-crossover haplotypes.",
  inputs: [
    { id: "geneNames", label: "Gene names", kind: "stringList" },
    {
      id: "parentalHaplotypes",
      label: "Parental haplotypes",
      kind: "stringList",
    },
    {
      id: "doubleCrossoverHaplotypes",
      label: "Double crossover haplotypes",
      kind: "stringList",
    },
  ],
  outputs: [
    { id: "middleGene", label: "Middle gene", kind: "string" },
    { id: "middleIndex", label: "Middle index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      geneNames: value.geneNames as readonly string[],
      parentalHaplotypes: value.parentalHaplotypes as readonly string[],
      doubleCrossoverHaplotypes:
        value.doubleCrossoverHaplotypes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
