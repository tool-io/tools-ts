import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type RsFromSugarDoseInput = {
  readonly sugarGrams: number;
  readonly volumeLiters: number;
};

export type RsFromSugarDoseOutput = {
  readonly residualSugarGPerL: number;
};

export const rsFromSugarDoseExample = {
  input: {
    sugarGrams: 1000,
    volumeLiters: 500,
  },
  output: {
    residualSugarGPerL: 2,
  },
} satisfies ToolExample<RsFromSugarDoseInput, RsFromSugarDoseOutput>;

export const calculateRsFromSugarDose = (
  input: RsFromSugarDoseInput,
): RsFromSugarDoseOutput => {
  if (input.volumeLiters <= 0)
    simpleError(
      "volumeLiters",
      "The wine volume must be positive.",
      "invalid_value",
    );
  return {
    residualSugarGPerL: roundStatistic(input.sugarGrams / input.volumeLiters),
  };
};

export const rsFromSugarDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateRsFromSugarDose(input as unknown as RsFromSugarDoseInput),
  description:
    "Convert a weighed sugar addition into the residual sugar it contributes per liter.",
  id: "oenology/rs-from-sugar-dose",
  inputs: [
    {
      description: "Sucrose mass to dissolve.",
      id: "sugarGrams",
      kind: "number",
      label: "Sugar",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Wine volume receiving the sugar.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Residual sugar contributed by the dose.",
      id: "residualSugarGPerL",
      kind: "number",
      label: "RS",
      unit: "g/L",
    },
  ],
  title: "RS g/L from Dosing Sugar Calculator",
});
export const runRsFromSugarDose = rsFromSugarDoseTool.execute;
export default rsFromSugarDoseTool;
