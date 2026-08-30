import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly correctCompletions: number;
  readonly attemptedCompletions: number;
  readonly minimumSuccessFraction: number;
  readonly currentProvidedSteps: number;
}>;
export type Output = Readonly<{
  readonly successFraction: number;
  readonly fadeNextStep: boolean;
  readonly nextProvidedSteps: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.attemptedCompletions) ||
    input.attemptedCompletions < 1 ||
    !Number.isSafeInteger(input.correctCompletions) ||
    input.correctCompletions < 0 ||
    input.correctCompletions > input.attemptedCompletions ||
    input.minimumSuccessFraction < 0 ||
    input.minimumSuccessFraction > 1 ||
    !Number.isSafeInteger(input.currentProvidedSteps) ||
    input.currentProvidedSteps < 0
  )
    simpleError(
      "attemptedCompletions",
      "Valid completion attempts, threshold and scaffold step count required.",
    );
  const successFraction = input.correctCompletions / input.attemptedCompletions,
    fadeNextStep =
      successFraction >= input.minimumSuccessFraction &&
      input.currentProvidedSteps > 0;
  return {
    successFraction,
    fadeNextStep,
    nextProvidedSteps: input.currentProvidedSteps - Number(fadeNextStep),
  };
};
export const exampleInput = {
  correctCompletions: 8,
  attemptedCompletions: 10,
  minimumSuccessFraction: 0.75,
  currentProvidedSteps: 3,
} satisfies Input;
export const exampleOutput = {
  successFraction: 0.8,
  fadeNextStep: true,
  nextProvidedSteps: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/completion-problem-transition",
  title: "Completion Problem Transition",
  description: "Gate a completion-problem fade by observed student success.",
  inputs: [
    { id: "correctCompletions", label: "Correct completions", kind: "number" },
    {
      id: "attemptedCompletions",
      label: "Attempted completions",
      kind: "number",
    },
    {
      id: "minimumSuccessFraction",
      label: "Minimum success fraction",
      kind: "number",
    },
    {
      id: "currentProvidedSteps",
      label: "Current provided steps",
      kind: "number",
    },
  ],
  outputs: [
    { id: "successFraction", label: "Success fraction", kind: "number" },
    { id: "fadeNextStep", label: "Fade next step", kind: "boolean" },
    { id: "nextProvidedSteps", label: "Next provided steps", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      correctCompletions: value.correctCompletions as number,
      attemptedCompletions: value.attemptedCompletions as number,
      minimumSuccessFraction: value.minimumSuccessFraction as number,
      currentProvidedSteps: value.currentProvidedSteps as number,
    }),
});
export const run = tool.execute;
export default tool;
