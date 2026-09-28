import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  semiAxisX: number;
  semiAxisY: number;
  parameterDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "semiAxisX", label: "Semi axis x", kind: "number" },
  { id: "semiAxisY", label: "Semi axis y", kind: "number" },
  {
    id: "parameterDegrees",
    label: "Parameter degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.semiAxisX);
  H.positive(i.semiAxisY);
  H.bounded(i.parameterDegrees, -360, 360);
  const t = H.radians(i.parameterDegrees),
    norm = Math.hypot(i.semiAxisX * Math.sin(t), i.semiAxisY * Math.cos(t));
  return H.finish({
    tangentVector: [-i.semiAxisX * Math.sin(t), i.semiAxisY * Math.cos(t)],
    unitTangent: [
      (-i.semiAxisX * Math.sin(t)) / norm,
      (i.semiAxisY * Math.cos(t)) / norm,
    ],
  });
};
export const example = {
  input: { semiAxisX: 2, semiAxisY: 3, parameterDegrees: 0 },
  output: { result: { tangentVector: [0, 3], unitTangent: [0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/ellipse-parametric-tangent-direction",
  title: "Geometry: Ellipse Parametric Tangent Direction Tool",
  description:
    "Evaluate the parameter derivative and oriented unit tangent of x=a*cos(t), y=b*sin(t), with positive axes; parameter is not the polar angle.",
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
          tangentVector: { type: "array", items: { type: "number" } },
          unitTangent: { type: "array", items: { type: "number" } },
        },
        required: ["tangentVector", "unitTangent"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
