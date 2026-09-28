import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  edgeLength: number;
  angleFromBaseDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgeLength", label: "Edge length", kind: "number" },
  {
    id: "angleFromBaseDegrees",
    label: "Angle from base degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.edgeLength >= 0);
  H.bounded(i.angleFromBaseDegrees, 0, 90);
  return H.finish({
    perpendicularHeight:
      i.edgeLength * Math.sin(H.radians(i.angleFromBaseDegrees)),
  });
};
export const example = {
  input: { edgeLength: 2, angleFromBaseDegrees: 30 },
  output: { result: { perpendicularHeight: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/prism-oblique-edge-height-component",
  title: "Geometry: Prism Oblique Edge Height Component Tool",
  description:
    "Compute the perpendicular height component of a prism lateral edge from its explicit angle above the base plane, not volume or a general oblique solid model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { perpendicularHeight: { type: "number" } },
        required: ["perpendicularHeight"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
