import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ radialDistance: number; radius: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "radialDistance", label: "Radial distance", kind: "number" },
  { id: "radius", label: "Radius", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.radialDistance >= 0 && i.radius >= 0);
  return H.finish({
    signedBoundaryDistance: i.radialDistance - i.radius,
    absoluteBoundaryDistance: Math.abs(i.radialDistance - i.radius),
  });
};
export const example = {
  input: { radialDistance: 2, radius: 5 },
  output: {
    result: { signedBoundaryDistance: -3, absoluteBoundaryDistance: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/radial-distance-to-circle-boundary",
  title: "Distance: Radial Distance To Circle Boundary Tool",
  description:
    "Compute signed inside/outside and absolute distance to a circle boundary from an already measured center radius; no point-center inference.",
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
          absoluteBoundaryDistance: { type: "number" },
          signedBoundaryDistance: { type: "number" },
        },
        required: ["absoluteBoundaryDistance", "signedBoundaryDistance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
