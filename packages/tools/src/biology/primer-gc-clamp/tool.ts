import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const primerGcClampExample = {
  input: { sequence: "ACGATCGG" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const primerGcClampTool = createSimpleTool({
  id: "biology/primer-gc-clamp",
  title: "GC Clamp Check",
  description:
    "Check the GC clamp of a primer by counting guanine and cytosine bases among the last five nucleotides.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "gcClampOk", label: "GC clamp ok", kind: "boolean" },
    { id: "terminalGcCount", label: "Terminal GC count", kind: "integer" },
  ],
  calculate: (input) => {
    const sequence = input.sequence as string;
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    let terminalGcCount = 0;
    for (const base of sequence.slice(-5)) {
      if (base === "G" || base === "C") terminalGcCount += 1;
    }
    return {
      gcClampOk: terminalGcCount >= 2 && terminalGcCount <= 3,
      terminalGcCount,
    };
  },
});
export const runPrimerGcClamp = primerGcClampTool.execute;
export default primerGcClampTool;
