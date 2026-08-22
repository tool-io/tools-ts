import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const TrianglePerimeterTool = createSimpleTool({
  id: "geometry/triangle-perimeter",
  title: "Triangle Perimeter Calculator",
  description: "Sum three side lengths of a triangle.",
  inputs: [
    { id: "sideA", label: "Side A", kind: "number", minimum: 0 },
    { id: "sideB", label: "Side B", kind: "number", minimum: 0 },
    { id: "sideC", label: "Side C", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "perimeter", label: "Perimeter", kind: "number" }],
  calculate: (input) => {
    return {
      perimeter:
        (input.sideA as number) +
        (input.sideB as number) +
        (input.sideC as number),
    };
  },
});
export default TrianglePerimeterTool;
export const runTrianglePerimeter = TrianglePerimeterTool.execute;

export type TrianglePerimeterInput = {
  readonly sideA: number;
  readonly sideB: number;
  readonly sideC: number;
};

export type TrianglePerimeterOutput = {
  readonly perimeter: number;
};

export const trianglePerimeterExample = {
  input: {
    sideA: 1,
    sideB: 1,
    sideC: 1,
  },
  output: {
    perimeter: 3,
  },
} satisfies ToolExample<TrianglePerimeterInput, TrianglePerimeterOutput>;
