import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  equatorPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "equatorPolicy",
    label: "Equator policy",
    kind: "string",
    enum: ["N", "S", "equator"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.latitudeDegrees, -90, 90);
  H.choice(i.equatorPolicy, ["N", "S", "equator"]);
  return H.finish({
    hemisphere:
      i.latitudeDegrees > 0
        ? "N"
        : i.latitudeDegrees < 0
          ? "S"
          : i.equatorPolicy,
    magnitudeDegrees: Math.abs(i.latitudeDegrees),
  });
};
export const example = {
  input: { latitudeDegrees: 0, equatorPolicy: "equator" },
  output: { result: { hemisphere: "equator", magnitudeDegrees: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/latitude-hemisphere-at-equator-label",
  title: "Geography: Latitude Hemisphere At Equator Label Tool",
  description:
    "Label latitude with explicit N/S/equator policy at exactly zero; no sign inferred from an already normalized numeric zero.",
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
          hemisphere: { type: "string" },
          magnitudeDegrees: { type: "number" },
        },
        required: ["hemisphere", "magnitudeDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
