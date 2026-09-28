import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ angleDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "angleDegrees", label: "Angle degrees", kind: "number", unit: "deg" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.angleDegrees, -1e9, 1e9);
  return H.finish({ angleDegrees: H.mod(i.angleDegrees, 180) });
};
export const example = {
  input: { angleDegrees: -10 },
  output: { result: { angleDegrees: 170 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/line-angle-halfturn-canonical-form",
  title: "Geometry: Line Angle Halfturn Canonical Form Tool",
  description:
    "Canonicalize an unoriented planar line angle modulo a half-turn into [0,180), retaining the distinction from an oriented bearing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { angleDegrees: { type: "number" } },
        required: ["angleDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
