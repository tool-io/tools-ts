import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lessonMinutes: number;
  readonly miniLessonMinutes: number;
  readonly shareMinutes: number;
}>;
export type Output = Readonly<{
  readonly workMinutes: number;
  readonly miniLessonPercent: number;
  readonly sharePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.lessonMinutes <= 0 ||
    input.miniLessonMinutes < 0 ||
    input.shareMinutes < 0 ||
    input.miniLessonMinutes + input.shareMinutes > input.lessonMinutes
  )
    simpleError(
      "lessonMinutes",
      "Positive lesson with nonnegative mini-lesson and share times required.",
    );
  return {
    workMinutes:
      input.lessonMinutes - input.miniLessonMinutes - input.shareMinutes,
    miniLessonPercent: (100 * input.miniLessonMinutes) / input.lessonMinutes,
    sharePercent: (100 * input.shareMinutes) / input.lessonMinutes,
  };
};
export const exampleInput = {
  lessonMinutes: 50,
  miniLessonMinutes: 10,
  shareMinutes: 5,
} satisfies Input;
export const exampleOutput = {
  workMinutes: 35,
  miniLessonPercent: 20,
  sharePercent: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/workshop-time-allocation",
  title: "Workshop Time Allocation",
  description:
    "Allocate a workshop period to mini-lesson, independent work, and share.",
  inputs: [
    { id: "lessonMinutes", label: "Lesson minutes", kind: "number" },
    { id: "miniLessonMinutes", label: "Mini lesson minutes", kind: "number" },
    { id: "shareMinutes", label: "Share minutes", kind: "number" },
  ],
  outputs: [
    { id: "workMinutes", label: "Work minutes", kind: "number" },
    { id: "miniLessonPercent", label: "Mini lesson percent", kind: "number" },
    { id: "sharePercent", label: "Share percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      lessonMinutes: value.lessonMinutes as number,
      miniLessonMinutes: value.miniLessonMinutes as number,
      shareMinutes: value.shareMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
