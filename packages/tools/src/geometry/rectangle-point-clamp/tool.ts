import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  point: readonly number[];
  rectangle: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "point", label: "point", kind: "numberList" },
  { id: "rectangle", label: "rectangle", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.point(i.point);
  H.rect(i.rectangle);
  return H.finish({
    point: [
      Math.max(i.rectangle[0], Math.min(i.rectangle[2], i.point[0])),
      Math.max(i.rectangle[1], Math.min(i.rectangle[3], i.point[1])),
    ],
  });
};
export const example = {
  input: { point: [3, -1], rectangle: [0, 0, 2, 2] },
  output: { result: { point: [2, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/rectangle-point-clamp",
  title: "Rectangle Point Clamp",
  description:
    "Clamp a finite planar point to a closed axis-aligned rectangle, allowing degenerate rectangle axes; no polygon or geographic containment.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
