import { createSimpleTool, simpleError } from "../../core/simple.js";
export const magnitudeTool = createSimpleTool({
  id: "vector/magnitude",
  title: "Vector Magnitude Calculator",
  description: "Calculate the Euclidean magnitude of a numeric vector.",
  inputs: [
    { id: "vector", label: "Vector", kind: "numberList", format: "vector" },
  ],
  outputs: [{ id: "magnitude", label: "Magnitude", kind: "number" }],
  calculate: (input) => {
    const vector = input.vector as number[];
    if (vector.length === 0) simpleError("vector", "Enter a nonempty vector.");
    return { magnitude: Math.hypot(...vector) };
  },
});
export const runMagnitude = magnitudeTool.execute;
export default magnitudeTool;
