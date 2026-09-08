import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dayOffset,
  dateOrder,
  holdingDays,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly relinquishedTransferDate: string;
  readonly observedIdentificationDate: string;
  readonly callerApplicableCalendarDays: number;
}>;
export type Output = Readonly<{
  readonly callerIdentificationDeadline: string;
  readonly signedDaysRemaining: number;
}>;
const inputFields = [
  {
    id: "relinquishedTransferDate",
    label: "Relinquished transfer date",
    kind: "string",
  },
  {
    id: "observedIdentificationDate",
    label: "Observed identification date",
    kind: "string",
  },
  {
    id: "callerApplicableCalendarDays",
    label: "Caller applicable calendar days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerApplicableCalendarDays, "days", 1, 1000);
  const due = dayOffset(
    input.relinquishedTransferDate,
    input.callerApplicableCalendarDays,
  );
  holdingDays(input.relinquishedTransferDate, input.observedIdentificationDate);
  return {
    callerIdentificationDeadline: due,
    signedDaysRemaining: dateOrder(input.observedIdentificationDate, due),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  relinquishedTransferDate: "2026-01-01",
  observedIdentificationDate: "2026-02-15",
  callerApplicableCalendarDays: 45,
} satisfies Input;
export const exampleOutput = {
  callerIdentificationDeadline: "2026-02-15",
  signedDaysRemaining: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/like-kind-1031-identification-45-day-checker",
  title: "Like Kind 1031 Identification 45 Day Checker",
  description:
    "1031caller applicable calendar identification window against actual transfer/identification dates, no automatic weekend extension or valid property identification. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerIdentificationDeadline",
      label: "Caller identification deadline",
      kind: "string",
    },
    {
      id: "signedDaysRemaining",
      label: "Signed days remaining",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      relinquishedTransferDate: value.relinquishedTransferDate as string,
      observedIdentificationDate: value.observedIdentificationDate as string,
      callerApplicableCalendarDays:
        value.callerApplicableCalendarDays as number,
    }),
});
export const run = tool.execute;
export default tool;
