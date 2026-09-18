import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  a: readonly number[];
  b: readonly number[];
  c: readonly number[];
  d: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "a", label: "a", kind: "numberList" },
  { id: "b", label: "b", kind: "numberList" },
  { id: "c", label: "c", kind: "numberList" },
  { id: "d", label: "d", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.a, i.b, i.c, i.d].forEach(H.point);
  return H.finish({
    xOverlap:
      Math.max(Math.min(i.a[0], i.b[0]), Math.min(i.c[0], i.d[0])) <=
      Math.min(Math.max(i.a[0], i.b[0]), Math.max(i.c[0], i.d[0])),
    yOverlap:
      Math.max(Math.min(i.a[1], i.b[1]), Math.min(i.c[1], i.d[1])) <=
      Math.min(Math.max(i.a[1], i.b[1]), Math.max(i.c[1], i.d[1])),
  });
};
export const example = {
  input: { a: [0, 0], b: [2, 2], c: [0, 2], d: [2, 0] },
  output: { result: { xOverlap: true, yOverlap: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/segment-axis-bounding-overlap",
  title: "Segment Axis Bounding Overlap",
  description:
    "Audit inclusive axis-envelope overlap of two planar segments; overlapping envelopes alone do not prove segment intersection.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
