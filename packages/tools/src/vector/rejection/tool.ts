import { createSimpleTool, simpleError } from "../../core/simple.js";
export const rejectionTool = createSimpleTool({
  id: "vector/rejection",
  title: "Vector Rejection Calculator",
  description:
    "Calculate the component of a vector perpendicular to a nonzero basis vector.",
  inputs: [
    { id: "vector", label: "Vector", kind: "numberList", format: "vector" },
    { id: "onto", label: "Basis vector", kind: "numberList", format: "vector" },
  ],
  outputs: [
    { id: "vector", label: "Rejection", kind: "numberList", format: "vector" },
  ],
  calculate: (input) => {
    const vector = input.vector as number[],
      onto = input.onto as number[];
    if (vector.length === 0 || vector.length !== onto.length)
      simpleError("onto", "Vectors must have the same nonzero length.");
    const denominator = onto.reduce((sum, value) => sum + value * value, 0);
    if (denominator === 0)
      simpleError("onto", "Basis vector must have nonzero magnitude.");
    const scalar =
      vector.reduce((sum, value, index) => sum + value * onto[index]!, 0) /
      denominator;
    return {
      vector: vector.map((value, index) => value - onto[index]! * scalar),
    };
  },
});
export const runRejection = rejectionTool.execute;
export default rejectionTool;
