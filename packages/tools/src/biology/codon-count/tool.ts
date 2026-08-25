import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const codonCountExample = {
  input: { sequence: "ATGCAGTAA" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const codonCountTool = createSimpleTool({
  id: "biology/codon-count",
  title: "Codon Count",
  description:
    "Count how many complete three-base codons fit in a nucleotide sequence.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "codonCount", label: "Codons", kind: "integer", format: "count" },
  ],
  calculate: (input) => {
    const sequence = input.sequence as string;
    if (sequence !== "" && !/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    return { codonCount: Math.floor(sequence.length / 3) };
  },
});
export const runCodonCount = codonCountTool.execute;
export default codonCountTool;
