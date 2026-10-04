import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sentTimeSeconds: number;
  readonly acknowledgedTimeSeconds: number;
};
export type Output = { readonly delaySeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sentTimeSeconds: { type: "number" },
    acknowledgedTimeSeconds: { type: "number" },
  },
  required: ["sentTimeSeconds", "acknowledgedTimeSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delaySeconds: { type: "number" } },
  required: ["delaySeconds"],
} as const;
/** Compute acknowledgement delay for an ordered message/acknowledgement pair on the same clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sentTimeSeconds, acknowledgedTimeSeconds } = request;
  const compute = (): Output => {
    H.domain(
      acknowledgedTimeSeconds >= sentTimeSeconds,
      "acknowledgedTimeSeconds",
    );
    return { delaySeconds: acknowledgedTimeSeconds - sentTimeSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sentTimeSeconds: 100, acknowledgedTimeSeconds: 112 },
  output: { delaySeconds: 12 },
} satisfies ToolExample<Input, Output>;
export const messageAckDelayPairTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "communication/message-ack-delay-pair",
      title: "Message Ack Delay Pair Tool",
      description:
        "Compute acknowledgement delay for an ordered message/acknowledgement pair on the same clock.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sentTimeSeconds: { type: "number" },
          acknowledgedTimeSeconds: { type: "number" },
        },
        required: ["sentTimeSeconds", "acknowledgedTimeSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { delaySeconds: { type: "number" } },
        required: ["delaySeconds"],
      },
      ports: {
        inputs: [
          {
            id: "sentTimeSeconds",
            label: "Sent Time Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "acknowledgedTimeSeconds",
            label: "Acknowledged Time Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "delaySeconds",
            label: "Delay Seconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = messageAckDelayPairTool.execute;
export default messageAckDelayPairTool;
