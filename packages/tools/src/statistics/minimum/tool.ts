import { createSimpleTool, simpleError } from "../../core/simple.js";
export const minimumTool = createSimpleTool({
  id: "statistics/minimum",
  title: "Minimum Value Calculator",
  description: "Return the smallest value in a finite numeric list.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "minimum", label: "Minimum", kind: "number" }],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    return { minimum: Math.min(...values) };
  },
});
export const runMinimum = minimumTool.execute;
export default minimumTool;
