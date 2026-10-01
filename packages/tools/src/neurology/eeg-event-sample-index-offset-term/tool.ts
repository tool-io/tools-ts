import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventSample: number;
  readonly epochStartSample: number;
  readonly sampleHz: number;
};
export type Output = {
  readonly relativeSample: number;
  readonly relativeSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventSample: { type: "integer" },
    epochStartSample: { type: "integer" },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eventSample", "epochStartSample", "sampleHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeSample: { type: "integer" },
    relativeSeconds: { type: "number" },
  },
  required: ["relativeSample", "relativeSeconds"],
} as const;
/** Relative event sample/time offset when both supplied indices share the same origin, which cancels in subtraction; sample frequency is explicit and offsets may be negative. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventSample, epochStartSample, sampleHz } = request;
  const compute = (): Output => {
    H.positive(sampleHz);
    return {
      relativeSample: eventSample - epochStartSample,
      relativeSeconds: (eventSample - epochStartSample) / sampleHz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventSample: 1500, epochStartSample: 1000, sampleHz: 500 },
  output: { relativeSample: 500, relativeSeconds: 1 },
} satisfies ToolExample<Input, Output>;
export const eegEventSampleIndexOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-event-sample-index-offset-term",
    title: "EEG Event Sample Index Offset Term Tool",
    description:
      "Relative event sample/time offset when both supplied indices share the same origin, which cancels in subtraction; sample frequency is explicit and offsets may be negative.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventSample: { type: "integer" },
        epochStartSample: { type: "integer" },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eventSample", "epochStartSample", "sampleHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeSample: { type: "integer" },
        relativeSeconds: { type: "number" },
      },
      required: ["relativeSample", "relativeSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "eventSample",
          label: "Event Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "epochStartSample",
          label: "Epoch Start Sample",
          required: true,
          valueType: { type: "integer" },
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
          id: "relativeSample",
          label: "Relative Sample",
          valueType: { type: "integer" },
        },
        {
          id: "relativeSeconds",
          label: "Relative Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegEventSampleIndexOffsetTermTool.execute;
export default eegEventSampleIndexOffsetTermTool;
