import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly price: number;
  readonly availability: number;
  readonly applyAvailability: boolean;
  readonly hours: number;
};
export type Output = {
  readonly settlementQuantity: number;
  readonly amount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", minimum: 0 },
    price: { type: "number" },
    availability: { type: "number", minimum: 0, maximum: 1 },
    applyAvailability: { type: "boolean" },
    hours: { type: "number", minimum: 0 },
  },
  required: ["capacity", "price", "availability", "applyAvailability", "hours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    settlementQuantity: { type: "number" },
    amount: { type: "number" },
  },
  required: ["settlementQuantity", "amount"],
} as const;
/** Calculate capacity price settlement base token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, price, availability, applyAvailability, hours } = request;
  const compute = (): Output => {
    H.domain(capacity >= 0 && hours >= 0);
    H.probability(availability);
    return {
      settlementQuantity:
        capacity * hours * (applyAvailability ? availability : 1),
      amount: capacity * hours * (applyAvailability ? availability : 1) * price,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    capacity: 10,
    price: 2,
    availability: 0.8,
    applyAvailability: true,
    hours: 5,
  },
  output: { settlementQuantity: 40, amount: 80 },
} satisfies ToolExample<Input, Output>;
export const capacityPriceSettlementBaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/capacity-price-settlement-base-token",
    title: "Capacity Price Settlement Base Token Tool",
    description:
      "Calculate capacity price settlement base token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number", minimum: 0 },
        price: { type: "number" },
        availability: { type: "number", minimum: 0, maximum: 1 },
        applyAvailability: { type: "boolean" },
        hours: { type: "number", minimum: 0 },
      },
      required: [
        "capacity",
        "price",
        "availability",
        "applyAvailability",
        "hours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        settlementQuantity: { type: "number" },
        amount: { type: "number" },
      },
      required: ["settlementQuantity", "amount"],
    },
    ports: {
      inputs: [
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availability",
          label: "Availability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "applyAvailability",
          label: "Apply Availability",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "settlementQuantity",
          label: "Settlement Quantity",
          valueType: { type: "number" },
        },
        { id: "amount", label: "Amount", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = capacityPriceSettlementBaseTokenTool.execute;
export default capacityPriceSettlementBaseTokenTool;
