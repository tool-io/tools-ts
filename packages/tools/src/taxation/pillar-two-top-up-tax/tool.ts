import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coveredIncome: number;
  readonly effectiveTaxRatePercent: number;
  readonly minimumRatePercent: number;
  readonly substanceExclusion: number;
}>;
export type Output = Readonly<{
  readonly excessProfit: number;
  readonly topUpRatePercent: number;
  readonly topUpTax: number;
}>;

export const calculate = (input: Input): Output => {
  const excessProfit = Math.max(
    0,
    input.coveredIncome - input.substanceExclusion,
  );
  const topUpRatePercent = Math.max(
    0,
    input.minimumRatePercent - input.effectiveTaxRatePercent,
  );
  return {
    excessProfit,
    topUpRatePercent,
    topUpTax: (excessProfit * topUpRatePercent) / 100,
  };
};

export const exampleInput = {
  coveredIncome: 1000,
  effectiveTaxRatePercent: 10,
  minimumRatePercent: 15,
  substanceExclusion: 200,
} satisfies Input;
export const exampleOutput = {
  excessProfit: 800,
  topUpRatePercent: 5,
  topUpTax: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      coveredIncome: input.coveredIncome as number,
      effectiveTaxRatePercent: input.effectiveTaxRatePercent as number,
      minimumRatePercent: input.minimumRatePercent as number,
      substanceExclusion: input.substanceExclusion as number,
    }),
  description:
    "Estimate Pillar Two top-up tax from caller-supplied income, rates, and exclusion.",
  id: "taxation/pillar-two-top-up-tax",
  inputs: [
    {
      id: "coveredIncome",
      label: "Covered income",
      kind: "number",
      minimum: 0,
    },
    {
      id: "effectiveTaxRatePercent",
      label: "Effective tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "minimumRatePercent",
      label: "Minimum rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "substanceExclusion",
      label: "Substance-based exclusion",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "excessProfit", label: "Excess profit", kind: "number", minimum: 0 },
    {
      id: "topUpRatePercent",
      label: "Top-up rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "topUpTax",
      label: "Estimated top-up tax",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Pillar Two Top-Up Tax",
});

export const run = tool.execute;
export default tool;
