import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingTimestamp: number;
  readonly suppliedOffset: number;
};
export type Output = { readonly hearingTimestamp: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingTimestamp: { type: "number" },
    suppliedOffset: { type: "number" },
  },
  required: ["recordingTimestamp", "suppliedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hearingTimestamp: { type: "number" } },
  required: ["hearingTimestamp"],
} as const;
/** Apply an explicit signed hearing-record clock offset in the same unit without altering audio or inferring synchronization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingTimestamp, suppliedOffset } = request;
  const compute = (): Output => {
    return { hearingTimestamp: recordingTimestamp + suppliedOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordingTimestamp: 12, suppliedOffset: 3 },
  output: { hearingTimestamp: 15 },
} satisfies ToolExample<Input, Output>;
export const hearingRecordAudioTimestampOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/hearing-record-audio-timestamp-offset",
    title: "Hearing Record Audio Timestamp Offset",
    description:
      "Apply an explicit signed hearing-record clock offset in the same unit without altering audio or inferring synchronization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordingTimestamp: { type: "number" },
        suppliedOffset: { type: "number" },
      },
      required: ["recordingTimestamp", "suppliedOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { hearingTimestamp: { type: "number" } },
      required: ["hearingTimestamp"],
    },
    ports: {
      inputs: [
        {
          id: "recordingTimestamp",
          label: "Recording Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "hearingTimestamp",
          label: "Hearing Timestamp",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hearingRecordAudioTimestampOffsetTool.execute;
export default hearingRecordAudioTimestampOffsetTool;
