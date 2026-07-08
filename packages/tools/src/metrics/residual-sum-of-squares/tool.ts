import { createSimpleTool, simpleError } from "../../core/simple.js";
export const residualSumOfSquaresTool = createSimpleTool({
  id: "metrics/residual-sum-of-squares",
  title: "Residual Sum of Squares Calculator",
  description:
    "Calculate the sum of squared residuals between actual and predicted values.",
  inputs: [
    { id: "actual", label: "Actual values", kind: "numberList" },
    { id: "predicted", label: "Predicted values", kind: "numberList" },
  ],
  outputs: [
    {
      id: "residualSumOfSquares",
      label: "Residual sum of squares",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const actual = input.actual as number[],
      predicted = input.predicted as number[];
    if (actual.length === 0 || actual.length !== predicted.length)
      simpleError("predicted", "Lists must have the same nonzero length.");
    return {
      residualSumOfSquares: actual.reduce(
        (sum, value, index) => sum + (value - predicted[index]!) ** 2,
        0,
      ),
    };
  },
});
export const runResidualSumOfSquares = residualSumOfSquaresTool.execute;
export default residualSumOfSquaresTool;
