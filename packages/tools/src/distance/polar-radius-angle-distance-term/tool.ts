import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstRadius: number;
  secondRadius: number;
  angleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstRadius", label: "First radius", kind: "number" },
  { id: "secondRadius", label: "Second radius", kind: "number" },
  { id: "angleDegrees", label: "Angle degrees", kind: "number", unit: "deg" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.firstRadius >= 0 && i.secondRadius >= 0);
  H.bounded(i.angleDegrees, 0, 180);
  return H.finish({
    squaredDistance:
      (i.firstRadius - i.secondRadius) ** 2 +
      4 *
        i.firstRadius *
        i.secondRadius *
        Math.sin(H.radians(i.angleDegrees) / 2) ** 2,
  });
};
export const example = {
  input: { firstRadius: 2, secondRadius: 2, angleDegrees: 60 },
  output: { result: { squaredDistance: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/polar-radius-angle-distance-term",
  title: "Distance: Polar Radius Angle Distance Term Tool",
  description:
    "Evaluate squared planar polar-point separation using radial gap plus a stable half-angle angular term, with explicit nonnegative radii and minor angular separation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { squaredDistance: { type: "number" } },
        required: ["squaredDistance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
