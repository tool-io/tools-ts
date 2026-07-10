import { createSimpleTool, simpleError } from "../../core/simple.js";
export const l1NormTool = createSimpleTool({
  id: "vector/l1-norm",
  title: "Vector L1 Norm Calculator",
  description: "Calculate the sum of absolute vector components.",
  inputs: [
    { id: "vector", label: "Vector", kind: "numberList", format: "vector" },
  ],
  outputs: [{ id: "norm", label: "L1 norm", kind: "number" }],
  calculate: (input) => {
    const vector = input.vector as number[];
    if (vector.length === 0) simpleError("vector", "Enter a nonempty vector.");
    return { norm: vector.reduce((sum, value) => sum + Math.abs(value), 0) };
  },
});
export const runL1Norm = l1NormTool.execute;
export default l1NormTool;
