import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const brainBodyRatioExample = {
  input: { bodyMassKg: 70, brainMassG: 1400 },
  output: { brainBodyRatio: 20 },
} satisfies ToolExample<
  { readonly bodyMassKg: number; readonly brainMassG: number },
  { readonly brainBodyRatio: number }
>;

export const brainBodyRatioTool = createSimpleTool({
  id: "biology/brain-body-ratio",
  title: "Brain-Body Ratio",
  description:
    "Compute the gross brain-body mass ratio as brain mass in grams divided by body mass in kilograms.",
  inputs: [
    {
      description: "Brain mass in grams; must be greater than zero.",
      id: "brainMassG",
      label: "Brain mass",
      kind: "number",
      unit: "g",
    },
    {
      description: "Body mass in kilograms; must be greater than zero.",
      id: "bodyMassKg",
      label: "Body mass",
      kind: "number",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Brain mass in grams per kilogram of body mass.",
      id: "brainBodyRatio",
      label: "Brain-body ratio",
      kind: "number",
      unit: "g/kg",
    },
  ],
  calculate: (input) => {
    const brainMassG = input.brainMassG as number;
    const bodyMassKg = input.bodyMassKg as number;
    if (!(brainMassG > 0))
      simpleError("brainMassG", "The brain mass must be greater than zero.");
    if (!(bodyMassKg > 0))
      simpleError("bodyMassKg", "The body mass must be greater than zero.");
    return { brainBodyRatio: brainMassG / bodyMassKg };
  },
});
export const runBrainBodyRatio = brainBodyRatioTool.execute;
export default brainBodyRatioTool;
