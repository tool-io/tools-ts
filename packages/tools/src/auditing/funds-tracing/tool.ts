import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openingAccountBalance: number;
  readonly accountTransactions: readonly number[];
  readonly tracedFundsDeposited: number;
}>;
export type Output = Readonly<{
  readonly closingAccountBalance: number;
  readonly lowestIntermediateBalance: number;
  readonly traceableAmount: number;
}>;

export const calculate = (input: Input): Output => {
  let balance = input.openingAccountBalance,
    lowestIntermediateBalance = balance;
  for (const transaction of input.accountTransactions) {
    balance += transaction;
    lowestIntermediateBalance = Math.min(lowestIntermediateBalance, balance);
  }
  return {
    closingAccountBalance: balance,
    lowestIntermediateBalance,
    traceableAmount: Math.max(
      0,
      Math.min(input.tracedFundsDeposited, lowestIntermediateBalance),
    ),
  };
};

export const exampleInput = {
  openingAccountBalance: 100,
  accountTransactions: [100, -50, 25],
  tracedFundsDeposited: 100,
} satisfies Input;
export const exampleOutput = {
  closingAccountBalance: 175,
  lowestIntermediateBalance: 100,
  traceableAmount: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openingAccountBalance: input.openingAccountBalance as number,
      accountTransactions: input.accountTransactions as readonly number[],
      tracedFundsDeposited: input.tracedFundsDeposited as number,
    }),
  description: "Trace funds using the lowest-intermediate-balance method.",
  id: "auditing/funds-tracing",
  inputs: [
    {
      id: "openingAccountBalance",
      label: "Opening account balance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "accountTransactions",
      label: "Signed account transactions",
      kind: "numberList",
    },
    {
      id: "tracedFundsDeposited",
      label: "Traced funds deposited",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "closingAccountBalance",
      label: "Closing account balance",
      kind: "number",
    },
    {
      id: "lowestIntermediateBalance",
      label: "Lowest intermediate balance",
      kind: "number",
    },
    {
      id: "traceableAmount",
      label: "Lowest-intermediate-balance traceable amount",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Funds Tracing",
});

export const run = tool.execute;
export default tool;
