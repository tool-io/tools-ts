import { createSimpleTool } from "../../core/simple.js";
export const diceTool = createSimpleTool({
  id: "similarity/dice",
  title: "Sørensen–Dice Similarity Calculator",
  description:
    "Calculate Sørensen–Dice similarity between two sets of strings.",
  inputs: [
    { id: "first", label: "First set", kind: "stringList" },
    { id: "second", label: "Second set", kind: "stringList" },
  ],
  outputs: [
    {
      id: "similarity",
      label: "Similarity",
      kind: "number",
      format: "probability",
    },
  ],
  calculate: (input) => {
    const first = new Set(input.first as string[]),
      second = new Set(input.second as string[]);
    if (first.size === 0 && second.size === 0) return { similarity: 1 };
    let shared = 0;
    for (const value of first) if (second.has(value)) shared += 1;
    return { similarity: (2 * shared) / (first.size + second.size) };
  },
});
export const runDice = diceTool.execute;
export default diceTool;
