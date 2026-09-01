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
  readonly observedCompleteFnolCivilDate: string;
  readonly callerAssignmentClaimClassIds: readonly string[];
  readonly callerVerifiedAssignmentCalendarDays: readonly number[];
  readonly queryAssignmentClaimClassId: string;
  readonly observedAsOfCivilDate: string;
}>;
export type Output = Readonly<{
  readonly callerAdjusterAssignmentDeadlineCivilDate: string;
  readonly signedDaysUntilCallerDeadline: number;
  readonly callerDeadlineAlreadyPassed: boolean;
}>;
const inputFields = [
  {
    id: "observedCompleteFnolCivilDate",
    label: "Observed complete fnol civil date",
    kind: "string",
  },
  {
    id: "callerAssignmentClaimClassIds",
    label: "Caller assignment claim class ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAssignmentCalendarDays",
    label: "Caller verified assignment calendar days",
    kind: "numberList",
  },
  {
    id: "queryAssignmentClaimClassId",
    label: "Query assignment claim class id",
    kind: "string",
  },
  {
    id: "observedAsOfCivilDate",
    label: "Observed as of civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedAssignmentCalendarDays.forEach((v) =>
    bounded(v, "days", 0, 3660),
  );
  const duration = catalog(
      input.callerAssignmentClaimClassIds,
      input.callerVerifiedAssignmentCalendarDays,
      input.queryAssignmentClaimClassId,
    ),
    deadline = dateDay(input.observedCompleteFnolCivilDate) + duration,
    now = dateDay(input.observedAsOfCivilDate);
  return {
    callerAdjusterAssignmentDeadlineCivilDate: dayDate(deadline),
    signedDaysUntilCallerDeadline: deadline - now,
    callerDeadlineAlreadyPassed: now > deadline,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCompleteFnolCivilDate: "2026-01-01",
  callerAssignmentClaimClassIds: ["standard", "expedited"],
  callerVerifiedAssignmentCalendarDays: [30, 5],
  queryAssignmentClaimClassId: "standard",
  observedAsOfCivilDate: "2026-01-20",
} satisfies Input;
export const exampleOutput = {
  callerAdjusterAssignmentDeadlineCivilDate: "2026-01-31",
  signedDaysUntilCallerDeadline: 11,
  callerDeadlineAlreadyPassed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/adjuster-assignment-turnaround-days-lookup",
  title: "Adjuster Assignment Turnaround Days Lookup",
  description:
    "Audit actual complete FNOL date under caller verified claim-class assignment timing policy; differs from notice completeness and prior-auth/appeal windows, no response or legal duty guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAdjusterAssignmentDeadlineCivilDate",
      label: "Caller adjuster assignment deadline civil date",
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
      observedCompleteFnolCivilDate:
        value.observedCompleteFnolCivilDate as string,
      callerAssignmentClaimClassIds:
        value.callerAssignmentClaimClassIds as readonly string[],
      callerVerifiedAssignmentCalendarDays:
        value.callerVerifiedAssignmentCalendarDays as readonly number[],
      queryAssignmentClaimClassId: value.queryAssignmentClaimClassId as string,
      observedAsOfCivilDate: value.observedAsOfCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
