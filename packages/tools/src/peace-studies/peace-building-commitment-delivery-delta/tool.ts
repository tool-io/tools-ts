import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly committedAmount: number;
  readonly deliveredAmount: number;
};
export type Output = {
  readonly deliveryGap: number;
  readonly deliveredShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    committedAmount: { type: "number", exclusiveMinimum: 0 },
    deliveredAmount: { type: "number", minimum: 0 },
  },
  required: ["committedAmount", "deliveredAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveryGap: { type: "number" },
    deliveredShare: { type: "number" },
  },
  required: ["deliveryGap", "deliveredShare"],
} as const;
/** Compare recorded delivery with a positive peace-building commitment in one explicit common unit, preserving over-delivery. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { committedAmount, deliveredAmount } = request;
  const compute = (): Output => {
    (H.domain(committedAmount > 0, "committedAmount"), committedAmount);
    H.domain(deliveredAmount >= 0, "deliveredAmount");
    return {
      deliveryGap: committedAmount - deliveredAmount,
      deliveredShare: deliveredAmount / committedAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { committedAmount: 100, deliveredAmount: 70 },
  output: { deliveryGap: 30, deliveredShare: 0.7 },
} satisfies ToolExample<Input, Output>;
export const peaceBuildingCommitmentDeliveryDeltaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "peace-studies/peace-building-commitment-delivery-delta",
      title: "Peace Building Commitment Delivery Delta Tool",
      description:
        "Compare recorded delivery with a positive peace-building commitment in one explicit common unit, preserving over-delivery.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          committedAmount: { type: "number", exclusiveMinimum: 0 },
          deliveredAmount: { type: "number", minimum: 0 },
        },
        required: ["committedAmount", "deliveredAmount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deliveryGap: { type: "number" },
          deliveredShare: { type: "number" },
        },
        required: ["deliveryGap", "deliveredShare"],
      },
      ports: {
        inputs: [
          {
            id: "committedAmount",
            label: "Committed Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deliveredAmount",
            label: "Delivered Amount",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "deliveryGap",
            label: "Delivery Gap",
            valueType: { type: "number" },
          },
          {
            id: "deliveredShare",
            label: "Delivered Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = peaceBuildingCommitmentDeliveryDeltaTool.execute;
export default peaceBuildingCommitmentDeliveryDeltaTool;
