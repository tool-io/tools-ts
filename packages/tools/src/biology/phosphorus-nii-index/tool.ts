import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhosphorusNiiIndexInput = {
  readonly actualPPercent: number;
  readonly criticalPPercent: number;
};

export type PhosphorusNiiIndexOutput = {
  readonly phosphorusNutritionIndex: number;
};

export const phosphorusNiiIndexExample = {
  input: { actualPPercent: 0.3, criticalPPercent: 0.4 },
  output: { phosphorusNutritionIndex: 0.7499999999999999 },
} satisfies ToolExample<PhosphorusNiiIndexInput, PhosphorusNiiIndexOutput>;

export const phosphorusNiiIndexTool = createSimpleTool({
  id: "biology/phosphorus-nii-index",
  title: "Phosphorus Nutrition Index",
  description:
    "Compute the phosphorus nutrition index as actual phosphorus percent divided by critical phosphorus percent; values below one indicate phosphorus dilution.",
  inputs: [
    {
      description:
        "Actual plant phosphorus concentration as a percentage; must not be negative.",
      id: "actualPPercent",
      kind: "number",
      label: "Actual phosphorus",
      minimum: 0,
      unit: "%",
    },
    {
      description:
        "Critical phosphorus concentration as a percentage; must be greater than zero.",
      id: "criticalPPercent",
      kind: "number",
      label: "Critical phosphorus",
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Phosphorus nutrition index; below 1 indicates deficiency and above 1 indicates sufficiency.",
      id: "phosphorusNutritionIndex",
      kind: "number",
      label: "Phosphorus nutrition index",
    },
  ],
  calculate: (input) => {
    const actualPPercent = input.actualPPercent as number;
    const criticalPPercent = input.criticalPPercent as number;
    if (!(criticalPPercent > 0))
      simpleError(
        "criticalPPercent",
        "The critical phosphorus concentration must be greater than zero.",
      );
    return {
      phosphorusNutritionIndex: actualPPercent / criticalPPercent,
    };
  },
});
export const runPhosphorusNiiIndex = phosphorusNiiIndexTool.execute;
export default phosphorusNiiIndexTool;
