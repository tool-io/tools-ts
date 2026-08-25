import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BentoniteFiningDoseInput = {
  readonly doseGPerL: number;
  readonly volumeLiters: number;
};

export type BentoniteFiningDoseOutput = {
  readonly bentoniteKilograms: number;
};

export const bentoniteFiningDoseExample = {
  input: {
    doseGPerL: 0.6,
    volumeLiters: 5000,
  },
  output: {
    bentoniteKilograms: 3,
  },
} satisfies ToolExample<BentoniteFiningDoseInput, BentoniteFiningDoseOutput>;

export const calculateBentoniteFiningDose = (
  input: BentoniteFiningDoseInput,
): BentoniteFiningDoseOutput => {
  if (input.doseGPerL < 0)
    simpleError(
      "doseGPerL",
      "The bentonite dose cannot be negative.",
      "invalid_value",
    );
  return {
    bentoniteKilograms: roundStatistic(
      (input.doseGPerL * input.volumeLiters) / 1000,
    ),
  };
};

export const bentoniteFiningDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateBentoniteFiningDose(input as unknown as BentoniteFiningDoseInput),
  description:
    "Convert a bench-trial or treatment-plan bentonite rate in grams per liter into kilograms of dry bentonite for the selected wine volume.",
  id: "oenology/bentonite-fining-dose",
  inputs: [
    {
      description: "Dry bentonite specified per liter of wine.",
      id: "doseGPerL",
      kind: "number",
      label: "Dose rate",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Wine volume to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Bentonite to prepare for the treated volume.",
      id: "bentoniteKilograms",
      kind: "number",
      label: "Bentonite",
      unit: "kg",
    },
  ],
  title: "Bentonite Fining Dose Calculator",
});
export const runBentoniteFiningDose = bentoniteFiningDoseTool.execute;
export default bentoniteFiningDoseTool;
