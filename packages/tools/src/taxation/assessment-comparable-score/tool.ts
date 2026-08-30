import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly subjectValue: number;
  readonly comparableValues: readonly number[];
  readonly similarityScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedComparableValue: number;
  readonly subjectVariancePercent: number;
  readonly totalWeight: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.comparableValues.length === 0 ||
    input.comparableValues.length !== input.similarityScores.length ||
    input.similarityScores.some((value) => value < 0)
  )
    simpleError(
      "comparableValues",
      "Comparable values and nonnegative scores must be aligned and nonempty.",
      "invalid_comparables",
    );
  const totalWeight = input.similarityScores.reduce((a, b) => a + b, 0);
  if (totalWeight <= 0)
    simpleError(
      "similarityScores",
      "Total similarity weight must be positive.",
      "zero_weight",
    );
  const weightedComparableValue =
    input.comparableValues.reduce(
      (sum, value, index) => sum + value * input.similarityScores[index],
      0,
    ) / totalWeight;
  return {
    weightedComparableValue,
    subjectVariancePercent:
      weightedComparableValue === 0
        ? 0
        : (input.subjectValue / weightedComparableValue - 1) * 100,
    totalWeight,
  };
};

export const exampleInput = {
  subjectValue: 330000,
  comparableValues: [300000, 320000, 340000],
  similarityScores: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  weightedComparableValue: 320000,
  subjectVariancePercent: 3.125,
  totalWeight: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      subjectValue: input.subjectValue as number,
      comparableValues: input.comparableValues as readonly number[],
      similarityScores: input.similarityScores as readonly number[],
    }),
  description:
    "Weight comparable assessments by caller-assigned similarity and measure the subject variance.",
  id: "taxation/assessment-comparable-score",
  inputs: [
    {
      id: "subjectValue",
      label: "Subject assessed value",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "comparableValues",
      label: "Comparable assessed values",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "similarityScores",
      label: "Comparable similarity scores",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "weightedComparableValue",
      label: "Weighted comparable value",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "subjectVariancePercent",
      label: "Subject variance from comparables",
      kind: "number",
      unit: "%",
    },
    {
      id: "totalWeight",
      label: "Total similarity weight",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Assessment Comparable Score",
});

export const run = tool.execute;
export default tool;
