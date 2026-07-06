import { createSimpleTool, simpleError } from "../../core/simple.js";
export const meanAbsoluteDeviationTool = createSimpleTool({
  id: "statistics/mean-absolute-deviation",
  title: "Mean Absolute Deviation Calculator",
  description: "Calculate mean absolute deviation around the arithmetic mean.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      id: "meanAbsoluteDeviation",
      label: "Mean absolute deviation",
      kind: "number",
    },
    { id: "mean", label: "Mean", kind: "number" },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      meanAbsoluteDeviation:
        values.reduce((sum, value) => sum + Math.abs(value - mean), 0) /
        values.length,
      mean,
    };
  },
});
export const runMeanAbsoluteDeviation = meanAbsoluteDeviationTool.execute;
export default meanAbsoluteDeviationTool;
