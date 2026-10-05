import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTimestampSeconds: number;
  readonly notifiedTimestampSeconds: number;
};
export type Output = { readonly delaySeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTimestampSeconds: { type: "number" },
    notifiedTimestampSeconds: { type: "number" },
  },
  required: ["eventTimestampSeconds", "notifiedTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delaySeconds: { type: "number" } },
  required: ["delaySeconds"],
} as const;
/** Measure an ordered humanitarian event-to-notification interval on a shared timestamp scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTimestampSeconds, notifiedTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      notifiedTimestampSeconds >= eventTimestampSeconds,
      "notifiedTimestampSeconds",
    );
    return { delaySeconds: notifiedTimestampSeconds - eventTimestampSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTimestampSeconds: 1000, notifiedTimestampSeconds: 1120 },
  output: { delaySeconds: 120 },
} satisfies ToolExample<Input, Output>;
export const humanitarianNotificationDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/humanitarian-notification-delay",
    title: "Humanitarian Notification Delay Tool",
    description:
      "Measure an ordered humanitarian event-to-notification interval on a shared timestamp scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTimestampSeconds: { type: "number" },
        notifiedTimestampSeconds: { type: "number" },
      },
      required: ["eventTimestampSeconds", "notifiedTimestampSeconds"],
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
          id: "eventTimestampSeconds",
          label: "Event Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "notifiedTimestampSeconds",
          label: "Notified Timestamp Seconds",
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
});
export const run = humanitarianNotificationDelayTool.execute;
export default humanitarianNotificationDelayTool;
