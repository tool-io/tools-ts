import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly previousCompletedOrderCount: number };
export type Output = {
  readonly classification: string;
  readonly currentOrderOrdinal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { previousCompletedOrderCount: { type: "integer", minimum: 0 } },
  required: ["previousCompletedOrderCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classification: { type: "string", maxLength: 8192 },
    currentOrderOrdinal: { type: "integer" },
  },
  required: ["classification", "currentOrderOrdinal"],
} as const;
/** Classify a current order from an explicit count of prior completed orders, without resolving customer identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCompletedOrderCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousCompletedOrderCount) &&
        previousCompletedOrderCount >= 0 &&
        previousCompletedOrderCount <= Number.MAX_SAFE_INTEGER - 1,
      "previousCompletedOrderCount",
    ),
      previousCompletedOrderCount);
    return {
      classification: previousCompletedOrderCount === 0 ? "first" : "repeat",
      currentOrderOrdinal: previousCompletedOrderCount + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCompletedOrderCount: 0 },
  output: { classification: "first", currentOrderOrdinal: 1 },
} satisfies ToolExample<Input, Output>;
export const customerOrderFirstRepeatLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/customer-order-first-repeat-label",
    title: "Customer Order First Repeat Label",
    description:
      "Classify a current order from an explicit count of prior completed orders, without resolving customer identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCompletedOrderCount: { type: "integer", minimum: 0 },
      },
      required: ["previousCompletedOrderCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classification: { type: "string", maxLength: 8192 },
        currentOrderOrdinal: { type: "integer" },
      },
      required: ["classification", "currentOrderOrdinal"],
    },
    ports: {
      inputs: [
        {
          id: "previousCompletedOrderCount",
          label: "Previous Completed Order Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
        {
          id: "currentOrderOrdinal",
          label: "Current Order Ordinal",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = customerOrderFirstRepeatLabelTool.execute;
export default customerOrderFirstRepeatLabelTool;
