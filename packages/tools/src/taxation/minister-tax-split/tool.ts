import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cashCompensation: number;
  readonly housingAllowance: number;
  readonly incomeTaxRatePercent: number;
  readonly selfEmploymentRatePercent: number;
}>;
export type Output = Readonly<{
  readonly incomeTaxBase: number;
  readonly selfEmploymentTaxBase: number;
  readonly estimatedIncomeTax: number;
  readonly estimatedSelfEmploymentTax: number;
  readonly combinedEstimatedTax: number;
}>;

export const calculate = (input: Input): Output => {
  const incomeTaxBase = input.cashCompensation;
  const selfEmploymentTaxBase = input.cashCompensation + input.housingAllowance;
  const estimatedIncomeTax = (incomeTaxBase * input.incomeTaxRatePercent) / 100;
  const estimatedSelfEmploymentTax =
    (selfEmploymentTaxBase * input.selfEmploymentRatePercent) / 100;
  return {
    incomeTaxBase,
    selfEmploymentTaxBase,
    estimatedIncomeTax,
    estimatedSelfEmploymentTax,
    combinedEstimatedTax: estimatedIncomeTax + estimatedSelfEmploymentTax,
  };
};

export const exampleInput = {
  cashCompensation: 1000,
  housingAllowance: 500,
  incomeTaxRatePercent: 10,
  selfEmploymentRatePercent: 20,
} satisfies Input;
export const exampleOutput = {
  incomeTaxBase: 1000,
  selfEmploymentTaxBase: 1500,
  estimatedIncomeTax: 100,
  estimatedSelfEmploymentTax: 300,
  combinedEstimatedTax: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cashCompensation: input.cashCompensation as number,
      housingAllowance: input.housingAllowance as number,
      incomeTaxRatePercent: input.incomeTaxRatePercent as number,
      selfEmploymentRatePercent: input.selfEmploymentRatePercent as number,
    }),
  description:
    "Split minister compensation into caller-parameterized income and self-employment tax bases.",
  id: "taxation/minister-tax-split",
  inputs: [
    {
      id: "cashCompensation",
      label: "Cash compensation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "housingAllowance",
      label: "Housing allowance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "incomeTaxRatePercent",
      label: "Income-tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "selfEmploymentRatePercent",
      label: "Self-employment rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "incomeTaxBase",
      label: "Income-tax base",
      kind: "number",
      minimum: 0,
    },
    {
      id: "selfEmploymentTaxBase",
      label: "Self-employment tax base",
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
      id: "estimatedSelfEmploymentTax",
      label: "Estimated self-employment tax",
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
  title: "Minister Tax Split",
});

export const run = tool.execute;
export default tool;
