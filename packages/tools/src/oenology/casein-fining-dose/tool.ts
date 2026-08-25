import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CaseinFiningDoseInput = {
  readonly rateGPerHectoliter: number;
  readonly volumeHectoliters: number;
};

export type CaseinFiningDoseOutput = {
  readonly productGrams: number;
};

export const caseinFiningDoseExample = {
  input: {
    rateGPerHectoliter: 10,
    volumeHectoliters: 20,
  },
  output: {
    productGrams: 200,
  },
} satisfies ToolExample<CaseinFiningDoseInput, CaseinFiningDoseOutput>;

export const calculateCaseinFiningDose = (
  input: CaseinFiningDoseInput,
): CaseinFiningDoseOutput => {
  if (input.rateGPerHectoliter < 0)
    simpleError(
      "rateGPerHectoliter",
      "The fining rate cannot be negative.",
      "invalid_value",
    );
  return {
    productGrams: roundStatistic(
      input.rateGPerHectoliter * input.volumeHectoliters,
    ),
  };
};

export const caseinFiningDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateCaseinFiningDose(input as unknown as CaseinFiningDoseInput),
  description:
    "Convert a bench-trial or treatment-plan casein rate in grams per hectoliter into total product mass for a wine lot; this calculator does not select an effective dose.",
  id: "oenology/casein-fining-dose",
  inputs: [
    {
      description: "Casein rate per hectoliter of wine.",
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
      description: "Casein to prepare and add to the treated volume.",
      id: "productGrams",
      kind: "number",
      label: "Casein",
      unit: "g",
    },
  ],
  title: "Casein Fining Dose Calculator",
});
export const runCaseinFiningDose = caseinFiningDoseTool.execute;
export default caseinFiningDoseTool;
