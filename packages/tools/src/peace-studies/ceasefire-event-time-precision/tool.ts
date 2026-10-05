import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventCode: string;
  readonly timestampText: string;
  readonly precision: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventCode: { type: "string", maxLength: 8192 },
    timestampText: { type: "string", maxLength: 8192 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["second", "minute", "hour", "day", "approximate", "unknown"],
    },
  },
  required: ["eventCode", "timestampText", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit precision annotation to a public ceasefire-event timestamp transcription without establishing when an event occurred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventCode, timestampText, precision } = request;
  const compute = (): Output => {
    H.domain(eventCode.length > 0 && timestampText.length > 0, "eventCode");
    H.domain(
      ["second", "minute", "hour", "day", "approximate", "unknown"].includes(
        precision,
      ),
      "precision",
    );
    return {
      label:
        eventCode +
        "; time=" +
        JSON.stringify(timestampText) +
        "; precision=" +
        precision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventCode: "E17",
    timestampText: "2026-10-01 12:00",
    precision: "minute",
  },
  output: { label: 'E17; time="2026-10-01 12:00"; precision=minute' },
} satisfies ToolExample<Input, Output>;
export const ceasefireEventTimePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/ceasefire-event-time-precision",
    title: "Ceasefire Event Time Precision Tool",
    description:
      "Attach an explicit precision annotation to a public ceasefire-event timestamp transcription without establishing when an event occurred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventCode: { type: "string", maxLength: 8192 },
        timestampText: { type: "string", maxLength: 8192 },
        precision: {
          type: "string",
          maxLength: 8192,
          enum: ["second", "minute", "hour", "day", "approximate", "unknown"],
        },
      },
      required: ["eventCode", "timestampText", "precision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "eventCode",
          label: "Event Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timestampText",
          label: "Timestamp Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precision",
          label: "Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ceasefireEventTimePrecisionTool.execute;
export default ceasefireEventTimePrecisionTool;
