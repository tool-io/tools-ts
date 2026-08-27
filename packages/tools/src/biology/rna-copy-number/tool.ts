import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rnaCopyNumberExample = {
  input: { lengthNt: 1000, massNg: 1 },
} satisfies ToolExample<{
  readonly lengthNt: number;
  readonly massNg: number;
}>;

export const rnaCopyNumberTool = createSimpleTool({
  id: "biology/rna-copy-number",
  title: "RNA Copy Number",
  description:
    "Calculate the number of RNA molecules from mass in nanograms and length in nucleotides.",
  inputs: [
    { id: "massNg", label: "Mass", kind: "number", unit: "ng" },
    { id: "lengthNt", label: "Length", kind: "number", unit: "nt" },
  ],
  outputs: [{ id: "copyCount", label: "Copy count", kind: "number" }],
  calculate: (input) => {
    const massNg = input.massNg as number;
    const lengthNt = input.lengthNt as number;
    if (massNg <= 0)
      simpleError("massNg", "Mass must be positive.", "invalid_mass");
    if (lengthNt <= 0)
      simpleError("lengthNt", "Length must be positive.", "invalid_length");
    return {
      copyCount: (massNg * 6.022e23) / (lengthNt * 340 * 1e9),
    };
  },
});
export const runRnaCopyNumber = rnaCopyNumberTool.execute;
export default rnaCopyNumberTool;
