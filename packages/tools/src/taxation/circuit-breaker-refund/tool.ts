import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly householdIncome: number;
  readonly propertyTaxPaid: number;
  readonly incomeThresholdPercent: number;
  readonly refundCap: number;
}>;
export type Output = Readonly<{
  readonly thresholdTax: number;
  readonly excessPropertyTax: number;
  readonly refund: number;
}>;

export const calculate = (input: Input): Output => {
  const thresholdTax =
    (input.householdIncome * input.incomeThresholdPercent) / 100;
  const excessPropertyTax = Math.max(0, input.propertyTaxPaid - thresholdTax);
  return {
    thresholdTax,
    excessPropertyTax,
    refund: Math.min(excessPropertyTax, input.refundCap),
  };
};

export const exampleInput = {
  householdIncome: 50000,
  propertyTaxPaid: 3000,
  incomeThresholdPercent: 5,
  refundCap: 1000,
} satisfies Input;
export const exampleOutput = {
  thresholdTax: 2500,
  excessPropertyTax: 500,
  refund: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      householdIncome: input.householdIncome as number,
      propertyTaxPaid: input.propertyTaxPaid as number,
      incomeThresholdPercent: input.incomeThresholdPercent as number,
      refundCap: input.refundCap as number,
    }),
  description:
    "Calculate a property-tax circuit-breaker refund using supplied threshold and cap.",
  id: "taxation/circuit-breaker-refund",
  inputs: [
    {
      id: "householdIncome",
      label: "Household income",
      kind: "number",
      minimum: 0,
    },
    {
      id: "propertyTaxPaid",
      label: "Property tax paid",
      kind: "number",
      minimum: 0,
    },
    {
      id: "incomeThresholdPercent",
      label: "Tax-to-income threshold",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "refundCap", label: "Refund cap", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "thresholdTax",
      label: "Threshold property tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "excessPropertyTax",
      label: "Tax above threshold",
      kind: "number",
      minimum: 0,
    },
    {
      id: "refund",
      label: "Circuit-breaker refund",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Circuit-Breaker Refund",
});

export const run = tool.execute;
export default tool;
