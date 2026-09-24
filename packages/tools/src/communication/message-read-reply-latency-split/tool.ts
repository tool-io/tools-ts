import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sent: number;
  readonly read: number;
  readonly replied: number;
};
export type Output = {
  readonly deliveryToRead: number;
  readonly readToReply: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sent: { type: "number" },
    read: { type: "number" },
    replied: { type: "number" },
  },
  required: ["sent", "read", "replied"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveryToRead: { type: "number" },
    readToReply: { type: "number" },
    total: { type: "number" },
  },
  required: ["deliveryToRead", "readToReply", "total"],
} as const;
/** Calculate message read reply latency split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sent, read, replied } = request;
  const compute = (): Output => {
    H.domain(sent <= read && read <= replied);
    return {
      deliveryToRead: read - sent,
      readToReply: replied - read,
      total: replied - sent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sent: 100, read: 130, replied: 180 },
  output: { deliveryToRead: 30, readToReply: 50, total: 80 },
} satisfies ToolExample<Input, Output>;
export const messageReadReplyLatencySplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/message-read-reply-latency-split",
    title: "Message Read Reply Latency Split Tool",
    description:
      "Calculate message read reply latency split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sent: { type: "number" },
        read: { type: "number" },
        replied: { type: "number" },
      },
      required: ["sent", "read", "replied"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveryToRead: { type: "number" },
        readToReply: { type: "number" },
        total: { type: "number" },
      },
      required: ["deliveryToRead", "readToReply", "total"],
    },
    ports: {
      inputs: [
        {
          id: "sent",
          label: "Sent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "read",
          label: "Read",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "replied",
          label: "Replied",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "deliveryToRead",
          label: "Delivery To Read",
          valueType: { type: "number" },
        },
        {
          id: "readToReply",
          label: "Read To Reply",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = messageReadReplyLatencySplitTool.execute;
export default messageReadReplyLatencySplitTool;
