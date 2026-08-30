import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly correctRecall: number;
  readonly attemptedRecall: number;
  readonly passFraction: number;
  readonly currentDay: number;
  readonly successGapDays: number;
  readonly retryGapDays: number;
}>;
export type Output = Readonly<{
  readonly recallFraction: number;
  readonly masteryGatePassed: boolean;
  readonly nextRetrievalDay: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.attemptedRecall) ||
    input.attemptedRecall < 1 ||
    !Number.isSafeInteger(input.correctRecall) ||
    input.correctRecall < 0 ||
    input.correctRecall > input.attemptedRecall ||
    input.passFraction < 0 ||
    input.passFraction > 1 ||
    !Number.isSafeInteger(input.currentDay) ||
    !Number.isSafeInteger(input.successGapDays) ||
    !Number.isSafeInteger(input.retryGapDays) ||
    input.successGapDays < 1 ||
    input.retryGapDays < 1
  )
    simpleError(
      "attemptedRecall",
      "Valid recall attempt counts, threshold and review gaps required.",
    );
  const recallFraction = input.correctRecall / input.attemptedRecall,
    masteryGatePassed = recallFraction >= input.passFraction;
  return {
    recallFraction,
    masteryGatePassed,
    nextRetrievalDay:
      input.currentDay +
      (masteryGatePassed ? input.successGapDays : input.retryGapDays),
  };
};
export const exampleInput = {
  correctRecall: 4,
  attemptedRecall: 5,
  passFraction: 0.7,
  currentDay: 10,
  successGapDays: 7,
  retryGapDays: 1,
} satisfies Input;
export const exampleOutput = {
  recallFraction: 0.8,
  masteryGatePassed: true,
  nextRetrievalDay: 17,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/retrieval-practice-gate",
  title: "Retrieval Practice Gate",
  description:
    "Schedule the next retrieval test from observed recall and a mastery gate.",
  inputs: [
    { id: "correctRecall", label: "Correct recall", kind: "number" },
    { id: "attemptedRecall", label: "Attempted recall", kind: "number" },
    { id: "passFraction", label: "Pass fraction", kind: "number" },
    { id: "currentDay", label: "Current day", kind: "number" },
    { id: "successGapDays", label: "Success gap days", kind: "number" },
    { id: "retryGapDays", label: "Retry gap days", kind: "number" },
  ],
  outputs: [
    { id: "recallFraction", label: "Recall fraction", kind: "number" },
    { id: "masteryGatePassed", label: "Mastery gate passed", kind: "boolean" },
    { id: "nextRetrievalDay", label: "Next retrieval day", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      correctRecall: value.correctRecall as number,
      attemptedRecall: value.attemptedRecall as number,
      passFraction: value.passFraction as number,
      currentDay: value.currentDay as number,
      successGapDays: value.successGapDays as number,
      retryGapDays: value.retryGapDays as number,
    }),
});
export const run = tool.execute;
export default tool;
