import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  daysBetween,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEmbargoStartDate: string;
  readonly callerRequestedReviewDate: string;
  readonly callerApplicableCenturyBoundaryDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedEmbargoStartDate",
    label: "Caller verified embargo start date",
    kind: "string",
  },
  {
    id: "callerRequestedReviewDate",
    label: "Caller requested review date",
    kind: "string",
  },
  {
    id: "callerApplicableCenturyBoundaryDate",
    label: "Caller applicable century boundary date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    daysBetween(
      input.callerVerifiedEmbargoStartDate,
      input.callerApplicableCenturyBoundaryDate,
    ) < 0
  )
    simpleError(
      "boundary",
      "Independently verified boundary cannot precede stated trigger.",
    );
  return {
    daysToCallerBoundary: daysBetween(
      input.callerRequestedReviewDate,
      input.callerApplicableCenturyBoundaryDate,
    ),
    atOrAfterCallerBoundary:
      daysBetween(
        input.callerApplicableCenturyBoundaryDate,
        input.callerRequestedReviewDate,
      ) >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedEmbargoStartDate: "1926-01-01",
    callerRequestedReviewDate: "2026-01-01",
    callerApplicableCenturyBoundaryDate: "2026-01-01",
  },
  output: {
    result: { daysToCallerBoundary: 0, atOrAfterCallerBoundary: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/personal-data-100yr-checker",
  title: "Privacy Embargo 100-Year Rule Personal Data Checker",
  description:
    "Compare actual review date with independently legally established century-embargo boundary, manual proleptic Gregorian validation. No universal100-year personal-data rule, automatic opening, privacy/FOI eligibility or copyright consequence; boundary calculated/verified externally.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
