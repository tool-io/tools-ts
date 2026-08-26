import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const gcContentExample = {
  input: { sequence: "GATTACA" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const gcContentTool = createSimpleTool({
  id: "biology/gc-content",
  title: "GC Content Calculator",
  description: "Calculate the percentage of G and C bases in a DNA sequence.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [{ id: "gcPercent", label: "GC percent", kind: "number" }],
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
    let gcBases = 0;
    for (const base of sequence) if (base === "G" || base === "C") gcBases += 1;
    return { gcPercent: (gcBases / sequence.length) * 100 };
  },
});
export const runGcContent = gcContentTool.execute;
export default gcContentTool;
