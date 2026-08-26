import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchoolAgePopulationProjectionInput = {
  readonly currentSchoolAgePopulation: number;
  readonly survivalRatio: number;
  readonly netMigrantSchoolAgeChildren?: number;
};

export type SchoolAgePopulationProjectionOutput = {
  readonly projectedSchoolAgePopulation: number;
  readonly expectedSurvivors: number;
};

export const calculateSchoolAgePopulationProjection = (
  input: SchoolAgePopulationProjectionInput,
): SchoolAgePopulationProjectionOutput => {
  if (!(input.currentSchoolAgePopulation >= 0))
    return simpleError(
      "currentSchoolAgePopulation",
      "The current school-age population must be non-negative.",
      "invalid_population",
    );
  if (!(input.survivalRatio > 0 && input.survivalRatio <= 1))
    return simpleError(
      "survivalRatio",
      "The cohort survival ratio must lie between zero and one.",
      "invalid_ratio",
    );
  const netMigrantSchoolAgeChildren = input.netMigrantSchoolAgeChildren ?? 0;
  if (!Number.isFinite(netMigrantSchoolAgeChildren))
    return simpleError(
      "netMigrantSchoolAgeChildren",
      "Net migration must be a finite number.",
      "invalid_migration",
    );
  const expectedSurvivors =
    input.currentSchoolAgePopulation * input.survivalRatio;
  if (expectedSurvivors + netMigrantSchoolAgeChildren < 0)
    return simpleError(
      "netMigrantSchoolAgeChildren",
      "Net out-migration cannot make the projected population negative.",
      "invalid_migration",
    );
  return {
    projectedSchoolAgePopulation:
      expectedSurvivors + netMigrantSchoolAgeChildren,
    expectedSurvivors,
  };
};

export const schoolAgePopulationProjectionExample = {
  input: {
    currentSchoolAgePopulation: 2000000,
    survivalRatio: 0.97,
    netMigrantSchoolAgeChildren: 15000,
  },
  output: {
    projectedSchoolAgePopulation: 1955000,
    expectedSurvivors: 1940000,
  },
} satisfies ToolExample<
  SchoolAgePopulationProjectionInput,
  SchoolAgePopulationProjectionOutput
>;

export const schoolAgePopulationProjectionTool = createSimpleTool({
  id: "demography/school-age-population-projection",
  title: "School Age Population Projection",
  description:
    "Project a school-age cohort to the next planning date with the census survival ratio method: survivors equal the current cohort times l(x+n)/l(x), plus net school-age migrants.",
  inputs: [
    {
      description: "Current population of the school-age group.",
      id: "currentSchoolAgePopulation",
      kind: "number",
      label: "Cohort",
      minimum: 0,
    },
    {
      description:
        "Life-table survival ratio for the cohort over the projection interval.",
      id: "survivalRatio",
      kind: "number",
      label: "Survival ratio",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Net migrant children in the age group arriving by the target date; may be negative.",
      id: "netMigrantSchoolAgeChildren",
      kind: "number",
      label: "Net migrants",
    },
  ],
  outputs: [
    {
      description: "Projected school-age population at the target date.",
      id: "projectedSchoolAgePopulation",
      kind: "number",
      label: "Projection",
    },
    {
      description: "Expected survivors before adding migration.",
      id: "expectedSurvivors",
      kind: "number",
      label: "Survivors",
    },
  ],
  calculate: (input) =>
    calculateSchoolAgePopulationProjection(
      input as unknown as SchoolAgePopulationProjectionInput,
    ),
});

export const runSchoolAgePopulationProjection =
  schoolAgePopulationProjectionTool.execute;
export default schoolAgePopulationProjectionTool;
