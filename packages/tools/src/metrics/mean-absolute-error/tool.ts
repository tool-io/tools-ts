import { createSimpleTool, simpleError } from "../../core/simple.js";
export const meanAbsoluteErrorTool = createSimpleTool({
  id: "metrics/mean-absolute-error",
  title: "Mean Absolute Error Calculator",
  description: "Calculate mean absolute prediction error.",
  inputs: [
    { id: "actual", label: "Actual values", kind: "numberList" },
    { id: "predicted", label: "Predicted values", kind: "numberList" },
  ],
  outputs: [
    { id: "meanAbsoluteError", label: "Mean absolute error", kind: "number" },
  ],
  calculate: (input) => {
    const actual = input.actual as number[],
      predicted = input.predicted as number[];
    if (actual.length === 0 || actual.length !== predicted.length)
      simpleError("predicted", "Lists must have the same nonzero length.");
    return {
      meanAbsoluteError:
        actual.reduce(
          (sum, value, index) => sum + Math.abs(value - predicted[index]!),
          0,
        ) / actual.length,
    };
  },
});
export const runMeanAbsoluteError = meanAbsoluteErrorTool.execute;
export default meanAbsoluteErrorTool;
