import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly recordingOrigin: number;
  readonly suppliedClockShift: number;
};
export type Output = { readonly relativeTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    recordingOrigin: { type: "number" },
    suppliedClockShift: { type: "number" },
  },
  required: ["eventTime", "recordingOrigin", "suppliedClockShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeTime: { type: "number" } },
  required: ["relativeTime"],
} as const;
/** Normalize one supplied simulator/research waveform timestamp without patient monitoring guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, recordingOrigin, suppliedClockShift } = request;
  const compute = (): Output => {
    return { relativeTime: eventTime + suppliedClockShift - recordingOrigin };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 120, recordingOrigin: 100, suppliedClockShift: -5 },
  output: { relativeTime: 15 },
} satisfies ToolExample<Input, Output>;
export const waveformEventTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/waveform-event-time-offset",
    title: "Waveform Event Time Offset Tool",
    description:
      "Normalize one supplied simulator/research waveform timestamp without patient monitoring guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        recordingOrigin: { type: "number" },
        suppliedClockShift: { type: "number" },
      },
      required: ["eventTime", "recordingOrigin", "suppliedClockShift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeTime: { type: "number" } },
      required: ["relativeTime"],
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
          id: "suppliedClockShift",
          label: "Supplied Clock Shift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeTime",
          label: "Relative Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waveformEventTimeOffsetTool.execute;
export default waveformEventTimeOffsetTool;
