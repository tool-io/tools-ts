import { createSimpleTool, simpleError } from "../../core/simple.js";
export const cumulativeSumTool = createSimpleTool({
  id: "list/cumulative-sum",
  title: "Cumulative Sum Calculator",
  description: "Calculate successive sums across a numeric list.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "sums", label: "Cumulative sums", kind: "numberList" }],
  calculate: (input) => {
    let sum = 0;
    const sums = (input.values as number[]).map((value) => {
      sum += value;
      if (!Number.isFinite(sum))
        simpleError("values", "A cumulative sum is not finite.");
      return sum;
    });
    return { sums };
  },
});
export const runCumulativeSum = cumulativeSumTool.execute;
export default cumulativeSumTool;
