import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BarkDensityInput = {
  readonly barkDryMassG: number;
  readonly barkVolumeCm3: number;
};

export type BarkDensityOutput = {
  readonly barkDensityGCm3: number;
};

export const barkDensityExample = {
  input: { barkDryMassG: 45, barkVolumeCm3: 90 },
  output: { barkDensityGCm3: 0.5 },
} satisfies ToolExample<BarkDensityInput, BarkDensityOutput>;

export const barkDensityTool = createSimpleTool({
  id: "biology/bark-density",
  title: "Bark Density",
  description:
    "Compute bark density in grams per cubic centimetre as oven-dry bark mass divided by bark volume.",
  inputs: [
    {
      id: "barkDryMassG",
      kind: "number",
      label: "Bark dry mass",
      unit: "g",
    },
    {
      id: "barkVolumeCm3",
      kind: "number",
      label: "Bark volume",
      unit: "cm³",
    },
  ],
  outputs: [
    {
      id: "barkDensityGCm3",
      kind: "number",
      label: "Bark density",
      unit: "g/cm³",
    },
  ],
  calculate: (input) => {
    const barkDryMassG = input.barkDryMassG as number;
    const barkVolumeCm3 = input.barkVolumeCm3 as number;
    if (!(barkDryMassG > 0))
      simpleError(
        "barkDryMassG",
        "The bark dry mass must be greater than zero.",
      );
    if (!(barkVolumeCm3 > 0))
      simpleError(
        "barkVolumeCm3",
        "The bark volume must be greater than zero.",
      );
    return { barkDensityGCm3: barkDryMassG / barkVolumeCm3 };
  },
});
export const runBarkDensity = barkDensityTool.execute;
export default barkDensityTool;
