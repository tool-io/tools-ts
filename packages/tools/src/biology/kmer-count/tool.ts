import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const kmerCountExample = {
  input: { kmer: "AA", sequence: "AAAA" },
} satisfies ToolExample<{ readonly kmer: string; readonly sequence: string }>;

export const kmerCountTool = createSimpleTool({
  id: "biology/kmer-count",
  title: "K-mer Count",
  description:
    "Count occurrences of an exact k-mer in a DNA sequence with overlapping windows.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "kmer", label: "K-mer", kind: "string" },
  ],
  outputs: [
    {
      id: "kmerCount",
      label: "K-mers found",
      kind: "integer",
      format: "count",
    },
  ],
  calculate: (input) => {
    const sequence = input.sequence as string;
    const kmer = input.kmer as string;
    if (sequence === "")
      simpleError("sequence", "Sequence must not be empty.", "empty_sequence");
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (kmer === "")
      simpleError("kmer", "K-mer must not be empty.", "empty_sequence");
    if (!/^[ACGT]+$/.test(kmer))
      simpleError(
        "kmer",
        "K-mer must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (kmer.length > sequence.length)
      simpleError(
        "kmer",
        "K-mer length must not exceed the sequence length.",
        "invalid_length",
      );
    let kmerCount = 0;
    for (let index = 0; index + kmer.length <= sequence.length; index += 1)
      if (sequence.startsWith(kmer, index)) kmerCount += 1;
    return { kmerCount };
  },
});
export const runKmerCount = kmerCountTool.execute;
export default kmerCountTool;
