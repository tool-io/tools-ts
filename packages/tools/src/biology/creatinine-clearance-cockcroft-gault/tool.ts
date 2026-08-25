import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const creatinineClearanceExample = {
  input: {
    ageYears: 40,
    sex: "male",
    serumCreatinineMgDl: 1,
    weightKg: 70,
  },
  output: { creatinineClearanceMlMin: 97.22222222222223 },
} satisfies ToolExample<
  {
    readonly ageYears: number;
    readonly sex: string;
    readonly serumCreatinineMgDl: number;
    readonly weightKg: number;
  },
  { readonly creatinineClearanceMlMin: number }
>;

export const creatinineClearanceTool = createSimpleTool({
  id: "biology/creatinine-clearance-cockcroft-gault",
  title: "Cockcroft-Gault CrCl",
  description:
    "Estimate creatinine clearance with the Cockcroft-Gault equation.",
  inputs: [
    {
      id: "ageYears",
      kind: "integer",
      label: "Age",
      maximum: 120,
      minimum: 18,
      unit: "years",
    },
    {
      id: "weightKg",
      kind: "number",
      label: "Weight",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      id: "serumCreatinineMgDl",
      kind: "number",
      label: "Serum creatinine",
      minimum: Number.MIN_VALUE,
      unit: "mg/dL",
    },
    { enum: ["female", "male"], id: "sex", kind: "string", label: "Sex" },
  ],
  outputs: [
    {
      id: "creatinineClearanceMlMin",
      kind: "number",
      label: "Creatinine clearance",
      unit: "mL/min",
    },
  ],
  calculate: (input) => ({
    creatinineClearanceMlMin:
      (((140 - (input.ageYears as number)) * (input.weightKg as number)) /
        (72 * (input.serumCreatinineMgDl as number))) *
      (input.sex === "female" ? 0.85 : 1),
  }),
});
export const runCreatinineClearance = creatinineClearanceTool.execute;
export default creatinineClearanceTool;
