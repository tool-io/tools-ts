import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualTaxAmount: number;
  readonly taxableMonths: number;
  readonly paymentsAlreadyMade: number;
}>;
export type Output = Readonly<{
  readonly proratedTax: number;
  readonly balanceDue: number;
  readonly overpayment: number;
}>;

export const calculate = (input: Input): Output => {
  const proratedTax = (input.annualTaxAmount * input.taxableMonths) / 12;
  return {
    proratedTax,
    balanceDue: Math.max(0, proratedTax - input.paymentsAlreadyMade),
    overpayment: Math.max(0, input.paymentsAlreadyMade - proratedTax),
  };
};

export const exampleInput = {
  annualTaxAmount: 1200,
  taxableMonths: 6,
  paymentsAlreadyMade: 100,
} satisfies Input;
export const exampleOutput = {
  proratedTax: 600,
  balanceDue: 500,
  overpayment: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualTaxAmount: input.annualTaxAmount as number,
      taxableMonths: input.taxableMonths as number,
      paymentsAlreadyMade: input.paymentsAlreadyMade as number,
    }),
  description:
    "Prorate a caller-supplied annual highway vehicle tax by taxable months.",
  id: "taxation/highway-vehicle-tax",
  inputs: [
    {
      id: "annualTaxAmount",
      label: "Full-year highway vehicle tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxableMonths",
      label: "Taxable months",
      kind: "integer",
      minimum: 0,
      maximum: 12,
    },
    {
      id: "paymentsAlreadyMade",
      label: "Payments already made",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "proratedTax",
      label: "Prorated vehicle tax",
      kind: "number",
      minimum: 0,
    },
    { id: "balanceDue", label: "Balance due", kind: "number", minimum: 0 },
    { id: "overpayment", label: "Overpayment", kind: "number", minimum: 0 },
  ],
  title: "Highway Vehicle Tax",
});

export const run = tool.execute;
export default tool;
