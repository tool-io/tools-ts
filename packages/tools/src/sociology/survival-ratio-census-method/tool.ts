import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SurvivalRatioCensusMethodInput = {
  readonly populationAgeXCohort: number;
  readonly populationFiveYearsLater: number;
};

export type SurvivalRatioCensusMethodOutput = {
  readonly survivalRatio: number;
};

export const survivalRatioCensusMethodExample = {
  input: {
    populationAgeXCohort: 1000000,
    populationFiveYearsLater: 850000,
  },
  output: {
    survivalRatio: 0.85,
  },
} satisfies ToolExample<
  SurvivalRatioCensusMethodInput,
  SurvivalRatioCensusMethodOutput
>;

export const calculateSurvivalRatio = (
  input: SurvivalRatioCensusMethodInput,
): SurvivalRatioCensusMethodOutput => {
  if (
    !Number.isFinite(input.populationAgeXCohort) ||
    input.populationAgeXCohort <= 0
  )
    simpleError(
      "populationAgeXCohort",
      "The starting cohort count must be positive.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.populationFiveYearsLater) ||
    input.populationFiveYearsLater < 0
  )
    simpleError(
      "populationFiveYearsLater",
      "The later cohort count must be a finite nonnegative number.",
      "invalid_value",
    );
  const survivalRatio =
    input.populationFiveYearsLater / input.populationAgeXCohort;
  if (!Number.isFinite(survivalRatio))
    simpleError(
      "populationFiveYearsLater",
      "The cohort ratio is outside the finite numeric range.",
      "numeric_range",
    );
  return { survivalRatio };
};

export const survivalRatioCensusMethodTool = createSimpleTool({
  calculate: (input) =>
    calculateSurvivalRatio({
      populationAgeXCohort: input.populationAgeXCohort as number,
      populationFiveYearsLater: input.populationFiveYearsLater as number,
    }),
  description:
    "Compare a birth cohort across two censuses to estimate its five-year survival ratio.",
  id: "sociology/survival-ratio-census-method",
  inputs: [
    {
      description: "Cohort counted at age x in the earlier census.",
      id: "populationAgeXCohort",
      kind: "number",
      label: "Earlier cohort",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Same birth cohort counted five years older later.",
      id: "populationFiveYearsLater",
      kind: "number",
      label: "Later survivors",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Later-to-earlier cohort ratio; it estimates survival only when migration and coverage changes are negligible.",
      id: "survivalRatio",
      kind: "number",
      label: "Survival ratio",
    },
  ],
  title: "Survival Ratio Census Method Calculator",
});
export const runSurvivalRatioCensusMethod =
  survivalRatioCensusMethodTool.execute;
export default survivalRatioCensusMethodTool;
