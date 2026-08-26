import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NitrogenNiiIndexInput = {
  readonly actualNitrogenPercent: number;
  readonly criticalNitrogenPercent: number;
};

export type NitrogenNiiIndexOutput = {
  readonly nitrogenNutritionIndex: number;
};

export const nitrogenNiiIndexExample = {
  input: { actualNitrogenPercent: 3.2, criticalNitrogenPercent: 4 },
  output: { nitrogenNutritionIndex: 0.8 },
} satisfies ToolExample<NitrogenNiiIndexInput, NitrogenNiiIndexOutput>;

export const nitrogenNiiIndexTool = createSimpleTool({
  id: "biology/nitrogen-nii-index",
  title: "Nitrogen Nutrition Index",
  description:
    "Compute the nitrogen nutrition index as actual nitrogen percent divided by critical nitrogen percent; values below one indicate nitrogen dilution.",
  inputs: [
    {
      description:
        "Actual plant nitrogen concentration as a percentage; must not be negative.",
      id: "actualNitrogenPercent",
      kind: "number",
      label: "Actual nitrogen",
      minimum: 0,
      unit: "%",
    },
    {
      description:
        "Critical nitrogen concentration as a percentage; must be greater than zero.",
      id: "criticalNitrogenPercent",
      kind: "number",
      label: "Critical nitrogen",
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Nitrogen nutrition index; below 1 indicates deficiency and above 1 indicates sufficiency.",
      id: "nitrogenNutritionIndex",
      kind: "number",
      label: "Nitrogen nutrition index",
    },
  ],
  calculate: (input) => {
    const actualNitrogenPercent = input.actualNitrogenPercent as number;
    const criticalNitrogenPercent = input.criticalNitrogenPercent as number;
    if (!(criticalNitrogenPercent > 0))
      simpleError(
        "criticalNitrogenPercent",
        "The critical nitrogen concentration must be greater than zero.",
      );
    return {
      nitrogenNutritionIndex: actualNitrogenPercent / criticalNitrogenPercent,
    };
  },
});
export const runNitrogenNiiIndex = nitrogenNiiIndexTool.execute;
export default nitrogenNiiIndexTool;
