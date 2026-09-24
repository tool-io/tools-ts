import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ pitchMm: number; wireDiameterMm: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pitchMm", label: "Pitch mm", kind: "number", unit: "mm" },
  {
    id: "wireDiameterMm",
    label: "Wire diameter mm",
    kind: "number",
    unit: "mm",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.pitchMm);
  H.check(i.wireDiameterMm >= 0 && i.wireDiameterMm <= i.pitchMm);
  return H.finish({
    openingMm: i.pitchMm - i.wireDiameterMm,
    openAreaFraction: ((i.pitchMm - i.wireDiameterMm) / i.pitchMm) ** 2,
  });
};
export const example = {
  input: { pitchMm: 2, wireDiameterMm: 0.5 },
  output: { result: { openingMm: 1.5, openAreaFraction: 0.5625 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/mesh-pitch-to-opening-with-wire",
  title: "Conversion: Mesh Pitch To Opening With Wire Tool",
  description:
    "Compute clear aperture and ideal square-mesh open-area fraction from center pitch and wire diameter, not a mesh-number standard lookup.",
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
          openAreaFraction: { type: "number" },
          openingMm: { type: "number" },
        },
        required: ["openAreaFraction", "openingMm"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
