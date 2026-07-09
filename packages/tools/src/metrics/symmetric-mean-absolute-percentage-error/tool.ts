import { createSimpleTool, simpleError } from "../../core/simple.js";
export const symmetricMeanAbsolutePercentageErrorTool = createSimpleTool({
  id: "metrics/symmetric-mean-absolute-percentage-error",
  title: "Symmetric Mean Absolute Percentage Error Calculator",
  description: "Calculate symmetric mean absolute percentage error.",
  inputs: [
    { id: "actual", label: "Actual values", kind: "numberList" },
    { id: "predicted", label: "Predicted values", kind: "numberList" },
  ],
  outputs: [{ id: "percent", label: "SMAPE", kind: "number", unit: "%" }],
  calculate: (input) => {
    const actual = input.actual as number[],
      predicted = input.predicted as number[];
    if (actual.length === 0 || actual.length !== predicted.length)
      simpleError("predicted", "Lists must have the same nonzero length.");
    let total = 0;
    for (let i = 0; i < actual.length; i++) {
      const denominator = Math.abs(actual[i]!) + Math.abs(predicted[i]!);
      total +=
        denominator === 0
          ? 0
          : (2 * Math.abs(actual[i]! - predicted[i]!)) / denominator;
    }
    return { percent: (total / actual.length) * 100 };
  },
});
export const runSymmetricMeanAbsolutePercentageError =
  symmetricMeanAbsolutePercentageErrorTool.execute;
export default symmetricMeanAbsolutePercentageErrorTool;
