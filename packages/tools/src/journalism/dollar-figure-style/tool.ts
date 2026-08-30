import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly amount: number;
  readonly decimalPlaces: number;
  readonly renderedAmount: string;
}>;
export type Output = Readonly<{
  readonly expectedAmount: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const expectedAmount = `$${input.amount.toLocaleString("en-US", { minimumFractionDigits: input.decimalPlaces, maximumFractionDigits: input.decimalPlaces, useGrouping: true })}`;
  return {
    expectedAmount,
    matchesExpected: input.renderedAmount.trim() === expectedAmount,
  };
};

export const exampleInput = {
  amount: 1234.5,
  decimalPlaces: 2,
  renderedAmount: "$1,234.50",
} satisfies Input;
export const exampleOutput = {
  expectedAmount: "$1,234.50",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      amount: input.amount as number,
      decimalPlaces: input.decimalPlaces as number,
      renderedAmount: input.renderedAmount as string,
    }),
  description: "Validate dollar-figure grouping and decimal precision.",
  id: "journalism/dollar-figure-style",
  inputs: [
    { id: "amount", label: "Dollar amount", kind: "number" },
    {
      id: "decimalPlaces",
      label: "Decimal places",
      kind: "integer",
      minimum: 0,
      maximum: 6,
    },
    { id: "renderedAmount", label: "Rendered amount", kind: "string" },
  ],
  outputs: [
    { id: "expectedAmount", label: "Expected dollar figure", kind: "string" },
    {
      id: "matchesExpected",
      label: "Matches expected amount",
      kind: "boolean",
    },
  ],
  title: "Dollar Figure Style",
});

export const run = tool.execute;
export default tool;
