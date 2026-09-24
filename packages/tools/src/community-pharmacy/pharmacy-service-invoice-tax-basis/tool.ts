import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serviceNet: number;
  readonly taxableFraction: number;
  readonly taxRate: number;
  readonly discount: number;
  readonly discountBeforeTax: boolean;
};
export type Output = {
  readonly taxableBase: number;
  readonly tax: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceNet: { type: "number" },
    taxableFraction: { type: "number", minimum: 0, maximum: 1 },
    taxRate: { type: "number", minimum: 0 },
    discount: { type: "number", minimum: 0 },
    discountBeforeTax: { type: "boolean" },
  },
  required: [
    "serviceNet",
    "taxableFraction",
    "taxRate",
    "discount",
    "discountBeforeTax",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxableBase: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
  },
  required: ["taxableBase", "tax", "total"],
} as const;
/** Invoice arithmetic under an explicitly supplied tax base and discount order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serviceNet, taxableFraction, taxRate, discount, discountBeforeTax } =
    request;
  const compute = (): Output => {
    H.domain(serviceNet >= discount && discount >= 0 && taxRate >= 0);
    H.probability(taxableFraction);
    return {
      taxableBase:
        (serviceNet - (discountBeforeTax ? discount : 0)) * taxableFraction,
      tax:
        (serviceNet - (discountBeforeTax ? discount : 0)) *
        taxableFraction *
        taxRate,
      total:
        serviceNet -
        discount +
        (serviceNet - (discountBeforeTax ? discount : 0)) *
          taxableFraction *
          taxRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    serviceNet: 100,
    taxableFraction: 0.5,
    taxRate: 0.2,
    discount: 10,
    discountBeforeTax: true,
  },
  output: { taxableBase: 45, tax: 9, total: 99 },
} satisfies ToolExample<Input, Output>;
export const pharmacyServiceInvoiceTaxBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/pharmacy-service-invoice-tax-basis",
    title: "Pharmacy Service Invoice Tax Basis Tool",
    description:
      "Invoice arithmetic under an explicitly supplied tax base and discount order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceNet: { type: "number" },
        taxableFraction: { type: "number", minimum: 0, maximum: 1 },
        taxRate: { type: "number", minimum: 0 },
        discount: { type: "number", minimum: 0 },
        discountBeforeTax: { type: "boolean" },
      },
      required: [
        "serviceNet",
        "taxableFraction",
        "taxRate",
        "discount",
        "discountBeforeTax",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxableBase: { type: "number" },
        tax: { type: "number" },
        total: { type: "number" },
      },
      required: ["taxableBase", "tax", "total"],
    },
    ports: {
      inputs: [
        {
          id: "serviceNet",
          label: "Service Net",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxableFraction",
          label: "Taxable Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
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
          id: "discountBeforeTax",
          label: "Discount Before Tax",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "taxableBase",
          label: "Taxable Base",
          valueType: { type: "number" },
        },
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacyServiceInvoiceTaxBasisTool.execute;
export default pharmacyServiceInvoiceTaxBasisTool;
