import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly promisedAt: number;
  readonly deliveredAt: number;
  readonly allowedEarly: number;
  readonly allowedLate: number;
};
export type Output = {
  readonly lateness: number;
  readonly sign: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promisedAt: { type: "number" },
    deliveredAt: { type: "number" },
    allowedEarly: { type: "number", minimum: 0 },
    allowedLate: { type: "number", minimum: 0 },
  },
  required: ["promisedAt", "deliveredAt", "allowedEarly", "allowedLate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lateness: { type: "number" },
    sign: { type: "integer" },
    withinWindow: { type: "boolean" },
  },
  required: ["lateness", "sign", "withinWindow"],
} as const;
/** Calculate supplier delivery lateness sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promisedAt, deliveredAt, allowedEarly, allowedLate } = request;
  const compute = (): Output => {
    H.domain(allowedEarly >= 0 && allowedLate >= 0);
    return {
      lateness: deliveredAt - promisedAt,
      sign: Math.sign(deliveredAt - promisedAt),
      withinWindow:
        deliveredAt >= promisedAt - allowedEarly &&
        deliveredAt <= promisedAt + allowedLate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { promisedAt: 10, deliveredAt: 12, allowedEarly: 1, allowedLate: 3 },
  output: { lateness: 2, sign: 1, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const supplierDeliveryLatenessSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/supplier-delivery-lateness-sign",
    title: "Supplier Delivery Lateness Sign Tool",
    description:
      "Calculate supplier delivery lateness sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promisedAt: { type: "number" },
        deliveredAt: { type: "number" },
        allowedEarly: { type: "number", minimum: 0 },
        allowedLate: { type: "number", minimum: 0 },
      },
      required: ["promisedAt", "deliveredAt", "allowedEarly", "allowedLate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lateness: { type: "number" },
        sign: { type: "integer" },
        withinWindow: { type: "boolean" },
      },
      required: ["lateness", "sign", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "promisedAt",
          label: "Promised At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveredAt",
          label: "Delivered At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedEarly",
          label: "Allowed Early",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedLate",
          label: "Allowed Late",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lateness", label: "Lateness", valueType: { type: "number" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = supplierDeliveryLatenessSignTool.execute;
export default supplierDeliveryLatenessSignTool;
