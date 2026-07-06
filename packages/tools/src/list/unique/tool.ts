import { createSimpleTool } from "../../core/simple.js";
export const uniqueTool = createSimpleTool({
  id: "list/unique",
  title: "List Unique Values Tool",
  description:
    "Remove duplicate strings while preserving first occurrence order.",
  inputs: [{ id: "values", label: "Values", kind: "stringList" }],
  outputs: [{ id: "values", label: "Unique values", kind: "stringList" }],
  calculate: (input) => {
    return { values: [...new Set(input.values as string[])] };
  },
});
export const runUnique = uniqueTool.execute;
export default uniqueTool;
