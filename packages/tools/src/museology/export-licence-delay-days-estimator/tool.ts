import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  totalCount,
  afterWork,
} from "../shared.js";
export type Input = Readonly<{
  readonly applicationDayOrdinal: number;
  readonly callerStageWorkingDays: readonly number[];
  readonly observedWorkingCalendarOrdinals: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledStageCompletionOrdinals: readonly number[];
  readonly completionWithinSuppliedCalendar: boolean;
  readonly totalDeclaredWorkingDays: number;
}>;
const inputFields = [
  {
    id: "applicationDayOrdinal",
    label: "Application day ordinal",
    kind: "integer",
  },
  {
    id: "callerStageWorkingDays",
    label: "Caller stage working days",
    kind: "numberList",
  },
  {
    id: "observedWorkingCalendarOrdinals",
    label: "Observed working calendar ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.applicationDayOrdinal, "applicationDayOrdinal");
  input.callerStageWorkingDays.forEach((v) =>
    count(v, "callerStageWorkingDays"),
  );
  if (!input.callerStageWorkingDays.length)
    simpleError("stages", "Nonempty caller workflow stages required.");
  let date = input.applicationDayOrdinal;
  const dates = input.callerStageWorkingDays.map((v) =>
    date === -1
      ? -1
      : (date = afterWork(date, v, input.observedWorkingCalendarOrdinals)),
  );
  return {
    modeledStageCompletionOrdinals: dates,
    completionWithinSuppliedCalendar: date !== -1,
    totalDeclaredWorkingDays: totalCount(
      input.callerStageWorkingDays,
      "workingDays",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  applicationDayOrdinal: 10,
  callerStageWorkingDays: [2, 1],
  observedWorkingCalendarOrdinals: [11, 12, 15, 16],
} satisfies Input;
export const exampleOutput = {
  modeledStageCompletionOrdinals: [12, 15],
  completionWithinSuppliedCalendar: true,
  totalDeclaredWorkingDays: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/export-licence-delay-days-estimator",
  title: "Export Licence Delay Working Days Estimator",
  description:
    "Schedule sequential caller export-licence workflow stages on explicitly supplied working-day calendar; incomplete calendar yields -1, not authority processing time or legal permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledStageCompletionOrdinals",
      label: "Modeled stage completion ordinals",
      kind: "numberList",
    },
    {
      id: "completionWithinSuppliedCalendar",
      label: "Completion within supplied calendar",
      kind: "boolean",
    },
    {
      id: "totalDeclaredWorkingDays",
      label: "Total declared working days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      applicationDayOrdinal: value.applicationDayOrdinal as number,
      callerStageWorkingDays: value.callerStageWorkingDays as readonly number[],
      observedWorkingCalendarOrdinals:
        value.observedWorkingCalendarOrdinals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
