import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const complementDnaExample = {
  input: { sequence: "ATGCAG" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const complementDnaTool = createSimpleTool({
  id: "biology/complement-dna",
  title: "DNA Complement",
  description:
    "Map each DNA base to its complement, pairing A with T and G with C.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [{ id: "complement", label: "Complement strand", kind: "string" }],
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
      complement: [...sequence].map((base) => complements[base]).join(""),
    };
  },
});
export const runComplementDna = complementDnaTool.execute;
export default complementDnaTool;
