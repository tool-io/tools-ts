import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  momentX: number;
  momentY: number;
  normalForce: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "momentX", label: "Moment x", kind: "number" },
  { id: "momentY", label: "Moment y", kind: "number" },
  { id: "normalForce", label: "Normal force", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.normalForce);
  return H.finish({
    copX: -i.momentY / i.normalForce,
    copY: i.momentX / i.normalForce,
  });
};
export const example = {
  input: { momentX: 20, momentY: -10, normalForce: 100 },
  output: { result: { copX: 0.1, copY: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "biomechanics/force-plate-cop-coordinate",
  title: "Biomechanics: Force Plate Cop Coordinate Tool",
  description:
    "Compute center of pressure in the force-plate origin plane under an explicitly z-up right-handed convention, ignoring horizontal-force height corrections; not clinical analysis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { copX: { type: "number" }, copY: { type: "number" } },
        required: ["copX", "copY"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
