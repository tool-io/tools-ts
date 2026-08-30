import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expectedRefund: number;
  readonly eligibleDebts: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalEligibleDebt: number;
  readonly appliedOffset: number;
  readonly remainingRefund: number;
  readonly remainingDebt: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.eligibleDebts.some((value) => value < 0))
    simpleError(
      "eligibleDebts",
      "Debt amounts must be nonnegative.",
      "invalid_debts",
    );
  const totalEligibleDebt = input.eligibleDebts.reduce((a, b) => a + b, 0);
  const appliedOffset = Math.min(input.expectedRefund, totalEligibleDebt);
  return {
    totalEligibleDebt,
    appliedOffset,
    remainingRefund: input.expectedRefund - appliedOffset,
    remainingDebt: totalEligibleDebt - appliedOffset,
  };
};

export const exampleInput = {
  expectedRefund: 100,
  eligibleDebts: [30, 20],
} satisfies Input;
export const exampleOutput = {
  totalEligibleDebt: 50,
  appliedOffset: 50,
  remainingRefund: 50,
  remainingDebt: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      expectedRefund: input.expectedRefund as number,
      eligibleDebts: input.eligibleDebts as readonly number[],
    }),
  description:
    "Apply an expected refund against caller-supplied eligible debt amounts.",
  id: "taxation/refund-offset",
  inputs: [
    {
      id: "expectedRefund",
      label: "Expected refund",
      kind: "number",
      minimum: 0,
    },
    { id: "eligibleDebts", label: "Eligible offset debts", kind: "numberList" },
  ],
  outputs: [
    {
      id: "totalEligibleDebt",
      label: "Total eligible debt",
      kind: "number",
      minimum: 0,
    },
    {
      id: "appliedOffset",
      label: "Applied refund offset",
      kind: "number",
      minimum: 0,
    },
    {
      id: "remainingRefund",
      label: "Refund after offset",
      kind: "number",
      minimum: 0,
    },
    {
      id: "remainingDebt",
      label: "Eligible debt after offset",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Refund Offset",
});

export const run = tool.execute;
export default tool;
