import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dateDay } from "../batch-shared.js";
export type Input = Readonly<{
  readonly reportingPeriodEndDate: string;
  readonly eventObservedDate: string;
  readonly financialStatementsAuthorizationDate: string;
  readonly callerConditionExistedAtPeriodEnd: boolean;
  readonly callerEventMaterial: boolean;
}>;
export type Output = Readonly<{
  readonly inSubsequentEventReviewWindow: boolean;
  readonly callerEvidenceEventClass: string;
  readonly nonadjustingDisclosureCandidate: boolean;
}>;
const inputFields = [
  {
    id: "reportingPeriodEndDate",
    label: "Reporting period end date",
    kind: "string",
  },
  { id: "eventObservedDate", label: "Event observed date", kind: "string" },
  {
    id: "financialStatementsAuthorizationDate",
    label: "Financial statements authorization date",
    kind: "string",
  },
  {
    id: "callerConditionExistedAtPeriodEnd",
    label: "Caller condition existed at period end",
    kind: "boolean",
  },
  {
    id: "callerEventMaterial",
    label: "Caller event material",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const end = dateDay(input.reportingPeriodEndDate),
    event = dateDay(input.eventObservedDate),
    authorization = dateDay(input.financialStatementsAuthorizationDate);
  if (authorization < end)
    simpleError(
      "authorization",
      "Statement authorization cannot precede period end.",
    );
  const within = event > end && event <= authorization;
  return {
    inSubsequentEventReviewWindow: within,
    callerEvidenceEventClass: !within
      ? "outside-review-window"
      : input.callerConditionExistedAtPeriodEnd
        ? "adjusting-candidate"
        : "nonadjusting-candidate",
    nonadjustingDisclosureCandidate:
      within &&
      !input.callerConditionExistedAtPeriodEnd &&
      input.callerEventMaterial,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reportingPeriodEndDate: "2025-12-31",
  eventObservedDate: "2026-01-10",
  financialStatementsAuthorizationDate: "2026-02-01",
  callerConditionExistedAtPeriodEnd: true,
  callerEventMaterial: true,
} satisfies Input;
export const exampleOutput = {
  inSubsequentEventReviewWindow: true,
  callerEvidenceEventClass: "adjusting-candidate",
  nonadjustingDisclosureCandidate: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/subsequent-events-type-i-vs-ii-classifier",
  title: "Subsequent Events Type I vs II Classifier",
  description:
    "Screen actual event timing through caller statement authorization and explicitly supplied preexisting-condition/materiality evidence, retaining adjusting/nonadjusting candidates; no discovery of underlying conditions or framework-specific final disclosure decision.",
  inputs: inputFields,
  outputs: [
    {
      id: "inSubsequentEventReviewWindow",
      label: "In subsequent event review window",
      kind: "boolean",
    },
    {
      id: "callerEvidenceEventClass",
      label: "Caller evidence event class",
      kind: "string",
    },
    {
      id: "nonadjustingDisclosureCandidate",
      label: "Nonadjusting disclosure candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      reportingPeriodEndDate: value.reportingPeriodEndDate as string,
      eventObservedDate: value.eventObservedDate as string,
      financialStatementsAuthorizationDate:
        value.financialStatementsAuthorizationDate as string,
      callerConditionExistedAtPeriodEnd:
        value.callerConditionExistedAtPeriodEnd as boolean,
      callerEventMaterial: value.callerEventMaterial as boolean,
    }),
});
export const run = tool.execute;
export default tool;
