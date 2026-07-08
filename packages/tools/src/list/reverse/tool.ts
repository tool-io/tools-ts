import { createSimpleTool } from "../../core/simple.js";
export const reverseTool = createSimpleTool({
  id: "list/reverse",
  title: "Reverse List Tool",
  description: "Reverse a string list without modifying the input.",
  inputs: [{ id: "values", label: "Values", kind: "stringList" }],
  outputs: [{ id: "values", label: "Reversed values", kind: "stringList" }],
  calculate: (input) => {
    return { values: [...(input.values as string[])].reverse() };
  },
});
export const runReverse = reverseTool.execute;
export default reverseTool;
