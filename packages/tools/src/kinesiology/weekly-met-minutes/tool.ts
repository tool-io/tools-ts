import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly activityMets: readonly number[];
  readonly activityMinutes: readonly number[];
  readonly weeklyLower: number;
  readonly weeklyUpper: number;
}>;
export type Output = Readonly<{
  readonly totalMetMinutes: number;
  readonly withinWeeklyRange: boolean;
}>;
export const calculate = (input: Input): Output => {
  const n = input.activityMets.length;
  if (
    !n ||
    n !== input.activityMinutes.length ||
    input.activityMets.some((v) => v < 0) ||
    input.activityMinutes.some((v) => v < 0) ||
    input.weeklyLower < 0 ||
    input.weeklyUpper < input.weeklyLower
  )
    simpleError(
      "activityMinutes",
      "Aligned nonnegative METs/durations and ordered weekly range required.",
    );
  const totalMetMinutes = input.activityMets.reduce(
    (sum, met, i) => sum + met * input.activityMinutes[i],
    0,
  );
  return {
    totalMetMinutes,
    withinWeeklyRange:
      totalMetMinutes >= input.weeklyLower &&
      totalMetMinutes <= input.weeklyUpper,
  };
};
export const exampleInput = {
  activityMets: [3, 6],
  activityMinutes: [30, 20],
  weeklyLower: 150,
  weeklyUpper: 500,
} satisfies Input;
export const exampleOutput = {
  totalMetMinutes: 210,
  withinWeeklyRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/weekly-met-minutes",
  title: "Weekly MET Minutes",
  description:
    "Sum weekly MET-minutes across activities against caller-defined bounds.",
  inputs: [
    { id: "activityMets", label: "Activity mets", kind: "numberList" },
    { id: "activityMinutes", label: "Activity minutes", kind: "numberList" },
    { id: "weeklyLower", label: "Weekly lower", kind: "number" },
    { id: "weeklyUpper", label: "Weekly upper", kind: "number" },
  ],
  outputs: [
    { id: "totalMetMinutes", label: "Total met minutes", kind: "number" },
    { id: "withinWeeklyRange", label: "Within weekly range", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      activityMets: value.activityMets as readonly number[],
      activityMinutes: value.activityMinutes as readonly number[],
      weeklyLower: value.weeklyLower as number,
      weeklyUpper: value.weeklyUpper as number,
    }),
});
export const run = tool.execute;
export default tool;
