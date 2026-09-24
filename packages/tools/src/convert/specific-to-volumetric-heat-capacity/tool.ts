import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  specificHeatJPerKgK: number;
  densityKgPerM3: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "specificHeatJPerKgK",
    label: "Specific heat j per kg k",
    kind: "number",
  },
  { id: "densityKgPerM3", label: "Density kg per m3", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.specificHeatJPerKgK);
  H.positive(i.densityKgPerM3);
  return H.finish({
    volumetricHeatCapacityJPerM3K: i.specificHeatJPerKgK * i.densityKgPerM3,
  });
};
export const example = {
  input: { specificHeatJPerKgK: 1000, densityKgPerM3: 2 },
  output: { result: { volumetricHeatCapacityJPerM3K: 2000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/specific-to-volumetric-heat-capacity",
  title: "Conversion: Specific To Volumetric Heat Capacity Tool",
  description:
    "Convert explicit matching-state mass-specific heat capacity and density into volumetric heat capacity; no material-property inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { volumetricHeatCapacityJPerM3K: { type: "number" } },
        required: ["volumetricHeatCapacityJPerM3K"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
