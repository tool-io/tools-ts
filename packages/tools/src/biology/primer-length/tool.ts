import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const primerLengthExample = {
  input: { length: 22 },
} satisfies ToolExample<{ readonly length: number }>;

export const primerLengthTool = createSimpleTool({
  id: "biology/primer-length",
  title: "Primer Length Check",
  description:
    "Check whether a primer length in bases falls in the optimal 18 to 25 range.",
  inputs: [
    { id: "length", label: "Primer length", kind: "integer", unit: "nt" },
  ],
  outputs: [
    { id: "optimal", label: "Optimal length", kind: "boolean" },
    { id: "length", label: "Primer length", kind: "integer", unit: "nt" },
  ],
  calculate: (input) => {
    const length = input.length as number;
    return { optimal: length >= 18 && length <= 25, length };
  },
});
export const runPrimerLength = primerLengthTool.execute;
export default primerLengthTool;
