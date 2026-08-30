import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualSales: number;
  readonly annualTransactions: number;
  readonly salesThreshold: number;
  readonly transactionThreshold: number;
  readonly thresholdMode: string;
}>;
export type Output = Readonly<{
  readonly meetsSalesThreshold: boolean;
  readonly meetsTransactionThreshold: boolean;
  readonly meetsConfiguredThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const meetsSalesThreshold = input.annualSales >= input.salesThreshold;
  const meetsTransactionThreshold =
    input.annualTransactions >= input.transactionThreshold;
  return {
    meetsSalesThreshold,
    meetsTransactionThreshold,
    meetsConfiguredThreshold:
      input.thresholdMode === "either"
        ? meetsSalesThreshold || meetsTransactionThreshold
        : meetsSalesThreshold && meetsTransactionThreshold,
  };
};

export const exampleInput = {
  annualSales: 120000,
  annualTransactions: 150,
  salesThreshold: 100000,
  transactionThreshold: 200,
  thresholdMode: "either",
} satisfies Input;
export const exampleOutput = {
  meetsSalesThreshold: true,
  meetsTransactionThreshold: false,
  meetsConfiguredThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualSales: input.annualSales as number,
      annualTransactions: input.annualTransactions as number,
      salesThreshold: input.salesThreshold as number,
      transactionThreshold: input.transactionThreshold as number,
      thresholdMode: input.thresholdMode as string,
    }),
  description:
    "Compare sales and transaction counts with caller-supplied nexus thresholds.",
  id: "taxation/nexus-threshold-screen",
  inputs: [
    {
      id: "annualSales",
      label: "Annual in-jurisdiction sales",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "annualTransactions",
      label: "Annual in-jurisdiction transactions",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "salesThreshold",
      label: "Sales threshold",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "transactionThreshold",
      label: "Transaction threshold",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "thresholdMode",
      label: "Threshold mode",
      kind: "string",
      enum: ["either", "both"],
    },
  ],
  outputs: [
    {
      id: "meetsSalesThreshold",
      label: "Meets sales threshold",
      kind: "boolean",
    },
    {
      id: "meetsTransactionThreshold",
      label: "Meets transaction threshold",
      kind: "boolean",
    },
    {
      id: "meetsConfiguredThreshold",
      label: "Meets configured threshold",
      kind: "boolean",
    },
  ],
  title: "Nexus Threshold Screen",
});

export const run = tool.execute;
export default tool;
