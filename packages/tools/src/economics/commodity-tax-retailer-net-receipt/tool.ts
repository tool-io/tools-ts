import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consumerPaymentPerUnit: number;
  readonly suppliedTaxPerUnit: number;
};
export type Output = { readonly retailerNetReceiptPerUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumerPaymentPerUnit: { type: "number" },
    suppliedTaxPerUnit: { type: "number" },
  },
  required: ["consumerPaymentPerUnit", "suppliedTaxPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retailerNetReceiptPerUnit: { type: "number" } },
  required: ["retailerNetReceiptPerUnit"],
} as const;
/** Subtract an explicit signed per-unit commodity tax from consumer payment without deciding incidence or legal tax treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { consumerPaymentPerUnit, suppliedTaxPerUnit } = request;
  const compute = (): Output => {
    return {
      retailerNetReceiptPerUnit: consumerPaymentPerUnit - suppliedTaxPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { consumerPaymentPerUnit: 12, suppliedTaxPerUnit: 2 },
  output: { retailerNetReceiptPerUnit: 10 },
} satisfies ToolExample<Input, Output>;
export const commodityTaxRetailerNetReceiptTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economics"],
      keywords: ["economics"],
    },
    id: "economics/commodity-tax-retailer-net-receipt",
    title: "Commodity Tax Retailer Net Receipt",
    description:
      "Subtract an explicit signed per-unit commodity tax from consumer payment without deciding incidence or legal tax treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumerPaymentPerUnit: { type: "number" },
        suppliedTaxPerUnit: { type: "number" },
      },
      required: ["consumerPaymentPerUnit", "suppliedTaxPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { retailerNetReceiptPerUnit: { type: "number" } },
      required: ["retailerNetReceiptPerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "consumerPaymentPerUnit",
          label: "Consumer Payment Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTaxPerUnit",
          label: "Supplied Tax Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retailerNetReceiptPerUnit",
          label: "Retailer Net Receipt Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = commodityTaxRetailerNetReceiptTool.execute;
export default commodityTaxRetailerNetReceiptTool;
