import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ volumeSusceptibility: number; density: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "volumeSusceptibility",
    label: "Volume susceptibility",
    kind: "number",
  },
  { id: "density", label: "Density", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.density);
  return H.finish({ massSusceptibility: i.volumeSusceptibility / i.density });
};
export const example = {
  input: { volumeSusceptibility: 0.002, density: 2 },
  output: { result: { massSusceptibility: 0.001 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/volume-susceptibility-mass-susceptibility",
  title: "Conversion: Volume Susceptibility Mass Susceptibility Tool",
  description:
    "Convert dimensionless SI volume magnetic susceptibility to mass susceptibility using explicit matching-state density; no cgs/4pi assumption or material data.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { massSusceptibility: { type: "number" } },
        required: ["massSusceptibility"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
