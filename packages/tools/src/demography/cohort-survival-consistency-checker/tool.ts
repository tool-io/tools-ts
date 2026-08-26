import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CohortSurvivalConsistencyCheckerInput = {
  readonly cohortAtFirstCensus: number;
  readonly observedAtSecondCensus: number;
  readonly lifeTableLxAtStartAge: number;
  readonly lifeTableLxAfterInterval: number;
  readonly tolerancePercent?: number;
};

export type CohortSurvivalConsistencyCheckerOutput = {
  readonly survivalRatio: number;
  readonly expectedSurvivors: number;
  readonly closureErrorPercent: number;
  readonly consistent: boolean;
};

export const calculateCohortSurvivalConsistencyChecker = (
  input: CohortSurvivalConsistencyCheckerInput,
): CohortSurvivalConsistencyCheckerOutput => {
  const tolerancePercent = input.tolerancePercent ?? 5;
  if (!(input.cohortAtFirstCensus > 0))
    simpleError(
      "cohortAtFirstCensus",
      "The first census cohort size must be greater than zero.",
      "invalid_population",
    );
  if (!(
    typeof input.observedAtSecondCensus === "number" &&
    Number.isFinite(input.observedAtSecondCensus) &&
    input.observedAtSecondCensus >= 0
  ))
    simpleError(
      "observedAtSecondCensus",
      "The observed second census count must be finite and non-negative.",
      "invalid_population",
    );
  if (!(input.lifeTableLxAtStartAge > 0))
    simpleError(
      "lifeTableLxAtStartAge",
      "Life table Lx at the starting age must be greater than zero.",
      "invalid_life_table",
    );
  if (!(input.lifeTableLxAfterInterval > 0))
    simpleError(
      "lifeTableLxAfterInterval",
      "Life table Lx after the interval must be greater than zero.",
      "invalid_life_table",
    );
  if (input.lifeTableLxAfterInterval > input.lifeTableLxAtStartAge)
    simpleError(
      "lifeTableLxAfterInterval",
      "Life-table survivorship after the interval cannot exceed survivorship at its start.",
      "invalid_life_table",
    );
  if (!(tolerancePercent >= 0))
    simpleError(
      "tolerancePercent",
      "The closure tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const survivalRatio =
    input.lifeTableLxAfterInterval / input.lifeTableLxAtStartAge;
  const expectedSurvivors = input.cohortAtFirstCensus * survivalRatio;
  const closureErrorPercent =
    ((input.observedAtSecondCensus - expectedSurvivors) / expectedSurvivors) *
    100;
  return {
    survivalRatio,
    expectedSurvivors,
    closureErrorPercent,
    consistent: Math.abs(closureErrorPercent) <= tolerancePercent,
  };
};

export const cohortSurvivalConsistencyCheckerExample = {
  input: {
    cohortAtFirstCensus: 10000,
    observedAtSecondCensus: 9180,
    lifeTableLxAtStartAge: 450000,
    lifeTableLxAfterInterval: 405000,
  },
  output: {
    survivalRatio: 0.9,
    expectedSurvivors: 9000,
    closureErrorPercent: 2,
    consistent: true,
  },
} satisfies ToolExample<
  CohortSurvivalConsistencyCheckerInput,
  CohortSurvivalConsistencyCheckerOutput
>;

export const cohortSurvivalConsistencyCheckerTool = createSimpleTool({
  id: "demography/cohort-survival-consistency-checker",
  title: "Cohort Survival Consistency Checker",
  description:
    "Project a census cohort forward with the life-table survival ratio L(x+n)/L(x) and report the percent closure error of the observed second census count against it.",
  inputs: [
    {
      description: "Cohort size enumerated at the first census.",
      id: "cohortAtFirstCensus",
      kind: "number",
      label: "Cohort at t1",
      minimum: 0,
    },
    {
      description:
        "Observed size of the same birth cohort at the second census.",
      id: "observedAtSecondCensus",
      kind: "number",
      label: "Observed at t2",
      minimum: 0,
    },
    {
      description:
        "Life table person-years Lx for the age group occupied at the first census.",
      id: "lifeTableLxAtStartAge",
      kind: "number",
      label: "Lx start",
      minimum: 0,
    },
    {
      description:
        "Life table person-years Lx for the age group occupied n years later.",
      id: "lifeTableLxAfterInterval",
      kind: "number",
      label: "Lx after interval",
      minimum: 0,
    },
    {
      default: 5,
      description:
        "Maximum absolute closure error in percent still judged consistent.",
      id: "tolerancePercent",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Cohort survival ratio implied by the life table.",
      id: "survivalRatio",
      kind: "number",
      label: "Survival ratio",
    },
    {
      description:
        "Expected survivors obtained by multiplying the cohort by the ratio.",
      id: "expectedSurvivors",
      kind: "number",
      label: "Expected",
    },
    {
      description:
        "Observed minus expected survivors as a percent of the expected value.",
      id: "closureErrorPercent",
      kind: "number",
      label: "Closure error",
    },
    {
      description:
        "True when the absolute closure error is within the tolerance.",
      id: "consistent",
      kind: "boolean",
      label: "Consistent",
    },
  ],
  calculate: (input) =>
    calculateCohortSurvivalConsistencyChecker(
      input as unknown as CohortSurvivalConsistencyCheckerInput,
    ),
});

export const runCohortSurvivalConsistencyChecker =
  cohortSurvivalConsistencyCheckerTool.execute;
export default cohortSurvivalConsistencyCheckerTool;
