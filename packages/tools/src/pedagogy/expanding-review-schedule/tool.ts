import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly startDay: number;
  readonly initialGapDays: number;
  readonly growthFactor: number;
  readonly reviewCount: number;
}>;
export type Output = Readonly<{
  readonly reviewDays: readonly number[];
  readonly lastGapDays: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.startDay) ||
    !Number.isSafeInteger(input.initialGapDays) ||
    input.initialGapDays < 1 ||
    input.growthFactor < 1 ||
    !Number.isSafeInteger(input.reviewCount) ||
    input.reviewCount < 1 ||
    input.reviewCount > 100
  )
    simpleError(
      "reviewCount",
      "Valid start, positive initial gap, growth factor and review count required.",
    );
  let day = input.startDay,
    gap = input.initialGapDays;
  const reviewDays: number[] = [];
  for (let i = 0; i < input.reviewCount; i++) {
    day += Math.round(gap);
    if (!Number.isSafeInteger(day))
      simpleError("reviewCount", "Review day exceeds safe integer range.");
    reviewDays.push(day);
    if (i < input.reviewCount - 1) gap *= input.growthFactor;
  }
  return { reviewDays, lastGapDays: Math.round(gap) };
};
export const exampleInput = {
  startDay: 0,
  initialGapDays: 2,
  growthFactor: 2,
  reviewCount: 4,
} satisfies Input;
export const exampleOutput = {
  reviewDays: [2, 6, 14, 30],
  lastGapDays: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/expanding-review-schedule",
  title: "Expanding Review Schedule",
  description:
    "Generate expanding review intervals with caller-defined initial gap and growth.",
  inputs: [
    { id: "startDay", label: "Start day", kind: "number" },
    { id: "initialGapDays", label: "Initial gap days", kind: "number" },
    { id: "growthFactor", label: "Growth factor", kind: "number" },
    { id: "reviewCount", label: "Review count", kind: "number" },
  ],
  outputs: [
    { id: "reviewDays", label: "Review days", kind: "numberList" },
    { id: "lastGapDays", label: "Last gap days", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startDay: value.startDay as number,
      initialGapDays: value.initialGapDays as number,
      growthFactor: value.growthFactor as number,
      reviewCount: value.reviewCount as number,
    }),
});
export const run = tool.execute;
export default tool;
