import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly submittedAtMinutes: readonly number[];
  readonly feedbackAtMinutes: readonly number[];
  readonly maximumDelayMinutes: number;
}>;
export type Output = Readonly<{
  readonly delayMinutes: readonly number[];
  readonly onTimeCount: number;
  readonly onTimePercent: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.submittedAtMinutes.length;
  if (
    !n ||
    n !== input.feedbackAtMinutes.length ||
    input.maximumDelayMinutes < 0 ||
    input.submittedAtMinutes.some((v, i) => input.feedbackAtMinutes[i] < v)
  )
    simpleError(
      "feedbackAtMinutes",
      "Aligned submissions and nonnegative feedback delays required.",
    );
  const delayMinutes = input.submittedAtMinutes.map(
      (v, i) => input.feedbackAtMinutes[i] - v,
    ),
    onTimeCount = delayMinutes.filter(
      (v) => v <= input.maximumDelayMinutes,
    ).length;
  return { delayMinutes, onTimeCount, onTimePercent: (100 * onTimeCount) / n };
};
export const exampleInput = {
  submittedAtMinutes: [0, 10, 20],
  feedbackAtMinutes: [20, 80, 50],
  maximumDelayMinutes: 30,
} satisfies Input;
export const exampleOutput = {
  delayMinutes: [20, 70, 30],
  onTimeCount: 2,
  onTimePercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/feedback-delay-coverage",
  title: "Feedback Delay Coverage",
  description:
    "Audit assessment feedback delays against a caller-defined timeliness target.",
  inputs: [
    {
      id: "submittedAtMinutes",
      label: "Submitted at minutes",
      kind: "numberList",
    },
    {
      id: "feedbackAtMinutes",
      label: "Feedback at minutes",
      kind: "numberList",
    },
    {
      id: "maximumDelayMinutes",
      label: "Maximum delay minutes",
      kind: "number",
    },
  ],
  outputs: [
    { id: "delayMinutes", label: "Delay minutes", kind: "numberList" },
    { id: "onTimeCount", label: "On time count", kind: "number" },
    { id: "onTimePercent", label: "On time percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      submittedAtMinutes: value.submittedAtMinutes as readonly number[],
      feedbackAtMinutes: value.feedbackAtMinutes as readonly number[],
      maximumDelayMinutes: value.maximumDelayMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
