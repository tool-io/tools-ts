import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const primerGcCountExample = {
  input: { sequence: "GCGCCAAA" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const primerGcCountTool = createSimpleTool({
  id: "biology/primer-gc-count",
  title: "Primer GC Percent",
  description:
    "Calculate the GC percentage of a primer sequence for clamp design checks.",
  inputs: [{ id: "sequence", label: "Primer sequence", kind: "string" }],
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
export const runPrimerGcCount = primerGcCountTool.execute;
export default primerGcCountTool;
