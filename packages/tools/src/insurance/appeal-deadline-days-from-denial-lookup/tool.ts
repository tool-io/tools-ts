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
  readonly observedAppealableDenialCivilDate: string;
  readonly callerVerifiedAppealClassIds: readonly string[];
  readonly callerVerifiedAppealCalendarDayLimits: readonly number[];
  readonly queryAppealClassId: string;
  readonly observedAsOfCivilDate: string;
}>;
export type Output = Readonly<{
  readonly callerAppealDeadlineCivilDate: string;
  readonly signedDaysUntilCallerDeadline: number;
  readonly callerDeadlineAlreadyPassed: boolean;
}>;
const inputFields = [
  {
    id: "observedAppealableDenialCivilDate",
    label: "Observed appealable denial civil date",
    kind: "string",
  },
  {
    id: "callerVerifiedAppealClassIds",
    label: "Caller verified appeal class ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAppealCalendarDayLimits",
    label: "Caller verified appeal calendar day limits",
    kind: "numberList",
  },
  { id: "queryAppealClassId", label: "Query appeal class id", kind: "string" },
  {
    id: "observedAsOfCivilDate",
    label: "Observed as of civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedAppealCalendarDayLimits.forEach((v) =>
    bounded(v, "days", 0, 3660),
  );
  const duration = catalog(
      input.callerVerifiedAppealClassIds,
      input.callerVerifiedAppealCalendarDayLimits,
      input.queryAppealClassId,
    ),
    deadline = dateDay(input.observedAppealableDenialCivilDate) + duration,
    now = dateDay(input.observedAsOfCivilDate);
  return {
    callerAppealDeadlineCivilDate: dayDate(deadline),
    signedDaysUntilCallerDeadline: deadline - now,
    callerDeadlineAlreadyPassed: now > deadline,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAppealableDenialCivilDate: "2026-01-01",
  callerVerifiedAppealClassIds: ["standard", "expedited"],
  callerVerifiedAppealCalendarDayLimits: [30, 5],
  queryAppealClassId: "standard",
  observedAsOfCivilDate: "2026-01-20",
} satisfies Input;
export const exampleOutput = {
  callerAppealDeadlineCivilDate: "2026-01-31",
  signedDaysUntilCallerDeadline: 11,
  callerDeadlineAlreadyPassed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/appeal-deadline-days-from-denial-lookup",
  title: "Appeal Deadline Days From Denial Lookup",
  description:
    "Audit actual appealable denial date against caller verified appeal-class calendar-day filing window; response deadline differs from appeal filing, no legal deadline certification or rights advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAppealDeadlineCivilDate",
      label: "Caller appeal deadline civil date",
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
      observedAppealableDenialCivilDate:
        value.observedAppealableDenialCivilDate as string,
      callerVerifiedAppealClassIds:
        value.callerVerifiedAppealClassIds as readonly string[],
      callerVerifiedAppealCalendarDayLimits:
        value.callerVerifiedAppealCalendarDayLimits as readonly number[],
      queryAppealClassId: value.queryAppealClassId as string,
      observedAsOfCivilDate: value.observedAsOfCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
