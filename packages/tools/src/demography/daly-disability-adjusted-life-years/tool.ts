import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DalyDisabilityAdjustedLifeYearsInput = {
  readonly numberOfDeaths: number;
  readonly lifeExpectancyAtDeathYears: number;
  readonly incidentCases: number;
  readonly disabilityWeight: number;
  readonly averageDurationYears: number;
};

export type DalyDisabilityAdjustedLifeYearsOutput = {
  readonly yllYears: number;
  readonly yldYears: number;
  readonly dalyYears: number;
};

export const calculateDalyDisabilityAdjustedLifeYears = (
  input: DalyDisabilityAdjustedLifeYearsInput,
): DalyDisabilityAdjustedLifeYearsOutput => {
  if (!(input.numberOfDeaths >= 0))
    return simpleError(
      "numberOfDeaths",
      "Deaths must be non-negative.",
      "invalid_burden",
    );
  if (!(input.lifeExpectancyAtDeathYears > 0))
    return simpleError(
      "lifeExpectancyAtDeathYears",
      "Standard life expectancy at the age of death must be greater than zero.",
      "invalid_burden",
    );
  if (!(input.incidentCases >= 0))
    return simpleError(
      "incidentCases",
      "Incident cases must be non-negative.",
      "invalid_burden",
    );
  if (!(input.disabilityWeight >= 0 && input.disabilityWeight <= 1))
    return simpleError(
      "disabilityWeight",
      "The disability weight must lie between zero and one.",
      "invalid_burden",
    );
  if (!(input.averageDurationYears >= 0))
    return simpleError(
      "averageDurationYears",
      "Average duration must be non-negative.",
      "invalid_burden",
    );
  const yllYears = input.numberOfDeaths * input.lifeExpectancyAtDeathYears;
  const yldYears =
    input.incidentCases * input.disabilityWeight * input.averageDurationYears;
  return { yllYears, yldYears, dalyYears: yllYears + yldYears };
};

export const dalyDisabilityAdjustedLifeYearsExample = {
  input: {
    numberOfDeaths: 120,
    lifeExpectancyAtDeathYears: 38,
    incidentCases: 900,
    disabilityWeight: 0.25,
    averageDurationYears: 6,
  },
  output: { yllYears: 4560, yldYears: 1350, dalyYears: 5910 },
} satisfies ToolExample<
  DalyDisabilityAdjustedLifeYearsInput,
  DalyDisabilityAdjustedLifeYearsOutput
>;

export const dalyDisabilityAdjustedLifeYearsTool = createSimpleTool({
  id: "demography/daly-disability-adjusted-life-years",
  title: "DALY Calculator",
  description:
    "Compute disability-adjusted life years as YLL (deaths times standard life expectancy at death) plus YLD (incidence times disability weight times duration), undiscounted and without age weighting per the GBD 2010+ convention.",
  inputs: [
    {
      description: "Deaths from the condition.",
      id: "numberOfDeaths",
      kind: "number",
      label: "Deaths",
      minimum: 0,
    },
    {
      description: "Standard life expectancy in years at the age of death.",
      id: "lifeExpectancyAtDeathYears",
      kind: "number",
      label: "LE at death",
    },
    {
      description: "New cases arising during the period.",
      id: "incidentCases",
      kind: "number",
      label: "Incident cases",
      minimum: 0,
    },
    {
      description:
        "Disability weight between zero (full health) and one (death).",
      id: "disabilityWeight",
      kind: "number",
      label: "DW",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Average duration of the disabling state in years.",
      id: "averageDurationYears",
      kind: "number",
      label: "Duration",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Years of life lost to mortality.",
      id: "yllYears",
      kind: "number",
      label: "YLL",
    },
    {
      description: "Years lived with disability.",
      id: "yldYears",
      kind: "number",
      label: "YLD",
    },
    {
      description: "Total DALYs, YLL plus YLD.",
      id: "dalyYears",
      kind: "number",
      label: "DALY",
    },
  ],
  calculate: (input) =>
    calculateDalyDisabilityAdjustedLifeYears(
      input as unknown as DalyDisabilityAdjustedLifeYearsInput,
    ),
});

export const runDalyDisabilityAdjustedLifeYears =
  dalyDisabilityAdjustedLifeYearsTool.execute;
export default dalyDisabilityAdjustedLifeYearsTool;
