import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly partyInInterest: boolean;
  readonly coveredTransactionType: boolean;
  readonly documentedExemption: boolean;
  readonly transactionAmount: number;
  readonly reviewThreshold: number;
}>;
export type Output = Readonly<{
  readonly potentiallyProhibited: boolean;
  readonly thresholdExceeded: boolean;
  readonly reviewStatus: string;
}>;

export const calculate = (input: Input): Output => {
  const potentiallyProhibited =
      input.partyInInterest &&
      input.coveredTransactionType &&
      !input.documentedExemption,
    thresholdExceeded = input.transactionAmount >= input.reviewThreshold;
  return {
    potentiallyProhibited,
    thresholdExceeded,
    reviewStatus: potentiallyProhibited
      ? "investigate"
      : input.partyInInterest && input.documentedExemption
        ? "review-exemption"
        : "clear",
  };
};

export const exampleInput = {
  partyInInterest: true,
  coveredTransactionType: true,
  documentedExemption: false,
  transactionAmount: 10000,
  reviewThreshold: 5000,
} satisfies Input;
export const exampleOutput = {
  potentiallyProhibited: true,
  thresholdExceeded: true,
  reviewStatus: "investigate",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      partyInInterest: input.partyInInterest as boolean,
      coveredTransactionType: input.coveredTransactionType as boolean,
      documentedExemption: input.documentedExemption as boolean,
      transactionAmount: input.transactionAmount as number,
      reviewThreshold: input.reviewThreshold as number,
    }),
  description:
    "Screen plan transactions for party-in-interest and exemption indicators.",
  id: "auditing/prohibited-transaction-screen",
  inputs: [
    {
      id: "partyInInterest",
      label: "Counterparty is a party in interest",
      kind: "boolean",
    },
    {
      id: "coveredTransactionType",
      label: "Transaction type is covered",
      kind: "boolean",
    },
    {
      id: "documentedExemption",
      label: "Documented exemption applies",
      kind: "boolean",
    },
    {
      id: "transactionAmount",
      label: "Transaction amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reviewThreshold",
      label: "Review threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "potentiallyProhibited",
      label: "Potentially prohibited transaction",
      kind: "boolean",
    },
    {
      id: "thresholdExceeded",
      label: "Review threshold exceeded",
      kind: "boolean",
    },
    {
      id: "reviewStatus",
      label: "Review status",
      kind: "string",
      enum: ["clear", "review-exemption", "investigate"],
    },
  ],
  title: "Prohibited-Transaction Screen",
});

export const run = tool.execute;
export default tool;
