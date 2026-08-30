import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nftSalesProceeds: number;
  readonly creatorExpenses: number;
  readonly selfEmploymentTaxRatePercent: number;
  readonly incomeTaxRatePercent: number;
}>;
export type Output = Readonly<{
  readonly netCreatorIncome: number;
  readonly estimatedSelfEmploymentTax: number;
  readonly estimatedIncomeTax: number;
  readonly combinedEstimatedTax: number;
}>;

export const calculate = (input: Input): Output => {
  const netCreatorIncome = input.nftSalesProceeds - input.creatorExpenses;
  const taxable = Math.max(0, netCreatorIncome);
  const estimatedSelfEmploymentTax =
    (taxable * input.selfEmploymentTaxRatePercent) / 100;
  const estimatedIncomeTax = (taxable * input.incomeTaxRatePercent) / 100;
  return {
    netCreatorIncome,
    estimatedSelfEmploymentTax,
    estimatedIncomeTax,
    combinedEstimatedTax: estimatedSelfEmploymentTax + estimatedIncomeTax,
  };
};

export const exampleInput = {
  nftSalesProceeds: 1000,
  creatorExpenses: 200,
  selfEmploymentTaxRatePercent: 10,
  incomeTaxRatePercent: 20,
} satisfies Input;
export const exampleOutput = {
  netCreatorIncome: 800,
  estimatedSelfEmploymentTax: 80,
  estimatedIncomeTax: 160,
  combinedEstimatedTax: 240,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nftSalesProceeds: input.nftSalesProceeds as number,
      creatorExpenses: input.creatorExpenses as number,
      selfEmploymentTaxRatePercent:
        input.selfEmploymentTaxRatePercent as number,
      incomeTaxRatePercent: input.incomeTaxRatePercent as number,
    }),
  description: "Estimate caller-parameterized tax on net NFT creator income.",
  id: "taxation/nft-creator-income",
  inputs: [
    {
      id: "nftSalesProceeds",
      label: "NFT sales proceeds",
      kind: "number",
      minimum: 0,
    },
    {
      id: "creatorExpenses",
      label: "Creator expenses",
      kind: "number",
      minimum: 0,
    },
    {
      id: "selfEmploymentTaxRatePercent",
      label: "Self-employment tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "incomeTaxRatePercent",
      label: "Income-tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    { id: "netCreatorIncome", label: "Net creator income", kind: "number" },
    {
      id: "estimatedSelfEmploymentTax",
      label: "Estimated self-employment tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "estimatedIncomeTax",
      label: "Estimated income tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "combinedEstimatedTax",
      label: "Combined estimated tax",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "NFT Creator Income",
});

export const run = tool.execute;
export default tool;
