import { createSimpleTool, simpleError } from "../../core/simple.js";
export const combinationCountTool = createSimpleTool({
  id: "combinatorics/combination-count",
  title: "Combination Count Calculator",
  description:
    "Calculate the number of unordered ways to choose k items from n items.",
  inputs: [
    { id: "n", label: "Total items", kind: "integer", minimum: 0 },
    { id: "k", label: "Chosen items", kind: "integer", minimum: 0 },
  ],
  outputs: [{ id: "combinations", label: "Combinations", kind: "integer" }],
  calculate: (input) => {
    const n = input.n as number;
    const kInput = input.k as number;
    if (kInput > n)
      simpleError("k", "Chosen items must not exceed total items.");
    const k = Math.min(kInput, n - kInput);
    let result = 1;
    for (let index = 1; index <= k; index += 1) {
      result = (result * (n - k + index)) / index;
      if (!Number.isSafeInteger(result))
        simpleError("n", "The result exceeds the safe integer range.");
    }
    return { combinations: result };
  },
});
export const runCombinationCount = combinationCountTool.execute;
export default combinationCountTool;
