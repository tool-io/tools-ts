import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly paymentAmount: number;
  readonly orderedLiabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly allocatedAmounts: readonly number[];
  readonly totalAllocated: number;
  readonly unappliedPayment: number;
  readonly remainingLiability: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.orderedLiabilities.some((value) => value < 0))
    simpleError(
      "orderedLiabilities",
      "Liabilities must be nonnegative.",
      "invalid_liabilities",
    );
  let remaining = input.paymentAmount;
  const allocatedAmounts = input.orderedLiabilities.map((value) => {
    const allocated = Math.min(value, remaining);
    remaining -= allocated;
    return allocated;
  });
  const totalLiability = input.orderedLiabilities.reduce((a, b) => a + b, 0);
  const totalAllocated = input.paymentAmount - remaining;
  return {
    allocatedAmounts,
    totalAllocated,
    unappliedPayment: remaining,
    remainingLiability: totalLiability - totalAllocated,
  };
};

export const exampleInput = {
  paymentAmount: 100,
  orderedLiabilities: [30, 90],
} satisfies Input;
export const exampleOutput = {
  allocatedAmounts: [30, 70],
  totalAllocated: 100,
  unappliedPayment: 0,
  remainingLiability: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      paymentAmount: input.paymentAmount as number,
      orderedLiabilities: input.orderedLiabilities as readonly number[],
    }),
  description: "Allocate a tax payment across caller-ordered liabilities.",
  id: "taxation/tax-payment-allocation",
  inputs: [
    {
      id: "paymentAmount",
      label: "Payment amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "orderedLiabilities",
      label: "Liabilities in allocation order",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "allocatedAmounts",
      label: "Amounts allocated by liability",
      kind: "numberList",
    },
    {
      id: "totalAllocated",
      label: "Total allocated",
      kind: "number",
      minimum: 0,
    },
    {
      id: "unappliedPayment",
      label: "Unapplied payment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "remainingLiability",
      label: "Remaining liability",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Tax Payment Allocation",
});

export const run = tool.execute;
export default tool;
