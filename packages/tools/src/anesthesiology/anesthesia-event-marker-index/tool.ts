import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly recordingOrigin: number;
  readonly sampleRate: number;
};
export type Output = {
  readonly nearestIndex: number;
  readonly errorTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    recordingOrigin: { type: "number" },
    sampleRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eventTime", "recordingOrigin", "sampleRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearestIndex: { type: "integer" },
    errorTime: { type: "number" },
  },
  required: ["nearestIndex", "errorTime"],
} as const;
/** Map a supplied retrospective research event to its nearest sample under explicit clock metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, recordingOrigin, sampleRate } = request;
  const compute = (): Output => {
    H.positive(sampleRate);
    return {
      nearestIndex: Math.round((eventTime - recordingOrigin) * sampleRate),
      errorTime:
        Math.round((eventTime - recordingOrigin) * sampleRate) / sampleRate -
        (eventTime - recordingOrigin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 10.25, recordingOrigin: 10, sampleRate: 4 },
  output: { nearestIndex: 1, errorTime: 0 },
} satisfies ToolExample<Input, Output>;
export const anesthesiaEventMarkerIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/anesthesia-event-marker-index",
    title: "Anesthesia Event Marker Index Tool",
    description:
      "Map a supplied retrospective research event to its nearest sample under explicit clock metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        recordingOrigin: { type: "number" },
        sampleRate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eventTime", "recordingOrigin", "sampleRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nearestIndex: { type: "integer" },
        errorTime: { type: "number" },
      },
      required: ["nearestIndex", "errorTime"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordingOrigin",
          label: "Recording Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleRate",
          label: "Sample Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nearestIndex",
          label: "Nearest Index",
          valueType: { type: "integer" },
        },
        { id: "errorTime", label: "Error Time", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaEventMarkerIndexTool.execute;
export default anesthesiaEventMarkerIndexTool;
