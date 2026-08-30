import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly recallExpense: number;
  readonly contaminatedStockLoss: number;
  readonly businessInterruptionLoss: number;
  readonly recallLimit: number;
  readonly stockLimit: number;
  readonly interruptionLimit: number;
}>;
export type Output = Readonly<{
  readonly recallRecovery: number;
  readonly stockRecovery: number;
  readonly interruptionRecovery: number;
  readonly totalRecovery: number;
  readonly uninsuredLoss: number;
}>;

export const calculate = (input: Input): Output => {
  const recallRecovery = Math.min(input.recallExpense, input.recallLimit),
    stockRecovery = Math.min(input.contaminatedStockLoss, input.stockLimit),
    interruptionRecovery = Math.min(
      input.businessInterruptionLoss,
      input.interruptionLimit,
    ),
    totalRecovery = recallRecovery + stockRecovery + interruptionRecovery,
    totalLoss =
      input.recallExpense +
      input.contaminatedStockLoss +
      input.businessInterruptionLoss;
  return {
    recallRecovery,
    stockRecovery,
    interruptionRecovery,
    totalRecovery,
    uninsuredLoss: totalLoss - totalRecovery,
  };
};

export const exampleInput = {
  recallExpense: 100,
  contaminatedStockLoss: 200,
  businessInterruptionLoss: 300,
  recallLimit: 80,
  stockLimit: 150,
  interruptionLimit: 250,
} satisfies Input;
export const exampleOutput = {
  recallRecovery: 80,
  stockRecovery: 150,
  interruptionRecovery: 250,
  totalRecovery: 480,
  uninsuredLoss: 120,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      recallExpense: input.recallExpense as number,
      contaminatedStockLoss: input.contaminatedStockLoss as number,
      businessInterruptionLoss: input.businessInterruptionLoss as number,
      recallLimit: input.recallLimit as number,
      stockLimit: input.stockLimit as number,
      interruptionLimit: input.interruptionLimit as number,
    }),
  description: "Split product-recall loss across supplied coverage limits.",
  id: "insurance/recall-loss-split",
  inputs: [
    {
      id: "recallExpense",
      label: "Recall expense",
      kind: "number",
      minimum: 0,
    },
    {
      id: "contaminatedStockLoss",
      label: "Contaminated stock loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "businessInterruptionLoss",
      label: "Business interruption loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "recallLimit",
      label: "Recall expense limit",
      kind: "number",
      minimum: 0,
    },
    { id: "stockLimit", label: "Stock loss limit", kind: "number", minimum: 0 },
    {
      id: "interruptionLimit",
      label: "Interruption limit",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "recallRecovery",
      label: "Recall recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "stockRecovery",
      label: "Stock recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "interruptionRecovery",
      label: "Interruption recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalRecovery",
      label: "Total recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "uninsuredLoss",
      label: "Uninsured loss",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Recall Loss Split",
});

export const run = tool.execute;
export default tool;
