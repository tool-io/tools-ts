import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const primerSelfDimerTmExample = {
  input: { sequence: "GCGATTATCGC" },
  output: { dimerRisk: true, longestSelfComplementRun: 5 },
} satisfies ToolExample<
  { readonly sequence: string },
  { readonly dimerRisk: boolean; readonly longestSelfComplementRun: number }
>;

export const primerSelfDimerTmTool = createSimpleTool({
  id: "biology/primer-self-dimer-tm",
  title: "Self-Dimer Tm Risk",
  description:
    "Screen a primer for self-dimer risk by aligning it with its reverse complement, finding the longest contiguous complementary run, and flagging runs of at least five bases.",
  inputs: [
    {
      description:
        "Primer sequence of at least eight nucleotides using only uppercase A, C, G and T.",
      id: "sequence",
      label: "Sequence",
      kind: "string",
    },
  ],
  outputs: [
    {
      description:
        "Length in bases of the longest perfect complementary run across all self-alignments.",
      id: "longestSelfComplementRun",
      label: "Longest self-complement run",
      kind: "integer",
    },
    {
      description:
        "True when the longest self-complementary run is at least five bases.",
      id: "dimerRisk",
      label: "Dimer risk",
      kind: "boolean",
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
    if (sequence.length < 8)
      simpleError(
        "sequence",
        "Sequence must be at least eight nucleotides long.",
        "short_sequence",
      );
    const complements: Record<string, string> = {
      A: "T",
      C: "G",
      G: "C",
      T: "A",
    };
    const bases = [...sequence];
    const reverseComplement = bases.map((base) => complements[base]).reverse();
    let longestSelfComplementRun = 0;
    for (
      let offset = -reverseComplement.length + 1;
      offset < bases.length;
      offset += 1
    ) {
      let run = 0;
      for (
        let index = Math.max(0, offset);
        index < Math.min(bases.length, offset + reverseComplement.length);
        index += 1
      ) {
        if (bases[index] === reverseComplement[index - offset]) {
          run += 1;
          longestSelfComplementRun = Math.max(longestSelfComplementRun, run);
        } else {
          run = 0;
        }
      }
    }
    return {
      longestSelfComplementRun,
      dimerRisk: longestSelfComplementRun >= 5,
    };
  },
});
export const runPrimerSelfDimerTm = primerSelfDimerTmTool.execute;
export default primerSelfDimerTmTool;
