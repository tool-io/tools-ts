import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CreatinineClearanceMdrdInput = {
  readonly ageYears: number;
  readonly serumCreatinineMgDl: number;
  readonly sex: "female" | "male";
};

export type CreatinineClearanceMdrdOutput = {
  readonly egfrMlPerMin: number;
};

export const creatinineClearanceMdrdExample = {
  input: { serumCreatinineMgDl: 1, ageYears: 40, sex: "male" },
  output: { egfrMlPerMin: 82.75988346250195 },
} satisfies ToolExample<
  CreatinineClearanceMdrdInput,
  CreatinineClearanceMdrdOutput
>;

export const creatinineClearanceMdrdTool = createSimpleTool({
  id: "biology/creatinine-clearance-mdrd",
  title: "MDRD eGFR",
  description:
    "Estimate glomerular filtration rate with the four variable MDRD equation.",
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
      id: "serumCreatinineMgDl",
      kind: "number",
      label: "Serum creatinine",
      minimum: Number.MIN_VALUE,
      unit: "mg/dL",
    },
    {
      enum: ["female", "male"],
      id: "sex",
      kind: "string",
      label: "Sex",
    },
  ],
  outputs: [
    {
      id: "egfrMlPerMin",
      kind: "number",
      label: "eGFR",
      unit: "mL/min/1.73 m2",
    },
  ],
  calculate: (input) => ({
    egfrMlPerMin:
      175 *
      Math.pow(input.serumCreatinineMgDl as number, -1.154) *
      Math.pow(input.ageYears as number, -0.203) *
      (input.sex === "female" ? 0.742 : 1),
  }),
});
export const runCreatinineClearanceMdrd = creatinineClearanceMdrdTool.execute;
export default creatinineClearanceMdrdTool;
