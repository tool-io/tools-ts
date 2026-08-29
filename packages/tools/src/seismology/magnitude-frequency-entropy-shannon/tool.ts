import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const magnitudeFrequencyEntropyShannonExample = {
  input: { binCounts: [1, 1] },
  output: { shannonEntropyBits: 1, maxPossibleBits: 1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const magnitudeFrequencyEntropyShannonTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ binCounts }) => {
      const ns = binCounts as unknown[];
      if (!Array.isArray(ns) || ns.length === 0)
        simpleError("binCounts", "Provide counts.");
      if ((ns as number[]).some((count) => count < 0))
        simpleError("binCounts", "Bin counts cannot be negative.");
      const total = (ns as number[]).reduce((a, b) => a + b, 0);
      if (total <= 0)
        simpleError("binCounts", "Counts must sum to a positive total.");
      let h = 0;
      for (const c of ns as number[]) {
        if (c <= 0) continue;
        const p = c / total;
        h -= p * Math.log2(p);
      }
      return {
        shannonEntropyBits: h,
        maxPossibleBits: Math.log2((ns as number[]).length),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Shannon entropy H = −Σ p·log₂p over magnitude-bin probabilities.",
  id: "seismology/magnitude-frequency-entropy-shannon",
  inputs: [
    {
      description: "Counts per magnitude bin.",
      id: "binCounts",
      kind: "numberList",
      label: "n_i",
    },
  ],
  outputs: [
    {
      description: "Entropy in bits.",
      id: "shannonEntropyBits",
      kind: "number",
      label: "H",
    },
    {
      description: "Entropy of a uniform distribution over the same bins.",
      id: "maxPossibleBits",
      kind: "number",
      label: "H_max",
    },
  ],
  title: "Magnitude Frequency Entropy Shannon Calculator",
});
export const runMagnitudeFrequencyEntropyShannon =
  magnitudeFrequencyEntropyShannonTool.execute;
export { magnitudeFrequencyEntropyShannonExample as example };
export default magnitudeFrequencyEntropyShannonTool;
