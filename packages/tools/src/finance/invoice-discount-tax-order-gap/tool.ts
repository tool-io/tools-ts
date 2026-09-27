import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: number;
  readonly discount: number;
  readonly tax: number;
};
export type Output = {
  readonly discountThenTax: number;
  readonly taxThenBaseDiscount: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "number" },
    discount: { type: "number", minimum: 0, maximum: 1 },
    tax: { type: "number", minimum: 0 },
  },
  required: ["base", "discount", "tax"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountThenTax: { type: "number" },
    taxThenBaseDiscount: { type: "number" },
    gap: { type: "number" },
  },
  required: ["discountThenTax", "taxThenBaseDiscount", "gap"],
} as const;
/** Compare tax on discounted base with tax on original base followed by a base-only discount; caller supplies all rates. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { base, discount, tax } = input;
  const compute = (): Output => {
    H.probability(discount);
    H.domain(tax >= 0);
    const a = base * (1 - discount) * (1 + tax),
      b = base * (1 + tax) - base * discount;
    return { discountThenTax: a, taxThenBaseDiscount: b, gap: b - a };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { base: 100, discount: 0.1, tax: 0.2 },
  output: { discountThenTax: 108, taxThenBaseDiscount: 110, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const invoiceDiscountTaxOrderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/invoice-discount-tax-order-gap",
    title: "Invoice Discount Tax Order Gap Tool",
    description:
      "Compare tax on discounted base with tax on original base followed by a base-only discount; caller supplies all rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "number" },
        discount: { type: "number", minimum: 0, maximum: 1 },
        tax: { type: "number", minimum: 0 },
      },
      required: ["base", "discount", "tax"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountThenTax: { type: "number" },
        taxThenBaseDiscount: { type: "number" },
        gap: { type: "number" },
      },
      required: ["discountThenTax", "taxThenBaseDiscount", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discount",
          label: "Discount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tax",
          label: "Tax",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "discountThenTax",
          label: "Discount Then Tax",
          valueType: { type: "number" },
        },
        {
          id: "taxThenBaseDiscount",
          label: "Tax Then Base Discount",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = invoiceDiscountTaxOrderGapTool.execute;
export default invoiceDiscountTaxOrderGapTool;
