import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rewardsReceived: number;
  readonly fairValuePerReward: number;
  readonly relatedExpenses: number;
  readonly estimatedTaxRatePercent: number;
}>;
export type Output = Readonly<{
  readonly grossStakingIncome: number;
  readonly netStakingIncome: number;
  readonly estimatedTax: number;
}>;

export const calculate = (input: Input): Output => {
  const grossStakingIncome = input.rewardsReceived * input.fairValuePerReward;
  const netStakingIncome = grossStakingIncome - input.relatedExpenses;
  return {
    grossStakingIncome,
    netStakingIncome,
    estimatedTax:
      (Math.max(0, netStakingIncome) * input.estimatedTaxRatePercent) / 100,
  };
};

export const exampleInput = {
  rewardsReceived: 100,
  fairValuePerReward: 2,
  relatedExpenses: 20,
  estimatedTaxRatePercent: 25,
} satisfies Input;
export const exampleOutput = {
  grossStakingIncome: 200,
  netStakingIncome: 180,
  estimatedTax: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rewardsReceived: input.rewardsReceived as number,
      fairValuePerReward: input.fairValuePerReward as number,
      relatedExpenses: input.relatedExpenses as number,
      estimatedTaxRatePercent: input.estimatedTaxRatePercent as number,
    }),
  description:
    "Estimate net staking income and tax using caller-supplied values and rate.",
  id: "taxation/staking-income",
  inputs: [
    {
      id: "rewardsReceived",
      label: "Staking rewards received",
      kind: "number",
      minimum: 0,
    },
    {
      id: "fairValuePerReward",
      label: "Fair value per reward",
      kind: "number",
      minimum: 0,
    },
    {
      id: "relatedExpenses",
      label: "Related expenses",
      kind: "number",
      minimum: 0,
    },
    {
      id: "estimatedTaxRatePercent",
      label: "Estimated tax rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "grossStakingIncome",
      label: "Gross staking income",
      kind: "number",
      minimum: 0,
    },
    { id: "netStakingIncome", label: "Net staking income", kind: "number" },
    { id: "estimatedTax", label: "Estimated tax", kind: "number", minimum: 0 },
  ],
  title: "Staking Income",
});

export const run = tool.execute;
export default tool;
