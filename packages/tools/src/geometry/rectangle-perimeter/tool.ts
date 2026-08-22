import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const RectanglePerimeterTool = createSimpleTool({
  id: "geometry/rectangle-perimeter",
  title: "Rectangle Perimeter Calculator",
  description: "Compute perimeter of a rectangle as 2*(width+height).",
  inputs: [
    { id: "width", label: "Width", kind: "number", minimum: 0 },
    { id: "height", label: "Height", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "perimeter", label: "Perimeter", kind: "number" }],
  calculate: (input) => {
    return {
      perimeter: 2 * ((input.width as number) + (input.height as number)),
    };
  },
});
export default RectanglePerimeterTool;
export const runRectanglePerimeter = RectanglePerimeterTool.execute;

export type RectanglePerimeterInput = {
  readonly width: number;
  readonly height: number;
};

export type RectanglePerimeterOutput = {
  readonly perimeter: number;
};

export const rectanglePerimeterExample = {
  input: {
    width: 1,
    height: 1,
  },
  output: {
    perimeter: 4,
  },
} satisfies ToolExample<RectanglePerimeterInput, RectanglePerimeterOutput>;
