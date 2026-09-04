import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dayOffset,
  dateOrder,
  holdingDays,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerEligiblePropertyTransferDate: string;
  readonly observedElectionSubmissionDate: string;
  readonly callerApplicableCalendarWindowDays: number;
}>;
export type Output = Readonly<{
  readonly callerElectionDeadline: string;
  readonly signedDeadlineDaysRemaining: number;
}>;
const inputFields = [
  {
    id: "callerEligiblePropertyTransferDate",
    label: "Caller eligible property transfer date",
    kind: "string",
  },
  {
    id: "observedElectionSubmissionDate",
    label: "Observed election submission date",
    kind: "string",
  },
  {
    id: "callerApplicableCalendarWindowDays",
    label: "Caller applicable calendar window days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerApplicableCalendarWindowDays, "window", 1, 365);
  const due = dayOffset(
    input.callerEligiblePropertyTransferDate,
    input.callerApplicableCalendarWindowDays,
  );
  holdingDays(
    input.callerEligiblePropertyTransferDate,
    input.observedElectionSubmissionDate,
  );
  return {
    callerElectionDeadline: due,
    signedDeadlineDaysRemaining: dateOrder(
      input.observedElectionSubmissionDate,
      due,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEligiblePropertyTransferDate: "2026-01-01",
  observedElectionSubmissionDate: "2026-01-31",
  callerApplicableCalendarWindowDays: 30,
} satisfies Input;
export const exampleOutput = {
  callerElectionDeadline: "2026-01-31",
  signedDeadlineDaysRemaining: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/cliff-early-exercise-83b-election-30day-checker",
  title: "Cliff Early Exercise 83b Election 30 day Checker",
  description:
    "83(b) caller independently eligible transfer and applicable calendar election window, deadline screen only; cliff/early exercise not evidence of eligibility or timely filing proof. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerElectionDeadline",
      label: "Caller election deadline",
      kind: "string",
    },
    {
      id: "signedDeadlineDaysRemaining",
      label: "Signed deadline days remaining",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEligiblePropertyTransferDate:
        value.callerEligiblePropertyTransferDate as string,
      observedElectionSubmissionDate:
        value.observedElectionSubmissionDate as string,
      callerApplicableCalendarWindowDays:
        value.callerApplicableCalendarWindowDays as number,
    }),
});
export const run = tool.execute;
export default tool;
