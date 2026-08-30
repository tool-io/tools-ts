import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly peptideSequences: readonly string[];
  readonly minimumResidues: number;
  readonly maximumResidues: number;
}>;
export type Output = Readonly<{
  readonly retainedSequences: readonly string[];
  readonly rejectedCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.minimumResidues) ||
    !Number.isSafeInteger(input.maximumResidues) ||
    input.minimumResidues < 1 ||
    input.minimumResidues > input.maximumResidues
  )
    simpleError(
      "minimumResidues",
      "Positive ordered integer length limits required.",
    );
  input.peptideSequences.forEach(proteinSequence);
  const retainedSequences = input.peptideSequences.filter(
    (v) =>
      v.length >= input.minimumResidues && v.length <= input.maximumResidues,
  );
  return {
    retainedSequences,
    rejectedCount: input.peptideSequences.length - retainedSequences.length,
  };
};
export const exampleInput = {
  peptideSequences: ["A", "GG", "GGG"],
  minimumResidues: 2,
  maximumResidues: 3,
} satisfies Input;
export const exampleOutput = {
  retainedSequences: ["GG", "GGG"],
  rejectedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/digest-length-filter",
  title: "Digest Length Filter",
  description:
    "Filter peptide sequences by caller-selected residue length range.",
  inputs: [
    { id: "peptideSequences", label: "Peptide sequences", kind: "stringList" },
    { id: "minimumResidues", label: "Minimum residues", kind: "number" },
    { id: "maximumResidues", label: "Maximum residues", kind: "number" },
  ],
  outputs: [
    {
      id: "retainedSequences",
      label: "Retained sequences",
      kind: "stringList",
    },
    { id: "rejectedCount", label: "Rejected count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      peptideSequences: value.peptideSequences as readonly string[],
      minimumResidues: value.minimumResidues as number,
      maximumResidues: value.maximumResidues as number,
    }),
});
export const run = tool.execute;
export default tool;
