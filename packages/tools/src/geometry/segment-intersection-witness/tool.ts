import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  a: readonly number[];
  b: readonly number[];
  c: readonly number[];
  d: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "a", label: "a", kind: "numberList" },
  { id: "b", label: "b", kind: "numberList" },
  { id: "c", label: "c", kind: "numberList" },
  { id: "d", label: "d", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish(H.intersectSegments(i.a, i.b, i.c, i.d));
};
export const example = {
  input: { a: [0, 0], b: [2, 2], c: [0, 2], d: [2, 0] },
  output: { result: { kind: "point", points: [[1, 1]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Segment Intersection Witness", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/segment-intersection-witness",
  title: "Segment Intersection Witness",
  description:
    "Return planar closed-segment intersection witnesses, including degenerate-point and collinear overlap cases; exact floating comparisons, no robust geometry guarantee.",
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
          kind: { type: "string" },
          points: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["kind", "points"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
