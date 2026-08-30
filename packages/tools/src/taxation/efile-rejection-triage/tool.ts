import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly identityMismatch: boolean;
  readonly duplicateFiling: boolean;
  readonly schemaError: boolean;
  readonly paymentError: boolean;
}>;
export type Output = Readonly<{
  readonly issueCount: number;
  readonly priorityAction: string;
}>;

export const calculate = (input: Input): Output => {
  const issueCount = [
    input.identityMismatch,
    input.duplicateFiling,
    input.schemaError,
    input.paymentError,
  ].filter(Boolean).length;
  const priorityAction = input.identityMismatch
    ? "verify-identity"
    : input.duplicateFiling
      ? "investigate-duplicate"
      : input.schemaError
        ? "fix-return-data"
        : input.paymentError
          ? "fix-payment-data"
          : "manual-review";
  return { issueCount, priorityAction };
};

export const exampleInput = {
  identityMismatch: false,
  duplicateFiling: false,
  schemaError: true,
  paymentError: false,
} satisfies Input;
export const exampleOutput = {
  issueCount: 1,
  priorityAction: "fix-return-data",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      identityMismatch: input.identityMismatch as boolean,
      duplicateFiling: input.duplicateFiling as boolean,
      schemaError: input.schemaError as boolean,
      paymentError: input.paymentError as boolean,
    }),
  description:
    "Triage common e-file rejection indicators into a priority action.",
  id: "taxation/efile-rejection-triage",
  inputs: [
    {
      id: "identityMismatch",
      label: "Identity data mismatch",
      kind: "boolean",
    },
    {
      id: "duplicateFiling",
      label: "Duplicate filing indicated",
      kind: "boolean",
    },
    { id: "schemaError", label: "Return schema error", kind: "boolean" },
    { id: "paymentError", label: "Payment information error", kind: "boolean" },
  ],
  outputs: [
    { id: "issueCount", label: "Issue count", kind: "integer", minimum: 0 },
    {
      id: "priorityAction",
      label: "Priority action",
      kind: "string",
      enum: [
        "verify-identity",
        "investigate-duplicate",
        "fix-return-data",
        "fix-payment-data",
        "manual-review",
      ],
    },
  ],
  title: "E-File Rejection Triage",
});

export const run = tool.execute;
export default tool;
