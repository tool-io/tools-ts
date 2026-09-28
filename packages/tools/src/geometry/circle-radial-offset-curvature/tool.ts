import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ radius: number; radialOffset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "radius", label: "Radius", kind: "number" },
  { id: "radialOffset", label: "Radial offset", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.radius);
  const r = i.radius + i.radialOffset;
  H.positive(r);
  return H.finish({ offsetRadius: r, curvature: 1 / r });
};
export const example = {
  input: { radius: 4, radialOffset: 1 },
  output: { result: { offsetRadius: 5, curvature: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/circle-radial-offset-curvature",
  title: "Geometry: Circle Radial Offset Curvature Tool",
  description:
    "Return radius and unsigned curvature of an ideal concentric circle offset, rejecting zero/negative offset radius; no curve-offset topology engine.",
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
          curvature: { type: "number" },
          offsetRadius: { type: "number" },
        },
        required: ["curvature", "offsetRadius"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
