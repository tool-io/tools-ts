import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type U5mrUnderFiveRateInput = {
  readonly deathsUnderFive: number;
  readonly liveBirths: number;
};

export type U5mrUnderFiveRateOutput = {
  readonly underFiveMortalityRate: number;
};

export const calculateU5mrUnderFiveRate = (
  input: U5mrUnderFiveRateInput,
): U5mrUnderFiveRateOutput => {
  if (!(input.deathsUnderFive >= 0))
    simpleError(
      "deathsUnderFive",
      "Deaths under five must be non-negative.",
      "invalid_deaths",
    );
  if (!(input.liveBirths > 0))
    simpleError(
      "liveBirths",
      "Live births must be greater than zero.",
      "invalid_births",
    );
  return {
    underFiveMortalityRate: (input.deathsUnderFive / input.liveBirths) * 1000,
  };
};

export const u5mrUnderFiveRateExample = {
  input: { deathsUnderFive: 7800, liveBirths: 190000 },
  output: { underFiveMortalityRate: 41.05263157894737 },
} satisfies ToolExample<U5mrUnderFiveRateInput, U5mrUnderFiveRateOutput>;

export const u5mrUnderFiveRateTool = createSimpleTool({
  id: "demography/u5mr-under-five-rate",
  title: "U5MR Under Five Rate Calculator",
  description:
    "Compute the under-five mortality rate as deaths of children under age five per one thousand live births.",
  inputs: [
    {
      description: "Deaths of children under five years of age.",
      id: "deathsUnderFive",
      kind: "number",
      label: "Deaths <5",
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
      description: "Under-five mortality rate per 1000 live births.",
      id: "underFiveMortalityRate",
      kind: "number",
      label: "U5MR",
    },
  ],
  calculate: (input) =>
    calculateU5mrUnderFiveRate(input as unknown as U5mrUnderFiveRateInput),
});

export const runU5mrUnderFiveRate = u5mrUnderFiveRateTool.execute;
export default u5mrUnderFiveRateTool;
