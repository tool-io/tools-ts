import { createSimpleTool, simpleError } from "../../core/simple.js";

export const meanTool = createSimpleTool({
  id: "statistics/mean",
  title: "Mean Calculator",
  description: "Calculate the arithmetic mean of a finite numeric list.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "mean", label: "Mean", kind: "number" }],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    if (!Number.isFinite(mean))
      simpleError("values", "The mean exceeds the finite number range.");
    return { mean };
  },
});

export const runMean = meanTool.execute;
export default meanTool;
