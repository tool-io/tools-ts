import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ImrInfantMortalityRateInput = {
  readonly deathsUnderOne: number;
  readonly liveBirths: number;
};

export type ImrInfantMortalityRateOutput = {
  readonly infantMortalityRate: number;
};

export const calculateImrInfantMortalityRate = (
  input: ImrInfantMortalityRateInput,
): ImrInfantMortalityRateOutput => {
  if (!(input.deathsUnderOne >= 0))
    simpleError(
      "deathsUnderOne",
      "Infant deaths must be non-negative.",
      "invalid_deaths",
    );
  if (!(input.liveBirths > 0))
    simpleError(
      "liveBirths",
      "Live births must be greater than zero.",
      "invalid_births",
    );
  return {
    infantMortalityRate: (input.deathsUnderOne / input.liveBirths) * 1000,
  };
};

export const imrInfantMortalityRateExample = {
  input: { deathsUnderOne: 5200, liveBirths: 210000 },
  output: { infantMortalityRate: 24.761904761904763 },
} satisfies ToolExample<
  ImrInfantMortalityRateInput,
  ImrInfantMortalityRateOutput
>;

export const imrInfantMortalityRateTool = createSimpleTool({
  id: "demography/imr-infant-mortality-rate",
  title: "IMR Infant Mortality Rate Calculator",
  description:
    "Compute the infant mortality rate as deaths under age one per one thousand live births.",
  inputs: [
    {
      description: "Deaths of children under one year of age in the year.",
      id: "deathsUnderOne",
      kind: "number",
      label: "Deaths <1",
      minimum: 0,
    },
    {
      description: "Live births in the year.",
      id: "liveBirths",
      kind: "number",
      label: "Live births",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Infant mortality rate per 1000 live births.",
      id: "infantMortalityRate",
      kind: "number",
      label: "IMR",
    },
  ],
  calculate: (input) =>
    calculateImrInfantMortalityRate(
      input as unknown as ImrInfantMortalityRateInput,
    ),
});

export const runImrInfantMortalityRate = imrInfantMortalityRateTool.execute;
export default imrInfantMortalityRateTool;
