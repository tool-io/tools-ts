import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const sequenceLengthExample = {
  input: { sequence: "ATGCAG" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const sequenceLengthTool = createSimpleTool({
  id: "biology/sequence-length",
  title: "Sequence Length",
  description: "Count the number of characters in a nucleotide sequence.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    {
      id: "length",
      label: "Length",
      kind: "integer",
      format: "count",
      unit: "nt",
    },
  ],
  calculate: (input) => ({ length: (input.sequence as string).length }),
});
export const runSequenceLength = sequenceLengthTool.execute;
export default sequenceLengthTool;
