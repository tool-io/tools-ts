import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eligiblePurchases: number;
  readonly normalTaxRatePercent: number;
  readonly holidayTaxRatePercent: number;
  readonly perItemCap: number;
}>;
export type Output = Readonly<{
  readonly eligibleAmount: number;
  readonly normalTax: number;
  readonly holidayTax: number;
  readonly taxSavings: number;
}>;

export const calculate = (input: Input): Output => {
  const eligibleAmount = Math.min(input.eligiblePurchases, input.perItemCap);
  const normalTax = (eligibleAmount * input.normalTaxRatePercent) / 100;
  const holidayTax = (eligibleAmount * input.holidayTaxRatePercent) / 100;
  return {
    eligibleAmount,
    normalTax,
    holidayTax,
    taxSavings: normalTax - holidayTax,
  };
};

export const exampleInput = {
  eligiblePurchases: 1200,
  normalTaxRatePercent: 10,
  holidayTaxRatePercent: 0,
  perItemCap: 1000,
} satisfies Input;
export const exampleOutput = {
  eligibleAmount: 1000,
  normalTax: 100,
  holidayTax: 0,
  taxSavings: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eligiblePurchases: input.eligiblePurchases as number,
      normalTaxRatePercent: input.normalTaxRatePercent as number,
      holidayTaxRatePercent: input.holidayTaxRatePercent as number,
      perItemCap: input.perItemCap as number,
    }),
  description:
    "Calculate sales-tax holiday savings using caller-supplied rates and cap.",
  id: "taxation/tax-holiday-savings",
  inputs: [
    {
      id: "eligiblePurchases",
      label: "Eligible holiday purchases",
      kind: "number",
      minimum: 0,
    },
    {
      id: "normalTaxRatePercent",
      label: "Normal tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "holidayTaxRatePercent",
      label: "Holiday tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "perItemCap",
      label: "Eligible amount cap",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "eligibleAmount",
      label: "Capped eligible amount",
      kind: "number",
      minimum: 0,
    },
    { id: "normalTax", label: "Normal tax", kind: "number", minimum: 0 },
    { id: "holidayTax", label: "Holiday tax", kind: "number", minimum: 0 },
    { id: "taxSavings", label: "Tax-holiday savings", kind: "number" },
  ],
  title: "Tax-Holiday Savings",
});

export const run = tool.execute;
export default tool;
