import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sentTimestampSeconds: number;
  readonly acknowledgedTimestampSeconds: number;
};
export type Output = {
  readonly acknowledgmentLagSeconds: number;
  readonly precedesSend: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sentTimestampSeconds: { type: "number" },
    acknowledgedTimestampSeconds: { type: "number" },
  },
  required: ["sentTimestampSeconds", "acknowledgedTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acknowledgmentLagSeconds: { type: "number" },
    precedesSend: { type: "boolean" },
  },
  required: ["acknowledgmentLagSeconds", "precedesSend"],
} as const;
/** Compare explicit anesthesia handoff send and acknowledgment times without inferring successful care transfer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sentTimestampSeconds, acknowledgedTimestampSeconds } = request;
  const compute = (): Output => {
    return {
      acknowledgmentLagSeconds:
        acknowledgedTimestampSeconds - sentTimestampSeconds,
      precedesSend: acknowledgedTimestampSeconds < sentTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sentTimestampSeconds: 100, acknowledgedTimestampSeconds: 112 },
  output: { acknowledgmentLagSeconds: 12, precedesSend: false },
} satisfies ToolExample<Input, Output>;
export const anesthesiaHandoffAcknowledgmentTimeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["anesthesiology", "health and medicine"],
        keywords: ["anesthesiology", "health and medicine"],
      },
      id: "anesthesiology/anesthesia-handoff-acknowledgment-time",
      title: "Anesthesia Handoff Acknowledgment Time",
      description:
        "Compare explicit anesthesia handoff send and acknowledgment times without inferring successful care transfer.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sentTimestampSeconds: { type: "number" },
          acknowledgedTimestampSeconds: { type: "number" },
        },
        required: ["sentTimestampSeconds", "acknowledgedTimestampSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          acknowledgmentLagSeconds: { type: "number" },
          precedesSend: { type: "boolean" },
        },
        required: ["acknowledgmentLagSeconds", "precedesSend"],
      },
      ports: {
        inputs: [
          {
            id: "sentTimestampSeconds",
            label: "Sent Timestamp Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "acknowledgedTimestampSeconds",
            label: "Acknowledged Timestamp Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "acknowledgmentLagSeconds",
            label: "Acknowledgment Lag Seconds",
            valueType: { type: "number" },
          },
          {
            id: "precedesSend",
            label: "Precedes Send",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = anesthesiaHandoffAcknowledgmentTimeTool.execute;
export default anesthesiaHandoffAcknowledgmentTimeTool;
