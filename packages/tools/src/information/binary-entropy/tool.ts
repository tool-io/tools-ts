import { createSimpleTool } from "../../core/simple.js";
export const binaryEntropyTool = createSimpleTool({
  id: "information/binary-entropy",
  title: "Binary Entropy Calculator",
  description: "Calculate binary Shannon entropy in bits.",
  inputs: [
    {
      id: "probability",
      label: "Probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "entropyBits", label: "Entropy", kind: "number", unit: "bit" },
  ],
  calculate: (input) => {
    const p = input.probability as number;
    return {
      entropyBits:
        p === 0 || p === 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p),
    };
  },
});
export const runBinaryEntropy = binaryEntropyTool.execute;
export default binaryEntropyTool;
