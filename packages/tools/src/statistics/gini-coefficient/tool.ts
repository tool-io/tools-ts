import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const giniCoefficient = (values: readonly number[]): number => {
  if (!values.length) simpleError("values", "Provide at least one value.");
  if (values.some((value) => value < 0))
    simpleError("values", "Gini values must be nonnegative.");
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  if (!(sum > 0) || !Number.isFinite(sum))
    simpleError("values", "Values must have a finite positive sum.");
  const weighted = sorted.reduce(
    (sum, value, index) => sum + (index + 1) * value,
    0,
  );
  return (
    (2 * weighted) / (sorted.length * sum) - (sorted.length + 1) / sorted.length
  );
};

export const example = {
  input: { values: [0, 0, 1, 1] },
  output: { coefficient: 0.5 },
} satisfies ToolExample<
  { readonly values: number[] },
  { readonly coefficient: number }
>;

export const tool = createSimpleTool({
  id: "statistics/gini-coefficient",
  title: "Gini Coefficient Calculator",
  description:
    "Calculate the 0–1 Gini inequality coefficient for nonnegative observations using the sorted-sum formula. An all-zero sample is undefined, not perfectly equal.",
  inputs: [{ id: "values", kind: "numberList", label: "Observations" }],
  outputs: [{ id: "coefficient", kind: "number", label: "Gini coefficient" }],
  calculate: (input) => ({
    coefficient: giniCoefficient(input.values as number[]),
  }),
});
export type GiniCoefficientInput = Readonly<typeof example.input>;
export type GiniCoefficientOutput = Readonly<typeof example.output>;
export const giniCoefficientTool = tool;
export const runGiniCoefficient = tool.execute;
export default tool;
