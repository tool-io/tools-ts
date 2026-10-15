import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  point: readonly number[];
  start: readonly number[];
  end: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "point", label: "point", kind: "numberList" },
  { id: "start", label: "start", kind: "numberList" },
  { id: "end", label: "end", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = Math.max(
    0,
    Math.min(1, H.segmentParameter(i.point, i.start, i.end)),
  );
  return H.finish({
    parameter: t,
    point: i.start.map((x, j) => x + t * (i.end[j] - x)),
    distance: Math.hypot(
      ...i.point.map((x, j) => x - i.start[j] - t * (i.end[j] - i.start[j])),
    ),
  });
};
export const example = {
  input: { point: [3, 1], start: [0, 0], end: [2, 0] },
  output: {
    result: { parameter: 1, point: [2, 0], distance: 1.4142135623730951 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Point Segment Clamped Nearest Point", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/point-segment-clamped-nearest",
  title: "Point Segment Clamped Nearest Point",
  description:
    "Find the clamped nearest point on a nondegenerate planar segment and its Euclidean distance; finite number arithmetic, not a spatial index.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parameter: { type: "number" },
          point: { type: "array", items: { type: "number" } },
          distance: { type: "number" },
        },
        required: ["parameter", "point", "distance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
