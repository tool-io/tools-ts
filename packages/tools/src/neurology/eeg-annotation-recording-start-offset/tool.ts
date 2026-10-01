import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annotationSeconds: number;
  readonly recordingStartSeconds: number;
  readonly clockOffsetSeconds: number;
  readonly sampleHz: number;
};
export type Output = {
  readonly relativeSeconds: number;
  readonly nearestSample: number;
  readonly sampleErrorSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annotationSeconds: { type: "number" },
    recordingStartSeconds: { type: "number" },
    clockOffsetSeconds: { type: "number" },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "annotationSeconds",
    "recordingStartSeconds",
    "clockOffsetSeconds",
    "sampleHz",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeSeconds: { type: "number" },
    nearestSample: { type: "integer" },
    sampleErrorSeconds: { type: "number" },
  },
  required: ["relativeSeconds", "nearestSample", "sampleErrorSeconds"],
} as const;
/** Explicit clock-offset corrected annotation index with nearest-sample, half-toward-positive-infinity rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    annotationSeconds,
    recordingStartSeconds,
    clockOffsetSeconds,
    sampleHz,
  } = request;
  const compute = (): Output => {
    H.positive(sampleHz);
    const relativeSeconds =
        annotationSeconds - recordingStartSeconds - clockOffsetSeconds,
      nearestSample = Math.round(relativeSeconds * sampleHz);
    return {
      relativeSeconds,
      nearestSample,
      sampleErrorSeconds: nearestSample / sampleHz - relativeSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    annotationSeconds: 12,
    recordingStartSeconds: 10,
    clockOffsetSeconds: 0.1,
    sampleHz: 100,
  },
  output: { relativeSeconds: 1.9, nearestSample: 190, sampleErrorSeconds: 0 },
} satisfies ToolExample<Input, Output>;
export const eegAnnotationRecordingStartOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-annotation-recording-start-offset",
    title: "EEG Annotation Recording Start Offset Tool",
    description:
      "Explicit clock-offset corrected annotation index with nearest-sample, half-toward-positive-infinity rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annotationSeconds: { type: "number" },
        recordingStartSeconds: { type: "number" },
        clockOffsetSeconds: { type: "number" },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "annotationSeconds",
        "recordingStartSeconds",
        "clockOffsetSeconds",
        "sampleHz",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeSeconds: { type: "number" },
        nearestSample: { type: "integer" },
        sampleErrorSeconds: { type: "number" },
      },
      required: ["relativeSeconds", "nearestSample", "sampleErrorSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "annotationSeconds",
          label: "Annotation Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "recordingStartSeconds",
          label: "Recording Start Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "clockOffsetSeconds",
          label: "Clock Offset Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
      ],
      outputs: [
        {
          id: "relativeSeconds",
          label: "Relative Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "nearestSample",
          label: "Nearest Sample",
          valueType: { type: "integer" },
        },
        {
          id: "sampleErrorSeconds",
          label: "Sample Error Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegAnnotationRecordingStartOffsetTool.execute;
export default eegAnnotationRecordingStartOffsetTool;
