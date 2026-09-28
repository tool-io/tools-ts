import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  lowerRadius: number;
  upperRadius: number;
  axialHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lowerRadius", label: "Lower radius", kind: "number" },
  { id: "upperRadius", label: "Upper radius", kind: "number" },
  { id: "axialHeight", label: "Axial height", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lowerRadius >= 0 && i.upperRadius >= 0);
  H.positive(i.axialHeight);
  return H.finish({
    generatrixAngleDegrees: H.degrees(
      Math.atan2(Math.abs(i.lowerRadius - i.upperRadius), i.axialHeight),
    ),
    slantLength: Math.hypot(i.lowerRadius - i.upperRadius, i.axialHeight),
  });
};
export const example = {
  input: { lowerRadius: 3, upperRadius: 0, axialHeight: 4 },
  output: {
    result: { generatrixAngleDegrees: 36.86989764584402, slantLength: 5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/cone-generatrix-angle-from-radii",
  title: "Geometry: Cone Generatrix Angle From Radii Tool",
  description:
    "Compute a right cone/frustum generatrix angle relative to its axis and slant length from explicit nonnegative radii and positive axial height.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          generatrixAngleDegrees: { type: "number" },
          slantLength: { type: "number" },
        },
        required: ["generatrixAngleDegrees", "slantLength"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
