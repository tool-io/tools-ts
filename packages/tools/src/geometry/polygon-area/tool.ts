import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolygonAreaInput = {
  readonly xs?: readonly number[];
  readonly ys?: readonly number[];
};

export type PolygonAreaOutput = {
  readonly area: number;
};

export const calculatePolygonArea = (
  input: PolygonAreaInput,
): PolygonAreaOutput => {
  const xs = input.xs ?? [0, 4, 4, 0];
  const ys = input.ys ?? [0, 0, 3, 3];
  const count = xs.length;
  if (ys.length !== count || count < 3)
    return simpleError(
      "xs",
      "xs and ys must have equal lengths with at least three vertices.",
      "invalid_polygon",
    );
  const doubled = xs.reduce(
    (sum, x, index) =>
      sum + x * ys[(index + 1) % count] - xs[(index + 1) % count] * ys[index],
    0,
  );
  return { area: Math.abs(doubled) / 2 };
};

export const polygonAreaExample = {
  input: {
    xs: [0, 4, 0],
    ys: [0, 0, 3],
  },
  output: {
    area: 6,
  },
} satisfies ToolExample<PolygonAreaInput, PolygonAreaOutput>;

export const polygonAreaTool = createSimpleTool({
  id: "geometry/polygon-area",
  title: "Polygon Area Calculator",
  description:
    "Compute the area of a simple polygon from parallel vertex coordinate lists using the shoelace formula.",
  inputs: [
    {
      description: "Vertex x coordinates in order around the polygon.",
      default: [0, 4, 4, 0],
      id: "xs",
      kind: "numberList",
      label: "X coordinates",
    },
    {
      description: "Vertex y coordinates matching xs.",
      default: [0, 0, 3, 3],
      id: "ys",
      kind: "numberList",
      label: "Y coordinates",
    },
  ],
  outputs: [
    {
      description: "Absolute enclosed area in square units.",
      id: "area",
      kind: "number",
      label: "Area",
    },
  ],
  calculate: (input) =>
    calculatePolygonArea({
      xs: input.xs as readonly number[] | undefined,
      ys: input.ys as readonly number[] | undefined,
    }),
});

export const runPolygonArea = polygonAreaTool.execute;
export default polygonAreaTool;
