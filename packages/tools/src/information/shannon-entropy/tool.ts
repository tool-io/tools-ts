import { createSimpleTool, simpleError } from "../../core/simple.js";
export const shannonEntropyTool = createSimpleTool({
  id: "information/shannon-entropy",
  title: "Shannon Entropy Calculator",
  description:
    "Calculate Shannon entropy in bits from a discrete probability distribution.",
  inputs: [{ id: "probabilities", label: "Probabilities", kind: "numberList" }],
  outputs: [
    { id: "entropyBits", label: "Entropy", kind: "number", unit: "bit" },
  ],
  calculate: (input) => {
    const values = input.probabilities as number[];
    if (values.length === 0 || values.some((value) => value < 0))
      simpleError("probabilities", "Enter nonnegative probabilities.");
    const sum = values.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 1e-12)
      simpleError("probabilities", "Probabilities must sum to one.");
    return {
      entropyBits: -values.reduce(
        (total, value) => total + (value === 0 ? 0 : value * Math.log2(value)),
        0,
      ),
    };
  },
});
export const runShannonEntropy = shannonEntropyTool.execute;
export default shannonEntropyTool;
