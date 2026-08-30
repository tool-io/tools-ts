import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly studentIds: readonly string[];
  readonly latestScores: readonly number[];
  readonly masteryScore: number;
  readonly attemptsUsed: readonly number[];
  readonly maximumAttempts: number;
}>;
export type Output = Readonly<{
  readonly masteredIds: readonly string[];
  readonly retryEligibleIds: readonly string[];
  readonly reviewRequiredIds: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.studentIds.length;
  if (
    !n ||
    input.latestScores.length !== n ||
    input.attemptsUsed.length !== n ||
    new Set(input.studentIds).size !== n ||
    !Number.isSafeInteger(input.maximumAttempts) ||
    input.maximumAttempts < 1 ||
    input.attemptsUsed.some(
      (v) => !Number.isSafeInteger(v) || v < 1 || v > input.maximumAttempts,
    )
  )
    simpleError(
      "studentIds",
      "Aligned distinct students, scores, and valid attempt counts required.",
    );
  return {
    masteredIds: input.studentIds.filter(
      (_, i) => input.latestScores[i] >= input.masteryScore,
    ),
    retryEligibleIds: input.studentIds.filter(
      (_, i) =>
        input.latestScores[i] < input.masteryScore &&
        input.attemptsUsed[i] < input.maximumAttempts,
    ),
    reviewRequiredIds: input.studentIds.filter(
      (_, i) =>
        input.latestScores[i] < input.masteryScore &&
        input.attemptsUsed[i] >= input.maximumAttempts,
    ),
  };
};
export const exampleInput = {
  studentIds: ["A", "B", "C"],
  latestScores: [65, 85, 74],
  masteryScore: 80,
  attemptsUsed: [1, 1, 3],
  maximumAttempts: 3,
} satisfies Input;
export const exampleOutput = {
  masteredIds: ["B"],
  retryEligibleIds: ["A"],
  reviewRequiredIds: ["C"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/mastery-retry-tracker",
  title: "Mastery Retry Tracker",
  description:
    "Classify student mastery, remaining retry eligibility, and exhausted attempts.",
  inputs: [
    { id: "studentIds", label: "Student ids", kind: "stringList" },
    { id: "latestScores", label: "Latest scores", kind: "numberList" },
    { id: "masteryScore", label: "Mastery score", kind: "number" },
    { id: "attemptsUsed", label: "Attempts used", kind: "numberList" },
    { id: "maximumAttempts", label: "Maximum attempts", kind: "number" },
  ],
  outputs: [
    { id: "masteredIds", label: "Mastered ids", kind: "stringList" },
    { id: "retryEligibleIds", label: "Retry eligible ids", kind: "stringList" },
    {
      id: "reviewRequiredIds",
      label: "Review required ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      studentIds: value.studentIds as readonly string[],
      latestScores: value.latestScores as readonly number[],
      masteryScore: value.masteryScore as number,
      attemptsUsed: value.attemptsUsed as readonly number[],
      maximumAttempts: value.maximumAttempts as number,
    }),
});
export const run = tool.execute;
export default tool;
