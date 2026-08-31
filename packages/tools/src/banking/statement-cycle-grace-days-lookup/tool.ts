import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  addDays,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly statementCycleEndDate: string;
  readonly callerGraceCivilDays: number;
  readonly asOfDate: string;
  readonly callerGraceEligibilitySatisfied: boolean;
}>;
export type Output = Readonly<{
  readonly callerGraceEndDate: string;
  readonly signedCivilDaysUntilGraceEnd: number;
  readonly pastCallerGraceEnd: boolean;
  readonly withinEligibleCallerGraceWindow: boolean;
}>;
const inputFields = [
  {
    id: "statementCycleEndDate",
    label: "Statement cycle end date",
    kind: "string",
  },
  {
    id: "callerGraceCivilDays",
    label: "Caller grace civil days",
    kind: "number",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
  {
    id: "callerGraceEligibilitySatisfied",
    label: "Caller grace eligibility satisfied",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerGraceCivilDays, "graceDays", 0, 366);
  const end = addDays(input.statementCycleEndDate, input.callerGraceCivilDays),
    today = dateDay(input.asOfDate),
    cycle = dateDay(input.statementCycleEndDate),
    remaining = dateDay(end) - today;
  return {
    callerGraceEndDate: end,
    signedCivilDaysUntilGraceEnd: remaining,
    pastCallerGraceEnd: remaining < 0,
    withinEligibleCallerGraceWindow:
      input.callerGraceEligibilitySatisfied && today >= cycle && remaining >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  statementCycleEndDate: "2025-01-31",
  callerGraceCivilDays: 21,
  asOfDate: "2025-02-20",
  callerGraceEligibilitySatisfied: true,
} satisfies Input;
export const exampleOutput = {
  callerGraceEndDate: "2025-02-21",
  signedCivilDaysUntilGraceEnd: 1,
  pastCallerGraceEnd: false,
  withinEligibleCallerGraceWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/statement-cycle-grace-days-lookup",
  title: "Statement Cycle Grace Days Lookup",
  description:
    "Resolve explicit caller civil-day grace window from cycle end and separately supplied qualification evidence, including exact end date; not statutory/card-specific grace rights or a business-day/time-of-day due-date adjustment.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerGraceEndDate",
      label: "Caller grace end date",
      kind: "string",
    },
    {
      id: "signedCivilDaysUntilGraceEnd",
      label: "Signed civil days until grace end",
      kind: "number",
    },
    {
      id: "pastCallerGraceEnd",
      label: "Past caller grace end",
      kind: "boolean",
    },
    {
      id: "withinEligibleCallerGraceWindow",
      label: "Within eligible caller grace window",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      statementCycleEndDate: value.statementCycleEndDate as string,
      callerGraceCivilDays: value.callerGraceCivilDays as number,
      asOfDate: value.asOfDate as string,
      callerGraceEligibilitySatisfied:
        value.callerGraceEligibilitySatisfied as boolean,
    }),
});
export const run = tool.execute;
export default tool;
