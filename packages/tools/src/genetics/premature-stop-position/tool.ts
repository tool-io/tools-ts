import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, dna, codonAminoAcid } from "../shared.js";

export type Input = Readonly<{
  readonly codingSequence: string;
  readonly mutatedCodonIndex: number;
  readonly mutatedCodon: string;
}>;
export type Output = Readonly<{
  readonly originalAminoAcid: string;
  readonly replacementAminoAcid: string;
  readonly prematureStop: boolean;
  readonly retainedAminoAcids: number;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.codingSequence),
    codon = dna(input.mutatedCodon);
  count(input.mutatedCodonIndex, "mutatedCodonIndex");
  if (
    s.length % 3 !== 0 ||
    input.mutatedCodonIndex * 3 + 3 > s.length ||
    codon.length !== 3
  )
    simpleError(
      "mutatedCodonIndex",
      "In-frame sequence, valid codon index and replacement triplet required.",
    );
  const originalAminoAcid = codonAminoAcid(
      s.slice(input.mutatedCodonIndex * 3, input.mutatedCodonIndex * 3 + 3),
    ),
    replacementAminoAcid = codonAminoAcid(codon),
    firstStop = (sequence: string) => {
      for (let i = 0; i < sequence.length; i += 3)
        if (codonAminoAcid(sequence.slice(i, i + 3)) === "*") return i / 3;
      return sequence.length / 3;
    },
    originalLength = firstStop(s),
    mutated =
      s.slice(0, input.mutatedCodonIndex * 3) +
      codon +
      s.slice(input.mutatedCodonIndex * 3 + 3),
    retainedAminoAcids = firstStop(mutated);
  return {
    originalAminoAcid,
    replacementAminoAcid,
    prematureStop:
      replacementAminoAcid === "*" && retainedAminoAcids < originalLength,
    retainedAminoAcids,
  };
};
export const exampleInput = {
  codingSequence: "ATGAAATAA",
  mutatedCodonIndex: 1,
  mutatedCodon: "TAG",
} satisfies Input;
export const exampleOutput = {
  originalAminoAcid: "K",
  replacementAminoAcid: "*",
  prematureStop: true,
  retainedAminoAcids: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/premature-stop-position",
  title: "Premature Stop Position",
  description:
    "Check a codon replacement for a new premature stop under the standard genetic code.",
  inputs: [
    { id: "codingSequence", label: "Coding sequence", kind: "string" },
    { id: "mutatedCodonIndex", label: "Mutated codon index", kind: "integer" },
    { id: "mutatedCodon", label: "Mutated codon", kind: "string" },
  ],
  outputs: [
    { id: "originalAminoAcid", label: "Original amino acid", kind: "string" },
    {
      id: "replacementAminoAcid",
      label: "Replacement amino acid",
      kind: "string",
    },
    { id: "prematureStop", label: "Premature stop", kind: "boolean" },
    { id: "retainedAminoAcids", label: "Retained amino acids", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      codingSequence: value.codingSequence as string,
      mutatedCodonIndex: value.mutatedCodonIndex as number,
      mutatedCodon: value.mutatedCodon as string,
    }),
});
export const run = tool.execute;
export default tool;
