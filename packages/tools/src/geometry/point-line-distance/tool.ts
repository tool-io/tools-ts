import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pointLineDistanceExample = {
  input: { px: 3, py: 4, x1: 0, x2: 10, y1: 0, y2: 0 },
  output: { distance: 4 },
} satisfies ToolExample<PointLineDistanceInput, PointLineDistanceOutput>;

export const calculatePointLineDistance = (
  input: PointLineDistanceInput,
): PointLineDistanceOutput => {
  const dx = input.x2 - input.x1;
  const dy = input.y2 - input.y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0)
    simpleError("x1", "The two line points are identical.", "degenerate_line");
  return {
    distance:
      Math.abs(dy * (input.px - input.x1) - dx * (input.py - input.y1)) /
      Math.sqrt(lenSq),
  };
};

export type PointLineDistanceInput = {
  readonly px: number;
  readonly py: number;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
};
export type PointLineDistanceOutput = { readonly distance: number };

export const pointLineDistanceTool = createSimpleTool({
  calculate: (input) =>
    calculatePointLineDistance(input as unknown as PointLineDistanceInput),
  description:
    "Compute the shortest distance from a point to an infinite line defined by two points.",
  id: "geometry/point-line-distance",
  inputs: [
    { id: "px", kind: "number", label: "Point X" },
    { id: "py", kind: "number", label: "Point Y" },
    { id: "x1", kind: "number", label: "Line X1" },
    { id: "y1", kind: "number", label: "Line Y1" },
    { id: "x2", kind: "number", label: "Line X2" },
    { id: "y2", kind: "number", label: "Line Y2" },
  ],
  outputs: [{ id: "distance", kind: "number", label: "Distance" }],
  title: "Point to Line Distance Calculator",
});
export const runPointLineDistance = pointLineDistanceTool.execute;
export default pointLineDistanceTool;
