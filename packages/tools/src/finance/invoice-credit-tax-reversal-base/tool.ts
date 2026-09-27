import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly creditGross: number; readonly taxRate: number };
export type Output = {
  readonly netCredit: number;
  readonly reversedTax: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditGross: { type: "number" },
    taxRate: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["creditGross", "taxRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCredit: { type: "number" },
    reversedTax: { type: "number" },
  },
  required: ["netCredit", "reversedTax"],
} as const;
/** Split a signed tax-inclusive credit into its net amount and tax at an explicit uniform rate. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { creditGross, taxRate } = input;
  const compute = (): Output => {
    H.domain(taxRate > -1);
    const netCredit = creditGross / (1 + taxRate);
    return { netCredit, reversedTax: creditGross - netCredit };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { creditGross: 120, taxRate: 0.2 },
  output: { netCredit: 100, reversedTax: 20 },
} satisfies ToolExample<Input, Output>;
export const invoiceCreditTaxReversalBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/invoice-credit-tax-reversal-base",
    title: "Invoice Credit Tax Reversal Base Tool",
    description:
      "Split a signed tax-inclusive credit into its net amount and tax at an explicit uniform rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditGross: { type: "number" },
        taxRate: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["creditGross", "taxRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netCredit: { type: "number" },
        reversedTax: { type: "number" },
      },
      required: ["netCredit", "reversedTax"],
    },
    ports: {
      inputs: [
        {
          id: "creditGross",
          label: "Credit Gross",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netCredit", label: "Net Credit", valueType: { type: "number" } },
        {
          id: "reversedTax",
          label: "Reversed Tax",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = invoiceCreditTaxReversalBaseTool.execute;
export default invoiceCreditTaxReversalBaseTool;
