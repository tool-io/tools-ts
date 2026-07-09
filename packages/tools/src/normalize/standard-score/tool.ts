import { createSimpleTool, simpleError } from "../../core/simple.js";
export const standardScoreTool = createSimpleTool({
  id: "normalize/standard-score",
  title: "Standardize Dataset Tool",
  description: "Standardize a numeric dataset to population z-scores.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    { id: "values", label: "Standard scores", kind: "numberList" },
    { id: "mean", label: "Mean", kind: "number" },
    {
      id: "standardDeviation",
      label: "Population standard deviation",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    const mean = values.reduce((a, b) => a + b, 0) / values.length,
      standardDeviation = Math.sqrt(
        values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
          values.length,
      );
    if (standardDeviation === 0)
      simpleError("values", "Values need nonzero variation.");
    return {
      values: values.map((value) => (value - mean) / standardDeviation),
      mean,
      standardDeviation,
    };
  },
});
export const runStandardScore = standardScoreTool.execute;
export default standardScoreTool;
