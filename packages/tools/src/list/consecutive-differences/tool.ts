import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConsecutiveDifferencesInput = {
  readonly values: readonly number[];
};

export type ConsecutiveDifferencesOutput = {
  readonly differences: number[];
};

export const consecutiveDifferencesExample = {
  input: { values: [10, 12, 9] },
  output: { differences: [2, -3] },
} satisfies ToolExample<
  ConsecutiveDifferencesInput,
  ConsecutiveDifferencesOutput
>;

export const calculateConsecutiveDifferences = (
  input: ConsecutiveDifferencesInput,
): ConsecutiveDifferencesOutput => {
  const values = input.values as readonly number[];
  if (values.length < 2)
    simpleError(
      "values",
      "Provide at least two values.",
      "insufficient_values",
    );
  const differences: number[] = [];
  for (let index = 1; index < values.length; index += 1)
    differences.push(values[index]! - values[index - 1]!);
  return { differences };
};

export const consecutiveDifferencesTool = createSimpleTool({
  calculate: (input) =>
    calculateConsecutiveDifferences(
      input as unknown as ConsecutiveDifferencesInput,
    ),
  description:
    "Compute the pairwise differences between consecutive dataset values.",
  id: "list/consecutive-differences",
  inputs: [
    {
      description: "Values in sequence order.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
  ],
  outputs: [
    {
      description:
        "Differences of length one less than the input, values[i + 1] minus values[i].",
      id: "differences",
      kind: "numberList",
      label: "Differences",
    },
  ],
  title: "Dataset Consecutive Differences Tool",
});
export const runConsecutiveDifferences = consecutiveDifferencesTool.execute;
export default consecutiveDifferencesTool;
