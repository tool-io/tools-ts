import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OvercrowdedDwellingRateEurostatInput = {
  readonly peopleInOvercrowdedHouseholds: number;
  readonly surveyedPopulation: number;
};

export type OvercrowdedDwellingRateEurostatOutput = {
  readonly overcrowdingRatePercent: number;
};

export const overcrowdedDwellingRateEurostatExample = {
  input: {
    peopleInOvercrowdedHouseholds: 210,
    surveyedPopulation: 1500,
  },
  output: {
    overcrowdingRatePercent: 14.000000000000002,
  },
} satisfies ToolExample<
  OvercrowdedDwellingRateEurostatInput,
  OvercrowdedDwellingRateEurostatOutput
>;

export const calculateOvercrowdingRate = (
  input: OvercrowdedDwellingRateEurostatInput,
): OvercrowdedDwellingRateEurostatOutput => {
  if (
    !Number.isFinite(input.surveyedPopulation) ||
    input.surveyedPopulation <= 0
  )
    simpleError(
      "surveyedPopulation",
      "The surveyed population must be a finite positive number.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.peopleInOvercrowdedHouseholds) ||
    input.peopleInOvercrowdedHouseholds < 0 ||
    input.peopleInOvercrowdedHouseholds > input.surveyedPopulation
  )
    simpleError(
      "peopleInOvercrowdedHouseholds",
      "People in overcrowded households must be between zero and the surveyed population.",
      "invalid_value",
    );
  return {
    overcrowdingRatePercent:
      (input.peopleInOvercrowdedHouseholds / input.surveyedPopulation) * 100,
  };
};

export const overcrowdedDwellingRateEurostatTool = createSimpleTool({
  calculate: (input) =>
    calculateOvercrowdingRate({
      peopleInOvercrowdedHouseholds:
        input.peopleInOvercrowdedHouseholds as number,
      surveyedPopulation: input.surveyedPopulation as number,
    }),
  description:
    "Compute Eurostat's overcrowding rate as the percentage of people living in households classified as overcrowded.",
  id: "sociology/overcrowded-dwelling-rate-eurostat",
  inputs: [
    {
      description:
        "People living in households that fail Eurostat's rooms-per-household rule.",
      id: "peopleInOvercrowdedHouseholds",
      kind: "number",
      label: "People in overcrowded households",
      minimum: 0,
    },
    {
      description: "All people represented by the survey denominator.",
      id: "surveyedPopulation",
      kind: "number",
      label: "Surveyed population",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Share of people living in overcrowded households.",
      id: "overcrowdingRatePercent",
      kind: "number",
      label: "Overcrowding rate",
      unit: "%",
    },
  ],
  title: "Overcrowded Dwelling Rate Eurostat Calculator",
});
export const runOvercrowdedDwellingRateEurostat =
  overcrowdedDwellingRateEurostatTool.execute;
export default overcrowdedDwellingRateEurostatTool;
