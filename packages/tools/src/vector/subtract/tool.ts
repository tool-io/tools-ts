import { createSimpleTool, simpleError } from "../../core/simple.js";
export const subtractTool = createSimpleTool({
  id: "vector/subtract",
  title: "Vector Subtraction Calculator",
  description: "Subtract one equal-length numeric vector from another.",
  inputs: [
    {
      id: "first",
      label: "First vector",
      kind: "numberList",
      format: "vector",
    },
    {
      id: "second",
      label: "Second vector",
      kind: "numberList",
      format: "vector",
    },
  ],
  outputs: [
    {
      id: "vector",
      label: "Difference vector",
      kind: "numberList",
      format: "vector",
    },
  ],
  calculate: (input) => {
    const first = input.first as number[],
      second = input.second as number[];
    if (first.length === 0 || first.length !== second.length)
      simpleError("second", "Vectors must have the same nonzero length.");
    return { vector: first.map((value, index) => value - second[index]!) };
  },
});
export const runSubtract = subtractTool.execute;
export default subtractTool;
