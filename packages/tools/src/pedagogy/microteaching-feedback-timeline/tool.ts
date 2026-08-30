import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly startMinute: number;
  readonly teachMinutes: number;
  readonly observeMinutes: number;
  readonly feedbackMinutes: number;
  readonly reviseMinutes: number;
}>;
export type Output = Readonly<{
  readonly phaseNames: readonly string[];
  readonly phaseStartMinutes: readonly number[];
  readonly endMinute: number;
}>;
export const calculate = (input: Input): Output => {
  const durations = [
    input.teachMinutes,
    input.observeMinutes,
    input.feedbackMinutes,
    input.reviseMinutes,
  ];
  if (durations.some((v) => v <= 0))
    simpleError(
      "teachMinutes",
      "All microteaching phase durations must be positive.",
    );
  let cursor = input.startMinute;
  const phaseStartMinutes = durations.map((v) => {
    const start = cursor;
    cursor += v;
    return start;
  });
  return {
    phaseNames: ["teach", "observe", "feedback", "revise"],
    phaseStartMinutes,
    endMinute: cursor,
  };
};
export const exampleInput = {
  startMinute: 0,
  teachMinutes: 10,
  observeMinutes: 5,
  feedbackMinutes: 5,
  reviseMinutes: 10,
} satisfies Input;
export const exampleOutput = {
  phaseNames: ["teach", "observe", "feedback", "revise"],
  phaseStartMinutes: [0, 10, 15, 20],
  endMinute: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/microteaching-feedback-timeline",
  title: "Microteaching Feedback Timeline",
  description:
    "Schedule a microteaching lesson, observation, feedback, and revision cycle.",
  inputs: [
    { id: "startMinute", label: "Start minute", kind: "number" },
    { id: "teachMinutes", label: "Teach minutes", kind: "number" },
    { id: "observeMinutes", label: "Observe minutes", kind: "number" },
    { id: "feedbackMinutes", label: "Feedback minutes", kind: "number" },
    { id: "reviseMinutes", label: "Revise minutes", kind: "number" },
  ],
  outputs: [
    { id: "phaseNames", label: "Phase names", kind: "stringList" },
    {
      id: "phaseStartMinutes",
      label: "Phase start minutes",
      kind: "numberList",
    },
    { id: "endMinute", label: "End minute", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startMinute: value.startMinute as number,
      teachMinutes: value.teachMinutes as number,
      observeMinutes: value.observeMinutes as number,
      feedbackMinutes: value.feedbackMinutes as number,
      reviseMinutes: value.reviseMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
