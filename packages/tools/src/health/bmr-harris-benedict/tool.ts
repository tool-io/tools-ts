import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BmrHarrisBenedictInput = {
  readonly ageYears: number;
  readonly heightCm: number;
  readonly sex: "female" | "male";
  readonly weightKg: number;
};

export type BmrHarrisBenedictOutput = {
  readonly bmr: number;
};

export const bmrHarrisBenedictExample = {
  input: { weightKg: 70, heightCm: 170, ageYears: 30, sex: "male" },
  output: { bmr: 1671.672 },
} satisfies ToolExample<BmrHarrisBenedictInput, BmrHarrisBenedictOutput>;

export const bmrHarrisBenedictTool = createSimpleTool({
  id: "health/bmr-harris-benedict",
  title: "BMR Harris Benedict Calculator",
  description:
    "Compute basal metabolic rate with the revised Harris-Benedict equations (Roza and Shizgal).",
  inputs: [
    {
      description: "Body weight in kilograms; must be greater than zero.",
      id: "weightKg",
      label: "Weight",
      kind: "number",
      unit: "kg",
    },
    {
      description: "Height in centimetres; must be greater than zero.",
      id: "heightCm",
      label: "Height",
      kind: "number",
      unit: "cm",
    },
    {
      description: "Age in whole years between 1 and 120.",
      id: "ageYears",
      label: "Age",
      kind: "integer",
      maximum: 120,
      minimum: 1,
      unit: "years",
    },
    {
      default: "male",
      description: "Biological sex selecting the equation coefficients.",
      enum: ["female", "male"],
      id: "sex",
      label: "Sex",
      kind: "string",
    },
  ],
  outputs: [
    {
      id: "bmr",
      label: "Basal metabolic rate",
      kind: "number",
      unit: "kcal/day",
    },
  ],
  calculate: (input) => {
    const weight = input.weightKg as number;
    if (weight <= 0)
      simpleError(
        "weightKg",
        "The weight must be greater than zero kilograms.",
        "invalid_weight",
      );
    const heightCm = input.heightCm as number;
    if (heightCm <= 0)
      simpleError(
        "heightCm",
        "The height must be greater than zero centimetres.",
        "invalid_height",
      );
    const ageYears = input.ageYears as number;
    const bmr =
      input.sex === "female"
        ? 447.593 + 9.247 * weight + 3.098 * heightCm - 4.33 * ageYears
        : 88.362 + 13.397 * weight + 4.799 * heightCm - 5.677 * ageYears;
    return { bmr };
  },
});
export const runBmrHarrisBenedict = bmrHarrisBenedictTool.execute;
export default bmrHarrisBenedictTool;
