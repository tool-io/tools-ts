import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type Caco3DoseInput = {
  readonly targetReductionGPerL: number;
  readonly volumeLiters: number;
};

export type Caco3DoseOutput = {
  readonly caco3Grams: number;
};

export const caco3DoseExample = {
  input: {
    targetReductionGPerL: 1.2,
    volumeLiters: 25,
  },
  output: {
    caco3Grams: 20.1,
  },
} satisfies ToolExample<Caco3DoseInput, Caco3DoseOutput>;

export const calculateCaco3Dose = (input: Caco3DoseInput): Caco3DoseOutput => {
  return {
    caco3Grams: roundStatistic(
      input.targetReductionGPerL * input.volumeLiters * 0.67,
    ),
  };
};

export const caco3DoseTool = createSimpleTool({
  calculate: (input) => calculateCaco3Dose(input as unknown as Caco3DoseInput),
  description:
    "Estimate calcium carbonate mass from wine volume and intended titratable-acidity reduction using 0.67 grams CaCO3 per liter for each 1 g/L reduction; confirm treatment limits and results with trials and analysis.",
  id: "oenology/caco3-dose",
  inputs: [
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
      description: "Calcium carbonate to add to the treated volume.",
      id: "caco3Grams",
      kind: "number",
      label: "CaCO3 dose",
      unit: "g",
    },
  ],
  title: "Calcium Carbonate Dose Calculator",
});
export const runCaco3Dose = caco3DoseTool.execute;
export default caco3DoseTool;
