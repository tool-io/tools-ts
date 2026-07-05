import { createSimpleTool } from "../../core/simple.js";
export const unionTool = createSimpleTool({
  id: "set/union",
  title: "List Union Tool",
  description:
    "Return unique strings from two lists in first-occurrence order.",
  inputs: [
    { id: "first", label: "First list", kind: "stringList" },
    { id: "second", label: "Second list", kind: "stringList" },
  ],
  outputs: [{ id: "values", label: "Union", kind: "stringList" }],
  calculate: (input) => {
    return {
      values: [
        ...new Set([
          ...(input.first as string[]),
          ...(input.second as string[]),
        ]),
      ],
    };
  },
});
export const runUnion = unionTool.execute;
export default unionTool;
