import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeanMassJamesInput = {
  readonly heightM: number;
  readonly sex: "female" | "male";
  readonly weightKg: number;
};

export type LeanMassJamesOutput = {
  readonly leanMassKg: number;
};

export const leanMassJamesExample = {
  input: { weightKg: 70, heightM: 1.8, sex: "male" },
  output: { leanMassKg: 57.641975308641975 },
} satisfies ToolExample<LeanMassJamesInput, LeanMassJamesOutput>;

export const leanMassJamesTool = createSimpleTool({
  id: "health/lean-mass-james",
  title: "Lean Mass James Calculator",
  description:
    "Compute lean body mass with the James formula from weight, height, and sex.",
  inputs: [
    {
      description: "Body weight in kilograms; must be greater than zero.",
      id: "weightKg",
      label: "Weight",
      kind: "number",
      unit: "kg",
    },
    {
      description: "Height in metres; must be greater than zero.",
      id: "heightM",
      label: "Height",
      kind: "number",
      unit: "m",
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
      id: "leanMassKg",
      label: "Lean mass",
      kind: "number",
      unit: "kg",
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
    const heightM = input.heightM as number;
    if (heightM <= 0)
      simpleError(
        "heightM",
        "The height must be greater than zero metres.",
        "invalid_height",
      );
    const heightCm = heightM * 100;
    const ratioSquared = (weight / heightCm) ** 2;
    const leanMassKg =
      input.sex === "female"
        ? 1.07 * weight - 148 * ratioSquared
        : 1.1 * weight - 128 * ratioSquared;
    if (leanMassKg <= 0)
      simpleError(
        "bodyComposition",
        "The James formula is not applicable to this weight and height combination.",
        "formula_not_applicable",
      );
    return { leanMassKg };
  },
});
export const runLeanMassJames = leanMassJamesTool.execute;
export default leanMassJamesTool;
