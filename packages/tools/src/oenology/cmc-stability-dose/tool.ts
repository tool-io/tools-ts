import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CmcStabilityDoseInput = {
  readonly rateGPerHectoliter: number;
  readonly volumeHectoliters: number;
};

export type CmcStabilityDoseOutput = {
  readonly productGrams: number;
};

export const cmcStabilityDoseExample = {
  input: {
    rateGPerHectoliter: 10,
    volumeHectoliters: 20,
  },
  output: {
    productGrams: 200,
  },
} satisfies ToolExample<CmcStabilityDoseInput, CmcStabilityDoseOutput>;

export const calculateCmcStabilityDose = (
  input: CmcStabilityDoseInput,
): CmcStabilityDoseOutput => {
  if (input.rateGPerHectoliter < 0)
    simpleError(
      "rateGPerHectoliter",
      "The CMC rate cannot be negative.",
      "invalid_value",
    );
  return {
    productGrams: roundStatistic(
      input.rateGPerHectoliter * input.volumeHectoliters,
    ),
  };
};

export const cmcStabilityDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateCmcStabilityDose(input as unknown as CmcStabilityDoseInput),
  description:
    "Convert a product specification or treatment-plan carboxymethylcellulose rate into total grams for the selected wine volume; it does not determine tartrate stability or select a dose.",
  id: "oenology/cmc-stability-dose",
  inputs: [
    {
      description: "CMC rate per hectoliter of wine.",
      id: "rateGPerHectoliter",
      kind: "number",
      label: "Dose rate",
      minimum: 0,
      unit: "g/hL",
    },
    {
      description: "Wine volume to treat.",
      id: "volumeHectoliters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "hL",
    },
  ],
  outputs: [
    {
      description: "Carboxymethylcellulose to stir into the treated volume.",
      id: "productGrams",
      kind: "number",
      label: "CMC",
      unit: "g",
    },
  ],
  title: "CMC Stability Dose Calculator",
});
export const runCmcStabilityDose = cmcStabilityDoseTool.execute;
export default cmcStabilityDoseTool;
