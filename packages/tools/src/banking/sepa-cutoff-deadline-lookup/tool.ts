import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  addDays,
  businessDay,
  nextBusinessDay,
  businessAfter,
  clockMinute,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly submissionLocalDate: string;
  readonly submissionLocalClock: string;
  readonly callerLocalCutoffClock: string;
  readonly callerBusinessDaySettlementLag: number;
  readonly callerHolidayDates: readonly string[];
}>;
export type Output = Readonly<{
  readonly effectiveProcessingCivilDate: string;
  readonly callerModeledSettlementCivilDate: string;
  readonly missedCallerSameDayCutoff: boolean;
}>;
const inputFields = [
  { id: "submissionLocalDate", label: "Submission local date", kind: "string" },
  {
    id: "submissionLocalClock",
    label: "Submission local clock",
    kind: "string",
  },
  {
    id: "callerLocalCutoffClock",
    label: "Caller local cutoff clock",
    kind: "string",
  },
  {
    id: "callerBusinessDaySettlementLag",
    label: "Caller business day settlement lag",
    kind: "number",
  },
  {
    id: "callerHolidayDates",
    label: "Caller holiday dates",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerBusinessDaySettlementLag, "lag", 0, 30);
  const day = dateDay(input.submissionLocalDate),
    time = clockMinute(input.submissionLocalClock),
    cutoff = clockMinute(input.callerLocalCutoffClock),
    open = businessDay(day, input.callerHolidayDates),
    missed = open && time > cutoff,
    start = nextBusinessDay(
      missed
        ? addDays(input.submissionLocalDate, 1)
        : input.submissionLocalDate,
      input.callerHolidayDates,
    );
  return {
    effectiveProcessingCivilDate: start,
    callerModeledSettlementCivilDate: businessAfter(
      start,
      input.callerBusinessDaySettlementLag,
      input.callerHolidayDates,
    ),
    missedCallerSameDayCutoff: missed,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  submissionLocalDate: "2025-01-03",
  submissionLocalClock: "17:00",
  callerLocalCutoffClock: "16:00",
  callerBusinessDaySettlementLag: 1,
  callerHolidayDates: ["2025-01-06"],
} satisfies Input;
export const exampleOutput = {
  effectiveProcessingCivilDate: "2025-01-07",
  callerModeledSettlementCivilDate: "2025-01-08",
  missedCallerSameDayCutoff: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/sepa-cutoff-deadline-lookup",
  title: "SEPA Cutoff Deadline Lookup",
  description:
    "Resolve caller SEPA bank local cutoff and weekend/explicit-holiday processing calendar with supplied business-day lag; exact cutoff is included, time zone/DST already caller resolved, not a network guarantee or universal SEPA deadline.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveProcessingCivilDate",
      label: "Effective processing civil date",
      kind: "string",
    },
    {
      id: "callerModeledSettlementCivilDate",
      label: "Caller modeled settlement civil date",
      kind: "string",
    },
    {
      id: "missedCallerSameDayCutoff",
      label: "Missed caller same day cutoff",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      submissionLocalDate: value.submissionLocalDate as string,
      submissionLocalClock: value.submissionLocalClock as string,
      callerLocalCutoffClock: value.callerLocalCutoffClock as string,
      callerBusinessDaySettlementLag:
        value.callerBusinessDaySettlementLag as number,
      callerHolidayDates: value.callerHolidayDates as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
