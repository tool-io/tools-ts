import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MigrationAgePropensityScheduleInput = {
  readonly migrantsByAge: readonly number[];
  readonly populationByAge: readonly number[];
};

export type MigrationAgePropensityScheduleOutput = {
  readonly propensitiesByAge: readonly number[];
};

export const migrationAgePropensityScheduleExample = {
  input: {
    migrantsByAge: [50, 200],
    populationByAge: [10000, 20000],
  },
  output: {
    propensitiesByAge: [0.005, 0.01],
  },
} satisfies ToolExample<
  MigrationAgePropensityScheduleInput,
  MigrationAgePropensityScheduleOutput
>;

export const calculateMigrationAgePropensities = (
  input: MigrationAgePropensityScheduleInput,
): MigrationAgePropensityScheduleOutput => {
  if (input.migrantsByAge.length !== input.populationByAge.length)
    simpleError(
      "populationByAge",
      "Every age group needs both a migrant count and a population base.",
      "length_mismatch",
    );
  if (input.populationByAge.length === 0)
    simpleError(
      "populationByAge",
      "At least one age group is required.",
      "invalid_value",
    );
  if (
    input.migrantsByAge.some(
      (migrants) => !Number.isFinite(migrants) || migrants < 0,
    )
  )
    simpleError(
      "migrantsByAge",
      "Migrant counts must be finite nonnegative numbers.",
      "invalid_value",
    );
  return {
    propensitiesByAge: input.populationByAge.map((population, index) => {
      if (!Number.isFinite(population) || population <= 0)
        simpleError(
          "populationByAge",
          "The at-risk population must be positive in every age group.",
          "invalid_value",
        );
      const propensity = input.migrantsByAge[index] / population;
      if (!Number.isFinite(propensity))
        simpleError(
          "migrantsByAge",
          "A migration propensity is outside the finite numeric range.",
          "numeric_range",
        );
      return propensity;
    }),
  };
};

export const migrationAgePropensityScheduleTool = createSimpleTool({
  calculate: (input) =>
    calculateMigrationAgePropensities({
      migrantsByAge: input.migrantsByAge as readonly number[],
      populationByAge: input.populationByAge as readonly number[],
    }),
  description:
    "Build the age-specific migration propensity schedule from migrant counts and the population at risk.",
  id: "sociology/migration-age-propensity-schedule",
  inputs: [
    {
      description: "Movers recorded in each age group.",
      id: "migrantsByAge",
      kind: "numberList",
      label: "Migrants by age",
    },
    {
      description: "Population at risk for the same groups.",
      id: "populationByAge",
      kind: "numberList",
      label: "Population by age",
    },
  ],
  outputs: [
    {
      description: "Migration rate per person in each age group.",
      id: "propensitiesByAge",
      kind: "numberList",
      label: "Propensities",
    },
  ],
  title: "Migration Age Propensity Schedule Calculator",
});
export const runMigrationAgePropensitySchedule =
  migrationAgePropensityScheduleTool.execute;
export default migrationAgePropensityScheduleTool;
