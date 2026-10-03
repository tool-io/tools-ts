import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstExpiry: string;
  readonly secondExpiry: string;
  readonly firstReceipt: number;
  readonly secondReceipt: number;
};
export type Output = { readonly order: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstExpiry: { type: "string", maxLength: 8192 },
    secondExpiry: { type: "string", maxLength: 8192 },
    firstReceipt: { type: "integer" },
    secondReceipt: { type: "integer" },
  },
  required: ["firstExpiry", "secondExpiry", "firstReceipt", "secondReceipt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { order: { type: "integer" } },
  required: ["order"],
} as const;
/** Order expiry dates ascending, breaking equal-date ties by explicit receipt sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstExpiry, secondExpiry, firstReceipt, secondReceipt } = request;
  const compute = (): Output => {
    const first = H.dateOnly(firstExpiry).getTime(),
      second = H.dateOnly(secondExpiry).getTime();
    return {
      order:
        Math.sign(first - second) || Math.sign(firstReceipt - secondReceipt),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstExpiry: "2026-11-01",
    secondExpiry: "2026-12-01",
    firstReceipt: 20,
    secondReceipt: 10,
  },
  output: { order: -1 },
} satisfies ToolExample<Input, Output>;
export const lotExpiryFirstOutOrderPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/lot-expiry-first-out-order-pair",
    title: "Lot Expiry First Out Order Pair Tool",
    description:
      "Order expiry dates ascending, breaking equal-date ties by explicit receipt sequence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstExpiry: { type: "string", maxLength: 8192 },
        secondExpiry: { type: "string", maxLength: 8192 },
        firstReceipt: { type: "integer" },
        secondReceipt: { type: "integer" },
      },
      required: [
        "firstExpiry",
        "secondExpiry",
        "firstReceipt",
        "secondReceipt",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { order: { type: "integer" } },
      required: ["order"],
    },
    ports: {
      inputs: [
        {
          id: "firstExpiry",
          label: "First Expiry",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondExpiry",
          label: "Second Expiry",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstReceipt",
          label: "First Receipt",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondReceipt",
          label: "Second Receipt",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "order", label: "Order", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = lotExpiryFirstOutOrderPairTool.execute;
export default lotExpiryFirstOutOrderPairTool;
