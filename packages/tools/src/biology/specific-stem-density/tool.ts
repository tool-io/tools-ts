import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificStemDensityInput = {
  readonly stemDryMassG: number;
  readonly stemVolumeCm3: number;
};

export type SpecificStemDensityOutput = {
  readonly stemDensityGCm3: number;
};

export const specificStemDensityExample = {
  input: { stemDryMassG: 150, stemVolumeCm3: 200 },
  output: { stemDensityGCm3: 0.75 },
} satisfies ToolExample<SpecificStemDensityInput, SpecificStemDensityOutput>;

export const specificStemDensityTool = createSimpleTool({
  id: "biology/specific-stem-density",
  title: "Stem Wood Density",
  description:
    "Compute stem wood density in grams per cubic centimetre as oven-dry stem mass divided by stem volume.",
  inputs: [
    {
      id: "stemDryMassG",
      kind: "number",
      label: "Stem dry mass",
      unit: "g",
    },
    {
      id: "stemVolumeCm3",
      kind: "number",
      label: "Stem volume",
      unit: "cm³",
    },
  ],
  outputs: [
    {
      id: "stemDensityGCm3",
      kind: "number",
      label: "Stem wood density",
      unit: "g/cm³",
    },
  ],
  calculate: (input) => {
    const stemDryMassG = input.stemDryMassG as number;
    const stemVolumeCm3 = input.stemVolumeCm3 as number;
    if (!(stemDryMassG > 0))
      simpleError(
        "stemDryMassG",
        "The stem dry mass must be greater than zero.",
      );
    if (!(stemVolumeCm3 > 0))
      simpleError(
        "stemVolumeCm3",
        "The stem volume must be greater than zero.",
      );
    return { stemDensityGCm3: stemDryMassG / stemVolumeCm3 };
  },
});
export const runSpecificStemDensity = specificStemDensityTool.execute;
export default specificStemDensityTool;
