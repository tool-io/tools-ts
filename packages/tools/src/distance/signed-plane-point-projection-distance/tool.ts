import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  point: readonly number[];
  normal: readonly number[];
  offset: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "point", label: "Point", kind: "numberList" },
  { id: "normal", label: "Normal", kind: "numberList" },
  { id: "offset", label: "Offset", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.point.length === 3 && i.normal.length === 3);
  const norm = Math.hypot(...i.normal);
  H.positive(norm);
  const dot = i.point.reduce((s, x, j) => s + x * i.normal[j], 0);
  return H.finish({ signedDistance: (dot + i.offset) / norm });
};
export const example = {
  input: { point: [1, 2, 3], normal: [0, 0, 2], offset: -2 },
  output: { result: { signedDistance: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/signed-plane-point-projection-distance",
  title: "Distance: Signed Plane Point Projection Distance Tool",
  description:
    "Compute signed point-to-plane distance from explicit plane coefficients in three dimensions, preserving normal orientation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedDistance: { type: "number" } },
        required: ["signedDistance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
