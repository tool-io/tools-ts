import { createSimpleTool, simpleError } from "../../core/simple.js";
export const crossProductTool = createSimpleTool({
  id: "vector/cross-product",
  title: "Vector Cross Product Calculator",
  description: "Calculate the three-dimensional cross product of two vectors.",
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
      label: "Cross product",
      kind: "numberList",
      format: "vector",
    },
  ],
  calculate: (input) => {
    const a = input.first as number[],
      b = input.second as number[];
    if (a.length !== 3 || b.length !== 3)
      simpleError(
        "second",
        "Cross product requires two three-dimensional vectors.",
      );
    return {
      vector: [
        a[1]! * b[2]! - a[2]! * b[1]!,
        a[2]! * b[0]! - a[0]! * b[2]!,
        a[0]! * b[1]! - a[1]! * b[0]!,
      ],
    };
  },
});
export const runCrossProduct = crossProductTool.execute;
export default crossProductTool;
