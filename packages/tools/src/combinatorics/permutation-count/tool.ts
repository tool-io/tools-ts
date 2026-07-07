import { createSimpleTool, simpleError } from "../../core/simple.js";
export const permutationCountTool = createSimpleTool({
  id: "combinatorics/permutation-count",
  title: "Permutation Count Calculator",
  description:
    "Calculate the number of ordered ways to choose k items from n items.",
  inputs: [
    { id: "n", label: "Total items", kind: "integer", minimum: 0 },
    { id: "k", label: "Chosen items", kind: "integer", minimum: 0 },
  ],
  outputs: [{ id: "permutations", label: "Permutations", kind: "integer" }],
  calculate: (input) => {
    const n = input.n as number;
    const k = input.k as number;
    if (k > n) simpleError("k", "Chosen items must not exceed total items.");
    let result = 1;
    for (let index = 0; index < k; index += 1) {
      result *= n - index;
      if (!Number.isSafeInteger(result))
        simpleError("n", "The result exceeds the safe integer range.");
    }
    return { permutations: result };
  },
});
export const runPermutationCount = permutationCountTool.execute;
export default permutationCountTool;
