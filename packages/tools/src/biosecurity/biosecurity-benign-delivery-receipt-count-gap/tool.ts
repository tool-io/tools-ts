import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispatched: number;
  readonly received: number;
  readonly returned: number;
  readonly damagedReceived: number;
};
export type Output = {
  readonly inTransit: number;
  readonly usableReceived: number;
  readonly receivedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispatched: { type: "integer", minimum: 1 },
    received: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    damagedReceived: { type: "integer", minimum: 0 },
  },
  required: ["dispatched", "received", "returned", "damagedReceived"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inTransit: { type: "integer" },
    usableReceived: { type: "integer" },
    receivedShare: { type: "number" },
  },
  required: ["inTransit", "usableReceived", "receivedShare"],
} as const;
/** Reconcile supplied benign delivery counts without sensitive inventory content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispatched, received, returned, damagedReceived } = request;
  const compute = (): Output => {
    H.integer(dispatched, 1);
    H.integer(received, 0, dispatched);
    H.integer(returned, 0, dispatched - received);
    H.integer(damagedReceived, 0, received);
    return {
      inTransit: dispatched - received - returned,
      usableReceived: received - damagedReceived,
      receivedShare: received / dispatched,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispatched: 100, received: 80, returned: 5, damagedReceived: 3 },
  output: { inTransit: 15, usableReceived: 77, receivedShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const biosecurityBenignDeliveryReceiptCountGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-benign-delivery-receipt-count-gap",
      title: "Biosecurity Benign Delivery Receipt Count Gap Tool",
      description:
        "Reconcile supplied benign delivery counts without sensitive inventory content.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dispatched: { type: "integer", minimum: 1 },
          received: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          damagedReceived: { type: "integer", minimum: 0 },
        },
        required: ["dispatched", "received", "returned", "damagedReceived"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inTransit: { type: "integer" },
          usableReceived: { type: "integer" },
          receivedShare: { type: "number" },
        },
        required: ["inTransit", "usableReceived", "receivedShare"],
      },
      ports: {
        inputs: [
          {
            id: "dispatched",
            label: "Dispatched",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "received",
            label: "Received",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "damagedReceived",
            label: "Damaged Received",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "inTransit",
            label: "In Transit",
            valueType: { type: "integer" },
          },
          {
            id: "usableReceived",
            label: "Usable Received",
            valueType: { type: "integer" },
          },
          {
            id: "receivedShare",
            label: "Received Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityBenignDeliveryReceiptCountGapTool.execute;
export default biosecurityBenignDeliveryReceiptCountGapTool;
