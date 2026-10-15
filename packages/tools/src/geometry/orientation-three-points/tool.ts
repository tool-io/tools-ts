import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  a: readonly number[];
  b: readonly number[];
  c: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "a", label: "a", kind: "numberList" },
  { id: "b", label: "b", kind: "numberList" },
  { id: "c", label: "c", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  [i.a, i.b, i.c].forEach(H.point);
  const cross = H.cross(i.a, i.b, i.c);
  return H.finish({
    cross,
    orientation:
      cross > 0 ? "counterclockwise" : cross < 0 ? "clockwise" : "collinear",
  });
};
export const example = {
  input: { a: [0, 0], b: [1, 0], c: [0, 1] },
  output: { result: { cross: 1, orientation: "counterclockwise" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Three Point Orientation", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/orientation-three-points",
  title: "Three Point Orientation",
  description:
    "Orient three finite planar points by exact floating arithmetic cross-product sign; no adaptive numerical robustness, geographic coordinates or tolerance inference.",
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
          cross: { type: "number" },
          orientation: { type: "string" },
        },
        required: ["cross", "orientation"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
