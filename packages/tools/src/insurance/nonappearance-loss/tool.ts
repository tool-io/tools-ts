import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ticketRevenueAtRisk: number;
  readonly extraExpense: number;
  readonly mitigationRevenue: number;
  readonly dependencyPercent: number;
  readonly policyLimit: number;
}>;
export type Output = Readonly<{
  readonly dependentRevenueLoss: number;
  readonly netLoss: number;
  readonly claimPayment: number;
}>;

export const calculate = (input: Input): Output => {
  const dependentRevenueLoss =
      (input.ticketRevenueAtRisk * input.dependencyPercent) / 100,
    netLoss = Math.max(
      0,
      dependentRevenueLoss + input.extraExpense - input.mitigationRevenue,
    );
  return {
    dependentRevenueLoss,
    netLoss,
    claimPayment: Math.min(netLoss, input.policyLimit),
  };
};

export const exampleInput = {
  ticketRevenueAtRisk: 100000,
  extraExpense: 10000,
  mitigationRevenue: 20000,
  dependencyPercent: 80,
  policyLimit: 100000,
} satisfies Input;
export const exampleOutput = {
  dependentRevenueLoss: 80000,
  netLoss: 70000,
  claimPayment: 70000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ticketRevenueAtRisk: input.ticketRevenueAtRisk as number,
      extraExpense: input.extraExpense as number,
      mitigationRevenue: input.mitigationRevenue as number,
      dependencyPercent: input.dependencyPercent as number,
      policyLimit: input.policyLimit as number,
    }),
  description:
    "Estimate event nonappearance loss using caller-supplied dependency and mitigation.",
  id: "insurance/nonappearance-loss",
  inputs: [
    {
      id: "ticketRevenueAtRisk",
      label: "Ticket revenue at risk",
      kind: "number",
      minimum: 0,
    },
    { id: "extraExpense", label: "Extra expense", kind: "number", minimum: 0 },
    {
      id: "mitigationRevenue",
      label: "Mitigation revenue",
      kind: "number",
      minimum: 0,
    },
    {
      id: "dependencyPercent",
      label: "Headliner dependency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "policyLimit", label: "Policy limit", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "dependentRevenueLoss",
      label: "Dependent revenue loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "netLoss",
      label: "Net nonappearance loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "claimPayment",
      label: "Modeled claim payment",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Nonappearance Loss",
});

export const run = tool.execute;
export default tool;
