import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sentTime: number;
  readonly deliveredTime: number;
  readonly acknowledgedTime: number;
};
export type Output = {
  readonly deliveryDelay: number;
  readonly acknowledgementDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sentTime: { type: "number" },
    deliveredTime: { type: "number" },
    acknowledgedTime: { type: "number" },
  },
  required: ["sentTime", "deliveredTime", "acknowledgedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveryDelay: { type: "number" },
    acknowledgementDelay: { type: "number" },
  },
  required: ["deliveryDelay", "acknowledgementDelay"],
} as const;
/** Calculate channel delivery acknowledgement delay from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sentTime, deliveredTime, acknowledgedTime } = request;
  const compute = (): Output => {
    H.domain(sentTime <= deliveredTime && deliveredTime <= acknowledgedTime);
    return {
      deliveryDelay: deliveredTime - sentTime,
      acknowledgementDelay: acknowledgedTime - deliveredTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sentTime: 100, deliveredTime: 102, acknowledgedTime: 107 },
  output: { deliveryDelay: 2, acknowledgementDelay: 5 },
} satisfies ToolExample<Input, Output>;
export const channelDeliveryAcknowledgementDelayTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "communication/channel-delivery-acknowledgement-delay",
      title: "Channel Delivery Acknowledgement Delay Tool",
      description:
        "Calculate channel delivery acknowledgement delay from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sentTime: { type: "number" },
          deliveredTime: { type: "number" },
          acknowledgedTime: { type: "number" },
        },
        required: ["sentTime", "deliveredTime", "acknowledgedTime"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deliveryDelay: { type: "number" },
          acknowledgementDelay: { type: "number" },
        },
        required: ["deliveryDelay", "acknowledgementDelay"],
      },
      ports: {
        inputs: [
          {
            id: "sentTime",
            label: "Sent Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deliveredTime",
            label: "Delivered Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "acknowledgedTime",
            label: "Acknowledged Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "deliveryDelay",
            label: "Delivery Delay",
            valueType: { type: "number" },
          },
          {
            id: "acknowledgementDelay",
            label: "Acknowledgement Delay",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = channelDeliveryAcknowledgementDelayTool.execute;
export default channelDeliveryAcknowledgementDelayTool;
