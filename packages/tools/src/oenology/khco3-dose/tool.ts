import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type Khco3DoseInput = {
  readonly treatmentFactor: number;
  readonly targetReductionGPerL: number;
  readonly volumeLiters: number;
};

export type Khco3DoseOutput = {
  readonly khco3Grams: number;
};

export const khco3DoseExample = {
  input: {
    treatmentFactor: 0.9,
    targetReductionGPerL: 1,
    volumeLiters: 50,
  },
  output: {
    khco3Grams: 45,
  },
} satisfies ToolExample<Khco3DoseInput, Khco3DoseOutput>;

export const calculateKhco3Dose = (input: Khco3DoseInput): Khco3DoseOutput => {
  return {
    khco3Grams: roundStatistic(
      input.targetReductionGPerL * input.volumeLiters * input.treatmentFactor,
    ),
  };
};

export const khco3DoseTool = createSimpleTool({
  calculate: (input) => calculateKhco3Dose(input as unknown as Khco3DoseInput),
  description:
    "Estimate potassium bicarbonate mass from volume, intended titratable-acidity reduction, and a caller-selected treatment factor appropriate to the protocol and reporting basis.",
  id: "oenology/khco3-dose",
  inputs: [
    {
      description:
        "KHCO3 grams per liter for each 1 g/L intended TA reduction.",
      id: "treatmentFactor",
      kind: "number",
      label: "Treatment factor",
      minimum: 0,
    },
    {
      description: "Desired TA reduction.",
      id: "targetReductionGPerL",
      kind: "number",
      label: "Target reduction",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Volume of wine to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Potassium bicarbonate to add to the treated volume.",
      id: "khco3Grams",
      kind: "number",
      label: "KHCO3 dose",
      unit: "g",
    },
  ],
  title: "Potassium Bicarbonate Dose Calculator",
});
export const runKhco3Dose = khco3DoseTool.execute;
export default khco3DoseTool;
