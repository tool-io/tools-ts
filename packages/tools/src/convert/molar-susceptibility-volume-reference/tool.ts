import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  molarSusceptibility: number;
  molarVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "molarSusceptibility", label: "Molar susceptibility", kind: "number" },
  { id: "molarVolume", label: "Molar volume", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.molarVolume);
  return H.finish({
    volumeSusceptibility: i.molarSusceptibility / i.molarVolume,
  });
};
export const example = {
  input: { molarSusceptibility: 0.02, molarVolume: 2 },
  output: { result: { volumeSusceptibility: 0.01 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/molar-susceptibility-volume-reference",
  title: "Conversion: Molar Susceptibility Volume Reference Tool",
  description:
    "Crosswalk compatible SI molar magnetic susceptibility to volume susceptibility using supplied molar volume; no hidden molar mass/density lookup or cgs factor.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { volumeSusceptibility: { type: "number" } },
        required: ["volumeSusceptibility"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
