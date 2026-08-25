import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type OakChipDosageInput = {
  readonly rateGPerL: number;
  readonly volumeLiters: number;
};

export type OakChipDosageOutput = {
  readonly chipGrams: number;
};

export const oakChipDosageExample = {
  input: {
    rateGPerL: 2,
    volumeLiters: 1000,
  },
  output: {
    chipGrams: 2000,
  },
} satisfies ToolExample<OakChipDosageInput, OakChipDosageOutput>;

export const calculateOakChipDosage = (
  input: OakChipDosageInput,
): OakChipDosageOutput => {
  if (input.rateGPerL < 0)
    simpleError(
      "rateGPerL",
      "The chip dosage rate cannot be negative.",
      "invalid_value",
    );
  return {
    chipGrams: roundStatistic(input.rateGPerL * input.volumeLiters),
  };
};

export const oakChipDosageTool = createSimpleTool({
  calculate: (input) =>
    calculateOakChipDosage(input as unknown as OakChipDosageInput),
  description:
    "Weigh the oak chips needed for a lot at the chosen grams-per-liter dosage rate.",
  id: "oenology/oak-chip-dosage",
  inputs: [
    {
      description: "Trial or treatment-plan mass of chips per liter of wine.",
      id: "rateGPerL",
      kind: "number",
      label: "Dosage rate",
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
      description: "Oak chips to add to the treated volume.",
      id: "chipGrams",
      kind: "number",
      label: "Chips",
      unit: "g",
    },
  ],
  title: "Oak Chip Dosage Rate Calculator",
});
export const runOakChipDosage = oakChipDosageTool.execute;
export default oakChipDosageTool;
