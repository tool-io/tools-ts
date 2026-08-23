import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolylineLengthInput = {
  readonly xs?: readonly number[];
  readonly ys?: readonly number[];
};

export type PolylineLengthOutput = {
  readonly length: number;
};

export const calculatePolylineLength = (
  input: PolylineLengthInput,
): PolylineLengthOutput => {
  const xs = input.xs ?? [0, 3, 3];
  const ys = input.ys ?? [0, 0, 4];
  if (xs.length !== ys.length || xs.length < 2)
    return simpleError(
      "xs",
      "xs and ys must have equal lengths with at least two points.",
      "invalid_polyline",
    );
  let total = 0;
  for (let index = 1; index < xs.length; index += 1) {
    const dx = xs[index] - xs[index - 1];
    const dy = ys[index] - ys[index - 1];
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return { length: total };
};

export const polylineLengthExample = {
  input: {
    xs: [0, 3, 3],
    ys: [0, 0, 4],
  },
  output: {
    length: 7,
  },
} satisfies ToolExample<PolylineLengthInput, PolylineLengthOutput>;

export const polylineLengthTool = createSimpleTool({
  id: "geometry/polyline-length",
  title: "Polyline Length Calculator",
  description:
    "Sum the Euclidean distances between consecutive points of a polyline given as parallel coordinate lists.",
  inputs: [
    {
      description: "Point x coordinates in order along the polyline.",
      default: [0, 3, 3],
      id: "xs",
      kind: "numberList",
      label: "X coordinates",
    },
    {
      description: "Point y coordinates matching xs.",
      default: [0, 0, 4],
      id: "ys",
      kind: "numberList",
      label: "Y coordinates",
    },
  ],
  outputs: [
    {
      description: "Total polyline length.",
      id: "length",
      kind: "number",
      label: "Length",
    },
  ],
  calculate: (input) =>
    calculatePolylineLength({
      xs: input.xs as readonly number[] | undefined,
      ys: input.ys as readonly number[] | undefined,
    }),
});

export const runPolylineLength = polylineLengthTool.execute;
export default polylineLengthTool;
