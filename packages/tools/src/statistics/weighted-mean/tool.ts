import { createSimpleTool, simpleError } from "../../core/simple.js";
export const weightedMeanTool = createSimpleTool({
  id: "statistics/weighted-mean",
  title: "Weighted Mean Calculator",
  description:
    "Calculate an arithmetic mean using nonnegative observation weights.",
  inputs: [
    { id: "values", label: "Values", kind: "numberList" },
    { id: "weights", label: "Weights", kind: "numberList" },
  ],
  outputs: [{ id: "weightedMean", label: "Weighted mean", kind: "number" }],
  calculate: (input) => {
    const values = input.values as number[],
      weights = input.weights as number[];
    if (values.length === 0 || values.length !== weights.length)
      simpleError(
        "weights",
        "Values and weights must have the same nonzero length.",
      );
    if (weights.some((value) => value < 0))
      simpleError("weights", "Weights must be nonnegative.");
    const total = weights.reduce((a, b) => a + b, 0);
    if (total === 0)
      simpleError("weights", "At least one weight must be positive.");
    return {
      weightedMean:
        values.reduce((sum, value, index) => sum + value * weights[index]!, 0) /
        total,
    };
  },
});
export const runWeightedMean = weightedMeanTool.execute;
export default weightedMeanTool;
