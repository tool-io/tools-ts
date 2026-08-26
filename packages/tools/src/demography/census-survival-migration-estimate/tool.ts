import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CensusSurvivalMigrationEstimateInput = {
  readonly populationFirstCensus: number;
  readonly populationSecondCensus: number;
  readonly censusSurvivalRatio: number;
};

export type CensusSurvivalMigrationEstimateOutput = {
  readonly expectedSurvivors: number;
  readonly netMigrants: number;
};

export const calculateCensusSurvivalMigrationEstimate = (
  input: CensusSurvivalMigrationEstimateInput,
): CensusSurvivalMigrationEstimateOutput => {
  if (!(input.populationFirstCensus >= 0))
    return simpleError(
      "populationFirstCensus",
      "The first-census cohort size must be non-negative.",
      "invalid_population",
    );
  if (!(input.populationSecondCensus >= 0))
    return simpleError(
      "populationSecondCensus",
      "The second-census cohort size must be non-negative.",
      "invalid_population",
    );
  if (!(input.censusSurvivalRatio > 0 && input.censusSurvivalRatio <= 1))
    return simpleError(
      "censusSurvivalRatio",
      "The census survival ratio must lie between zero and one.",
      "invalid_ratio",
    );
  const expectedSurvivors =
    input.populationFirstCensus * input.censusSurvivalRatio;
  return {
    expectedSurvivors,
    netMigrants: input.populationSecondCensus - expectedSurvivors,
  };
};

export const censusSurvivalMigrationEstimateExample = {
  input: {
    populationFirstCensus: 500000,
    populationSecondCensus: 480000,
    censusSurvivalRatio: 0.95,
  },
  output: { expectedSurvivors: 475000, netMigrants: 5000 },
} satisfies ToolExample<
  CensusSurvivalMigrationEstimateInput,
  CensusSurvivalMigrationEstimateOutput
>;

export const censusSurvivalMigrationEstimateTool = createSimpleTool({
  id: "demography/census-survival-migration-estimate",
  title: "Census Survival Migration Estimate",
  description:
    "Estimate intercensal net migration for an age cohort as the observed cohort at the second census minus the survivors implied by applying a national life-table census survival ratio to the first-census cohort.",
  inputs: [
    {
      description: "Cohort size at age x in the first census.",
      id: "populationFirstCensus",
      kind: "number",
      label: "P1(x)",
      minimum: 0,
    },
    {
      description: "Same cohort at age x+n in the second census.",
      id: "populationSecondCensus",
      kind: "number",
      label: "P2(x+n)",
      minimum: 0,
    },
    {
      description: "Census survival ratio l(x+n)/l(x) for the cohort.",
      id: "censusSurvivalRatio",
      kind: "number",
      label: "Survival ratio",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Expected survivors without migration.",
      id: "expectedSurvivors",
      kind: "number",
      label: "Survivors",
    },
    {
      description: "Estimated net migrants; negative means net out-migration.",
      id: "netMigrants",
      kind: "number",
      label: "Net migrants",
    },
  ],
  calculate: (input) =>
    calculateCensusSurvivalMigrationEstimate(
      input as unknown as CensusSurvivalMigrationEstimateInput,
    ),
});

export const runCensusSurvivalMigrationEstimate =
  censusSurvivalMigrationEstimateTool.execute;
export default censusSurvivalMigrationEstimateTool;
