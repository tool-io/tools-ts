import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PropertyTaxInput = Readonly<{
  readonly assessedValue: number;
  readonly annualRatePercent: number;
}>;
export type PropertyTaxOutput = Readonly<{
  readonly annualTax: number;
}>;

export const calculatePropertyTax = (
  x: PropertyTaxInput,
): PropertyTaxOutput => {
  if (!Number.isFinite(x.assessedValue) || x.assessedValue < 0)
    simpleError("assessedValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.annualRatePercent) || x.annualRatePercent < 0)
    simpleError("annualRatePercent", "Provide a finite nonnegative number.");
  const annualTax = (x.assessedValue * x.annualRatePercent) / 100;
  if (!Number.isFinite(annualTax))
    simpleError(
      "annualTax",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { annualTax: Object.is(annualTax, -0) ? 0 : annualTax };
};

export const example = {
  input: {
    assessedValue: 200000,
    annualRatePercent: 1,
  },
  output: { annualTax: 2000 },
} satisfies ToolExample<PropertyTaxInput, PropertyTaxOutput>;

export const tool = createSimpleTool({
  id: "real-estate/property-tax",
  title: "Property Tax",
  description:
    "Annual property tax arithmetic from assessed value and user-supplied annual effective rate.",
  inputs: [
    {
      id: "assessedValue",
      kind: "number",
      label: "Assessed Value",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "annualRatePercent",
      kind: "number",
      label: "Annual Rate Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "annualTax", kind: "number", label: "Annual Tax", unit: "currency" },
  ],
  calculate: (input) =>
    calculatePropertyTax({
      assessedValue: input.assessedValue as number,
      annualRatePercent: input.annualRatePercent as number,
    }),
});
export const propertyTaxTool = tool;
export const runPropertyTax = tool.execute;
export default tool;
