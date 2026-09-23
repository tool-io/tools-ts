import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemValues: readonly number[];
  readonly returnValues: readonly number[];
  readonly shippingRevenue: number;
  readonly refundShipping: number;
};
export type Output = {
  readonly grossItems: number;
  readonly returnedItems: number;
  readonly netOrderValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemValues: { type: "array", maxItems: 256, items: { type: "number" } },
    returnValues: { type: "array", maxItems: 256, items: { type: "number" } },
    shippingRevenue: { type: "number", minimum: 0 },
    refundShipping: { type: "number", minimum: 0 },
  },
  required: ["itemValues", "returnValues", "shippingRevenue", "refundShipping"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossItems: { type: "number" },
    returnedItems: { type: "number" },
    netOrderValue: { type: "number" },
  },
  required: ["grossItems", "returnedItems", "netOrderValue"],
} as const;
/** Calculate order basket return net value from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemValues, returnValues, shippingRevenue, refundShipping } = request;
  const compute = (): Output => {
    H.domain(
      itemValues.every((x) => x >= 0) &&
        returnValues.every((x) => x >= 0) &&
        shippingRevenue >= 0 &&
        refundShipping >= 0,
    );
    return {
      grossItems: itemValues.reduce((a, b) => a + b, 0),
      returnedItems: returnValues.reduce((a, b) => a + b, 0),
      netOrderValue:
        itemValues.reduce((a, b) => a + b, 0) -
        returnValues.reduce((a, b) => a + b, 0) +
        shippingRevenue -
        refundShipping,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemValues: [20, 30],
    returnValues: [10],
    shippingRevenue: 5,
    refundShipping: 0,
  },
  output: { grossItems: 50, returnedItems: 10, netOrderValue: 45 },
} satisfies ToolExample<Input, Output>;
export const orderBasketReturnNetValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/order-basket-return-net-value",
    title: "Order Basket Return Net Value Tool",
    description:
      "Calculate order basket return net value from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemValues: { type: "array", maxItems: 256, items: { type: "number" } },
        returnValues: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        shippingRevenue: { type: "number", minimum: 0 },
        refundShipping: { type: "number", minimum: 0 },
      },
      required: [
        "itemValues",
        "returnValues",
        "shippingRevenue",
        "refundShipping",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossItems: { type: "number" },
        returnedItems: { type: "number" },
        netOrderValue: { type: "number" },
      },
      required: ["grossItems", "returnedItems", "netOrderValue"],
    },
    ports: {
      inputs: [
        {
          id: "itemValues",
          label: "Item Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "returnValues",
          label: "Return Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "shippingRevenue",
          label: "Shipping Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundShipping",
          label: "Refund Shipping",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossItems",
          label: "Gross Items",
          valueType: { type: "number" },
        },
        {
          id: "returnedItems",
          label: "Returned Items",
          valueType: { type: "number" },
        },
        {
          id: "netOrderValue",
          label: "Net Order Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orderBasketReturnNetValueTool.execute;
export default orderBasketReturnNetValueTool;
