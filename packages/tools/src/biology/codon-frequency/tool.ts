import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const codonFrequencyExample = {
  input: { codon: "ATG", sequence: "ATGGCA" },
} satisfies ToolExample<{
  readonly codon: string;
  readonly sequence: string;
}>;

export const codonFrequencyTool = createSimpleTool({
  id: "biology/codon-frequency",
  title: "Codon Frequency",
  description:
    "Calculate the frequency of a codon within the reading frame of a DNA sequence.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "codon", label: "Codon", kind: "string" },
  ],
  outputs: [{ id: "codonFrequency", label: "Codon frequency", kind: "number" }],
  calculate: (input) => {
    const sequence = input.sequence as string;
    const codon = input.codon as string;
    if (sequence !== "" && !/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (!/^[ACGT]{3}$/.test(codon))
      simpleError(
        "codon",
        "Codon must be exactly three uppercase A, C, G or T bases.",
        "invalid_sequence",
      );
    const totalCodons = Math.floor(sequence.length / 3);
    if (totalCodons === 0)
      simpleError(
        "sequence",
        "Sequence must contain at least one complete codon.",
        "zero_codons",
      );
    let matchingCodons = 0;
    for (let index = 0; index + 3 <= sequence.length; index += 3)
      if (sequence.slice(index, index + 3) === codon) matchingCodons += 1;
    return { codonFrequency: matchingCodons / totalCodons };
  },
});
export const runCodonFrequency = codonFrequencyTool.execute;
export default codonFrequencyTool;
