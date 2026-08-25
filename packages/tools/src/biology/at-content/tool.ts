import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const atContentExample = {
  input: { sequence: "GATTACA" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const atContentTool = createSimpleTool({
  id: "biology/at-content",
  title: "AT Content Calculator",
  description: "Calculate the percentage of A and T bases in a DNA sequence.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [{ id: "atPercent", label: "AT percent", kind: "number" }],
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
    let atBases = 0;
    for (const base of sequence) if (base === "A" || base === "T") atBases += 1;
    return { atPercent: (atBases / sequence.length) * 100 };
  },
});
export const runAtContent = atContentTool.execute;
export default atContentTool;
