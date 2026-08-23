import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoundingBoxInput = {
  readonly points: readonly (readonly number[])[];
};

export type BoundingBoxOutput = {
  readonly maxX: number;
  readonly maxY: number;
  readonly minX: number;
  readonly minY: number;
  readonly height: number;
  readonly width: number;
};

export const boundingBoxExample = {
  input: {
    points: [
      [0, 0],
      [4, 0],
      [4, 3],
      [1, 2],
    ],
  },
  output: { maxX: 4, maxY: 3, minX: 0, minY: 0, height: 3, width: 4 },
} satisfies ToolExample<BoundingBoxInput, BoundingBoxOutput>;

export const calculateBoundingBox = (
  input: BoundingBoxInput,
): BoundingBoxOutput => {
  if (input.points.length === 0)
    return simpleError("points", "Provide at least one point.", "empty_points");
  for (const [index, point] of input.points.entries())
    if (point.length < 2)
      return simpleError(
        "points",
        `points.${index} must contain x and y coordinates.`,
        "invalid_point",
      );
  let minX = input.points[0]![0]!;
  let minY = input.points[0]![1]!;
  let maxX = minX;
  let maxY = minY;
  for (const point of input.points) {
    minX = Math.min(minX, point[0]!);
    minY = Math.min(minY, point[1]!);
    maxX = Math.max(maxX, point[0]!);
    maxY = Math.max(maxY, point[1]!);
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    height: maxY - minY,
    width: maxX - minX,
  };
};

export const boundingBoxTool = createSimpleTool({
  calculate: (input) =>
    calculateBoundingBox({
      points: input.points as readonly (readonly number[])[],
    }),
  description:
    "Compute the axis-aligned bounding box of a set of two-dimensional points.",
  id: "geometry/bounding-box",
  inputs: [
    {
      description: "Point coordinates as [x, y] rows.",
      id: "points",
      kind: "matrix",
      label: "Points",
    },
  ],
  outputs: [
    { id: "minX", kind: "number", label: "Minimum x" },
    { id: "minY", kind: "number", label: "Minimum y" },
    { id: "maxX", kind: "number", label: "Maximum x" },
    { id: "maxY", kind: "number", label: "Maximum y" },
    { id: "width", kind: "number", label: "Width" },
    { id: "height", kind: "number", label: "Height" },
  ],
  title: "Bounding Box Calculator",
});

export const runBoundingBox = boundingBoxTool.execute;
export default boundingBoxTool;
