import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstParentLocusPairs: readonly string[];
  readonly secondParentLocusPairs: readonly string[];
}>;
export type Output = Readonly<{
  readonly firstGametes: readonly string[];
  readonly secondGametes: readonly string[];
  readonly combinationCells: number;
  readonly uniqueOffspringGenotypes: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.firstParentLocusPairs.length !== 3 ||
    input.secondParentLocusPairs.length !== 3 ||
    [...input.firstParentLocusPairs, ...input.secondParentLocusPairs].some(
      (v) => v.length !== 2,
    )
  )
    simpleError(
      "firstParentLocusPairs",
      "Three two-character locus pairs per parent required.",
    );
  if (
    input.firstParentLocusPairs.some(
      (v, i) =>
        !/^([A-Za-z])\1$/i.test(v) ||
        !/^([A-Za-z])\1$/i.test(input.secondParentLocusPairs[i]) ||
        v[0].toLowerCase() !== input.secondParentLocusPairs[i][0].toLowerCase(),
    ) ||
    new Set(input.firstParentLocusPairs.map((v) => v[0].toLowerCase())).size !==
      3
  )
    simpleError(
      "firstParentLocusPairs",
      "Each locus must use one letter with case for alleles; three distinct homologous loci required.",
    );
  const gametes = (pairs: readonly string[]) =>
      pairs.reduce<string[]>(
        (acc, pair) =>
          acc.flatMap((prefix) => [prefix + pair[0], prefix + pair[1]]),
        [""],
      ),
    firstGametes = gametes(input.firstParentLocusPairs),
    secondGametes = gametes(input.secondParentLocusPairs),
    genotypes = new Set<string>();
  for (const a of firstGametes)
    for (const b of secondGametes)
      genotypes.add([...a].map((v, i) => [v, b[i]].sort().join("")).join("/"));
  return {
    firstGametes,
    secondGametes,
    combinationCells: firstGametes.length * secondGametes.length,
    uniqueOffspringGenotypes: genotypes.size,
  };
};
export const exampleInput = {
  firstParentLocusPairs: ["Aa", "Bb", "Cc"],
  secondParentLocusPairs: ["Aa", "Bb", "Cc"],
} satisfies Input;
export const exampleOutput = {
  firstGametes: ["ABC", "ABc", "AbC", "Abc", "aBC", "aBc", "abC", "abc"],
  secondGametes: ["ABC", "ABc", "AbC", "Abc", "aBC", "aBc", "abC", "abc"],
  combinationCells: 64,
  uniqueOffspringGenotypes: 27,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/trihybrid-gamete-grid",
  title: "Trihybrid Gamete Grid",
  description:
    "Enumerate three-locus Mendelian gamete combinations and distinct multilocus offspring genotypes.",
  inputs: [
    {
      id: "firstParentLocusPairs",
      label: "First parent locus pairs",
      kind: "stringList",
    },
    {
      id: "secondParentLocusPairs",
      label: "Second parent locus pairs",
      kind: "stringList",
    },
  ],
  outputs: [
    { id: "firstGametes", label: "First gametes", kind: "stringList" },
    { id: "secondGametes", label: "Second gametes", kind: "stringList" },
    { id: "combinationCells", label: "Combination cells", kind: "number" },
    {
      id: "uniqueOffspringGenotypes",
      label: "Unique offspring genotypes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstParentLocusPairs: value.firstParentLocusPairs as readonly string[],
      secondParentLocusPairs: value.secondParentLocusPairs as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
