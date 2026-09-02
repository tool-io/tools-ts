import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  dayDate,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerSarTriggerDate: string;
  readonly callerVerifiedCalendarDayWindow: number;
  readonly callerIndependentExtensionDays: number;
  readonly asOfDate: string;
  readonly filingEvidenceKnown: boolean;
  readonly filingObserved: boolean;
}>;
export type Output = Readonly<{
  readonly callerModeledSarDeadline: string;
  readonly daysUntilCallerDeadline: number;
  readonly asOfAfterCallerDeadline: boolean;
  readonly knownFiled: boolean;
  readonly filingEvidenceUnknown: boolean;
}>;
const inputFields = [
  {
    id: "callerSarTriggerDate",
    label: "Caller sar trigger date",
    kind: "string",
  },
  {
    id: "callerVerifiedCalendarDayWindow",
    label: "Caller verified calendar day window",
    kind: "number",
  },
  {
    id: "callerIndependentExtensionDays",
    label: "Caller independent extension days",
    kind: "number",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
  {
    id: "filingEvidenceKnown",
    label: "Filing evidence known",
    kind: "boolean",
  },
  { id: "filingObserved", label: "Filing observed", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerVerifiedCalendarDayWindow, "window", 0, 3660);
  bounded(input.callerIndependentExtensionDays, "extension", 0, 3660);
  const deadline =
      dateDay(input.callerSarTriggerDate) +
      input.callerVerifiedCalendarDayWindow +
      input.callerIndependentExtensionDays,
    asOf = dateDay(input.asOfDate);
  return {
    callerModeledSarDeadline: dayDate(deadline),
    daysUntilCallerDeadline: deadline - asOf,
    asOfAfterCallerDeadline: asOf > deadline,
    knownFiled: input.filingEvidenceKnown && input.filingObserved,
    filingEvidenceUnknown: !input.filingEvidenceKnown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSarTriggerDate: "2026-01-01",
  callerVerifiedCalendarDayWindow: 30,
  callerIndependentExtensionDays: 0,
  asOfDate: "2026-01-31",
  filingEvidenceKnown: false,
  filingObserved: false,
} satisfies Input;
export const exampleOutput = {
  callerModeledSarDeadline: "2026-01-31",
  daysUntilCallerDeadline: 0,
  asOfAfterCallerDeadline: false,
  knownFiled: false,
  filingEvidenceUnknown: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/sar-filing-window-days-lookup",
  title: "SAR Filing Window Days Lookup",
  description:
    "Route caller independently established SAR trigger/window/extension to inclusive civil deadline, separate unavailable filing evidence; no default legal clock or actual reporting advice. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledSarDeadline",
      label: "Caller modeled sar deadline",
      kind: "string",
    },
    {
      id: "daysUntilCallerDeadline",
      label: "Days until caller deadline",
      kind: "number",
    },
    {
      id: "asOfAfterCallerDeadline",
      label: "As of after caller deadline",
      kind: "boolean",
    },
    { id: "knownFiled", label: "Known filed", kind: "boolean" },
    {
      id: "filingEvidenceUnknown",
      label: "Filing evidence unknown",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSarTriggerDate: value.callerSarTriggerDate as string,
      callerVerifiedCalendarDayWindow:
        value.callerVerifiedCalendarDayWindow as number,
      callerIndependentExtensionDays:
        value.callerIndependentExtensionDays as number,
      asOfDate: value.asOfDate as string,
      filingEvidenceKnown: value.filingEvidenceKnown as boolean,
      filingObserved: value.filingObserved as boolean,
    }),
});
export const run = tool.execute;
export default tool;
