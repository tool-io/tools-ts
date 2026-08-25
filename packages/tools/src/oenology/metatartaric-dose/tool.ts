import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MetatartaricDoseInput = {
  readonly rateGPerHectoliter: number;
  readonly volumeHectoliters: number;
};

export type MetatartaricDoseOutput = {
  readonly productGrams: number;
};

export const metatartaricDoseExample = {
  input: {
    rateGPerHectoliter: 40,
    volumeHectoliters: 20,
  },
  output: {
    productGrams: 800,
  },
} satisfies ToolExample<MetatartaricDoseInput, MetatartaricDoseOutput>;

export const calculateMetatartaricDose = (
  input: MetatartaricDoseInput,
): MetatartaricDoseOutput => {
  if (input.rateGPerHectoliter < 0)
    simpleError(
      "rateGPerHectoliter",
      "The treatment rate cannot be negative.",
      "invalid_value",
    );
  return {
    productGrams: roundStatistic(
      input.rateGPerHectoliter * input.volumeHectoliters,
    ),
  };
};

export const metatartaricDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateMetatartaricDose(input as unknown as MetatartaricDoseInput),
  description:
    "Convert a supplier-specified or treatment-plan metatartaric-acid rate into total product mass for the selected wine volume; the tool does not determine stability or persistence.",
  id: "oenology/metatartaric-dose",
  inputs: [
    {
      description: "Metatartaric acid rate per hectoliter of wine.",
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
      description: "Metatartaric acid to dissolve into the treated volume.",
      id: "productGrams",
      kind: "number",
      label: "Metatartaric acid",
      unit: "g",
    },
  ],
  title: "Metatartaric Acid Dose Calculator",
});
export const runMetatartaricDose = metatartaricDoseTool.execute;
export default metatartaricDoseTool;
