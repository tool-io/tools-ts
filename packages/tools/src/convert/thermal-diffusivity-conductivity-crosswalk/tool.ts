import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  diffusivity: number;
  density: number;
  specificHeat: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "diffusivity", label: "Diffusivity", kind: "number" },
  { id: "density", label: "Density", kind: "number" },
  { id: "specificHeat", label: "Specific heat", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.diffusivity, i.density, i.specificHeat].forEach(H.positive);
  return H.finish({ conductivity: i.diffusivity * i.density * i.specificHeat });
};
export const example = {
  input: { diffusivity: 0.1, density: 2, specificHeat: 3 },
  output: { result: { conductivity: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/thermal-diffusivity-conductivity-crosswalk",
  title: "Conversion: Thermal Diffusivity Conductivity Crosswalk Tool",
  description:
    "Recover thermal conductivity k=alpha*rho*cp from supplied compatible positive material properties; no fitted diffusion or material lookup.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conductivity: { type: "number" } },
        required: ["conductivity"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
