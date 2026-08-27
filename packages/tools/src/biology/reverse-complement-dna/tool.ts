import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const reverseComplementDnaExample = {
  input: { sequence: "ATGCAG" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const reverseComplementDnaTool = createSimpleTool({
  id: "biology/reverse-complement-dna",
  title: "Reverse Complement",
  description:
    "Build the reverse complement of a DNA sequence by complementing bases then reversing.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    {
      id: "reverseComplement",
      label: "Reverse complement strand",
      kind: "string",
    },
  ],
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
    const complements: Record<string, string> = {
      A: "T",
      C: "G",
      G: "C",
      T: "A",
    };
    return {
      reverseComplement: [...sequence]
        .map((base) => complements[base])
        .reverse()
        .join(""),
    };
  },
});
export const runReverseComplementDna = reverseComplementDnaTool.execute;
export default reverseComplementDnaTool;
