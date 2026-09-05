import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, businessDeadline } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerEligibleReceiptDate: string;
  readonly callerApplicableWorkingDayWindow: number;
  readonly callerVerifiedExcludedFederalHolidayDates: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerWorkingDayResponseDeadline: string;
}>;
const inputFields = [
  {
    id: "callerEligibleReceiptDate",
    label: "Caller eligible receipt date",
    kind: "string",
  },
  {
    id: "callerApplicableWorkingDayWindow",
    label: "Caller applicable working day window",
    kind: "number",
  },
  {
    id: "callerVerifiedExcludedFederalHolidayDates",
    label: "Caller verified excluded federal holiday dates",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    callerWorkingDayResponseDeadline: businessDeadline(
      input.callerEligibleReceiptDate,
      input.callerApplicableWorkingDayWindow,
      input.callerVerifiedExcludedFederalHolidayDates,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEligibleReceiptDate: "2026-01-02",
  callerApplicableWorkingDayWindow: 20,
  callerVerifiedExcludedFederalHolidayDates: ["2026-01-19"],
} satisfies Input;
export const exampleOutput = {
  callerWorkingDayResponseDeadline: "2026-02-02",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/foia-response-deadline-20-working-days-lookup",
  title: "FOIA Response Deadline 20 Working Days Lookup",
  description:
    "FOIA caller independently eligible receipt and applicable working-day window, excludes weekends and explicit holidays AFTER receipt; 20-day title not universal response/production entitlement, tolling/extensions external. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerWorkingDayResponseDeadline",
      label: "Caller working day response deadline",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEligibleReceiptDate: value.callerEligibleReceiptDate as string,
      callerApplicableWorkingDayWindow:
        value.callerApplicableWorkingDayWindow as number,
      callerVerifiedExcludedFederalHolidayDates:
        value.callerVerifiedExcludedFederalHolidayDates as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
