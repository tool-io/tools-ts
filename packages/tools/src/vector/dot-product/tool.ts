import { createSimpleTool, simpleError } from "../../core/simple.js";
export const dotProductTool = createSimpleTool({
  id: "vector/dot-product",
  title: "Dot Product Calculator",
  description:
    "Calculate the scalar dot product of equal-length numeric vectors.",
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
  outputs: [{ id: "dotProduct", label: "Dot product", kind: "number" }],
  calculate: (input) => {
    const first = input.first as number[],
      second = input.second as number[];
    if (first.length === 0 || first.length !== second.length)
      simpleError("second", "Vectors must have the same nonzero length.");
    return {
      dotProduct: first.reduce(
        (sum, value, index) => sum + value * second[index]!,
        0,
      ),
    };
  },
});
export const runDotProduct = dotProductTool.execute;
export default dotProductTool;
