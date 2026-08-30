import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly distributionAmount: number;
  readonly ordinaryDistributionAmount: number;
  readonly excessTaxRatePercent: number;
  readonly interestCharge: number;
}>;
export type Output = Readonly<{
  readonly excessDistribution: number;
  readonly distributionTax: number;
  readonly totalTaxAndInterest: number;
}>;

export const calculate = (input: Input): Output => {
  const excessDistribution = Math.max(
    0,
    input.distributionAmount - input.ordinaryDistributionAmount,
  );
  const distributionTax =
    (excessDistribution * input.excessTaxRatePercent) / 100;
  return {
    excessDistribution,
    distributionTax,
    totalTaxAndInterest: distributionTax + input.interestCharge,
  };
};

export const exampleInput = {
  distributionAmount: 1000,
  ordinaryDistributionAmount: 400,
  excessTaxRatePercent: 30,
  interestCharge: 20,
} satisfies Input;
export const exampleOutput = {
  excessDistribution: 600,
  distributionTax: 180,
  totalTaxAndInterest: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      distributionAmount: input.distributionAmount as number,
      ordinaryDistributionAmount: input.ordinaryDistributionAmount as number,
      excessTaxRatePercent: input.excessTaxRatePercent as number,
      interestCharge: input.interestCharge as number,
    }),
  description:
    "Estimate PFIC excess-distribution tax using caller-supplied classifications and rate.",
  id: "taxation/pfic-distribution-tax",
  inputs: [
    {
      id: "distributionAmount",
      label: "PFIC distribution",
      kind: "number",
      minimum: 0,
    },
    {
      id: "ordinaryDistributionAmount",
      label: "Ordinary distribution portion",
      kind: "number",
      minimum: 0,
    },
    {
      id: "excessTaxRatePercent",
      label: "Caller excess-distribution rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "interestCharge",
      label: "Caller interest charge",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "excessDistribution",
      label: "Excess distribution",
      kind: "number",
      minimum: 0,
    },
    {
      id: "distributionTax",
      label: "Distribution tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalTaxAndInterest",
      label: "Tax and interest",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "PFIC Distribution Tax",
});

export const run = tool.execute;
export default tool;
