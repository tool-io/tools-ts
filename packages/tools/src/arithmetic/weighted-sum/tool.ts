import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const weightedSumExample = {
  input: { values: [3, 4], weights: [2, 1] },
  output: { sum: 10 },
} satisfies ToolExample<WeightedSumInput, WeightedSumOutput>;

type WeightedSumInput = {
  readonly values: readonly number[];
  readonly weights: readonly number[];
};
type WeightedSumOutput = { readonly sum: number };

export const calculateWeightedSum = (
  input: WeightedSumInput,
): WeightedSumOutput => {
  if (input.values.length !== input.weights.length)
    simpleError(
      "weights",
      "Values and weights must have the same length.",
      "length_mismatch",
    );
  let sum = 0;
  for (let i = 0; i < input.values.length; i++)
    sum += (input.weights[i] ?? 0) * (input.values[i] ?? 0);
  return { sum: Number(sum.toPrecision(12)) };
};

export const weightedSumTool = createSimpleTool({
  calculate: (input) =>
    calculateWeightedSum(input as unknown as WeightedSumInput),
  description:
    "Compute the sum of products of weights and values from two parallel lists.",
  id: "arithmetic/weighted-sum",
  inputs: [
    {
      description: "Value list.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
    {
      description: "Corresponding weight list.",
      id: "weights",
      kind: "numberList",
      label: "Weights",
    },
  ],
  outputs: [{ id: "sum", kind: "number", label: "Weighted sum" }],
  title: "Weighted Sum Calculator",
});
export const runWeightedSum = weightedSumTool.execute;
export default weightedSumTool;
