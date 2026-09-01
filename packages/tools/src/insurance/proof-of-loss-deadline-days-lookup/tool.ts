import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  dayDate,
  catalog,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedProofOfLossTriggerCivilDate: string;
  readonly callerProofOfLossClassIds: readonly string[];
  readonly callerVerifiedProofOfLossCalendarDays: readonly number[];
  readonly queryProofOfLossClassId: string;
  readonly observedAsOfCivilDate: string;
}>;
export type Output = Readonly<{
  readonly callerProofOfLossDeadlineCivilDate: string;
  readonly signedDaysUntilCallerDeadline: number;
  readonly callerDeadlineAlreadyPassed: boolean;
}>;
const inputFields = [
  {
    id: "observedProofOfLossTriggerCivilDate",
    label: "Observed proof of loss trigger civil date",
    kind: "string",
  },
  {
    id: "callerProofOfLossClassIds",
    label: "Caller proof of loss class ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedProofOfLossCalendarDays",
    label: "Caller verified proof of loss calendar days",
    kind: "numberList",
  },
  {
    id: "queryProofOfLossClassId",
    label: "Query proof of loss class id",
    kind: "string",
  },
  {
    id: "observedAsOfCivilDate",
    label: "Observed as of civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedProofOfLossCalendarDays.forEach((v) =>
    bounded(v, "days", 0, 3660),
  );
  const duration = catalog(
      input.callerProofOfLossClassIds,
      input.callerVerifiedProofOfLossCalendarDays,
      input.queryProofOfLossClassId,
    ),
    deadline = dateDay(input.observedProofOfLossTriggerCivilDate) + duration,
    now = dateDay(input.observedAsOfCivilDate);
  return {
    callerProofOfLossDeadlineCivilDate: dayDate(deadline),
    signedDaysUntilCallerDeadline: deadline - now,
    callerDeadlineAlreadyPassed: now > deadline,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedProofOfLossTriggerCivilDate: "2026-01-01",
  callerProofOfLossClassIds: ["standard", "expedited"],
  callerVerifiedProofOfLossCalendarDays: [30, 5],
  queryProofOfLossClassId: "standard",
  observedAsOfCivilDate: "2026-01-20",
} satisfies Input;
export const exampleOutput = {
  callerProofOfLossDeadlineCivilDate: "2026-01-31",
  signedDaysUntilCallerDeadline: 11,
  callerDeadlineAlreadyPassed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/proof-of-loss-deadline-days-lookup",
  title: "Proof Of Loss Deadline Days Lookup",
  description:
    "Audit actual caller independently established proof-of-loss trigger against verified filing class calendar-day window; no denial/notice trigger substitution, business-day inference or legal deadline certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerProofOfLossDeadlineCivilDate",
      label: "Caller proof of loss deadline civil date",
      kind: "string",
    },
    {
      id: "signedDaysUntilCallerDeadline",
      label: "Signed days until caller deadline",
      kind: "number",
    },
    {
      id: "callerDeadlineAlreadyPassed",
      label: "Caller deadline already passed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedProofOfLossTriggerCivilDate:
        value.observedProofOfLossTriggerCivilDate as string,
      callerProofOfLossClassIds:
        value.callerProofOfLossClassIds as readonly string[],
      callerVerifiedProofOfLossCalendarDays:
        value.callerVerifiedProofOfLossCalendarDays as readonly number[],
      queryProofOfLossClassId: value.queryProofOfLossClassId as string,
      observedAsOfCivilDate: value.observedAsOfCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
