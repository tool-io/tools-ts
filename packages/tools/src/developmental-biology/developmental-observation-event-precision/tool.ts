import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventCode: string;
  readonly timeText: string;
  readonly precision: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventCode: { type: "string", maxLength: 8192, minLength: 1 },
    timeText: { type: "string", maxLength: 8192, minLength: 1 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["second", "minute", "hour", "day", "interval", "unknown"],
    },
  },
  required: ["eventCode", "timeText", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit developmental-observation timing precision without estimating an event time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventCode, timeText, precision } = request;
  const compute = (): Output => {
    H.domain(eventCode.length > 0 && timeText.length > 0, "eventCode");
    H.domain(
      ["second", "minute", "hour", "day", "interval", "unknown"].includes(
        precision,
      ),
      "precision",
    );
    return {
      label:
        eventCode +
        "; time=" +
        JSON.stringify(timeText) +
        "; precision=" +
        precision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventCode: "E17", timeText: "12–14 h", precision: "interval" },
  output: { label: 'E17; time="12–14 h"; precision=interval' },
} satisfies ToolExample<Input, Output>;
export const developmentalObservationEventPrecisionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["developmental-biology", "developmental biology", "biology"],
        keywords: ["developmental biology", "biology"],
      },
      id: "developmental-biology/developmental-observation-event-precision",
      title: "Developmental Observation Event Precision",
      description:
        "Label explicit developmental-observation timing precision without estimating an event time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eventCode: { type: "string", maxLength: 8192, minLength: 1 },
          timeText: { type: "string", maxLength: 8192, minLength: 1 },
          precision: {
            type: "string",
            maxLength: 8192,
            enum: ["second", "minute", "hour", "day", "interval", "unknown"],
          },
        },
        required: ["eventCode", "timeText", "precision"],
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
            id: "timeText",
            label: "Time Text",
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
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = developmentalObservationEventPrecisionTool.execute;
export default developmentalObservationEventPrecisionTool;
