import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type EgfrCkdEpiInput = {
  readonly ageYears: number;
  readonly serumCreatinineMgDl: number;
  readonly sex: "female" | "male";
};

export type EgfrCkdEpiOutput = {
  readonly egfrMlPerMin: number;
};

export const egfrCkdEpiExample = {
  input: { serumCreatinineMgDl: 0.9, ageYears: 55, sex: "female" },
  output: { egfrMlPerMin: 75.49880473189417 },
} satisfies ToolExample<EgfrCkdEpiInput, EgfrCkdEpiOutput>;

export const egfrCkdEpiTool = createSimpleTool({
  id: "biology/egfr-ckd-epi",
  title: "2021 CKD-EPI eGFR",
  description:
    "Estimate adult glomerular filtration rate with the 2021 race-free CKD-EPI creatinine equation. The result is normalized to 1.73 square metres of body surface area and is an estimate, not a measured GFR.",
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
  calculate: (input) => {
    const creatinine = input.serumCreatinineMgDl as number;
    const female = input.sex === "female";
    const kappa = female ? 0.7 : 0.9;
    const alpha = female ? -0.241 : -0.302;
    const ratio = creatinine / kappa;
    return {
      egfrMlPerMin:
        142 *
        Math.pow(Math.min(ratio, 1), alpha) *
        Math.pow(Math.max(ratio, 1), -1.2) *
        Math.pow(0.9938, input.ageYears as number) *
        (female ? 1.012 : 1),
    };
  },
});
export const runEgfrCkdEpi = egfrCkdEpiTool.execute;
export default egfrCkdEpiTool;
