import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly messageTime: number;
  readonly responseTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = {
  readonly elapsed: number;
  readonly responseBeforeMessage: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    messageTime: { type: "number" },
    responseTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["messageTime", "responseTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    responseBeforeMessage: { type: "boolean" },
  },
  required: ["elapsed", "responseBeforeMessage"],
} as const;
/** Compare supplied message/response clocks after an explicit response-clock offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { messageTime, responseTime, suppliedClockOffset } = request;
  const compute = (): Output => {
    return {
      elapsed: responseTime - suppliedClockOffset - messageTime,
      responseBeforeMessage: responseTime - suppliedClockOffset < messageTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { messageTime: 10, responseTime: 25, suppliedClockOffset: 2 },
  output: { elapsed: 13, responseBeforeMessage: false },
} satisfies ToolExample<Input, Output>;
export const messageResponseSpanTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "communication/message-response-span",
      title: "Message Response Span Tool",
      description:
        "Compare supplied message/response clocks after an explicit response-clock offset.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          messageTime: { type: "number" },
          responseTime: { type: "number" },
          suppliedClockOffset: { type: "number" },
        },
        required: ["messageTime", "responseTime", "suppliedClockOffset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsed: { type: "number" },
          responseBeforeMessage: { type: "boolean" },
        },
        required: ["elapsed", "responseBeforeMessage"],
      },
      ports: {
        inputs: [
          {
            id: "messageTime",
            label: "Message Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "responseTime",
            label: "Response Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedClockOffset",
            label: "Supplied Clock Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
          {
            id: "responseBeforeMessage",
            label: "Response Before Message",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = messageResponseSpanTool.execute;
export default messageResponseSpanTool;
