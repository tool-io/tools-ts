import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MillRateTaxInput = Readonly<{
  readonly taxableAssessedValue: number;
  readonly millRate: number;
}>;
export type MillRateTaxOutput = Readonly<{
  readonly annualTax: number;
}>;

export const calculateMillRateTax = (
  x: MillRateTaxInput,
): MillRateTaxOutput => {
  if (!Number.isFinite(x.taxableAssessedValue) || x.taxableAssessedValue < 0)
    simpleError("taxableAssessedValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.millRate) || x.millRate < 0)
    simpleError("millRate", "Provide a finite nonnegative number.");
  const annualTax = (x.taxableAssessedValue * x.millRate) / 1000;
  if (!Number.isFinite(annualTax))
    simpleError(
      "annualTax",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { annualTax: Object.is(annualTax, -0) ? 0 : annualTax };
};

export const example = {
  input: {
    taxableAssessedValue: 200000,
    millRate: 20,
  },
  output: { annualTax: 4000 },
} satisfies ToolExample<MillRateTaxInput, MillRateTaxOutput>;

export const tool = createSimpleTool({
  id: "real-estate/mill-rate-tax",
  title: "Mill Rate Tax",
  description:
    "Annual property tax from taxable assessed value and mills per thousand currency units.",
  inputs: [
    {
      id: "taxableAssessedValue",
      kind: "number",
      label: "Taxable Assessed Value",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "millRate",
      kind: "number",
      label: "Mill Rate",
      unit: "mills",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "annualTax", kind: "number", label: "Annual Tax", unit: "currency" },
  ],
  calculate: (input) =>
    calculateMillRateTax({
      taxableAssessedValue: input.taxableAssessedValue as number,
      millRate: input.millRate as number,
    }),
});
export const millRateTaxTool = tool;
export const runMillRateTax = tool.execute;
export default tool;
