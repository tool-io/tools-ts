import { createSimpleTool } from "../../core/simple.js";
export const differenceTool = createSimpleTool({
  id: "set/difference",
  title: "List Difference Tool",
  description:
    "Return unique values from the first string list that are absent from the second.",
  inputs: [
    { id: "first", label: "First list", kind: "stringList" },
    { id: "second", label: "Second list", kind: "stringList" },
  ],
  outputs: [{ id: "values", label: "Difference", kind: "stringList" }],
  calculate: (input) => {
    const second = new Set(input.second as string[]);
    return {
      values: [...new Set(input.first as string[])].filter(
        (value) => !second.has(value),
      ),
    };
  },
});
export const runDifference = differenceTool.execute;
export default differenceTool;
