import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rootMeanSquaredErrorExample = {
  input: { actual: [1, 2, 3], predicted: [2, 2, 4] },
} satisfies ToolExample<{
  readonly actual: readonly number[];
  readonly predicted: readonly number[];
}>;

export const rootMeanSquaredErrorTool = createSimpleTool({
  id: "metrics/root-mean-squared-error",
  title: "Root Mean Squared Error Calculator",
  description: "Calculate the square root of mean squared prediction error.",
  inputs: [
    { id: "actual", label: "Actual values", kind: "numberList" },
    { id: "predicted", label: "Predicted values", kind: "numberList" },
  ],
  outputs: [
    {
      id: "rootMeanSquaredError",
      label: "Root mean squared error",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const actual = input.actual as number[],
      predicted = input.predicted as number[];
    if (actual.length === 0 || actual.length !== predicted.length)
      simpleError("predicted", "Lists must have the same nonzero length.");
    return {
      rootMeanSquaredError: Math.sqrt(
        actual.reduce(
          (sum, value, index) => sum + (value - predicted[index]!) ** 2,
          0,
        ) / actual.length,
      ),
    };
  },
});
export const runRootMeanSquaredError = rootMeanSquaredErrorTool.execute;
export default rootMeanSquaredErrorTool;
