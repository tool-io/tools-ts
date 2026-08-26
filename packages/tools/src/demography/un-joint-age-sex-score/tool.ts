import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnJointAgeSexScoreInput = {
  readonly malePopulation: readonly number[];
  readonly femalePopulation: readonly number[];
};

export type UnJointAgeSexScoreOutput = {
  readonly sexRatioScore: number;
  readonly maleAgeRatioScore: number;
  readonly femaleAgeRatioScore: number;
  readonly jointScore: number;
  readonly accuracyClass: "accurate" | "inaccurate" | "highlyInaccurate";
};

const checkPositiveList = (values: readonly number[], field: string): void => {
  if (values.length < 3)
    simpleError(
      field,
      "Provide at least three five-year age groups.",
      "invalid_list",
    );
  for (const value of values)
    if (!(typeof value === "number" && Number.isFinite(value) && value > 0))
      simpleError(
        field,
        "Age-group populations must be finite and greater than zero.",
        "invalid_list",
      );
};

const ageRatioScore = (values: readonly number[]): number => {
  let score = 0;
  for (let i = 1; i < values.length - 1; i += 1)
    score += Math.abs(
      200 * (values[i]! / (values[i - 1]! + values[i + 1]!)) - 100,
    );
  return score;
};

/**
 * UN Manual IV age-sex accuracy index: three times the sum of absolute
 * successive sex-ratio differences plus male and female age-ratio scores.
 */
export const calculateUnJointAgeSexScore = (
  input: UnJointAgeSexScoreInput,
): UnJointAgeSexScoreOutput => {
  checkPositiveList(input.malePopulation, "malePopulation");
  checkPositiveList(input.femalePopulation, "femalePopulation");
  if (input.malePopulation.length !== input.femalePopulation.length)
    simpleError(
      "femalePopulation",
      "Male and female lists must cover the same age groups.",
      "invalid_list",
    );
  let sexRatioScore = 0;
  let previous = 100 * (input.malePopulation[0]! / input.femalePopulation[0]!);
  for (let i = 1; i < input.malePopulation.length; i += 1) {
    const ratio = 100 * (input.malePopulation[i]! / input.femalePopulation[i]!);
    sexRatioScore += Math.abs(ratio - previous);
    previous = ratio;
  }
  sexRatioScore *= 3;
  const maleAgeRatioScore = ageRatioScore(input.malePopulation);
  const femaleAgeRatioScore = ageRatioScore(input.femalePopulation);
  const jointScore = sexRatioScore + maleAgeRatioScore + femaleAgeRatioScore;
  const accuracyClass =
    jointScore < 20
      ? "accurate"
      : jointScore <= 40
        ? "inaccurate"
        : "highlyInaccurate";
  return {
    sexRatioScore,
    maleAgeRatioScore,
    femaleAgeRatioScore,
    jointScore,
    accuracyClass,
  };
};

export const unJointAgeSexScoreExample = {
  input: {
    malePopulation: [100, 98, 97, 95],
    femalePopulation: [104, 102, 101, 99],
  },
  output: {
    sexRatioScore: 0.5827505827506059,
    maleAgeRatioScore: 1.0257489282238765,
    femaleAgeRatioScore: 0.9853173158597315,
    jointScore: 2.593816826834214,
    accuracyClass: "accurate",
  },
} satisfies ToolExample<UnJointAgeSexScoreInput, UnJointAgeSexScoreOutput>;

export const unJointAgeSexScoreTool = createSimpleTool({
  id: "demography/un-joint-age-sex-score",
  title: "UN Joint Age Sex Score",
  description:
    "Compute the UN Manual IV joint score for age-sex data quality: three times the sum of absolute successive sex-ratio deviations plus the summed male and female age-ratio deviations, classifying below 20 as accurate, 20 to 40 as inaccurate and above 40 as highly inaccurate.",
  inputs: [
    {
      description: "Male population by five-year age group.",
      id: "malePopulation",
      kind: "numberList",
      label: "Males",
    },
    {
      description:
        "Female population by five-year age group, same order as males.",
      id: "femalePopulation",
      kind: "numberList",
      label: "Females",
    },
  ],
  outputs: [
    {
      description:
        "Three times the sum of absolute successive sex-ratio differences.",
      id: "sexRatioScore",
      kind: "number",
      label: "Sex ratio score",
    },
    {
      description: "Sum of absolute male age-ratio deviations from 100.",
      id: "maleAgeRatioScore",
      kind: "number",
      label: "Male age ratio score",
    },
    {
      description: "Sum of absolute female age-ratio deviations from 100.",
      id: "femaleAgeRatioScore",
      kind: "number",
      label: "Female age ratio score",
    },
    {
      description: "Total UN joint score.",
      id: "jointScore",
      kind: "number",
      label: "Joint score",
    },
    {
      description: "UN accuracy classification of the reported schedule.",
      enum: ["accurate", "inaccurate", "highlyInaccurate"],
      id: "accuracyClass",
      kind: "string",
      label: "Accuracy",
    },
  ],
  calculate: (input) =>
    calculateUnJointAgeSexScore(input as unknown as UnJointAgeSexScoreInput),
});

export const runUnJointAgeSexScore = unJointAgeSexScoreTool.execute;
export default unJointAgeSexScoreTool;
