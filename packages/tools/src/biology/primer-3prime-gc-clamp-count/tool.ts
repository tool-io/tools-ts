import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Primer3primeGcClampCountInput = {
  readonly sequence: string;
};

export type Primer3primeGcClampCountOutput = {
  readonly clampCount: number;
};

export const primer3primeGcClampCountExample = {
  input: { sequence: "ATGGCCG" },
  output: { clampCount: 3 },
} satisfies ToolExample<
  Primer3primeGcClampCountInput,
  Primer3primeGcClampCountOutput
>;

export const primer3primeGcClampCountTool = createSimpleTool({
  id: "biology/primer-3prime-gc-clamp-count",
  title: "3' GC Clamp Count",
  description:
    "Count guanine and cytosine bases among the last three nucleotides of a primer sequence.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [{ id: "clampCount", label: "GC clamp count", kind: "integer" }],
  calculate: (input) => {
    const sequence = input.sequence as string;
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (sequence.length < 3)
      simpleError(
        "sequence",
        "Sequence must be at least three nucleotides long.",
        "sequence_too_short",
      );
    let clampCount = 0;
    for (const base of sequence.slice(-3)) {
      if (base === "G" || base === "C") clampCount += 1;
    }
    return { clampCount };
  },
});
export const runPrimer3primeGcClampCount = primer3primeGcClampCountTool.execute;
export default primer3primeGcClampCountTool;
