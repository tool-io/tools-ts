import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const calculateRectangleArea = (
  input: RectangleAreaInput,
): RectangleAreaOutput => ({ area: input.width * input.height });

export const RectangleAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateRectangleArea(input as unknown as RectangleAreaInput),
  description: "Compute the area of a rectangle.",
  id: "geometry/rectangle-area",
  inputs: [
    {
      description: "First dimension.",
      id: "width",
      kind: "number",
      label: "Width",
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
  title: "Rectangle Area Calculator",
});
export const runRectangleArea = RectangleAreaTool.execute;
export default RectangleAreaTool;

export type RectangleAreaInput = {
  readonly width: number;
  readonly height: number;
};

export type RectangleAreaOutput = {
  readonly area: number;
};

export const rectangleAreaExample = {
  input: {
    width: 1,
    height: 1,
  },
  output: {
    area: 1,
  },
} satisfies ToolExample<RectangleAreaInput, RectangleAreaOutput>;
