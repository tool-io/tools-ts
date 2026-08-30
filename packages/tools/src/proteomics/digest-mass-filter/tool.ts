import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { peptideNeutralMass } from "../../core/protein.js";

export type Input = Readonly<{
  readonly peptideSequences: readonly string[];
  readonly minimumMassDa: number;
  readonly maximumMassDa: number;
}>;
export type Output = Readonly<{
  readonly retainedSequences: readonly string[];
  readonly peptideMassesDa: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (input.minimumMassDa < 0 || input.minimumMassDa > input.maximumMassDa)
    simpleError(
      "minimumMassDa",
      "Ordered nonnegative peptide mass bounds required.",
    );
  const peptideMassesDa = input.peptideSequences.map((v) =>
    peptideNeutralMass(v),
  );
  return {
    retainedSequences: input.peptideSequences.filter(
      (_, i) =>
        peptideMassesDa[i] >= input.minimumMassDa &&
        peptideMassesDa[i] <= input.maximumMassDa,
    ),
    peptideMassesDa,
  };
};
export const exampleInput = {
  peptideSequences: ["A", "GG", "WW"],
  minimumMassDa: 70,
  maximumMassDa: 200,
} satisfies Input;
export const exampleOutput = {
  retainedSequences: ["A", "GG"],
  peptideMassesDa: [89.04767, 132.05348, 390.16918],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/digest-mass-filter",
  title: "Digest Mass Filter",
  description:
    "Filter digest peptides by calculated monoisotopic neutral mass.",
  inputs: [
    { id: "peptideSequences", label: "Peptide sequences", kind: "stringList" },
    { id: "minimumMassDa", label: "Minimum mass da", kind: "number" },
    { id: "maximumMassDa", label: "Maximum mass da", kind: "number" },
  ],
  outputs: [
    {
      id: "retainedSequences",
      label: "Retained sequences",
      kind: "stringList",
    },
    { id: "peptideMassesDa", label: "Peptide masses da", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      peptideSequences: value.peptideSequences as readonly string[],
      minimumMassDa: value.minimumMassDa as number,
      maximumMassDa: value.maximumMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
