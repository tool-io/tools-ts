import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type YllYearsOfLifeLostStandardInput = {
  readonly numberOfDeaths: readonly number[];
  readonly standardLifeExpectancyAtDeath: readonly number[];
};

export type YllYearsOfLifeLostStandardOutput = {
  readonly yllTotal: number;
};

export const calculateYllYearsOfLifeLostStandard = (
  input: YllYearsOfLifeLostStandardInput,
): YllYearsOfLifeLostStandardOutput => {
  const deaths = input.numberOfDeaths;
  const expectancies = input.standardLifeExpectancyAtDeath;
  if (deaths.length < 1)
    return simpleError(
      "numberOfDeaths",
      "Provide at least one age group.",
      "invalid_list",
    );
  if (deaths.length !== expectancies.length)
    return simpleError(
      "standardLifeExpectancyAtDeath",
      "Death counts and life expectancy lists must have the same length.",
      "invalid_list",
    );
  for (const count of deaths)
    if (!(count >= 0))
      return simpleError(
        "numberOfDeaths",
        "Death counts must be non-negative.",
        "invalid_list",
      );
  for (const value of expectancies)
    if (!(value > 0))
      return simpleError(
        "standardLifeExpectancyAtDeath",
        "Standard life expectancies must be greater than zero.",
        "invalid_list",
      );
  let yllTotal = 0;
  for (let index = 0; index < deaths.length; index += 1)
    yllTotal += (deaths[index] as number) * (expectancies[index] as number);
  return { yllTotal };
};

export const yllYearsOfLifeLostStandardExample = {
  input: {
    numberOfDeaths: [50, 120, 200],
    standardLifeExpectancyAtDeath: [72, 41, 22],
  },
  output: { yllTotal: 12920 },
} satisfies ToolExample<
  YllYearsOfLifeLostStandardInput,
  YllYearsOfLifeLostStandardOutput
>;

export const yllYearsOfLifeLostStandardTool = createSimpleTool({
  id: "demography/yll-years-of-life-lost-standard",
  title: "YLL Calculator",
  description:
    "Compute total years of life lost as the sum of deaths in each age group times the standard life expectancy remaining at that age, undiscounted and without age weighting per the GBD 2010+ convention.",
  inputs: [
    {
      description: "Deaths in each age group or cause class.",
      id: "numberOfDeaths",
      kind: "numberList",
      label: "Deaths",
    },
    {
      description:
        "Standard life expectancy in years at death, aligned with the death counts.",
      id: "standardLifeExpectancyAtDeath",
      kind: "numberList",
      label: "LE at death",
    },
  ],
  outputs: [
    {
      description: "Total years of life lost.",
      id: "yllTotal",
      kind: "number",
      label: "YLL",
    },
  ],
  calculate: (input) =>
    calculateYllYearsOfLifeLostStandard(
      input as unknown as YllYearsOfLifeLostStandardInput,
    ),
});

export const runYllYearsOfLifeLostStandard =
  yllYearsOfLifeLostStandardTool.execute;
export default yllYearsOfLifeLostStandardTool;
