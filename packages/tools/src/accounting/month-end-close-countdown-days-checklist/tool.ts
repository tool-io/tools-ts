import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  dateDay,
  addDays,
  unique,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly periodEndDate: string;
  readonly asOfDate: string;
  readonly taskLabels: readonly string[];
  readonly callerDueOffsetsDays: readonly number[];
  readonly completedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly taskDueDates: readonly string[];
  readonly signedDaysUntilDue: readonly number[];
  readonly overdueUncompletedTaskIndices: readonly number[];
}>;
const inputFields = [
  { id: "periodEndDate", label: "Period end date", kind: "string" },
  { id: "asOfDate", label: "As of date", kind: "string" },
  { id: "taskLabels", label: "Task labels", kind: "stringList" },
  {
    id: "callerDueOffsetsDays",
    label: "Caller due offsets days",
    kind: "numberList",
  },
  { id: "completedFlags", label: "Completed flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.completedFlags, "completedFlags");
  aligned(input.taskLabels, input.callerDueOffsetsDays, "taskLabels");
  aligned(input.taskLabels, input.completedFlags, "taskLabels");
  unique(input.taskLabels, "tasks");
  const today = dateDay(input.asOfDate),
    dates = input.callerDueOffsetsDays.map((v) =>
      addDays(input.periodEndDate, v),
    ),
    remaining = dates.map((d) => dateDay(d) - today);
  return {
    taskDueDates: dates,
    signedDaysUntilDue: remaining,
    overdueUncompletedTaskIndices: remaining.flatMap((v, i) =>
      v < 0 && input.completedFlags[i] === 0 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  periodEndDate: "2025-01-31",
  asOfDate: "2025-02-05",
  taskLabels: ["Reconcile", "Approve"],
  callerDueOffsetsDays: [3, 7],
  completedFlags: [0, 0],
} satisfies Input;
export const exampleOutput = {
  taskDueDates: ["2025-02-03", "2025-02-07"],
  signedDaysUntilDue: [-2, 2],
  overdueUncompletedTaskIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/month-end-close-countdown-days-checklist",
  title: "Month End Close Countdown Days Checklist Tool",
  description:
    "Audit actual close checklist deadlines as caller civil-day offsets from period end, exposing signed time remaining and incomplete overdue tasks; no universal close cadence, holidays or assurance that completed tasks were reviewed.",
  inputs: inputFields,
  outputs: [
    { id: "taskDueDates", label: "Task due dates", kind: "stringList" },
    {
      id: "signedDaysUntilDue",
      label: "Signed days until due",
      kind: "numberList",
    },
    {
      id: "overdueUncompletedTaskIndices",
      label: "Overdue uncompleted task indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      periodEndDate: value.periodEndDate as string,
      asOfDate: value.asOfDate as string,
      taskLabels: value.taskLabels as readonly string[],
      callerDueOffsetsDays: value.callerDueOffsetsDays as readonly number[],
      completedFlags: value.completedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
