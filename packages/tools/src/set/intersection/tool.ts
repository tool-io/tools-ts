import { createSimpleTool } from "../../core/simple.js";
export const intersectionTool = createSimpleTool({
  id: "set/intersection",
  title: "List Intersection Tool",
  description: "Return unique strings shared by two lists.",
  inputs: [
    { id: "first", label: "First list", kind: "stringList" },
    { id: "second", label: "Second list", kind: "stringList" },
  ],
  outputs: [{ id: "values", label: "Intersection", kind: "stringList" }],
  calculate: (input) => {
    const second = new Set(input.second as string[]);
    return {
      values: [...new Set(input.first as string[])].filter((value) =>
        second.has(value),
      ),
    };
  },
});
export const runIntersection = intersectionTool.execute;
export default intersectionTool;
