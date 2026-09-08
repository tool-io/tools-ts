import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  dateOrder,
  holdingDays,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly originalPaymentDueDate: string;
  readonly callerExtendedFilingDueDate: string;
  readonly observedPaymentDate: string;
  readonly remainingTaxDueMinor: number;
}>;
export type Output = Readonly<{
  readonly paymentDaysPastOriginalDue: number;
  readonly extensionDoesNotRemovePaymentGap: boolean;
}>;
const inputFields = [
  {
    id: "originalPaymentDueDate",
    label: "Original payment due date",
    kind: "string",
  },
  {
    id: "callerExtendedFilingDueDate",
    label: "Caller extended filing due date",
    kind: "string",
  },
  { id: "observedPaymentDate", label: "Observed payment date", kind: "string" },
  {
    id: "remainingTaxDueMinor",
    label: "Remaining tax due minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.remainingTaxDueMinor, "remainingTaxDueMinor");
  holdingDays(input.originalPaymentDueDate, input.callerExtendedFilingDueDate);
  const d = dateOrder(input.originalPaymentDueDate, input.observedPaymentDate);
  return {
    paymentDaysPastOriginalDue: Math.max(0, d),
    extensionDoesNotRemovePaymentGap: d > 0 && input.remainingTaxDueMinor > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originalPaymentDueDate: "2026-04-15",
  callerExtendedFilingDueDate: "2026-10-15",
  observedPaymentDate: "2026-05-01",
  remainingTaxDueMinor: 100,
} satisfies Input;
export const exampleOutput = {
  paymentDaysPastOriginalDue: 16,
  extensionDoesNotRemovePaymentGap: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/extension-six-month-payment-warning-checker",
  title: "Extension Six Month Payment Warning Checker",
  description:
    "Independent filing extension date does not shift supplied original tax-payment deadline; observed gap warning only, no penalty amount or automatic6months. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "paymentDaysPastOriginalDue",
      label: "Payment days past original due",
      kind: "number",
    },
    {
      id: "extensionDoesNotRemovePaymentGap",
      label: "Extension does not remove payment gap",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      originalPaymentDueDate: value.originalPaymentDueDate as string,
      callerExtendedFilingDueDate: value.callerExtendedFilingDueDate as string,
      observedPaymentDate: value.observedPaymentDate as string,
      remainingTaxDueMinor: value.remainingTaxDueMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
