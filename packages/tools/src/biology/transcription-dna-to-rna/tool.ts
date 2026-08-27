import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const transcriptionDnaToRnaExample = {
  input: { sequence: "ATGCAG" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const transcriptionDnaToRnaTool = createSimpleTool({
  id: "biology/transcription-dna-to-rna",
  title: "Transcribe To RNA",
  description:
    "Transcribe a DNA sequence to RNA by replacing every thymine with uracil.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [{ id: "rna", label: "RNA transcript", kind: "string" }],
  calculate: (input) => {
    const sequence = input.sequence as string;
    if (sequence === "")
      simpleError("sequence", "Sequence must not be empty.", "empty_sequence");
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    return { rna: sequence.replace(/T/g, "U") };
  },
});
export const runTranscriptionDnaToRna = transcriptionDnaToRnaTool.execute;
export default transcriptionDnaToRnaTool;
