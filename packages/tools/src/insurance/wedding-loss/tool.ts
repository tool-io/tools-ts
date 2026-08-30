import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nonrefundableDeposits: number;
  readonly additionalPostponementCosts: number;
  readonly vendorRefunds: number;
  readonly policyLimit: number;
  readonly deductible: number;
}>;
export type Output = Readonly<{
  readonly grossLoss: number;
  readonly netCoveredLoss: number;
  readonly claimPayment: number;
  readonly uninsuredLoss: number;
}>;

export const calculate = (input: Input): Output => {
  const grossLoss =
      input.nonrefundableDeposits + input.additionalPostponementCosts,
    netCoveredLoss = Math.max(
      0,
      grossLoss - input.vendorRefunds - input.deductible,
    ),
    claimPayment = Math.min(input.policyLimit, netCoveredLoss);
  return {
    grossLoss,
    netCoveredLoss,
    claimPayment,
    uninsuredLoss: grossLoss - input.vendorRefunds - claimPayment,
  };
};

export const exampleInput = {
  nonrefundableDeposits: 10000,
  additionalPostponementCosts: 5000,
  vendorRefunds: 2000,
  policyLimit: 10000,
  deductible: 1000,
} satisfies Input;
export const exampleOutput = {
  grossLoss: 15000,
  netCoveredLoss: 12000,
  claimPayment: 10000,
  uninsuredLoss: 3000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nonrefundableDeposits: input.nonrefundableDeposits as number,
      additionalPostponementCosts: input.additionalPostponementCosts as number,
      vendorRefunds: input.vendorRefunds as number,
      policyLimit: input.policyLimit as number,
      deductible: input.deductible as number,
    }),
  description:
    "Calculate wedding postponement loss after refunds, deductible, and limit.",
  id: "insurance/wedding-loss",
  inputs: [
    {
      id: "nonrefundableDeposits",
      label: "Nonrefundable deposits",
      kind: "number",
      minimum: 0,
    },
    {
      id: "additionalPostponementCosts",
      label: "Additional postponement costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "vendorRefunds",
      label: "Vendor refunds",
      kind: "number",
      minimum: 0,
    },
    { id: "policyLimit", label: "Policy limit", kind: "number", minimum: 0 },
    { id: "deductible", label: "Deductible", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "grossLoss",
      label: "Gross wedding loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "netCoveredLoss",
      label: "Loss after refunds and deductible",
      kind: "number",
      minimum: 0,
    },
    {
      id: "claimPayment",
      label: "Modeled claim payment",
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
  title: "Wedding Loss",
});

export const run = tool.execute;
export default tool;
