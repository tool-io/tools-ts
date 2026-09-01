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
  readonly observedCompletePriorAuthRequestCivilDate: string;
  readonly callerPriorAuthRequestClassIds: readonly string[];
  readonly callerVerifiedPriorAuthCalendarDayWindows: readonly number[];
  readonly queryPriorAuthRequestClassId: string;
  readonly observedAsOfCivilDate: string;
}>;
export type Output = Readonly<{
  readonly callerPriorAuthResponseDeadlineCivilDate: string;
  readonly signedDaysUntilCallerDeadline: number;
  readonly callerDeadlineAlreadyPassed: boolean;
}>;
const inputFields = [
  {
    id: "observedCompletePriorAuthRequestCivilDate",
    label: "Observed complete prior auth request civil date",
    kind: "string",
  },
  {
    id: "callerPriorAuthRequestClassIds",
    label: "Caller prior auth request class ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPriorAuthCalendarDayWindows",
    label: "Caller verified prior auth calendar day windows",
    kind: "numberList",
  },
  {
    id: "queryPriorAuthRequestClassId",
    label: "Query prior auth request class id",
    kind: "string",
  },
  {
    id: "observedAsOfCivilDate",
    label: "Observed as of civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedPriorAuthCalendarDayWindows.forEach((v) =>
    bounded(v, "days", 0, 3660),
  );
  const duration = catalog(
      input.callerPriorAuthRequestClassIds,
      input.callerVerifiedPriorAuthCalendarDayWindows,
      input.queryPriorAuthRequestClassId,
    ),
    deadline =
      dateDay(input.observedCompletePriorAuthRequestCivilDate) + duration,
    now = dateDay(input.observedAsOfCivilDate);
  return {
    callerPriorAuthResponseDeadlineCivilDate: dayDate(deadline),
    signedDaysUntilCallerDeadline: deadline - now,
    callerDeadlineAlreadyPassed: now > deadline,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCompletePriorAuthRequestCivilDate: "2026-01-01",
  callerPriorAuthRequestClassIds: ["standard", "expedited"],
  callerVerifiedPriorAuthCalendarDayWindows: [30, 5],
  queryPriorAuthRequestClassId: "standard",
  observedAsOfCivilDate: "2026-01-20",
} satisfies Input;
export const exampleOutput = {
  callerPriorAuthResponseDeadlineCivilDate: "2026-01-31",
  signedDaysUntilCallerDeadline: 11,
  callerDeadlineAlreadyPassed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/prior-auth-turnaround-window-lookup",
  title: "Prior Auth Turnaround Window Lookup",
  description:
    "Audit actual complete prior-auth request date against caller independently verified request-class calendar-day response window; no business/holiday inference or authorization guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerPriorAuthResponseDeadlineCivilDate",
      label: "Caller prior auth response deadline civil date",
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
      observedCompletePriorAuthRequestCivilDate:
        value.observedCompletePriorAuthRequestCivilDate as string,
      callerPriorAuthRequestClassIds:
        value.callerPriorAuthRequestClassIds as readonly string[],
      callerVerifiedPriorAuthCalendarDayWindows:
        value.callerVerifiedPriorAuthCalendarDayWindows as readonly number[],
      queryPriorAuthRequestClassId:
        value.queryPriorAuthRequestClassId as string,
      observedAsOfCivilDate: value.observedAsOfCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
