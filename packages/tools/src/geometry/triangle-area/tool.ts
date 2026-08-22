import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const calculateTriangleArea = (
  input: TriangleAreaInput,
): TriangleAreaOutput => ({ area: (input.base * input.height) / 2 });

export const TriangleAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateTriangleArea(input as unknown as TriangleAreaInput),
  description: "Compute the area of a triangle from base and height.",
  id: "geometry/triangle-area",
  inputs: [
    {
      description: "First dimension.",
      id: "base",
      kind: "number",
      label: "Base",
      minimum: 0,
    },
    {
      description: "Second dimension.",
      id: "height",
      kind: "number",
      label: "Height",
      minimum: 0,
    },
  ],
  outputs: [{ id: "area", kind: "number", label: "Area" }],
  title: "Triangle Area Calculator",
});
export const runTriangleArea = TriangleAreaTool.execute;
export default TriangleAreaTool;

export type TriangleAreaInput = {
  readonly base: number;
  readonly height: number;
};

export type TriangleAreaOutput = {
  readonly area: number;
};

export const triangleAreaExample = {
  input: {
    base: 1,
    height: 1,
  },
  output: {
    area: 0.5,
  },
} satisfies ToolExample<TriangleAreaInput, TriangleAreaOutput>;
