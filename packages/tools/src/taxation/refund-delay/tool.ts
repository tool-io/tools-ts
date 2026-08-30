import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly delayDays: number;
  readonly interestFreeDays: number;
  readonly refundAmount: number;
  readonly annualInterestRatePercent: number;
}>;
export type Output = Readonly<{
  readonly interestBearingDays: number;
  readonly estimatedSimpleInterest: number;
  readonly estimatedRefundWithInterest: number;
}>;

export const calculate = (input: Input): Output => {
  const interestBearingDays = Math.max(
    0,
    input.delayDays - input.interestFreeDays,
  );
  const estimatedSimpleInterest =
    (((input.refundAmount * input.annualInterestRatePercent) / 100) *
      interestBearingDays) /
    365;
  return {
    interestBearingDays,
    estimatedSimpleInterest,
    estimatedRefundWithInterest: input.refundAmount + estimatedSimpleInterest,
  };
};

export const exampleInput = {
  delayDays: 40,
  interestFreeDays: 10,
  refundAmount: 3650,
  annualInterestRatePercent: 10,
} satisfies Input;
export const exampleOutput = {
  interestBearingDays: 30,
  estimatedSimpleInterest: 30,
  estimatedRefundWithInterest: 3680,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      delayDays: input.delayDays as number,
      interestFreeDays: input.interestFreeDays as number,
      refundAmount: input.refundAmount as number,
      annualInterestRatePercent: input.annualInterestRatePercent as number,
    }),
  description:
    "Estimate simple interest from caller-supplied refund delay and interest assumptions.",
  id: "taxation/refund-delay",
  inputs: [
    {
      id: "delayDays",
      label: "Refund delay",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "interestFreeDays",
      label: "Interest-free period",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    { id: "refundAmount", label: "Refund amount", kind: "number", minimum: 0 },
    {
      id: "annualInterestRatePercent",
      label: "Annual interest rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "interestBearingDays",
      label: "Interest-bearing delay",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "estimatedSimpleInterest",
      label: "Estimated simple interest",
      kind: "number",
      minimum: 0,
    },
    {
      id: "estimatedRefundWithInterest",
      label: "Estimated refund with interest",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Refund Delay",
});

export const run = tool.execute;
export default tool;
