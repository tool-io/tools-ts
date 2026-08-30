import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly criterionCount: number;
  readonly minutesPerCriterion: number;
  readonly holisticMinutes: number;
  readonly maximumGradingMinutes: number;
  readonly diagnosticFeedbackRequired: boolean;
}>;
export type Output = Readonly<{
  readonly analyticMinutes: number;
  readonly recommendedFormat: string;
  readonly timeOverrunMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.criterionCount) ||
    input.criterionCount < 1 ||
    input.minutesPerCriterion <= 0 ||
    input.holisticMinutes <= 0 ||
    input.maximumGradingMinutes <= 0
  )
    simpleError(
      "criterionCount",
      "Positive criterion count, grading rates, and time budget required.",
    );
  const analyticMinutes = input.criterionCount * input.minutesPerCriterion,
    recommendedFormat =
      input.diagnosticFeedbackRequired &&
      analyticMinutes <= input.maximumGradingMinutes
        ? "analytic"
        : input.holisticMinutes <= input.maximumGradingMinutes
          ? "holistic"
          : analyticMinutes <= input.maximumGradingMinutes
            ? "analytic"
            : "insufficient-time";
  return {
    analyticMinutes,
    recommendedFormat,
    timeOverrunMinutes: Math.max(
      0,
      analyticMinutes - input.maximumGradingMinutes,
    ),
  };
};
export const exampleInput = {
  criterionCount: 4,
  minutesPerCriterion: 2,
  holisticMinutes: 3,
  maximumGradingMinutes: 6,
  diagnosticFeedbackRequired: true,
} satisfies Input;
export const exampleOutput = {
  analyticMinutes: 8,
  recommendedFormat: "holistic",
  timeOverrunMinutes: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/rubric-format-selector",
  title: "Rubric Format Selector",
  description:
    "Choose an analytic or holistic rubric from feedback needs and grading time.",
  inputs: [
    { id: "criterionCount", label: "Criterion count", kind: "number" },
    {
      id: "minutesPerCriterion",
      label: "Minutes per criterion",
      kind: "number",
    },
    { id: "holisticMinutes", label: "Holistic minutes", kind: "number" },
    {
      id: "maximumGradingMinutes",
      label: "Maximum grading minutes",
      kind: "number",
    },
    {
      id: "diagnosticFeedbackRequired",
      label: "Diagnostic feedback required",
      kind: "boolean",
    },
  ],
  outputs: [
    { id: "analyticMinutes", label: "Analytic minutes", kind: "number" },
    { id: "recommendedFormat", label: "Recommended format", kind: "string" },
    { id: "timeOverrunMinutes", label: "Time overrun minutes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      criterionCount: value.criterionCount as number,
      minutesPerCriterion: value.minutesPerCriterion as number,
      holisticMinutes: value.holisticMinutes as number,
      maximumGradingMinutes: value.maximumGradingMinutes as number,
      diagnosticFeedbackRequired: value.diagnosticFeedbackRequired as boolean,
    }),
});
export const run = tool.execute;
export default tool;
