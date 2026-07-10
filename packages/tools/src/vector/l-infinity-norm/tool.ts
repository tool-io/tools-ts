import { createSimpleTool, simpleError } from "../../core/simple.js";
export const lInfinityNormTool = createSimpleTool({
  id: "vector/l-infinity-norm",
  title: "Vector L-Infinity Norm Calculator",
  description: "Calculate the maximum absolute vector component.",
  inputs: [
    { id: "vector", label: "Vector", kind: "numberList", format: "vector" },
  ],
  outputs: [{ id: "norm", label: "L-infinity norm", kind: "number" }],
  calculate: (input) => {
    const vector = input.vector as number[];
    if (vector.length === 0) simpleError("vector", "Enter a nonempty vector.");
    return { norm: Math.max(...vector.map(Math.abs)) };
  },
});
export const runLInfinityNorm = lInfinityNormTool.execute;
export default lInfinityNormTool;
