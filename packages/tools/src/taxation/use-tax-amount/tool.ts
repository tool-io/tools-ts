import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly purchaseAmount: number;
  readonly useTaxRatePercent: number;
  readonly salesTaxAlreadyPaid: number;
}>;
export type Output = Readonly<{
  readonly grossUseTax: number;
  readonly additionalUseTaxDue: number;
}>;

export const calculate = (input: Input): Output => {
  const grossUseTax = (input.purchaseAmount * input.useTaxRatePercent) / 100;
  return {
    grossUseTax,
    additionalUseTaxDue: Math.max(0, grossUseTax - input.salesTaxAlreadyPaid),
  };
};

export const exampleInput = {
  purchaseAmount: 1000,
  useTaxRatePercent: 6,
  salesTaxAlreadyPaid: 20,
} satisfies Input;
export const exampleOutput = {
  grossUseTax: 60,
  additionalUseTaxDue: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      purchaseAmount: input.purchaseAmount as number,
      useTaxRatePercent: input.useTaxRatePercent as number,
      salesTaxAlreadyPaid: input.salesTaxAlreadyPaid as number,
    }),
  description:
    "Calculate use tax from a caller-supplied rate and subtract sales tax already paid.",
  id: "taxation/use-tax-amount",
  inputs: [
    {
      id: "purchaseAmount",
      label: "Out-of-state purchase amount",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "useTaxRatePercent",
      label: "Applicable use-tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "salesTaxAlreadyPaid",
      label: "Sales tax already paid",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "grossUseTax",
      label: "Gross use tax",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "additionalUseTaxDue",
      label: "Additional use tax due",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Use Tax Amount",
});

export const run = tool.execute;
export default tool;
