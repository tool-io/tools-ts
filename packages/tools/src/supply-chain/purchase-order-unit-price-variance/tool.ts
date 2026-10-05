import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedUnitPrice: number;
  readonly invoicedUnitPrice: number;
  readonly quantity: number;
};
export type Output = {
  readonly unitVariance: number;
  readonly totalVariance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedUnitPrice: { type: "number", minimum: 0 },
    invoicedUnitPrice: { type: "number", minimum: 0 },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["orderedUnitPrice", "invoicedUnitPrice", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitVariance: { type: "number" },
    totalVariance: { type: "number" },
  },
  required: ["unitVariance", "totalVariance"],
} as const;
/** Measure invoice-minus-order price variance for a common unit, currency and quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedUnitPrice, invoicedUnitPrice, quantity } = request;
  const compute = (): Output => {
    H.domain(
      orderedUnitPrice >= 0 && invoicedUnitPrice >= 0 && quantity >= 0,
      "orderedUnitPrice",
    );
    return {
      unitVariance: invoicedUnitPrice - orderedUnitPrice,
      totalVariance: (invoicedUnitPrice - orderedUnitPrice) * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderedUnitPrice: 8, invoicedUnitPrice: 8.5, quantity: 20 },
  output: { unitVariance: 0.5, totalVariance: 10 },
} satisfies ToolExample<Input, Output>;
export const purchaseOrderUnitPriceVarianceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/purchase-order-unit-price-variance",
    title: "Purchase Order Unit Price Variance Tool",
    description:
      "Measure invoice-minus-order price variance for a common unit, currency and quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedUnitPrice: { type: "number", minimum: 0 },
        invoicedUnitPrice: { type: "number", minimum: 0 },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["orderedUnitPrice", "invoicedUnitPrice", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitVariance: { type: "number" },
        totalVariance: { type: "number" },
      },
      required: ["unitVariance", "totalVariance"],
    },
    ports: {
      inputs: [
        {
          id: "orderedUnitPrice",
          label: "Ordered Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "invoicedUnitPrice",
          label: "Invoiced Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unitVariance",
          label: "Unit Variance",
          valueType: { type: "number" },
        },
        {
          id: "totalVariance",
          label: "Total Variance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purchaseOrderUnitPriceVarianceTool.execute;
export default purchaseOrderUnitPriceVarianceTool;
