import { createSimpleTool, simpleError } from "../../core/simple.js";
export const projectionTool = createSimpleTool({
  id: "vector/projection",
  title: "Vector Projection Calculator",
  description: "Project one numeric vector onto a nonzero basis vector.",
  inputs: [
    { id: "vector", label: "Vector", kind: "numberList", format: "vector" },
    { id: "onto", label: "Basis vector", kind: "numberList", format: "vector" },
  ],
  outputs: [
    { id: "vector", label: "Projection", kind: "numberList", format: "vector" },
    { id: "scalar", label: "Projection scalar", kind: "number" },
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
    return { vector: onto.map((value) => value * scalar), scalar };
  },
});
export const runProjection = projectionTool.execute;
export default projectionTool;
