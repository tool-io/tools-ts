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
  return H.finish({ parameter: H.segmentParameter(i.point, i.start, i.end) });
};
export const example = {
  input: { point: [3, 1], start: [0, 0], end: [2, 0] },
  output: { result: { parameter: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Point Segment Projection Parameter", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/point-segment-parameter",
  title: "Point Segment Projection Parameter",
  description:
    "Project a point onto the infinite supporting segment line and return the unclamped parameter; a degenerate segment is rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { parameter: { type: "number" } },
        required: ["parameter"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
