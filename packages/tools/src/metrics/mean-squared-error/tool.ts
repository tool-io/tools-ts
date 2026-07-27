import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const meanSquaredErrorExample = {
  input: { actual: [1, 2, 3], predicted: [2, 2, 4] },
} satisfies ToolExample<{
  readonly actual: readonly number[];
  readonly predicted: readonly number[];
}>;

export const meanSquaredErrorTool = createSimpleTool({
  id: "metrics/mean-squared-error",
  title: "Mean Squared Error Calculator",
  description: "Calculate mean squared prediction error.",
  inputs: [
    { id: "actual", label: "Actual values", kind: "numberList" },
    { id: "predicted", label: "Predicted values", kind: "numberList" },
  ],
  outputs: [
    { id: "meanSquaredError", label: "Mean squared error", kind: "number" },
  ],
  calculate: (input) => {
    const actual = input.actual as number[],
      predicted = input.predicted as number[];
    if (actual.length === 0 || actual.length !== predicted.length)
      simpleError("predicted", "Lists must have the same nonzero length.");
    return {
      meanSquaredError:
        actual.reduce(
          (sum, value, index) => sum + (value - predicted[index]!) ** 2,
          0,
        ) / actual.length,
    };
  },
});
export const runMeanSquaredError = meanSquaredErrorTool.execute;
export default meanSquaredErrorTool;
