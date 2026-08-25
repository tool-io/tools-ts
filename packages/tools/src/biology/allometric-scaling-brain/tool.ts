import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const allometricScalingBrainExample = {
  input: { bodyMassG: 1000 },
  output: { predictedBrainMassG: 17.78279410038923 },
} satisfies ToolExample<
  {
    readonly bodyMassG: number;
    readonly intercept?: number;
    readonly slope?: number;
  },
  { readonly predictedBrainMassG: number }
>;

export const allometricScalingBrainTool = createSimpleTool({
  id: "biology/allometric-scaling-brain",
  title: "Brain Allometry Slope",
  description:
    "Predict brain mass from body mass with the allometric power law predictedBrainMassG = 10^(intercept + slope x log10(bodyMassG)); defaults use intercept -1.0 g and slope 0.75 for the vertebrate brain-body scaling line.",
  inputs: [
    {
      description: "Body mass in grams; must be greater than zero.",
      id: "bodyMassG",
      label: "Body mass",
      kind: "number",
      unit: "g",
    },
    {
      default: -1,
      description: "Log-log intercept of the scaling line; defaults to -1.0.",
      id: "intercept",
      label: "Intercept",
      kind: "number",
    },
    {
      default: 0.75,
      description: "Log-log slope of the scaling line; defaults to 0.75.",
      id: "slope",
      label: "Slope",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Predicted brain mass in grams.",
      id: "predictedBrainMassG",
      label: "Predicted brain mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const bodyMassG = input.bodyMassG as number;
    if (!(bodyMassG > 0))
      simpleError("bodyMassG", "The body mass must be greater than zero.");
    const intercept = input.intercept as number;
    const slope = input.slope as number;
    return {
      predictedBrainMassG: Math.pow(
        10,
        intercept + slope * Math.log10(bodyMassG),
      ),
    };
  },
});
export const runAllometricScalingBrain = allometricScalingBrainTool.execute;
export default allometricScalingBrainTool;
