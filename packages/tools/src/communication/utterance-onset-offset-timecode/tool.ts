import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utteranceId: string;
  readonly onsetSeconds: number;
  readonly offsetSeconds: number;
};
export type Output = {
  readonly durationSeconds: number;
  readonly timecodeToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utteranceId: { type: "string", maxLength: 8192, minLength: 1 },
    onsetSeconds: { type: "number" },
    offsetSeconds: { type: "number" },
  },
  required: ["utteranceId", "onsetSeconds", "offsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationSeconds: { type: "number" },
    timecodeToken: { type: "string", maxLength: 8192 },
  },
  required: ["durationSeconds", "timecodeToken"],
} as const;
/** Qualify explicit utterance onset and offset markers and their elapsed duration without detecting speech boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { utteranceId, onsetSeconds, offsetSeconds } = request;
  const compute = (): Output => {
    H.domain(utteranceId.length > 0, "utteranceId");
    H.domain(offsetSeconds >= onsetSeconds, "offsetSeconds");
    return {
      durationSeconds: offsetSeconds - onsetSeconds,
      timecodeToken: JSON.stringify([utteranceId, onsetSeconds, offsetSeconds]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { utteranceId: "U17", onsetSeconds: 12, offsetSeconds: 15 },
  output: { durationSeconds: 3, timecodeToken: '["U17",12,15]' },
} satisfies ToolExample<Input, Output>;
export const utteranceOnsetOffsetTimecodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/utterance-onset-offset-timecode",
    title: "Utterance Onset Offset Timecode",
    description:
      "Qualify explicit utterance onset and offset markers and their elapsed duration without detecting speech boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utteranceId: { type: "string", maxLength: 8192, minLength: 1 },
        onsetSeconds: { type: "number" },
        offsetSeconds: { type: "number" },
      },
      required: ["utteranceId", "onsetSeconds", "offsetSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationSeconds: { type: "number" },
        timecodeToken: { type: "string", maxLength: 8192 },
      },
      required: ["durationSeconds", "timecodeToken"],
    },
    ports: {
      inputs: [
        {
          id: "utteranceId",
          label: "Utterance Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "onsetSeconds",
          label: "Onset Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetSeconds",
          label: "Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
        {
          id: "timecodeToken",
          label: "Timecode Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = utteranceOnsetOffsetTimecodeTool.execute;
export default utteranceOnsetOffsetTimecodeTool;
