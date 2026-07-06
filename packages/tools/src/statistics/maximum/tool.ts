import { createSimpleTool, simpleError } from "../../core/simple.js";
export const maximumTool = createSimpleTool({
  id: "statistics/maximum",
  title: "Maximum Value Calculator",
  description: "Return the largest value in a finite numeric list.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "maximum", label: "Maximum", kind: "number" }],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    return { maximum: Math.max(...values) };
  },
});
export const runMaximum = maximumTool.execute;
export default maximumTool;
