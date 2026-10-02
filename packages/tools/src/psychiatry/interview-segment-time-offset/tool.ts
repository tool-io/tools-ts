import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentTime: number;
  readonly recordingOrigin: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly recordingTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentTime: { type: "number" },
    recordingOrigin: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["segmentTime", "recordingOrigin", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordingTime: { type: "number" } },
  required: ["recordingTime"],
} as const;
/** Translate a supplied interview segment timestamp without interpreting interview content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentTime, recordingOrigin, suppliedClockOffset } = request;
  const compute = (): Output => {
    return {
      recordingTime: recordingOrigin + segmentTime - suppliedClockOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentTime: 30, recordingOrigin: 100, suppliedClockOffset: 5 },
  output: { recordingTime: 125 },
} satisfies ToolExample<Input, Output>;
export const interviewSegmentTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/interview-segment-time-offset",
    title: "Interview Segment Time Offset Tool",
    description:
      "Translate a supplied interview segment timestamp without interpreting interview content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentTime: { type: "number" },
        recordingOrigin: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["segmentTime", "recordingOrigin", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordingTime: { type: "number" } },
      required: ["recordingTime"],
    },
    ports: {
      inputs: [
        {
          id: "segmentTime",
          label: "Segment Time",
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
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordingTime",
          label: "Recording Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = interviewSegmentTimeOffsetTool.execute;
export default interviewSegmentTimeOffsetTool;
