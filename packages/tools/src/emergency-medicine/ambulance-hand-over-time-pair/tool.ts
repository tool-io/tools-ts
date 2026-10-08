import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalTimestampSeconds: number;
  readonly handoverTimestampSeconds: number;
};
export type Output = { readonly handoverIntervalSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalTimestampSeconds: { type: "number" },
    handoverTimestampSeconds: { type: "number" },
  },
  required: ["arrivalTimestampSeconds", "handoverTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { handoverIntervalSeconds: { type: "number" } },
  required: ["handoverIntervalSeconds"],
} as const;
/** Measure a recorded ambulance arrival-to-handover interval without interpreting clinical urgency or selecting a service target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalTimestampSeconds, handoverTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      handoverTimestampSeconds >= arrivalTimestampSeconds,
      "handoverTimestampSeconds",
    );
    return {
      handoverIntervalSeconds:
        handoverTimestampSeconds - arrivalTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrivalTimestampSeconds: 1000, handoverTimestampSeconds: 1600 },
  output: { handoverIntervalSeconds: 600 },
} satisfies ToolExample<Input, Output>;
export const ambulanceHandOverTimePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "emergency-medicine",
        "emergency medicine",
        "health and medicine",
      ],
      keywords: ["emergency medicine", "health and medicine"],
    },
    id: "emergency-medicine/ambulance-hand-over-time-pair",
    title: "Ambulance Hand Over Time Pair",
    description:
      "Measure a recorded ambulance arrival-to-handover interval without interpreting clinical urgency or selecting a service target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalTimestampSeconds: { type: "number" },
        handoverTimestampSeconds: { type: "number" },
      },
      required: ["arrivalTimestampSeconds", "handoverTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { handoverIntervalSeconds: { type: "number" } },
      required: ["handoverIntervalSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalTimestampSeconds",
          label: "Arrival Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "handoverTimestampSeconds",
          label: "Handover Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "handoverIntervalSeconds",
          label: "Handover Interval Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ambulanceHandOverTimePairTool.execute;
export default ambulanceHandOverTimePairTool;
