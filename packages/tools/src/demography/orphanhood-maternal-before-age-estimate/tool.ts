import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OrphanhoodMaternalBeforeAgeEstimateInput = {
  readonly maternalSurvivalLm: readonly number[];
  readonly meanMaternalAgeAtBirth: number;
  readonly targetChildAge: number;
};

export type OrphanhoodMaternalBeforeAgeEstimateOutput = {
  readonly maternalSurvivalAtMeanMaternity: number;
  readonly maternalSurvivalAtTargetAgeOfMother: number;
  readonly proportionMotherAlive: number;
  readonly proportionOrphanedBeforeTargetAge: number;
};

const interpolateFiveYear = (
  table: readonly number[],
  age: number,
  field: string,
): number => {
  const position = age / 5;
  const index = Math.floor(position);
  if (index >= table.length)
    simpleError(
      field,
      "Extend the maternal survival table to cover the requested age.",
      "invalid_list",
    );
  if (index === position) return table[index]!;
  if (index + 1 >= table.length)
    simpleError(
      field,
      "Extend the maternal survival table to cover the requested age.",
      "invalid_list",
    );
  return (
    table[index]! + (position - index) * (table[index + 1]! - table[index]!)
  );
};

/**
 * Mean-maternity shortcut for maternal orphanhood: concentrating mothers'
 * ages at childbirth on the mean M gives P(mother alive at child's age a)
 * = lM(M + a) / lM(M), with linear interpolation between quinquennia.
 */
export const calculateOrphanhoodMaternalBeforeAgeEstimate = (
  input: OrphanhoodMaternalBeforeAgeEstimateInput,
): OrphanhoodMaternalBeforeAgeEstimateOutput => {
  const table = input.maternalSurvivalLm;
  if (table.length < 2)
    simpleError(
      "maternalSurvivalLm",
      "Provide at least two quinquennial maternal survival values.",
      "invalid_list",
    );
  for (const value of table)
    if (!(
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0 &&
      value <= 1
    ))
      simpleError(
        "maternalSurvivalLm",
        "Maternal survival values must lie in the interval from zero (exclusive) to one.",
        "invalid_list",
      );
  for (let index = 1; index < table.length; index += 1)
    if (table[index]! > table[index - 1]!)
      simpleError(
        "maternalSurvivalLm",
        "Maternal survivorship must be non-increasing as age advances.",
        "invalid_list",
      );
  if (!(
    typeof input.meanMaternalAgeAtBirth === "number" &&
    Number.isFinite(input.meanMaternalAgeAtBirth) &&
    input.meanMaternalAgeAtBirth > 0
  ))
    simpleError(
      "meanMaternalAgeAtBirth",
      "The mean age of mothers at childbirth must be greater than zero.",
      "invalid_age",
    );
  if (!(
    typeof input.targetChildAge === "number" &&
    Number.isFinite(input.targetChildAge) &&
    input.targetChildAge >= 0
  ))
    simpleError(
      "targetChildAge",
      "The target child age must be non-negative.",
      "invalid_age",
    );
  const atMaternity = interpolateFiveYear(
    table,
    input.meanMaternalAgeAtBirth,
    "maternalSurvivalLm",
  );
  const atTarget = interpolateFiveYear(
    table,
    input.meanMaternalAgeAtBirth + input.targetChildAge,
    "maternalSurvivalLm",
  );
  if (!(atMaternity > 0))
    simpleError(
      "maternalSurvivalLm",
      "Maternal survival at the mean maternity age must be greater than zero.",
      "invalid_list",
    );
  const proportionMotherAlive = atTarget / atMaternity;
  return {
    maternalSurvivalAtMeanMaternity: atMaternity,
    maternalSurvivalAtTargetAgeOfMother: atTarget,
    proportionMotherAlive,
    proportionOrphanedBeforeTargetAge: 1 - proportionMotherAlive,
  };
};

export const orphanhoodMaternalBeforeAgeEstimateExample = {
  input: {
    maternalSurvivalLm: [0.97, 0.94, 0.91, 0.88, 0.84, 0.79, 0.73],
    meanMaternalAgeAtBirth: 20,
    targetChildAge: 10,
  },
  output: {
    maternalSurvivalAtMeanMaternity: 0.84,
    maternalSurvivalAtTargetAgeOfMother: 0.73,
    proportionMotherAlive: 0.8690476190476191,
    proportionOrphanedBeforeTargetAge: 0.13095238095238093,
  },
} satisfies ToolExample<
  OrphanhoodMaternalBeforeAgeEstimateInput,
  OrphanhoodMaternalBeforeAgeEstimateOutput
>;

export const orphanhoodMaternalBeforeAgeEstimateTool = createSimpleTool({
  id: "demography/orphanhood-maternal-before-age-estimate",
  title: "Orphanhood Maternal Before Age Estimate",
  description:
    "Estimate the proportion of children of a given age whose mother is alive by applying maternal life-table survivorship lM(M + a) / lM(M) at the mean maternal age at birth M, with linear interpolation across five-year groups.",
  inputs: [
    {
      description:
        "Maternal survivorship lM from ages 0 upward in five-year steps, each in (0, 1].",
      id: "maternalSurvivalLm",
      kind: "numberList",
      label: "lM",
    },
    {
      description:
        "Mean age of mothers at childbirth in years; supply a value estimated for the population.",
      id: "meanMaternalAgeAtBirth",
      kind: "number",
      label: "Mean maternity age",
    },
    {
      description: "Child age at which orphanhood is evaluated.",
      id: "targetChildAge",
      kind: "number",
      label: "Child age",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Interpolated lM at the mother's mean maternity age.",
      id: "maternalSurvivalAtMeanMaternity",
      kind: "number",
      label: "lM(M)",
    },
    {
      description: "Interpolated lM when the child reaches the target age.",
      id: "maternalSurvivalAtTargetAgeOfMother",
      kind: "number",
      label: "lM(M+a)",
    },
    {
      description: "Estimated proportion of children with a living mother.",
      id: "proportionMotherAlive",
      kind: "number",
      label: "Mother alive",
    },
    {
      description:
        "Estimated proportion maternally orphaned before the target age.",
      id: "proportionOrphanedBeforeTargetAge",
      kind: "number",
      label: "Orphaned",
    },
  ],
  calculate: (input) =>
    calculateOrphanhoodMaternalBeforeAgeEstimate(
      input as unknown as OrphanhoodMaternalBeforeAgeEstimateInput,
    ),
});

export const runOrphanhoodMaternalBeforeAgeEstimate =
  orphanhoodMaternalBeforeAgeEstimateTool.execute;
export default orphanhoodMaternalBeforeAgeEstimateTool;
