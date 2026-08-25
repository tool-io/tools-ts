import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const dnaCopyNumberExample = {
  input: { lengthBp: 1000, massNg: 1 },
} satisfies ToolExample<{
  readonly lengthBp: number;
  readonly massNg: number;
}>;

export const dnaCopyNumberTool = createSimpleTool({
  id: "biology/dna-copy-number",
  title: "DNA Copy Number",
  description:
    "Calculate the number of DNA molecules from mass in nanograms and length in base pairs.",
  inputs: [
    { id: "massNg", label: "Mass", kind: "number", unit: "ng" },
    { id: "lengthBp", label: "Length", kind: "integer", unit: "bp" },
  ],
  outputs: [{ id: "copyCount", label: "Copy count", kind: "number" }],
  calculate: (input) => {
    const massNg = input.massNg as number;
    const lengthBp = input.lengthBp as number;
    if (massNg <= 0)
      simpleError("massNg", "Mass must be positive.", "invalid_mass");
    if (lengthBp <= 0)
      simpleError("lengthBp", "Length must be positive.", "invalid_length");
    return {
      copyCount: (massNg * 6.022e23) / (lengthBp * 650 * 1e9),
    };
  },
});
export const runDnaCopyNumber = dnaCopyNumberTool.execute;
export default dnaCopyNumberTool;
