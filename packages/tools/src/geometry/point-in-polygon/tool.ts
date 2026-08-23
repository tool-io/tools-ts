import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PointInPolygonInput = {
  readonly x?: number;
  readonly xs?: readonly number[];
  readonly y?: number;
  readonly ys?: readonly number[];
};

export type PointInPolygonOutput = {
  readonly inside: boolean;
  readonly onBoundary: boolean;
};

/**
 * Even-odd ray casting over the polygon given by parallel vertex lists,
 * plus an exact collinearity segment test so boundary points are reported.
 * `inside` counts the boundary as part of the polygon.
 */
export const calculatePointInPolygon = (
  input: PointInPolygonInput,
): PointInPolygonOutput => {
  const x = input.x ?? 2;
  const y = input.y ?? 1;
  const xs = input.xs ?? [0, 4, 4, 0];
  const ys = input.ys ?? [0, 0, 3, 3];
  if (xs.length !== ys.length || xs.length < 3)
    simpleError(
      "xs",
      "xs and ys must have equal lengths with at least three vertices.",
      "invalid_polygon",
    );
  let inside = false;
  let onBoundary = false;
  const count = xs.length;
  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    const xCurrent = xs[index];
    const yCurrent = ys[index];
    const xNext = xs[next];
    const yNext = ys[next];
    const cross =
      (xNext - xCurrent) * (y - yCurrent) - (yNext - yCurrent) * (x - xCurrent);
    if (
      cross === 0 &&
      Math.min(xCurrent, xNext) <= x &&
      x <= Math.max(xCurrent, xNext) &&
      Math.min(yCurrent, yNext) <= y &&
      y <= Math.max(yCurrent, yNext)
    )
      onBoundary = true;
    const straddlesRay = yCurrent > y !== yNext > y;
    if (
      straddlesRay &&
      x < ((xNext - xCurrent) * (y - yCurrent)) / (yNext - yCurrent) + xCurrent
    )
      inside = !inside;
  }
  return { inside: inside || onBoundary, onBoundary };
};

export const pointInPolygonExample = {
  input: { xs: [0, 4, 4, 0], ys: [0, 0, 3, 3], x: 2, y: 1 },
  output: { inside: true, onBoundary: false },
} satisfies ToolExample<PointInPolygonInput, PointInPolygonOutput>;

export const pointInPolygonTool = createSimpleTool({
  id: "geometry/point-in-polygon",
  title: "Point In Polygon Tester",
  description:
    "Even-odd ray-casting test of whether a point lies inside a simple polygon given as parallel vertex coordinate lists, with exact boundary detection.",
  inputs: [
    {
      default: 2,
      description: "X coordinate of the test point.",
      id: "x",
      kind: "number",
      label: "Point x",
    },
    {
      default: 1,
      description: "Y coordinate of the test point.",
      id: "y",
      kind: "number",
      label: "Point y",
    },
    {
      default: [0, 4, 4, 0],
      description: "Vertex x coordinates in order around the polygon.",
      id: "xs",
      kind: "numberList",
      label: "X coordinates",
    },
    {
      default: [0, 0, 3, 3],
      description: "Vertex y coordinates matching xs.",
      id: "ys",
      kind: "numberList",
      label: "Y coordinates",
    },
  ],
  outputs: [
    {
      description:
        "True when the point is inside the polygon or on its boundary.",
      id: "inside",
      kind: "boolean",
      label: "Inside",
    },
    {
      description: "True when the point lies exactly on a polygon edge.",
      id: "onBoundary",
      kind: "boolean",
      label: "On boundary",
    },
  ],
  calculate: (input) =>
    calculatePointInPolygon({
      x: input.x as number | undefined,
      xs: input.xs as readonly number[] | undefined,
      y: input.y as number | undefined,
      ys: input.ys as readonly number[] | undefined,
    }),
});

export const runPointInPolygon = pointInPolygonTool.execute;
export default pointInPolygonTool;
