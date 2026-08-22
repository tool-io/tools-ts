import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BmrMifflinInput = {
  readonly ageYears: number;
  readonly heightCm: number;
  readonly sex: "female" | "male";
  readonly weightKg: number;
};

export type BmrMifflinOutput = {
  readonly bmr: number;
};

export const bmrMifflinExample = {
  input: { weightKg: 70, heightCm: 170, ageYears: 30, sex: "male" },
  output: { bmr: 1617.5 },
} satisfies ToolExample<BmrMifflinInput, BmrMifflinOutput>;

export const bmrMifflinTool = createSimpleTool({
  id: "health/bmr-mifflin",
  title: "BMR Mifflin St Jeor Calculator",
  description:
    "Compute basal metabolic rate with the Mifflin St Jeor equations.",
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
      description: "Biological sex selecting the equation offset.",
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
    const base = 10 * weight + 6.25 * heightCm - 5 * ageYears;
    return { bmr: input.sex === "female" ? base - 161 : base + 5 };
  },
});
export const runBmrMifflin = bmrMifflinTool.execute;
export default bmrMifflinTool;
