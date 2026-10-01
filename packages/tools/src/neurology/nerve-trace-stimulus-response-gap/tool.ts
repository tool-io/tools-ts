import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusIndex: number;
  readonly responseIndex: number;
  readonly sampleHz: number;
  readonly triggerDelaySeconds: number;
};
export type Output = {
  readonly rawSeconds: number;
  readonly correctedSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusIndex: { type: "integer" },
    responseIndex: { type: "integer" },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
    triggerDelaySeconds: { type: "number" },
  },
  required: [
    "stimulusIndex",
    "responseIndex",
    "sampleHz",
    "triggerDelaySeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawSeconds: { type: "number" },
    correctedSeconds: { type: "number" },
  },
  required: ["rawSeconds", "correctedSeconds"],
} as const;
/** Signed interval from supplied event sample indices after an explicit trigger-delay correction, without event detection or a diagnostic latency limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusIndex, responseIndex, sampleHz, triggerDelaySeconds } =
    request;
  const compute = (): Output => {
    H.positive(sampleHz);
    return {
      rawSeconds: (responseIndex - stimulusIndex) / sampleHz,
      correctedSeconds:
        (responseIndex - stimulusIndex) / sampleHz - triggerDelaySeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stimulusIndex: 100,
    responseIndex: 150,
    sampleHz: 10000,
    triggerDelaySeconds: 0.001,
  },
  output: { rawSeconds: 0.005, correctedSeconds: 0.004 },
} satisfies ToolExample<Input, Output>;
export const nerveTraceStimulusResponseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/nerve-trace-stimulus-response-gap",
    title: "Nerve Trace Stimulus Response Gap Tool",
    description:
      "Signed interval from supplied event sample indices after an explicit trigger-delay correction, without event detection or a diagnostic latency limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusIndex: { type: "integer" },
        responseIndex: { type: "integer" },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
        triggerDelaySeconds: { type: "number" },
      },
      required: [
        "stimulusIndex",
        "responseIndex",
        "sampleHz",
        "triggerDelaySeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawSeconds: { type: "number" },
        correctedSeconds: { type: "number" },
      },
      required: ["rawSeconds", "correctedSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "stimulusIndex",
          label: "Stimulus Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "responseIndex",
          label: "Response Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "triggerDelaySeconds",
          label: "Trigger Delay Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "rawSeconds",
          label: "Raw Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "correctedSeconds",
          label: "Corrected Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = nerveTraceStimulusResponseGapTool.execute;
export default nerveTraceStimulusResponseGapTool;
