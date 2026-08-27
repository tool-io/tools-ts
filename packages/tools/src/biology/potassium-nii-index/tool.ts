import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PotassiumNiiIndexInput = {
  readonly actualKPercent: number;
  readonly criticalKPercent: number;
};

export type PotassiumNiiIndexOutput = {
  readonly potassiumNutritionIndex: number;
};

export const potassiumNiiIndexExample = {
  input: { actualKPercent: 2, criticalKPercent: 2.5 },
  output: { potassiumNutritionIndex: 0.8 },
} satisfies ToolExample<PotassiumNiiIndexInput, PotassiumNiiIndexOutput>;

export const potassiumNiiIndexTool = createSimpleTool({
  id: "biology/potassium-nii-index",
  title: "Potassium Nutrition Index",
  description:
    "Compute the potassium nutrition index as actual potassium percent divided by critical potassium percent; values below one indicate potassium dilution.",
  inputs: [
    {
      description:
        "Actual plant potassium concentration as a percentage; must not be negative.",
      id: "actualKPercent",
      kind: "number",
      label: "Actual potassium",
      minimum: 0,
      unit: "%",
    },
    {
      description:
        "Critical potassium concentration as a percentage; must be greater than zero.",
      id: "criticalKPercent",
      kind: "number",
      label: "Critical potassium",
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Potassium nutrition index; below 1 indicates deficiency and above 1 indicates sufficiency.",
      id: "potassiumNutritionIndex",
      kind: "number",
      label: "Potassium nutrition index",
    },
  ],
  calculate: (input) => {
    const actualKPercent = input.actualKPercent as number;
    const criticalKPercent = input.criticalKPercent as number;
    if (!(criticalKPercent > 0))
      simpleError(
        "criticalKPercent",
        "The critical potassium concentration must be greater than zero.",
      );
    return {
      potassiumNutritionIndex: actualKPercent / criticalKPercent,
    };
  },
});
export const runPotassiumNiiIndex = potassiumNiiIndexTool.execute;
export default potassiumNiiIndexTool;
