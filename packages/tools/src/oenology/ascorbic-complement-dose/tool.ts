import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type AscorbicComplementDoseInput = {
  readonly doseRateMgPerL: number;
  readonly volumeLiters: number;
};

export type AscorbicComplementDoseOutput = {
  readonly ascorbicAcidGrams: number;
};

export const ascorbicComplementDoseExample = {
  input: {
    doseRateMgPerL: 25,
    volumeLiters: 200,
  },
  output: {
    ascorbicAcidGrams: 5,
  },
} satisfies ToolExample<
  AscorbicComplementDoseInput,
  AscorbicComplementDoseOutput
>;

export const calculateAscorbicComplementDose = (
  input: AscorbicComplementDoseInput,
): AscorbicComplementDoseOutput => {
  if (input.doseRateMgPerL < 0)
    simpleError(
      "doseRateMgPerL",
      "The ascorbic-acid dose rate cannot be negative.",
      "invalid_value",
    );
  return {
    ascorbicAcidGrams: roundStatistic(
      (input.doseRateMgPerL * input.volumeLiters) / 1000,
    ),
  };
};

export const ascorbicComplementDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateAscorbicComplementDose(
      input as unknown as AscorbicComplementDoseInput,
    ),
  description:
    "Convert a user-selected ascorbic-acid treatment rate in milligrams per liter into total grams for a wine lot; determine the rate from an appropriate treatment plan rather than this arithmetic tool.",
  id: "oenology/ascorbic-complement-dose",
  inputs: [
    {
      description: "Ascorbic acid specified per liter of wine.",
      id: "doseRateMgPerL",
      kind: "number",
      label: "Dose rate",
      minimum: 0,
      unit: "mg/L",
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
      description: "Ascorbic acid to dissolve into the treated volume.",
      id: "ascorbicAcidGrams",
      kind: "number",
      label: "Ascorbic acid",
      unit: "g",
    },
  ],
  title: "Ascorbic Acid Complement Dose Calculator",
});
export const runAscorbicComplementDose = ascorbicComplementDoseTool.execute;
export default ascorbicComplementDoseTool;
